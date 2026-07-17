"""
ShieldAI Backend — Investigation Command Center Schemas

Mirrors the frontend TypeScript types in ``src/lib/types/command-center.ts``.
"""

from __future__ import annotations

from typing import List, Literal, Dict, Any, Optional
from pydantic import BaseModel, Field


RiskLevel = Literal["Critical", "High", "Medium", "Low"]
CaseStatus = Literal["Immediate Review", "Network Review", "Analyst Assigned", "Under Review", "Evidence Review", "Escalated", "Resolved"]


class CommandCase(BaseModel):
    id: str
    threat_category: str = Field(..., alias="threatCategory")
    location: str
    lat: float
    lng: float
    risk_score: int = Field(..., alias="riskScore")
    risk_level: RiskLevel = Field(..., alias="riskLevel")
    status: CaseStatus
    reported_at: str = Field(..., alias="reportedAt")
    trend: Literal["Increasing", "Stable", "Decreasing"]
    reported_cases: int = Field(..., alias="reportedCases")
    indicators: List[str]
    recommended_actions: List[str] = Field(..., alias="recommendedActions")

    model_config = {"populate_by_name": True}


class MetricValue(BaseModel):
    value: int
    addedToday: Optional[int] = None
    increasingRapidly: Optional[int] = None


class DashboardMetrics(BaseModel):
    active_cases: MetricValue = Field(..., alias="activeCases")
    critical_alerts: MetricValue = Field(..., alias="criticalAlerts")
    high_risk_entities: MetricValue = Field(..., alias="highRiskEntities")
    emerging_hotspots: MetricValue = Field(..., alias="emergingHotspots")
    avg_response_time_min: int = Field(..., alias="avgResponseTimeMin")

    model_config = {"populate_by_name": True}


class CrossModuleActivity(BaseModel):
    id: str
    module_name: Literal["Citizen Fraud Shield", "Fraud Network Analysis", "Geospatial Crime Intelligence", "Currency Verification"] = Field(..., alias="moduleName")
    summary: str
    case_id: Optional[str] = Field(None, alias="caseId")
    time_ago: str = Field(..., alias="timeAgo")
    severity: RiskLevel

    model_config = {"populate_by_name": True}


class AnalyticsTrendPoint(BaseModel):
    date: str
    digital_arrest_scam: int = Field(0, alias="Digital Arrest Scam")
    investment_fraud: int = Field(0, alias="Investment Fraud")
    fake_upi_request: int = Field(0, alias="Fake UPI Request")
    phishing: int = Field(0, alias="Phishing")
    
    model_config = {"populate_by_name": True, "extra": "allow"}


class AnalyticsDistribution(BaseModel):
    category: str
    percentage: float


class InvestigationStatusCounts(BaseModel):
    underReview: int
    analystAssigned: int
    evidenceReview: int
    escalated: int
    resolved: int


class ModuleHealth(BaseModel):
    module: str
    status: Literal["Operational", "Degraded", "Offline"]
    last_update: str
    uptime_percentage: float


class ExecutiveSecuritySummary(BaseModel):
    executive_summary: str
    emerging_threats: List[str]
    priority_investigations: List[str]
    highest_risk_region: str
    operational_readiness: str
    suggested_resource_deployment: List[str]
    module_health: List[ModuleHealth] = []
