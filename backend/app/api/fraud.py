"""
ShieldAI Backend — Fraud / Citizen Threat Analysis Endpoints

Integrates Gemini API for text, image, and voice analysis, 
providing real-time threat intelligence and complaint generation.
"""

from __future__ import annotations

import time
from typing import Any, Dict

from fastapi import APIRouter, File, Request, UploadFile, HTTPException

from app.core.logging import get_logger
from app.schemas.fraud import ThreatInputSchema, ComplaintRequestSchema, ThreatVerdict, ComplaintResponseSchema
from app.services.gemini import gemini_service
from app.utils.helpers import generate_timestamp
import uuid

from app.utils.response import success_response, error_response
from app.utils.upload import save_upload_file
from app.services.network_cache import session_store

logger = get_logger(__name__)

router = APIRouter(prefix="/fraud", tags=["Citizen Fraud Shield"])

# Common OpenAPI response for 500 errors
SERVER_ERROR_RESPONSE = {
    500: {
        "description": "Internal Server Error",
        "content": {
            "application/json": {
                "example": {
                    "success": False,
                    "message": "Failed to analyze data.",
                    "data": None,
                    "errors": [{"field": "ai", "message": "API timeout", "type": "timeout"}],
                    "timestamp": "2024-01-01T12:00:00Z",
                    "request_id": "abc-123"
                }
            }
        }
    }
}

BAD_REQUEST_RESPONSE = {
    400: {
        "description": "Bad Request - Validation Error",
        "content": {
            "application/json": {
                "example": {
                    "success": False,
                    "message": "Invalid file type.",
                    "data": None,
                    "errors": [{"field": "file", "message": "Only images are allowed.", "type": "validation"}],
                    "timestamp": "2024-01-01T12:00:00Z",
                    "request_id": "abc-123"
                }
            }
        }
    }
}


@router.post(
    "/analyze-text", 
    summary="Analyse Threat Text",
    description="Analyzes a suspicious text message (e.g., from WhatsApp or SMS) for fraud indicators using AI and deterministic regex entity extraction. Returns a detailed threat verdict including threat level, confidence, extracted entities, and safety recommendations.",
    responses={
        200: {
            "description": "Successful Analysis",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Text analysis complete.",
                        "data": {
                            "level": "Critical",
                            "score": 95,
                            "confidence": 99,
                            "category": "Digital Arrest Scam",
                            "assessment": "The sender claims to be from CBI and uses urgency/fear tactics.",
                            "evidence": [{"label": "Fear Tactic", "severity": "Critical", "explanation": "Threatens arrest."}],
                            "entities": [{"type": "Phone Number", "value": "+919876543210", "copyable": True}],
                            "recommendations": ["Do not transfer money.", "Block the number."],
                            "timestamp": "2024-01-01T12:00:00Z"
                        },
                        "errors": None,
                        "timestamp": "2024-01-01T12:00:00Z",
                        "request_id": "abc-123"
                    }
                }
            }
        },
        **SERVER_ERROR_RESPONSE
    }
)
async def analyze_text(request: Request, payload: ThreatInputSchema):
    """Analyse a suspicious text message for fraud indicators using Gemini."""
    start_time = time.perf_counter()
    
    try:
        verdict = gemini_service.analyze_text(payload)
        verdict["id"] = f"cfs_txt_{uuid.uuid4().hex[:8]}"
        verdict["timestamp"] = generate_timestamp()
        
        session_store.save_dataset(ThreatVerdict(**verdict))
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "AI Analysis Complete | type=text | score=%s | category=%s | duration=%.1fms",
            verdict["score"], verdict["category"], duration_ms
        )
        
        return success_response(
            data=verdict,
            message="Text analysis complete.",
            request=request,
        )
    except Exception as e:
        logger.exception("Text analysis failed")
        return error_response(message="Failed to analyze text.", status_code=500, request=request)


@router.post(
    "/analyze-image", 
    summary="Analyse Threat Image",
    description="Analyzes an uploaded image (such as a screenshot of a fake payment, a fraudulent official document, or phishing SMS screenshot) using multimodal AI to detect tampering, fake domains, or fraudulent claims.",
    responses={
        200: {
            "description": "Successful Image Analysis",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Image analysis complete.",
                        "data": {
                            "level": "High-Risk",
                            "score": 85,
                            "confidence": 95,
                            "category": "Fake UPI Request",
                            "assessment": "The screenshot shows a fake payment confirmation from a known scam UPI ID.",
                            "evidence": [{"label": "Fake Payment UI", "severity": "High", "explanation": "Font doesn't match official app."}],
                            "entities": [{"type": "UPI ID", "value": "scammer@okaxis", "copyable": True}],
                            "recommendations": ["Do not approve the collect request."],
                            "timestamp": "2024-01-01T12:00:00Z"
                        },
                        "errors": None,
                        "timestamp": "2024-01-01T12:00:00Z",
                        "request_id": "abc-123"
                    }
                }
            }
        },
        **BAD_REQUEST_RESPONSE,
        **SERVER_ERROR_RESPONSE
    }
)
async def analyze_image(
    request: Request,
    file: UploadFile = File(..., description="Image file to analyse (JPEG, PNG, WEBP)."),
):
    """Analyse an uploaded image for fraud indicators using Gemini Vision."""
    start_time = time.perf_counter()
    try:
        # Validate and save
        file_path = await save_upload_file(file, allowed_categories=["image"])
        
        # Analyze
        mime_type = file.content_type or "image/jpeg"
        verdict = gemini_service.analyze_image(file_path, mime_type)
        verdict["id"] = f"cfs_img_{uuid.uuid4().hex[:8]}"
        verdict["timestamp"] = generate_timestamp()
        
        session_store.save_dataset(ThreatVerdict(**verdict))
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "AI Analysis Complete | type=image | score=%s | category=%s | duration=%.1fms",
            verdict["score"], verdict["category"], duration_ms
        )
        
        return success_response(
            data=verdict,
            message="Image analysis complete.",
            request=request,
        )
    except ValueError as e:
        return error_response(message=str(e), status_code=400, request=request)
    except Exception as e:
        logger.exception("Image analysis failed")
        return error_response(message="Failed to analyze image.", status_code=500, request=request)


@router.post(
    "/analyze-voice", 
    summary="Analyse Voice Recording",
    description="Transcribes and analyzes an uploaded voice recording (e.g., recorded spam call, voice note) to detect voice phishing, urgency tactics, and impersonation.",
    responses={
        200: {
            "description": "Successful Voice Analysis",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Voice analysis complete.",
                        "data": {
                            "level": "Suspicious",
                            "score": 60,
                            "confidence": 80,
                            "category": "KYC Scam",
                            "assessment": "The caller is rushing the victim to update KYC to prevent account block.",
                            "evidence": [{"label": "Urgency", "severity": "Medium", "explanation": "Threatens account closure within 24h."}],
                            "entities": [],
                            "recommendations": ["Hang up.", "Call your bank's official number directly."],
                            "timestamp": "2024-01-01T12:00:00Z"
                        },
                        "errors": None,
                        "timestamp": "2024-01-01T12:00:00Z",
                        "request_id": "abc-123"
                    }
                }
            }
        },
        **BAD_REQUEST_RESPONSE,
        **SERVER_ERROR_RESPONSE
    }
)
async def analyze_voice(
    request: Request,
    file: UploadFile = File(..., description="Audio file to analyse (WAV, MP3, M4A)."),
):
    """Analyse an uploaded voice recording for scam indicators."""
    start_time = time.perf_counter()
    try:
        # Validate and save
        file_path = await save_upload_file(file, allowed_categories=["audio"])
        
        # Gemini-powered Speech-to-Text via File API
        # Gemini 1.5 Flash supports audio transcription natively when the file is uploaded
        transcript = gemini_service.transcribe_audio(file_path, file.content_type or "audio/wav")
        
        # Analyze transcript
        verdict = gemini_service.analyze_voice(transcript, file.filename or "audio")
        verdict["id"] = f"cfs_voc_{uuid.uuid4().hex[:8]}"
        verdict["timestamp"] = generate_timestamp()
        
        session_store.save_dataset(ThreatVerdict(**verdict))
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "AI Analysis Complete | type=voice | score=%s | category=%s | duration=%.1fms",
            verdict["score"], verdict["category"], duration_ms
        )
        
        return success_response(
            data=verdict,
            message="Voice analysis complete.",
            request=request,
        )
    except ValueError as e:
        return error_response(message=str(e), status_code=400, request=request)
    except Exception as e:
        logger.exception("Voice analysis failed")
        return error_response(message="Failed to analyze voice.", status_code=500, request=request)


@router.post(
    "/generate-complaint", 
    summary="Generate Official Complaint",
    description="Generates a structured, formal complaint draft based on the original threat and AI verdict. This drafted JSON is suitable to be fed directly into a PDF generation module or submitted to national cybercrime portals.",
    responses={
        200: {
            "description": "Successful Complaint Generation",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Complaint draft generated.",
                        "data": {
                            "summary": "Fraudulent message claiming to be from CBI.",
                            "incident_description": "I received a WhatsApp message from +919876543210...",
                            "evidence": ["Sender: +919876543210"],
                            "suggested_complaint": "To Whom It May Concern...",
                            "pdf_ready_json": {"title": "Cybercrime Complaint", "category": "Digital Arrest Scam"}
                        },
                        "errors": None,
                        "timestamp": "2024-01-01T12:00:00Z",
                        "request_id": "abc-123"
                    }
                }
            }
        },
        **SERVER_ERROR_RESPONSE
    }
)
async def generate_complaint(request: Request, payload: ComplaintRequestSchema):
    """Generate an official complaint draft based on the threat."""
    start_time = time.perf_counter()
    
    try:
        draft = gemini_service.generate_complaint(
            payload.input.model_dump(by_alias=True), 
            payload.verdict.model_dump(by_alias=True)
        )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "Complaint Generation Complete | category=%s | duration=%.1fms",
            payload.verdict.category, duration_ms
        )
        
        return success_response(
            data=draft,
            message="Complaint draft generated.",
            request=request,
        )
    except Exception as e:
        logger.exception("Complaint generation failed")
        return error_response(message="Failed to generate complaint.", status_code=500, request=request)
