"""
ShieldAI Backend — Standard Response Schemas

Pydantic models for the global API response envelope.
Every endpoint MUST return one of these shapes.
"""

from __future__ import annotations

from typing import Any, Dict, Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field

from app.utils.helpers import generate_timestamp

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard response envelope used by every API endpoint."""

    success: bool = True
    message: str = ""
    data: Optional[T] = None
    errors: Optional[List[Dict[str, Any]]] = None
    timestamp: str = Field(default_factory=generate_timestamp)
    request_id: str = ""


class HealthData(BaseModel):
    """Data payload for the health endpoint."""

    app_name: str
    app_version: str
    api_version: str
    python_version: str
    environment: str
    uptime_seconds: float
    status: str = "healthy"


class StatusData(BaseModel):
    """Data payload for the status endpoint."""

    app_name: str
    app_version: str
    api_version: str
    python_version: str
    environment: str
    uptime_seconds: float
    status: str = "operational"
    services: Dict[str, str] = Field(default_factory=dict)


class UploadData(BaseModel):
    """Data payload returned after a successful file upload."""

    filename: str
    original_filename: str
    size_bytes: int
    content_type: Optional[str] = None
    path: str
