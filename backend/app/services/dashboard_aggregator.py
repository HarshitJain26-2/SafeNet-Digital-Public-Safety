"""
ShieldAI Backend — Dashboard Aggregator

Collects and computes unified intelligence from all existing module 
sessions without duplicating storage.
"""

from __future__ import annotations

import datetime
from typing import List, Dict, Any, Tuple

from app.core.logging import get_logger
from app.schemas.dashboard import (
    DashboardMetrics,
    MetricValue,
    CommandCase,
    CrossModuleActivity,
    AnalyticsDistribution,
    AnalyticsTrendPoint,
    InvestigationStatusCounts
)
from app.services.network_cache import session_store
from app.services.geo_store import geo_store

logger = get_logger(__name__)


class CommandCenterAggregator:
    
    @staticmethod
    def _extract_activities() -> List[CrossModuleActivity]:
        activities = []
        now = datetime.datetime.now()
        
        # 1. Citizen & Currency sessions from session_store
        for sid, (ts, session) in session_store._cache.items():
            s_type = type(session).__name__
            
            if s_type == "ThreatVerdict":
                activities.append(CrossModuleActivity(
                    id=sid,
                    moduleName="Citizen Fraud Shield",
                    summary=f"Analyzed {session.category} complaint. Score: {session.score}",
                    timeAgo="Recently",
                    severity=session.level if session.level in ["Critical", "High", "Medium", "Low"] else "Low" # type: ignore
                ))
            elif s_type == "CurrencyAnalysisResult":
                activities.append(CrossModuleActivity(
                    id=sid,
                    moduleName="Currency Verification",
                    summary=f"Currency scan completed. Risk: {session.risk_level}",
                    timeAgo="Recently",
                    severity="High" if "High" in session.risk_level else "Low" # type: ignore
                ))
            elif s_type == "InvestigationDataset":
                activities.append(CrossModuleActivity(
                    id=sid,
                    moduleName="Fraud Network Analysis",
                    summary=f"Network investigation generated {session.metrics.total_clusters} clusters.",
                    timeAgo="Recently",
                    severity="High",
                    caseId=sid
                ))
                
        # 2. Geo Hotspots (mocked as activity)
        # Assuming geo_store has some hot spots, we can just say "Geo update"
        if geo_store.incidents:
            activities.append(CrossModuleActivity(
                id="geo_sys_1",
                moduleName="Geospatial Crime Intelligence",
                summary=f"Aggregated {len(geo_store.incidents)} spatial incidents.",
                timeAgo="Recently",
                severity="Medium"
            ))
            
        activities.sort(key=lambda x: x.id) # Sort mostly to have a deterministic mock order, real app would sort by ts
        return activities[:10]

    @staticmethod
    def get_metrics() -> DashboardMetrics:
        # Aggregate from session store
        active_network_cases = sum(1 for _, (_, s) in session_store._cache.items() if type(s).__name__ == "InvestigationDataset")
        citizen_cases = sum(1 for _, (_, s) in session_store._cache.items() if type(s).__name__ == "ThreatVerdict")
        
        critical_alerts = 0
        high_risk_entities = 0
        
        for _, (_, s) in session_store._cache.items():
            if type(s).__name__ == "ThreatVerdict" and s.level in ("High-Risk", "Critical"):
                critical_alerts += 1
            elif type(s).__name__ == "CurrencyAnalysisResult" and "High" in s.risk_level:
                critical_alerts += 1
            elif type(s).__name__ == "InvestigationDataset":
                high_risk_entities += s.metrics.money_mule_count + s.metrics.high_risk_account_count
                
        # Geo 
        hotspots = 0
        if geo_store.incidents:
            from app.services.geo_analytics import GeoAnalyticsService
            hs = GeoAnalyticsService.generate_hotspots(geo_store.incidents)
            hotspots = len(hs)
            
        return DashboardMetrics(
            activeCases=MetricValue(value=active_network_cases + citizen_cases, addedToday=max(1, citizen_cases)),
            criticalAlerts=MetricValue(value=critical_alerts),
            highRiskEntities=MetricValue(value=high_risk_entities),
            emergingHotspots=MetricValue(value=hotspots, increasingRapidly=max(0, hotspots - 2)),
            avgResponseTimeMin=12
        )

    @staticmethod
    def get_cases() -> List[CommandCase]:
        cases = []
        # Convert Network Investigations to Cases
        for sid, (ts, session) in session_store._cache.items():
            if type(session).__name__ == "InvestigationDataset":
                cases.append(CommandCase(
                    id=sid,
                    threatCategory="Money Laundering Network",
                    location="Multiple",
                    lat=20.0,
                    lng=77.0,
                    riskScore=85,
                    riskLevel="Critical",
                    status="Analyst Assigned",
                    reportedAt=datetime.datetime.fromtimestamp(ts).isoformat(),
                    trend="Increasing",
                    reportedCases=session.metrics.total_entities,
                    indicators=["Mule Accounts", "High Transaction Volume"],
                    recommendedActions=["Freeze Accounts", "Deploy Field Team"]
                ))
            elif type(session).__name__ == "ThreatVerdict":
                cases.append(CommandCase(
                    id=sid,
                    threatCategory=session.category,
                    location="Online",
                    lat=20.0,
                    lng=77.0,
                    riskScore=session.score,
                    riskLevel="High" if session.score > 75 else "Medium",
                    status="Immediate Review",
                    reportedAt=session.timestamp,
                    trend="Stable",
                    reportedCases=1,
                    indicators=[e.label for e in session.evidence],
                    recommendedActions=session.recommendations
                ))
        return cases
        
    @staticmethod
    def get_activity() -> List[CrossModuleActivity]:
        return CommandCenterAggregator._extract_activities()

    @staticmethod
    def get_analytics() -> Dict[str, Any]:
        # Count categories across all datasets
        cat_counts = {"Digital Arrest Scam": 0, "Phishing": 0, "Fake UPI Request": 0, "Counterfeit Currency": 0}
        
        for _, (_, s) in session_store._cache.items():
            if type(s).__name__ == "ThreatVerdict":
                cat = s.category
                if cat in cat_counts: cat_counts[cat] += 1
                else: cat_counts[cat] = 1
            elif type(s).__name__ == "CurrencyAnalysisResult":
                cat_counts["Counterfeit Currency"] += 1
                
        total = sum(cat_counts.values()) or 1
        
        distributions = [
            AnalyticsDistribution(category=k, percentage=round((v/total)*100, 1))
            for k, v in cat_counts.items() if v > 0
        ]
        if not distributions:
            distributions = [AnalyticsDistribution(category="Monitoring", percentage=100.0)]
            
        trends = []
        for i in range(7):
            date_str = (datetime.datetime.now() - datetime.timedelta(days=i)).strftime("%Y-%m-%d")
            trends.append(AnalyticsTrendPoint(
                date=date_str,
                **{"Digital Arrest Scam": 2 + i, "Phishing": 5 - i, "Fake UPI Request": 3}
            ))
            
        trends.reverse()
        
        return {
            "threatDistribution": [d.model_dump(by_alias=True) for d in distributions],
            "trends": [t.model_dump(by_alias=True) for t in trends]
        }
