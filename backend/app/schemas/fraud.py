"""
ShieldAI Backend — Fraud / Citizen Threat Schemas

Mirrors the frontend TypeScript types in ``src/lib/types/citizen.ts``.
Includes OpenAPI documentation examples for Swagger UI.
"""

from __future__ import annotations

from typing import List, Literal, Optional, Dict, Any

from pydantic import BaseModel, Field


# ── Input types ──────────────────────────────────────────────────────────────

InputSource = Literal["WhatsApp", "SMS", "Email", "Voice", "Payment Request", "Other"]


class ThreatInputSchema(BaseModel):
    """Incoming threat/message analysis request."""

    source: InputSource = Field(
        default="WhatsApp",
        description="The medium through which the suspicious message was received."
    )
    text: str = Field(
        ..., 
        min_length=1, 
        description="The suspicious message text to analyse.",
        examples=["I am from Mumbai Police. Your Aadhaar is blocked. Send 5000 to this UPI."]
    )
    phone_number: Optional[str] = Field(
        None, 
        alias="phoneNumber",
        description="The phone number of the sender.",
        examples=["+919876543210"]
    )
    upi_id: Optional[str] = Field(
        None, 
        alias="upiId",
        description="Any UPI ID mentioned in the message or sender.",
        examples=["scammer@ybl"]
    )
    url: Optional[str] = Field(
        None,
        description="Any URL included in the message.",
        examples=["http://fake-bank-update.com"]
    )

    model_config = {"populate_by_name": True}


# ── Output types ─────────────────────────────────────────────────────────────

Severity = Literal["Critical", "High", "Medium", "Informational"]
ThreatLevel = Literal["Safe", "Caution", "Suspicious", "High-Risk", "Critical"]

ScamCategory = Literal[
    "Digital Arrest Scam",
    "Government Impersonation",
    "Phishing",
    "Fake UPI Request",
    "OTP Fraud",
    "Investment Fraud",
    "Job Scam",
    "Loan Scam",
    "KYC Scam",
    "Lottery Scam",
    "Tech-Support Scam",
    "Unknown / Requires Review",
    "Safe Communication",
]


class EvidenceIndicator(BaseModel):
    """A single piece of evidence supporting the verdict."""

    label: str = Field(..., description="Short descriptive label of the indicator.", examples=["Fear Language"])
    severity: Severity = Field(..., description="Risk severity of this specific indicator.")
    explanation: str = Field(..., description="Detailed explanation of why this indicator is suspicious.", examples=["The sender attempts to create panic by mentioning an arrest."])


class DetectedEntity(BaseModel):
    """An entity extracted from the analysed input."""

    type: str = Field(..., description="Type of entity (e.g., Phone Number, UPI ID, Bank).", examples=["Phone Number"])
    value: str = Field(..., description="The extracted value.", examples=["+919876543210"])
    copyable: bool = Field(False, description="Whether this entity should be easily copyable in the UI.")


class ThreatVerdict(BaseModel):
    """Complete threat analysis verdict — matches frontend ``ThreatVerdict``."""

    id: str = Field(..., description="Unique identifier for this analysis session.")
    level: ThreatLevel = Field(..., description="Overall threat classification level.")
    score: int = Field(..., ge=0, le=100, description="Normalized threat score from 0 (Safe) to 100 (Critical).")
    confidence: int = Field(..., ge=0, le=100, description="AI confidence in this verdict.")
    category: ScamCategory = Field(..., description="Specific categorization of the threat vector.")
    assessment: str = Field(..., description="Detailed AI-generated explanation of the threat.")
    evidence: List[EvidenceIndicator] = Field(default_factory=list, description="Specific indicators extracted.")
    entities: List[DetectedEntity] = Field(default_factory=list, description="Entities involved in the threat.")
    recommendations: List[str] = Field(default_factory=list, description="Actionable safety advice for the victim.")
    timestamp: str = Field(..., description="ISO-8601 timestamp of when the analysis completed.")


# ── Complaint Types ──────────────────────────────────────────────────────────

class ComplaintRequestSchema(BaseModel):
    """Input needed to generate a complaint draft."""
    
    input: ThreatInputSchema = Field(..., description="The original threat input data.")
    verdict: ThreatVerdict = Field(..., description="The AI analysis verdict.")


class ComplaintResponseSchema(BaseModel):
    """Generated complaint drafted by AI."""
    
    summary: str = Field(..., description="A one-sentence summary of the incident.")
    incident_description: str = Field(..., description="A detailed, objective description of the incident from the victim's perspective.")
    evidence: List[str] = Field(default_factory=list, description="A list of extracted evidence strings.")
    suggested_complaint: str = Field(..., description="A formal letter/email draft suitable for submission to cybercrime authorities.")
    pdf_ready_json: Dict[str, Any] = Field(..., description="Structured JSON ready for PDF rendering.")
