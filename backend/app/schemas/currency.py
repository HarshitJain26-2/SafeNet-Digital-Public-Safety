"""
ShieldAI Backend — Currency Verification Schemas

Mirrors the frontend TypeScript types in ``src/lib/types/currency.ts``.
Includes OpenAPI documentation examples for Swagger UI.
"""

from __future__ import annotations

from typing import List, Literal, Optional, Dict, Any

from pydantic import BaseModel, Field


# ── Enums / Literals ─────────────────────────────────────────────────────────

CurrencyDenomination = Literal["₹100", "₹200", "₹500", "₹2000"]
CurrencyNoteSide = Literal["Front", "Reverse"]
CaptureType = Literal["Single Image", "Front + Reverse"]
FeatureStatus = Literal["Consistent", "Review", "Inconsistency", "Unknown"]
CurrencyRiskLevel = Literal["Low Risk", "Review Recommended", "High Risk"]


# ── Schemas ──────────────────────────────────────────────────────────────────

class BoundingBox(BaseModel):
    """Optional coordinates for highlighting suspicious regions in UI."""
    x: float = Field(..., description="X coordinate (e.g. normalized 0.0 to 1.0 or pixel).", examples=[0.25])
    y: float = Field(..., description="Y coordinate (e.g. normalized 0.0 to 1.0 or pixel).", examples=[0.25])
    width: float = Field(..., description="Width (e.g. normalized 0.0 to 1.0 or pixel).", examples=[0.1])
    height: float = Field(..., description="Height (e.g. normalized 0.0 to 1.0 or pixel).", examples=[0.1])


class SecurityFeature(BaseModel):
    """A single currency security feature inspection result."""

    id: str = Field(..., description="Internal ID of the feature (e.g. 'sec_thread').", examples=["sec_thread"])
    name: str = Field(..., description="Human-readable name.", examples=["Windowed Security Thread"])
    status: FeatureStatus = Field(..., description="Detected status of the feature.", examples=["Consistent"])
    observation: str = Field(..., description="Explanation of what was observed.", examples=["Thread is present and color shifts from green to blue."])
    confidence: Optional[int] = Field(None, ge=0, le=100, description="Confidence in this specific feature observation.", examples=[95])
    bounding_box: Optional[BoundingBox] = Field(None, alias="boundingBox", description="Optional coordinates highlighting the feature.")

    model_config = {"populate_by_name": True}


class CurrencyAnalysisResult(BaseModel):
    """Complete currency analysis result — matches frontend ``CurrencyAnalysisResult``."""

    id: str = Field(..., description="Unique internal identifier for the session.")
    risk_level: CurrencyRiskLevel = Field(..., alias="riskLevel", description="Overall risk level mapped for the frontend.", examples=["Low Risk"])
    confidence_score: int = Field(..., ge=0, le=100, alias="confidenceScore", description="Overall AI confidence score.", examples=[98])
    features: List[SecurityFeature] = Field(default_factory=list, description="List of analyzed security features.")
    evidence: List[str] = Field(default_factory=list, description="General observations and evidence strings.", examples=["Watermark clearly visible", "Serial number formatting correct"])
    timestamp: str = Field(..., description="ISO-8601 timestamp of analysis completion.")

    model_config = {"populate_by_name": True}
