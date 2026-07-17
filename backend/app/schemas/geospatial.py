"""
ShieldAI Backend — Geospatial Intelligence Schemas

Mirrors the frontend TypeScript types in ``src/lib/types/geospatial.ts``.
"""

from __future__ import annotations

from typing import List, Literal, Optional

from pydantic import BaseModel, Field


# ── Enums / Literals ─────────────────────────────────────────────────────────

ThreatCategory = Literal[
    "All Threat Categories",
    "Digital Arrest Scam",
    "Phishing",
    "Fake UPI Request",
    "Investment Fraud",
    "Impersonation Scam",
    "OTP Fraud",
    "Counterfeit Currency",
    "Money Mule Activity",
]

GeoRiskLevel = Literal["All Risk Levels", "Low", "Medium", "High", "Critical"]
TimeRange = Literal["Last 24 Hours", "Last 7 Days", "Last 30 Days", "Last 90 Days"]
TrendDirection = Literal["Increasing", "Stable", "Decreasing"]


# ── Schemas ──────────────────────────────────────────────────────────────────

class GeospatialFilterState(BaseModel):
    """Filter criteria for geospatial queries."""

    state: str = "All States"
    district: str = "All Districts"
    threat_category: ThreatCategory = Field("All Threat Categories", alias="threatCategory")
    risk_level: GeoRiskLevel = Field("All Risk Levels", alias="riskLevel")
    time_range: TimeRange = Field("Last 30 Days", alias="timeRange")

    model_config = {"populate_by_name": True}


class ThreatDistribution(BaseModel):
    category: ThreatCategory
    percentage: int
    count: int


class AIRecommendation(BaseModel):
    priority: Literal["High", "Medium", "Low"]
    summary: str
    actions: List[str] = []


class CrimeHotspot(BaseModel):
    """A single crime hotspot — matches frontend ``CrimeHotspot``."""

    id: str
    region_name: str = Field(..., alias="regionName")
    state_name: str = Field(..., alias="stateName")
    lat: float
    lng: float
    risk_score: int = Field(..., ge=0, le=100, alias="riskScore")
    risk_level: Literal["Low", "Medium", "High", "Critical"] = Field(..., alias="riskLevel")
    reported_incidents: int = Field(..., alias="reportedIncidents")
    primary_threat: ThreatCategory = Field(..., alias="primaryThreat")
    trend: TrendDirection
    threat_distribution: List[ThreatDistribution] = Field(
        default_factory=list, alias="threatDistribution"
    )
    recommendation: AIRecommendation

    model_config = {"populate_by_name": True}


class GeospatialAnalyticsSummary(BaseModel):
    """Aggregate analytics for the current filter view."""

    total_incidents: int = Field(0, alias="totalIncidents")
    incident_trend_percent: float = Field(0.0, alias="incidentTrendPercent")
    high_risk_zones: int = Field(0, alias="highRiskZones")
    emerging_hotspots: int = Field(0, alias="emergingHotspots")
    avg_response_time_min: float = Field(0.0, alias="avgResponseTimeMin")

    model_config = {"populate_by_name": True}


class ThreatTrendDataPoint(BaseModel):
    """Single data point for threat trend charts."""

    date: str
    digital_arrest_scam: int = Field(0, alias="Digital Arrest Scam")
    phishing: int = Field(0, alias="Phishing")
    fake_upi_request: int = Field(0, alias="Fake UPI Request")

    model_config = {"populate_by_name": True}


class GeospatialResponse(BaseModel):
    """Combined response for geospatial filter endpoint."""

    hotspots: List[CrimeHotspot] = []
    summary: Optional[GeospatialAnalyticsSummary] = None
