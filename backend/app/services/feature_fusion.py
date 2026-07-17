"""
ShieldAI Backend — Feature Fusion Layer

Merges deterministic machine learning outputs (TensorFlow) with 
explainable AI outputs (Gemini Vision) to form a unified, highly 
confident threat profile before risk scoring.
"""

from __future__ import annotations
from typing import Any, Dict, List


class FeatureFusionLayer:
    """Fuses model outputs for currency verification."""

    @staticmethod
    def fuse_currency_analysis(
        tf_prediction: str,
        tf_confidence: float,
        gemini_features: List[Dict[str, Any]],
        gemini_evidence: List[str]
    ) -> tuple[str, int, List[Any]]:
        """
        Merges TF and Gemini results.
        Returns: category, base_score, combined_evidence
        """
        category = "Counterfeit Currency" if tf_prediction == "Fake" else "Authentic"
        base_score = 0
        
        # Start base score based on TF prediction
        if tf_prediction == "Fake":
            base_score = max(50, int(tf_confidence * 100))
        else:
            # If TF says Genuine, base score is low, but can be raised by Gemini anomalies
            base_score = max(0, 100 - int(tf_confidence * 100))
            
        combined_evidence = []
        
        # Analyze Gemini features to adjust score and add to evidence
        inconsistencies = 0
        reviews_needed = 0
        
        # We create a simple object to simulate EvidenceIndicator for RiskEngine
        class _MockEv:
            def __init__(self, s):
                self.severity = s
                
        for feat in gemini_features:
            status = feat.get("status", "Unknown")
            if status == "Inconsistency":
                inconsistencies += 1
                combined_evidence.append(_MockEv("High"))
            elif status == "Review":
                reviews_needed += 1
                combined_evidence.append(_MockEv("Medium"))
            elif status == "Consistent":
                combined_evidence.append(_MockEv("Informational"))
                
        # Heuristic fusion rules:
        # If TF says Genuine, but Gemini finds inconsistencies, raise score
        if tf_prediction == "Genuine" and inconsistencies > 0:
            category = "Counterfeit Currency"
            base_score += 40 * inconsistencies
            
        # If TF says Fake, and Gemini finds inconsistencies, it's highly critical
        if tf_prediction == "Fake" and inconsistencies > 0:
            base_score += 20 * inconsistencies
            combined_evidence.append(_MockEv("Critical"))
            
        base_score = max(0, min(100, int(base_score)))
        
        return category, base_score, combined_evidence
