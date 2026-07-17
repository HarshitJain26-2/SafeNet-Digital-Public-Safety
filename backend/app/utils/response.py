"""
ShieldAI Backend — Response Formatting Utilities

Provides helper functions that wrap arbitrary data into the standard
API response envelope so all endpoints stay consistent.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import Request
from fastapi.responses import JSONResponse

from app.utils.helpers import generate_timestamp


def _get_request_id(request: Optional[Request] = None) -> str:
    """Extract request ID from request state, or return empty string."""
    if request and hasattr(request.state, "request_id"):
        return request.state.request_id
    return ""


def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = 200,
    request: Optional[Request] = None,
) -> JSONResponse:
    """Build a standard success JSON response."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data,
            "errors": None,
            "timestamp": generate_timestamp(),
            "request_id": _get_request_id(request),
        },
    )


def error_response(
    message: str = "An error occurred",
    errors: Optional[List[Dict[str, Any]]] = None,
    status_code: int = 500,
    request: Optional[Request] = None,
) -> JSONResponse:
    """Build a standard error JSON response."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": None,
            "errors": errors,
            "timestamp": generate_timestamp(),
            "request_id": _get_request_id(request),
        },
    )
