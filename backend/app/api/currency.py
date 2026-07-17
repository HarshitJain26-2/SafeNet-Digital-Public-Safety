"""
ShieldAI Backend — Currency Verification Endpoints

Integrates TensorFlow and Gemini Vision for currency security feature 
inspection and counterfeit detection.
"""

from __future__ import annotations

import time

from fastapi import APIRouter, File, Form, Request, UploadFile

from app.core.logging import get_logger
from app.schemas.currency import CurrencyDenomination, CurrencyNoteSide
from app.services.currency_ai import currency_ai_service
from app.utils.upload import save_upload_file
from app.services.network_cache import session_store
from app.schemas.currency import CurrencyAnalysisResult
from app.utils.response import success_response, error_response

logger = get_logger(__name__)

router = APIRouter(prefix="/currency", tags=["Currency Verification"])

# Common OpenAPI response for 500 errors
SERVER_ERROR_RESPONSE = {
    500: {
        "description": "Internal Server Error",
        "content": {
            "application/json": {
                "example": {
                    "success": False,
                    "message": "Failed to analyze currency.",
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
    "/analyze",
    summary="Analyse Currency Image",
    description="Analyzes an uploaded currency note image for counterfeit indicators. Merges TensorFlow classification with Gemini Vision security feature verification, checking for watermarks, threads, and micro-printing.",
    responses={
        200: {
            "description": "Successful Currency Analysis",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Currency analysis complete.",
                        "data": {
                            "riskLevel": "High Risk",
                            "confidenceScore": 92,
                            "features": [
                                {
                                    "id": "sec_thread",
                                    "name": "Windowed Security Thread",
                                    "status": "Inconsistency",
                                    "observation": "Thread is drawn on and does not color shift.",
                                    "confidence": 95,
                                    "boundingBox": {"x": 0.4, "y": 0.1, "width": 0.05, "height": 0.8}
                                }
                            ],
                            "evidence": ["Security thread looks printed.", "Reject Currency", "Report Suspicious Note"]
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
async def analyze_currency(
    request: Request,
    file: UploadFile = File(..., description="Currency note image (PNG, JPG, WEBP)"),
    denomination: str = Form("₹500", description="Note denomination (e.g. ₹500)"),
    note_side: str = Form("Front", description="Front or Reverse side of the note"),
):
    """Analyse an uploaded currency image for counterfeit indicators."""
    start_time = time.perf_counter()
    
    try:
        # Validate and save
        file_path = await save_upload_file(file, allowed_categories=["image"])
        
        # Analyze
        mime_type = file.content_type or "image/jpeg"
        verdict = currency_ai_service.analyze(file_path, mime_type, denomination)
        
        # Save session to shared store
        session_obj = CurrencyAnalysisResult(**verdict)
        session_store.save_dataset(session_obj)
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "API Route Complete | route=/currency/analyze | duration=%.1fms", duration_ms
        )
        
        return success_response(
            data=verdict,
            message="Currency analysis complete.",
            request=request,
        )
    except ValueError as e:
        return error_response(message=str(e), status_code=400, request=request)
    except Exception as e:
        logger.exception("Currency analysis failed")
        return error_response(message="Failed to analyze currency.", status_code=500, request=request)
