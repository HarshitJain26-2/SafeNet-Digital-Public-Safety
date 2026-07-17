"""
ShieldAI Backend — Geospatial AI Service

Utilizes Gemini to analyze geospatial crime hotspots and generate structured,
actionable deployment recommendations (priorities, unit counts, specific actions)
using the AIRiskEngine to grade severity.
"""

from __future__ import annotations

import json
from typing import List

from app.core.logging import get_logger
from app.schemas.geo import CrimeHotspot, AIRecommendation
from app.services.risk_engine import AIRiskEngine

logger = get_logger(__name__)

SYSTEM_PROMPT = """
You are a highly skilled public safety resource coordinator for ShieldAI. 
Given the following crime hotspot metrics (incident counts, threat distribution, trend), 
generate a specific, structured deployment recommendation.

You MUST respond strictly in valid JSON format. Do NOT include markdown blocks.
The JSON must perfectly match the following schema:
{
  "summary": "<Short explanation of the tactical plan>",
  "actions": [
    "<Action 1 (e.g. Deploy cyber unit)>",
    "<Action 2>"
  ],
  "deployment_priority": 1, // Integer 1 (Highest) to 5 (Lowest)
  "recommended_units": 4, // Integer (how many officers/units to deploy)
  "confidence": 85, // Integer 0-100
  "recommended_action": "<Primary operational action>"
}
"""

class GeoAIService:
    
    @staticmethod
    def enrich_hotspots_with_ai(hotspots: List[CrimeHotspot]) -> List[CrimeHotspot]:
        """Iterates over top hotspots, generating AI deployment recommendations."""
        
        # Only process the top 5 to save time/tokens. The rest get deterministic fallbacks.
        top_hotspots = hotspots[:5]
        
        import google.generativeai as genai
        from app.core.config import get_settings
        settings = get_settings()
        
        try:
            model = genai.GenerativeModel(
                model_name=getattr(settings, "gemini_model", "gemini-1.5-flash"),
                system_instruction=SYSTEM_PROMPT,
                generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
            )
        except Exception as e:
            logger.error("Failed to initialize Gemini for Geo AI: %s", str(e))
            return hotspots
            
        for hs in top_hotspots:
            # Prepare prompt payload
            prompt = (
                f"Region: {hs.region_name}, {hs.state_name}\n"
                f"Incidents: {hs.reported_incidents}\n"
                f"Risk Score: {hs.risk_score}\n"
                f"Primary Threat: {hs.primary_threat}\n"
                f"Trend: {hs.trend}\n"
            )
            
            try:
                response = model.generate_content([prompt])
                ai_res = json.loads(response.text)
                
                # We can also cross-check via Risk Engine
                class _MockEv:
                    def __init__(self, s):
                        self.severity = s
                
                evidence = []
                if hs.risk_score > 75: evidence.append(_MockEv("Critical"))
                elif hs.risk_score > 50: evidence.append(_MockEv("High"))
                else: evidence.append(_MockEv("Medium"))
                
                # Get validated level
                _, level = AIRiskEngine.calculate_risk(hs.primary_threat, evidence, hs.risk_score) # type: ignore
                prio_str = "High" if level in ("Critical", "High-Risk") else ("Medium" if level == "Medium-Risk" else "Low")
                
                hs.recommendation = AIRecommendation(
                    priority=prio_str, # type: ignore
                    summary=ai_res.get("summary", "Deploy resources to monitor threat."),
                    actions=ai_res.get("actions", ["Increase local cyber monitoring."]),
                    deployment_priority=ai_res.get("deployment_priority", 3),
                    recommended_units=ai_res.get("recommended_units", 2),
                    confidence=ai_res.get("confidence", 75),
                    recommended_action=ai_res.get("recommended_action", "Monitor")
                )
            except Exception as e:
                logger.error("Gemini Geo generation failed for hotspot %s: %s", hs.id, str(e))
                # Fallback handled by the dummy recommendation created in geo_analytics
                pass
                
        return hotspots

geo_ai_service = GeoAIService()
