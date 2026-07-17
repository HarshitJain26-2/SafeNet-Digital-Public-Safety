"""
ShieldAI Backend — Health / Status / Readiness Endpoints

Provides system health information for monitoring, load balancers,
and developer debugging.
"""

from __future__ import annotations

import platform
import time

from fastapi import APIRouter, Request

from app.core.config import get_settings
from app.schemas.response import HealthData, StatusData
from app.utils.response import success_response

router = APIRouter(tags=["System"])

# Captured once at module load (≈ application start)
_START_TIME = time.time()


@router.get("/health", summary="Health Check")
async def health_check(request: Request):
    """
    Basic health check endpoint.

    Returns application metadata, version, Python version, environment,
    uptime, and current system status.
    """
    settings = get_settings()
    data = HealthData(
        app_name=settings.app_name,
        app_version=settings.app_version,
        api_version=settings.api_v1_prefix,
        python_version=platform.python_version(),
        environment=settings.environment,
        uptime_seconds=round(time.time() - _START_TIME, 2),
        status="healthy",
    )
    return success_response(
        data=data.model_dump(),
        message="ShieldAI backend is healthy",
        request=request,
    )


@router.get("/status", summary="System Status")
async def system_status(request: Request):
    """
    Extended status endpoint with service readiness indicators.

    Future: reports health of database, AI services, and external integrations.
    """
    settings = get_settings()
    data = StatusData(
        app_name=settings.app_name,
        app_version=settings.app_version,
        api_version=settings.api_v1_prefix,
        python_version=platform.python_version(),
        environment=settings.environment,
        uptime_seconds=round(time.time() - _START_TIME, 2),
        status="operational",
        services={
            "database": "not_configured",
            "ai_engine": "not_configured",
            "authentication": "not_configured",
        },
    )
    return success_response(
        data=data.model_dump(),
        message="System status retrieved",
        request=request,
    )


@router.get("/readiness", summary="Readiness Probe")
async def readiness_probe(request: Request):
    """
    Readiness probe for orchestration platforms (K8s, Cloud Run, etc.).

    Returns 200 when the application is ready to accept traffic.
    Future: check database connectivity, model loading, etc.
    """
    return success_response(
        data={"ready": True},
        message="Application is ready",
        request=request,
    )
