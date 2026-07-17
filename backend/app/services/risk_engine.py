"""
ShieldAI Backend — Shared AI Risk Engine

Normalises and calculates risk scores based on evidence severity and 
threat categories. Ensures consistent scoring logic across all AI modules
(Fraud, Currency, Network, Geospatial).
"""

from __future__ import annotations

from typing import List, Any
from app.schemas.fraud import ThreatLevel

class AIRiskEngine:
    """Calculates and normalises threat scores across all ShieldAI modules."""

    @staticmethod
    def calculate_risk(category: str, evidence: List[Any], base_score: int) -> tuple[int, ThreatLevel]:
        """
        Calculate the final threat score and determine the threat level.
        
        Takes the LLM's base_score and applies deterministic heuristics
        based on evidence severity. Supports generalized categories.
        """
        score = base_score
        
        # Generalized safe categories across modules
        safe_categories = {"Safe Communication", "Safe", "Authentic", "No Threat", "Legitimate"}
        if category in safe_categories:
            return 0, "Safe"
            
        # Tally evidence severities (assuming evidence objects have a 'severity' attribute)
        critical_count = sum(1 for e in evidence if getattr(e, "severity", "") == "Critical")
        high_count = sum(1 for e in evidence if getattr(e, "severity", "") == "High")
        medium_count = sum(1 for e in evidence if getattr(e, "severity", "") == "Medium")

        # Apply deterministic bounds
        if critical_count > 0:
            score = max(score, 90)
        elif high_count > 1:
            score = max(score, 75)
        elif high_count > 0 or medium_count > 1:
            score = max(score, 60)
            
        # Ensure bounds
        score = max(0, min(100, score))

        # Determine generalized threat level
        if score >= 90:
            level: ThreatLevel = "Critical"
        elif score >= 75:
            level = "High-Risk"
        elif score >= 50:
            level = "Suspicious"
        elif score >= 20:
            level = "Caution"
        else:
            level = "Safe"
            
        return score, level

