"""
ShieldAI Backend — Network Graph Service

Builds NetworkX graphs from DataFrames, runs community detection and 
centrality algorithms, and builds the frontend schemas.
"""

from __future__ import annotations

import uuid
from typing import Any, Dict, List, Set, Tuple

import networkx as nx
import pandas as pd

from app.core.logging import get_logger
from app.schemas.network import (
    EvidenceTimelineEvent,
    FraudCluster,
    FraudEntity,
    FraudRelationship,
    InvestigationMetrics,
    GraphStatistics,
)

logger = get_logger(__name__)


class NetworkGraphService:
    """Builds and analyzes the investigation graph."""

    @staticmethod
    def build_and_analyze(df: pd.DataFrame) -> Tuple[
        List[FraudEntity],
        List[FraudRelationship],
        List[FraudCluster],
        List[EvidenceTimelineEvent],
        InvestigationMetrics,
        GraphStatistics
    ]:
        G = nx.DiGraph()

        # 1. Add Edges & Nodes
        for _, row in df.iterrows():
            src = row["SenderID"]
            dst = row["ReceiverID"]
            amt = float(row.get("Amount", 0.0))
            ts = row["Timestamp"]
            
            # Additional node attributes if available
            src_state = row.get("SenderState", None)
            dst_state = row.get("ReceiverState", None)
            
            if not G.has_node(src):
                G.add_node(src, state=src_state, total_out=0.0, total_in=0.0, first_seen=ts, last_seen=ts)
            if not G.has_node(dst):
                G.add_node(dst, state=dst_state, total_out=0.0, total_in=0.0, first_seen=ts, last_seen=ts)
                
            G.nodes[src]["total_out"] += amt
            G.nodes[dst]["total_in"] += amt
            
            # Update timestamps
            if ts < G.nodes[src]["first_seen"]: G.nodes[src]["first_seen"] = ts
            if ts > G.nodes[src]["last_seen"]: G.nodes[src]["last_seen"] = ts
            if ts < G.nodes[dst]["first_seen"]: G.nodes[dst]["first_seen"] = ts
            if ts > G.nodes[dst]["last_seen"]: G.nodes[dst]["last_seen"] = ts

            # Multi-edges can be tricky in standard DiGraph, so we aggregate weight and count
            if G.has_edge(src, dst):
                G[src][dst]["weight"] += 1
                G[src][dst]["amount"] += amt
                G[src][dst]["last_seen"] = ts
            else:
                G.add_edge(src, dst, weight=1, amount=amt, first_seen=ts, last_seen=ts)

        # 2. Network Analysis (Metrics)
        total_tx = len(df)
        total_entities = G.number_of_nodes()
        total_rels = G.number_of_edges()
        
        # Centrality (Mules / Coordinators)
        in_degree = dict(G.in_degree())
        out_degree = dict(G.out_degree())
        
        # Connected Components (Clusters)
        # Using undirected graph for community detection
        undirected_G = G.to_undirected()
        components = list(nx.connected_components(undirected_G))
        total_clusters = len(components)
        largest_cluster = max([len(c) for c in components]) if components else 0
        
        avg_degree = sum(dict(undirected_G.degree()).values()) / total_entities if total_entities > 0 else 0.0

        mule_count = 0
        high_risk_count = 0

        # Build Output Entities
        entities_out = []
        for node, data in G.nodes(data=True):
            in_d = in_degree.get(node, 0)
            out_d = out_degree.get(node, 0)
            
            # Heuristics for typing
            e_type = "Unknown Entity"
            r_level = "Low"
            r_score = 10
            
            if in_d > 5 and out_d > 5:
                e_type = "Potential Money Mule"
                r_level = "High"
                r_score = 85
                mule_count += 1
                high_risk_count += 1
            elif out_d > 10:
                e_type = "Suspected Coordinator"
                r_level = "High"
                r_score = 90
                high_risk_count += 1
            elif in_d > 10:
                e_type = "High-Risk Account"
                r_level = "Medium"
                r_score = 65
            elif out_d == 0 and in_d > 0:
                e_type = "Victim" # Sending money out, wait, if out_degree == 0, they only receive? That's opposite.
                # Actually if they only send money to known bad nodes:
                if in_d == 0 and out_d > 0:
                    e_type = "Victim"
            
            # Safe parsing of pandas NaT
            f_seen = data["first_seen"].isoformat() if pd.notnull(data["first_seen"]) else None
            l_seen = data["last_seen"].isoformat() if pd.notnull(data["last_seen"]) else None

            ent = FraudEntity(
                id=str(node),
                label=f"Node {str(node)[:8]}",
                type=e_type,
                riskLevel=r_level,
                riskScore=r_score,
                incomingValue=f"₹{data['total_in']:,.2f}",
                outgoingValue=f"₹{data['total_out']:,.2f}",
                transactionCount=in_d + out_d,
                firstObserved=f_seen,
                lastObserved=l_seen,
                x=0.0, # Placeholder
                y=0.0, # Placeholder
                state=str(data["state"]) if pd.notnull(data.get("state")) else None,
                indicators=[],
                connectedEntitiesCount=in_d + out_d
            )
            entities_out.append(ent)
            
        # Build Output Relationships
        rels_out = []
        for u, v, data in G.edges(data=True):
            f_seen_rel = data["first_seen"].isoformat() if pd.notnull(data["first_seen"]) else None
            l_seen_rel = data["last_seen"].isoformat() if pd.notnull(data["last_seen"]) else None
            
            # Normalize weight 1-5
            w = min(5, data["weight"])
            
            rels_out.append(FraudRelationship(
                id=str(uuid.uuid4()),
                sourceId=str(u),
                targetId=str(v),
                type="Transaction",
                weight=w,
                amount=f"₹{data['amount']:,.2f}",
                firstObserved=f_seen_rel,
                lastObserved=l_seen_rel
            ))
            
        # Build Clusters
        clusters_out = []
        for idx, comp in enumerate(components):
            if len(comp) < 2: continue # Ignore singletons
            
            sub = G.subgraph(comp)
            c_edges = sub.number_of_edges()
            c_nodes = sub.number_of_nodes()
            
            # Central entity is highest degree in sub
            central = max(dict(sub.degree()), key=dict(sub.degree()).get)
            
            c_risk = "Medium" if c_nodes > 5 else "Low"
            
            clusters_out.append(FraudCluster(
                id=f"cluster_{idx}",
                label=f"Community {idx}",
                entityCount=c_nodes,
                relationshipCount=c_edges,
                riskLevel=c_risk,
                pattern="Dense Transaction Network" if c_edges > c_nodes else "Linear Transfers",
                centralEntityId=str(central)
            ))
            
        # Build Timeline (sample of key events)
        timeline_out = []
        df_sorted = df.sort_values(by="Timestamp").head(50) # top 50 events
        for _, row in df_sorted.iterrows():
            ts_str = row["Timestamp"].isoformat() if pd.notnull(row["Timestamp"]) else ""
            timeline_out.append(EvidenceTimelineEvent(
                id=str(uuid.uuid4()),
                timestamp=ts_str,
                type="Transaction",
                description=f"Transfer of ₹{row.get('Amount', 0)}",
                source=str(row["SenderID"]),
                entityId=str(row["ReceiverID"])
            ))

        metrics = InvestigationMetrics(
            totalTransactions=total_tx,
            totalEntities=total_entities,
            totalRelationships=total_rels,
            totalClusters=total_clusters,
            largestClusterSize=largest_cluster,
            moneyMuleCount=mule_count,
            highRiskAccountCount=high_risk_count,
            averageNodeDegree=round(avg_degree, 2)
        )
        
        # Build GraphStatistics
        # Graph density for a directed graph: E / (V * (V - 1))
        density = 0.0
        if total_entities > 1:
            density = total_rels / (total_entities * (total_entities - 1))
            
        stats = GraphStatistics(
            node_count=total_entities,
            edge_count=total_rels,
            connected_components=total_clusters,
            average_degree=round(avg_degree, 2),
            graph_density=round(density, 4),
            largest_component=largest_cluster
        )
        
        return entities_out, rels_out, clusters_out, timeline_out, metrics, stats
