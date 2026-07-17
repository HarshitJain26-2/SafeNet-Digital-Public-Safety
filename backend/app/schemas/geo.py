"""
ShieldAI Backend — Geospatial Crime Intelligence Schemas

Mirrors the frontend TypeScript types in ``src/lib/types/geospatial.ts``.
Includes extended operational metadata for AI recommendations as requested.
"""

from __future__ import annotations

from typing import List, Literal, Optional, Dict, Any

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

RiskLevel = Literal["All Risk Levels", "Low", "Medium", "High", "Critical"]
SpecificRiskLevel = Literal["Low", "Medium", "High", "Critical"]
TimeRange = Literal["Last 24 Hours", "Last 7 Days", "Last 30 Days", "Last 90 Days"]
TrendDirection = Literal["Increasing", "Stable", "Decreasing"]


# ── Schemas ──────────────────────────────────────────────────────────────────

class GeospatialFilterState(BaseModel):
    state: str
    district: str
    threat_category: ThreatCategory = Field(..., alias="threatCategory")
    risk_level: RiskLevel = Field(..., alias="riskLevel")
    time_range: TimeRange = Field(..., alias="timeRange")

    model_config = {"populate_by_name": True}


class ThreatDistribution(BaseModel):
    category: ThreatCategory
    percentage: float
    count: int


class AIRecommendation(BaseModel):
    priority: Literal["High", "Medium", "Low"]
    summary: str
    actions: List[str]
    
    # Extended Operational Metadata
    deployment_priority: int = Field(1, description="1 (Highest) to 5 (Lowest)")
    recommended_units: int = Field(0, description="Recommended number of units to deploy")
    confidence: int = Field(0, description="0-100 confidence score")
    recommended_action: str = Field("", description="Primary operational action")


class CrimeHotspot(BaseModel):
    id: str
    region_name: str = Field(..., alias="regionName")
    state_name: str = Field(..., alias="stateName")
    lat: float
    lng: float
    risk_score: int = Field(..., ge=0, le=100, alias="riskScore")
    risk_level: SpecificRiskLevel = Field(..., alias="riskLevel")
    reported_incidents: int = Field(..., alias="reportedIncidents")
    primary_threat: ThreatCategory = Field(..., alias="primaryThreat")
    trend: TrendDirection
    threat_distribution: List[ThreatDistribution] = Field(..., alias="threatDistribution")
    recommendation: AIRecommendation

    model_config = {"populate_by_name": True}


class GeospatialAnalyticsSummary(BaseModel):
    total_incidents: int = Field(..., alias="totalIncidents")
    incident_trend_percent: float = Field(..., alias="incidentTrendPercent")
    high_risk_zones: int = Field(..., alias="highRiskZones")
    emerging_hotspots: int = Field(..., alias="emergingHotspots")
    avg_response_time_min: int = Field(..., alias="avgResponseTimeMin")

    model_config = {"populate_by_name": True}


# Since ThreatTrendDataPoint has dynamic keys in TS [key: string]: string | number
# We can represent it as a dict with required fields, or a pydantic model with extra fields allowed.
class ThreatTrendDataPoint(BaseModel):
    date: str
    digital_arrest_scam: float = Field(0, alias="Digital Arrest Scam")
    phishing: float = Field(0, alias="Phishing")
    fake_upi_request: float = Field(0, alias="Fake UPI Request")
    
    model_config = {"populate_by_name": True, "extra": "allow"}


class RegionalIntelligenceBrief(BaseModel):
    hotspot: CrimeHotspot
    generated_at: str = Field(..., alias="generatedAt")

    model_config = {"populate_by_name": True}


# Backend-only Unified Schema for ingesting raw crime data
class RawCrimeIncident(BaseModel):
    id: str
    category: ThreatCategory
    timestamp: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    risk_score: int = 50
    risk_level: SpecificRiskLevel = "Medium"
