"""
ShieldAI Backend — Dashboard AI Service

Generates Executive Security Summaries from aggregated module data.
"""

from __future__ import annotations

import json
from typing import Dict, Any, List

from app.core.config import get_settings
from app.core.logging import get_logger
from app.schemas.dashboard import ExecutiveSecuritySummary, ModuleHealth
from app.services.dashboard_aggregator import CommandCenterAggregator

logger = get_logger(__name__)

DASHBOARD_AI_PROMPT = """You are ShieldAI, an elite digital public safety AI.
Based on the strictly factual metrics provided, generate a structured Executive Security Summary.

Do NOT fabricate any numbers, regions, or cases not present in the data.
Generate ONLY a valid JSON object matching this schema exactly:
{
    "executive_summary": "High level text summary.",
    "emerging_threats": ["Threat 1", "Threat 2"],
    "priority_investigations": ["Case ID 1: ...", "Case ID 2: ..."],
    "highest_risk_region": "State/District name or N/A",
    "operational_readiness": "Assessment of current system readiness.",
    "suggested_resource_deployment": ["Deploy cyber cell to X", "Alert telecom operators for Y"]
}

Input Metrics:
{metrics_json}
"""


class DashboardAIService:
    
    def __init__(self) -> None:
        self.settings = get_settings()
        import google.generativeai as genai
        genai.configure(api_key=self.settings.gemini_api_key)
        
        # Use gemini-1.5-flash since we only need text JSON generation
        self.model = genai.GenerativeModel(
            model_name=self.settings.gemini_model,
            generation_config={"response_mime_type": "application/json"}
        )

    def _get_module_health(self) -> List[ModuleHealth]:
        return [
            ModuleHealth(
                module="Citizen Fraud Shield",
                status="Operational",
                last_update="Just Now",
                uptime_percentage=99.9
            ),
            ModuleHealth(
                module="Currency Detection",
                status="Operational",
                last_update="Just Now",
                uptime_percentage=99.9
            ),
            ModuleHealth(
                module="Fraud Network Intelligence",
                status="Operational",
                last_update="Just Now",
                uptime_percentage=99.8
            ),
            ModuleHealth(
                module="Geospatial Crime Intel",
                status="Operational",
                last_update="Just Now",
                uptime_percentage=99.9
            )
        ]

    def generate_summary(self) -> ExecutiveSecuritySummary:
        metrics = CommandCenterAggregator.get_metrics().model_dump(by_alias=True)
        cases = [c.model_dump(by_alias=True) for c in CommandCenterAggregator.get_cases() if c.risk_level == "Critical"]
        analytics = CommandCenterAggregator.get_analytics()
        
        payload = {
            "metrics": metrics,
            "critical_cases": cases[:5],
            "threat_distribution": analytics.get("threatDistribution", [])
        }
        
        prompt = DASHBOARD_AI_PROMPT.replace("{metrics_json}", json.dumps(payload, indent=2))
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text
            data = json.loads(result_text)
            
            summary = ExecutiveSecuritySummary(
                executive_summary=data.get("executive_summary", "System operating normally."),
                emerging_threats=data.get("emerging_threats", []),
                priority_investigations=data.get("priority_investigations", []),
                highest_risk_region=data.get("highest_risk_region", "N/A"),
                operational_readiness=data.get("operational_readiness", "Fully Operational"),
                suggested_resource_deployment=data.get("suggested_resource_deployment", []),
                module_health=self._get_module_health()
            )
            return summary
            
        except Exception as e:
            logger.error("Failed to generate dashboard AI summary: %s", str(e))
            # Fallback
            return ExecutiveSecuritySummary(
                executive_summary="Could not generate AI summary due to an internal error.",
                emerging_threats=[],
                priority_investigations=[],
                highest_risk_region="Unknown",
                operational_readiness="Degraded",
                suggested_resource_deployment=[],
                module_health=self._get_module_health()
            )

dashboard_ai_service = DashboardAIService()
