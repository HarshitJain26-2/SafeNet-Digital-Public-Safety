"""
ShieldAI Backend — Currency AI Service

Integrates TensorFlow/Teachable Machine models for base classification
and Gemini Vision for explainable security feature verification.
Fuses both into a standard risk score.
"""

from __future__ import annotations

import json
import time
import uuid
import datetime
from pathlib import Path
from typing import Any, Dict

from PIL import Image

from app.core.config import get_settings
from app.core.logging import get_logger
from app.schemas.currency import CurrencyDenomination, CurrencyAnalysisResult
from app.services.feature_fusion import FeatureFusionLayer
from app.services.gemini import GeminiFraudService
from app.services.recommendation import RecommendationEngine
from app.services.risk_engine import AIRiskEngine

try:
    import tensorflow as tf
    import numpy as np
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

logger = get_logger(__name__)

# Load Knowledge Base
KB_DIR = Path(__file__).resolve().parent.parent / "data"
FEATURES_JSON_PATH = KB_DIR / "currency_features.json"

def _load_features_db() -> Dict[str, Any]:
    if FEATURES_JSON_PATH.exists():
        with open(FEATURES_JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

CURRENCY_FEATURES_DB = _load_features_db()

# Load Vision Prompt
PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts" / "currency"
VISION_PROMPT_TEMPLATE = (
    PROMPTS_DIR / "vision_prompt.txt"
).read_text(encoding="utf-8") if (PROMPTS_DIR / "vision_prompt.txt").exists() else ""


class CurrencyAIService:
    """Service handling counterfeit currency detection."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.model = None
        self.gemini = GeminiFraudService()
        
        # Load TensorFlow model
        self.model_path = Path(__file__).resolve().parent.parent.parent / "models" / "currency_model.h5"
        self._load_tf_model()

    def _load_tf_model(self) -> None:
        """Loads the TF model gracefully."""
        if not TF_AVAILABLE:
            logger.warning("TensorFlow not installed. Running in MOCK mode.")
            return
            
        if not self.model_path.exists():
            logger.warning("Currency TF model not found at %s. Running in MOCK mode.", self.model_path)
            return
            
        try:
            self.model = tf.keras.models.load_model(str(self.model_path))
            logger.info("Successfully loaded TensorFlow currency model.")
        except Exception as e:
            logger.error("Failed to load TensorFlow model: %s", str(e))

    def _predict_tf(self, image_path: Path) -> tuple[str, float]:
        """Runs image through TF model. Returns (prediction, confidence)."""
        if self.model is None or not TF_AVAILABLE:
            # Mock logic based on filename or just return Genuine
            if "fake" in image_path.name.lower():
                return "Fake", 0.95
            return "Genuine", 0.98
            
        try:
            # Preprocessing for standard Teachable Machine models (224x224, normalized)
            img = Image.open(image_path).convert("RGB").resize((224, 224))
            img_array = np.asarray(img, dtype=np.float32)
            # Normalize to [-1, 1]
            img_array = (img_array / 127.5) - 1
            img_array = np.expand_dims(img_array, axis=0)
            
            predictions = self.model.predict(img_array)
            # Assume class 0 is Genuine, class 1 is Fake
            idx = np.argmax(predictions[0])
            confidence = float(predictions[0][idx])
            pred = "Fake" if idx == 1 else "Genuine"
            return pred, confidence
        except Exception as e:
            logger.error("TF Inference failed: %s", str(e))
            raise ValueError("TensorFlow Inference Failed")

    def _analyze_gemini(self, image_path: Path, mime_type: str, denomination: str) -> Dict[str, Any]:
        """Runs image through Gemini Vision for feature explainability."""
        expected_features = CURRENCY_FEATURES_DB.get(denomination, [])
        prompt_text = VISION_PROMPT_TEMPLATE.replace(
            "{denomination}", denomination
        ).replace(
            "{expected_features_json}", json.dumps(expected_features, indent=2)
        )
        
        import google.generativeai as genai
        uploaded_file = genai.upload_file(str(image_path), mime_type=mime_type)
        return self.gemini._call_gemini(self.gemini.model, [prompt_text, uploaded_file])

    def analyze(self, image_path: Path, mime_type: str, denomination: str) -> Dict[str, Any]:
        """Main pipeline for currency analysis."""
        start_total = time.perf_counter()
        
        # 1. Image Preprocessing & Validation
        try:
            img = Image.open(image_path)
            img.verify() # check corruption
            # Must reopen after verify
            img = Image.open(image_path)
            if img.size[0] > 8000 or img.size[1] > 8000:
                raise ValueError("Image dimensions too large.")
        except Exception as e:
            raise ValueError(f"Corrupted or invalid image: {str(e)}")
            
        # 2. TensorFlow Prediction
        tf_start = time.perf_counter()
        tf_pred, tf_conf = self._predict_tf(image_path)
        tf_time = (time.perf_counter() - tf_start) * 1000
        
        # 3. Gemini Feature Extraction
        gemini_start = time.perf_counter()
        try:
            gemini_res = self._analyze_gemini(image_path, mime_type, denomination)
            gemini_features = gemini_res.get("features", [])
            gemini_evidence = gemini_res.get("evidence", [])
        except Exception as e:
            logger.error("Gemini currency analysis failed: %s", str(e))
            gemini_features = []
            gemini_evidence = ["AI Vision analysis failed."]
        gemini_time = (time.perf_counter() - gemini_start) * 1000
            
        # 4. Feature Fusion
        category, base_score, combined_evidence_objs = FeatureFusionLayer.fuse_currency_analysis(
            tf_pred, tf_conf, gemini_features, gemini_evidence
        )
        
        # 5. Risk Engine
        final_score, threat_level = AIRiskEngine.calculate_risk(category, combined_evidence_objs, base_score)
        
        # 6. Recommendations
        recommendations = RecommendationEngine.get_recommendations(category, threat_level)
        
        # 7. Map to Frontend Schema
        if threat_level in ("Safe", "Caution"):
            risk_level = "Low Risk"
        elif threat_level == "Suspicious":
            risk_level = "Review Recommended"
        else:
            risk_level = "High Risk"
            
        total_time = (time.perf_counter() - start_total) * 1000
        
        # Metadata Logging
        logger.info(
            "Currency Analysis Complete | tf_time=%.1fms | gemini_time=%.1fms | total_time=%.1fms | tf_pred=%s | risk_level=%s | conf=%d",
            tf_time, gemini_time, total_time, tf_pred, risk_level, final_score
        )
        
        return {
            "id": f"cur_{uuid.uuid4().hex[:8]}",
            "riskLevel": risk_level,
            "confidenceScore": final_score,
            "features": gemini_features,
            "evidence": gemini_evidence + recommendations,
            "timestamp": datetime.datetime.now().isoformat()
        }

currency_ai_service = CurrencyAIService()
