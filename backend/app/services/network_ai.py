"""
ShieldAI Backend — Network AI Service

Utilizes Gemini to summarize investigation findings, generate plain-text 
narratives of detected fraud clusters, and output standardized Risk Scores 
and Recommendations.
"""

from __future__ import annotations

import json
from typing import Any, Dict, List
from pydantic import BaseModel

from app.core.logging import get_logger
from app.schemas.network import InvestigationSummary, InvestigationRecommendation, InvestigationMetrics
from app.services.gemini import GeminiFraudService
from app.services.risk_engine import AIRiskEngine
from app.services.recommendation import RecommendationEngine

logger = get_logger(__name__)

# Very strict prompt for Gemini to output JSON
SYSTEM_PROMPT = """
You are a highly skilled cyber intelligence analyst for ShieldAI. 
Given the following graph investigation metrics and timeline anomalies, generate a 
concise investigation summary.

You MUST respond strictly in valid JSON format. Do NOT include markdown blocks.
The JSON must perfectly match the following schema:
{
  "overview": "<One sentence overview of the network risk>",
  "keyPatterns": [
    "<Pattern 1>", "<Pattern 2>"
  ]
}
"""

class NetworkAIService:
    """Service handling AI summarization of network graphs."""

    def __init__(self) -> None:
        self.gemini = GeminiFraudService()
        
        # Override the complaint model just for this or create a temporary one.
        # It's cleaner to just use the base generate_content with a custom prompt, 
        # but GeminiFraudService already configures the json mime type.
        
    def generate_summary_and_recommendations(
        self, 
        metrics: InvestigationMetrics
    ) -> tuple[InvestigationSummary, List[InvestigationRecommendation]]:
        
        prompt = (
            f"Metrics: {metrics.model_dump_json()}\n"
            f"Detect anomalies based on high node degree, mules, and clusters."
        )
        
        overview = "Network analysis completed successfully."
        key_patterns = ["Standard transaction flow."]
        
        try:
            # We can use the base model with an overridden prompt by injecting system prompt in contents
            # if we don't want to create a whole new generative model instance.
            import google.generativeai as genai
            from app.core.config import get_settings
            settings = get_settings()
            
            temp_model = genai.GenerativeModel(
                model_name=getattr(settings, "gemini_model", "gemini-1.5-flash"),
                system_instruction=SYSTEM_PROMPT,
                generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
            )
            response = temp_model.generate_content([prompt])
            ai_res = json.loads(response.text)
            
            overview = ai_res.get("overview", overview)
            key_patterns = ai_res.get("keyPatterns", key_patterns)
        except Exception as e:
            logger.error("Gemini network summary failed: %s", str(e))
            overview = "AI Summary generation failed or unavailable. Default metrics used."
            key_patterns = ["Unable to detect advanced patterns due to AI failure."]
            
        summary = InvestigationSummary(
            overview=overview,
            totalEntities=metrics.total_transactions, # From schema alias
            totalRelationships=metrics.total_relationships,
            clustersIdentified=metrics.total_clusters,
            highPriorityEntities=metrics.high_risk_account_count,
            potentialMules=metrics.money_mule_count,
            connectedVictims=0, # Hardcoded for now unless computed
            totalAnalyzedValue="N/A", # Hardcoded or compute from df
            keyPatterns=key_patterns
        )
        
        # Risk & Recommendations
        # Map to Risk Engine
        class _MockEv:
            def __init__(self, s):
                self.severity = s
        
        evidence_objs = []
        if metrics.money_mule_count > 0:
            evidence_objs.append(_MockEv("Critical"))
        if metrics.high_risk_account_count > 0:
            evidence_objs.append(_MockEv("High"))
            
        base_score = 10 if metrics.money_mule_count == 0 else 50
        category = "Fraud Network Analysis"
        
        score, level = AIRiskEngine.calculate_risk(category, evidence_objs, base_score) # type: ignore
        
        # Recommendations
        rec_strings = RecommendationEngine.get_recommendations(category, level)
        
        recs_out = []
        for i, rec in enumerate(rec_strings):
            prio = "High" if level in ("Critical", "High-Risk") else "Medium"
            recs_out.append(InvestigationRecommendation(
                id=f"rec_{i}",
                priority=prio, # type: ignore
                action=rec.split(":")[0] if ":" in rec else rec,
                reason=rec
            ))
            
        return summary, recs_out

network_ai_service = NetworkAIService()
