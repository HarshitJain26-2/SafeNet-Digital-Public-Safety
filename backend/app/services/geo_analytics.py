"""
ShieldAI Backend — Geospatial Analytics Engine

Aggregates raw crime incidents using a lightweight grid-based spatial index.
Calculates hotspots, trends, and summary metrics.
"""

from __future__ import annotations

import collections
import datetime
from typing import List, Dict, Any, Optional
import math

import pandas as pd

from app.core.logging import get_logger
from app.schemas.geo import (
    CrimeHotspot, 
    GeospatialFilterState, 
    RawCrimeIncident,
    ThreatDistribution,
    ThreatTrendDataPoint,
    GeospatialAnalyticsSummary,
    AIRecommendation
)

logger = get_logger(__name__)


class SpatialIndex:
    """Lightweight grid-based bucketing for spatial coordinates."""
    
    def __init__(self, precision: int = 1):
        # precision=1 means roughly ~11.1km grid at equator (rounding to 1 decimal)
        self.precision = precision
        self.grid: Dict[tuple[float, float], List[RawCrimeIncident]] = collections.defaultdict(list)
        
    def add(self, incident: RawCrimeIncident):
        if incident.lat is not None and incident.lng is not None:
            bucket = (round(incident.lat, self.precision), round(incident.lng, self.precision))
            self.grid[bucket].append(incident)
            
    def get_clusters(self) -> Dict[tuple[float, float], List[RawCrimeIncident]]:
        return dict(self.grid)


class GeoAnalyticsService:

    @staticmethod
    def _apply_filters(incidents: List[RawCrimeIncident], filters: Optional[GeospatialFilterState]) -> List[RawCrimeIncident]:
        if not filters:
            return incidents
            
        filtered = []
        now = datetime.datetime.now()
        
        # Calculate time cutoff
        cutoff = None
        if filters.time_range == "Last 24 Hours":
            cutoff = now - datetime.timedelta(days=1)
        elif filters.time_range == "Last 7 Days":
            cutoff = now - datetime.timedelta(days=7)
        elif filters.time_range == "Last 30 Days":
            cutoff = now - datetime.timedelta(days=30)
        elif filters.time_range == "Last 90 Days":
            cutoff = now - datetime.timedelta(days=90)
            
        for i in incidents:
            if filters.state and filters.state != "All" and i.state != filters.state:
                continue
            if filters.district and filters.district != "All" and i.district != filters.district:
                continue
            if filters.threat_category != "All Threat Categories" and i.category != filters.threat_category:
                continue
            if filters.risk_level != "All Risk Levels" and i.risk_level != filters.risk_level:
                continue
            
            # Time filter
            if cutoff and i.timestamp:
                try:
                    i_time = datetime.datetime.fromisoformat(i.timestamp)
                    if i_time < cutoff:
                        continue
                except ValueError:
                    pass # Ignore invalid timestamps
                    
            filtered.append(i)
            
        return filtered

    @staticmethod
    def generate_hotspots(incidents: List[RawCrimeIncident], filters: Optional[GeospatialFilterState] = None) -> List[CrimeHotspot]:
        filtered = GeoAnalyticsService._apply_filters(incidents, filters)
        
        index = SpatialIndex(precision=1) # ~11km grid
        for inc in filtered:
            index.add(inc)
            
        clusters = index.get_clusters()
        hotspots = []
        
        for (lat, lng), items in clusters.items():
            if not items:
                continue
                
            # Aggregate stats for this bucket
            total = len(items)
            avg_score = sum(i.risk_score for i in items) / total
            
            # Threat Distribution
            cat_counts = collections.Counter([i.category for i in items])
            dist_list = []
            for cat, count in cat_counts.most_common():
                dist_list.append(ThreatDistribution(
                    category=cat, # type: ignore
                    percentage=round((count / total) * 100, 1),
                    count=count
                ))
                
            primary_threat = cat_counts.most_common(1)[0][0] if cat_counts else "Unknown Entity"
            
            # Region/State names from the most common in this bucket
            states = collections.Counter([i.state for i in items if i.state and i.state != "Unknown"])
            state_name = states.most_common(1)[0][0] if states else "Unknown State"
            
            regions = collections.Counter([i.district for i in items if i.district and i.district != "Unknown"])
            region_name = regions.most_common(1)[0][0] if regions else (state_name if state_name != "Unknown State" else "Unknown Region")
            
            risk_lvl = "High" if avg_score > 75 else ("Medium" if avg_score > 40 else "Low")
            
            # Dummy AI recommendation (overwritten by GeoAIService later if needed)
            dummy_rec = AIRecommendation(
                priority="Medium",
                summary="Pending AI analysis...",
                actions=[],
                deployment_priority=3,
                recommended_units=0,
                confidence=0,
                recommended_action="Pending"
            )
            
            hotspots.append(CrimeHotspot(
                id=f"hs_{lat}_{lng}".replace(".", "_"),
                regionName=region_name,
                stateName=state_name,
                lat=lat,
                lng=lng,
                riskScore=int(avg_score),
                riskLevel=risk_lvl, # type: ignore
                reportedIncidents=total,
                primaryThreat=primary_threat, # type: ignore
                trend="Increasing" if total > 5 else "Stable",
                threatDistribution=dist_list,
                recommendation=dummy_rec
            ))
            
        # Sort by severity (incident count * risk)
        hotspots.sort(key=lambda h: h.reported_incidents * h.risk_score, reverse=True)
        return hotspots

    @staticmethod
    def generate_summary(incidents: List[RawCrimeIncident], filters: Optional[GeospatialFilterState] = None) -> GeospatialAnalyticsSummary:
        filtered = GeoAnalyticsService._apply_filters(incidents, filters)
        
        total = len(filtered)
        high_risk = len([i for i in filtered if i.risk_level in ("High", "Critical")])
        
        return GeospatialAnalyticsSummary(
            totalIncidents=total,
            incidentTrendPercent=15.2, # Mock trend calculation
            highRiskZones=high_risk,
            emergingHotspots=max(0, high_risk - 2),
            avgResponseTimeMin=45
        )

    @staticmethod
    def generate_trends(incidents: List[RawCrimeIncident], filters: Optional[GeospatialFilterState] = None) -> List[ThreatTrendDataPoint]:
        filtered = GeoAnalyticsService._apply_filters(incidents, filters)
        
        # Group by date (YYYY-MM-DD)
        date_groups = collections.defaultdict(lambda: collections.defaultdict(int))
        for i in filtered:
            if not i.timestamp: continue
            try:
                dt = datetime.datetime.fromisoformat(i.timestamp).strftime("%Y-%m-%d")
                date_groups[dt][i.category] += 1
            except ValueError:
                pass
                
        trends = []
        for dt in sorted(date_groups.keys())[-30:]: # Last 30 days
            counts = date_groups[dt]
            point = ThreatTrendDataPoint(
                date=dt,
                **{k.replace(" ", "_").lower(): v for k, v in counts.items()} # dynamic mapping is loose, but Pydantic alias handles standard ones
            )
            # Explicitly set known aliases for frontend
            if "Digital Arrest Scam" in counts: point.digital_arrest_scam = counts["Digital Arrest Scam"]
            if "Phishing" in counts: point.phishing = counts["Phishing"]
            if "Fake UPI Request" in counts: point.fake_upi_request = counts["Fake UPI Request"]
            
            trends.append(point)
            
        return trends
