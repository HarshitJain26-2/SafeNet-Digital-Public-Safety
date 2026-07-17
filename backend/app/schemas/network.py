"""
ShieldAI Backend — Network / Graph Investigation Schemas

Mirrors the frontend TypeScript types in ``src/lib/types/network.ts``.
"""

from __future__ import annotations

from typing import List, Literal, Optional

from pydantic import BaseModel, Field


# ── Enums / Literals ─────────────────────────────────────────────────────────

EntityType = Literal[
    "Suspected Coordinator",
    "Potential Money Mule",
    "High-Risk Account",
    "Victim",
    "Phone Number",
    "UPI ID",
    "Bank Account",
    "Merchant",
    "Unknown Entity",
]

RiskLevel = Literal["High", "Medium", "Low", "Unknown"]

RelationshipType = Literal[
    "Transaction",
    "Call",
    "Repeated Contact",
    "Shared Device",
    "Shared Location",
    "Linked UPI",
    "Common Beneficiary",
]

EventType = Literal["Transaction", "Call", "Connection", "Alert"]


# ── Entity schemas ───────────────────────────────────────────────────────────

class EntityRiskIndicator(BaseModel):
    id: str
    label: str
    explanation: str
    severity: Literal["High", "Medium", "Low"]


class FraudEntity(BaseModel):
    id: str
    label: str
    type: EntityType
    risk_level: RiskLevel = Field(..., alias="riskLevel")
    risk_score: int = Field(..., ge=0, le=100, alias="riskScore")
    incoming_value: Optional[str] = Field(None, alias="incomingValue")
    outgoing_value: Optional[str] = Field(None, alias="outgoingValue")
    transaction_count: Optional[int] = Field(None, alias="transactionCount")
    call_frequency: Optional[int] = Field(None, alias="callFrequency")
    first_observed: Optional[str] = Field(None, alias="firstObserved")
    last_observed: Optional[str] = Field(None, alias="lastObserved")
    x: float
    y: float
    
    # Geospatial Extensions
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    indicators: List[EntityRiskIndicator] = []
    connected_entities_count: int = Field(0, alias="connectedEntitiesCount")

    model_config = {"populate_by_name": True}


class FraudRelationship(BaseModel):
    id: str
    source_id: str = Field(..., alias="sourceId")
    target_id: str = Field(..., alias="targetId")
    type: RelationshipType
    weight: int = Field(..., ge=1, le=5)
    details: Optional[str] = None
    amount: Optional[str] = None
    first_observed: Optional[str] = Field(None, alias="firstObserved")
    last_observed: Optional[str] = Field(None, alias="lastObserved")

    model_config = {"populate_by_name": True}


class FraudCluster(BaseModel):
    id: str
    label: str
    entity_count: int = Field(..., alias="entityCount")
    relationship_count: int = Field(..., alias="relationshipCount")
    risk_level: RiskLevel = Field(..., alias="riskLevel")
    pattern: str
    central_entity_id: str = Field(..., alias="centralEntityId")
    total_value: Optional[str] = Field(None, alias="totalValue")

    model_config = {"populate_by_name": True}


class EvidenceTimelineEvent(BaseModel):
    id: str
    timestamp: str
    type: EventType
    description: str
    entity_id: Optional[str] = Field(None, alias="entityId")
    amount: Optional[str] = None
    source: str
    risk_indicator: Optional[str] = Field(None, alias="riskIndicator")

    model_config = {"populate_by_name": True}


class InvestigationRecommendation(BaseModel):
    id: str
    priority: Literal["High", "Medium", "Low"]
    action: str
    reason: str
    target_entity_id: Optional[str] = Field(None, alias="targetEntityId")
    target_cluster_id: Optional[str] = Field(None, alias="targetClusterId")

    model_config = {"populate_by_name": True}


class InvestigationSummary(BaseModel):
    overview: str
    total_entities: int = Field(..., alias="totalEntities")
    total_relationships: int = Field(..., alias="totalRelationships")
    clusters_identified: int = Field(..., alias="clustersIdentified")
    high_priority_entities: int = Field(..., alias="highPriorityEntities")
    potential_mules: int = Field(..., alias="potentialMules")
    connected_victims: int = Field(..., alias="connectedVictims")
    total_analyzed_value: str = Field(..., alias="totalAnalyzedValue")
    key_patterns: List[str] = Field(default_factory=list, alias="keyPatterns")

    model_config = {"populate_by_name": True}


class InvestigationMetrics(BaseModel):
    total_transactions: int = Field(..., alias="totalTransactions")
    total_entities: int = Field(..., alias="totalEntities")
    total_relationships: int = Field(..., alias="totalRelationships")
    total_clusters: int = Field(..., alias="totalClusters")
    largest_cluster_size: int = Field(..., alias="largestClusterSize")
    money_mule_count: int = Field(..., alias="moneyMuleCount")
    high_risk_account_count: int = Field(..., alias="highRiskAccountCount")
    average_node_degree: float = Field(..., alias="averageNodeDegree")

    model_config = {"populate_by_name": True}


class GraphStatistics(BaseModel):
    node_count: int
    edge_count: int
    connected_components: int
    average_degree: float
    graph_density: float
    largest_component: int


class InvestigationDataset(BaseModel):
    """Complete investigation result — matches frontend ``InvestigationDataset``."""

    investigation_id: str = Field(..., alias="investigationId")
    metrics: InvestigationMetrics
    graph_statistics: Optional[GraphStatistics] = None
    entities: List[FraudEntity] = []
    relationships: List[FraudRelationship] = []
    clusters: List[FraudCluster] = []
    timeline: List[EvidenceTimelineEvent] = []
    summary: InvestigationSummary
    recommendations: List[InvestigationRecommendation] = []


