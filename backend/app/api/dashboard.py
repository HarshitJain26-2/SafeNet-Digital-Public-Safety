"""
ShieldAI Backend — Investigation Command Center API
"""

from __future__ import annotations

import time

from fastapi import APIRouter, Request

from app.core.logging import get_logger
from app.services.dashboard_aggregator import CommandCenterAggregator
from app.services.dashboard_ai import dashboard_ai_service
from app.utils.response import success_response, error_response

logger = get_logger(__name__)

router = APIRouter(prefix="/dashboard", tags=["Command Center"])


@router.get(
    "",
    summary="Get Full Dashboard",
    description="Returns composite payload of metrics, cases, and activity."
)
async def get_dashboard(request: Request):
    try:
        data = {
            "metrics": CommandCenterAggregator.get_metrics().model_dump(by_alias=True),
            "cases": [c.model_dump(by_alias=True) for c in CommandCenterAggregator.get_cases()],
            "activity": [a.model_dump(by_alias=True) for a in CommandCenterAggregator.get_activity()],
        }
        return success_response(data=data, message="Dashboard payload retrieved.", request=request)
    except Exception as e:
        logger.exception("Failed to get dashboard")
        return error_response(message="Internal Server Error", status_code=500, request=request)


@router.get("/metrics", summary="Get Dashboard Metrics")
async def get_dashboard_metrics(request: Request):
    try:
        data = CommandCenterAggregator.get_metrics().model_dump(by_alias=True)
        return success_response(data=data, message="Metrics retrieved.", request=request)
    except Exception as e:
        logger.exception("Failed to get metrics")
        return error_response(message="Internal Server Error", status_code=500, request=request)


@router.get("/cases", summary="Get Command Cases")
async def get_dashboard_cases(request: Request):
    try:
        data = [c.model_dump(by_alias=True) for c in CommandCenterAggregator.get_cases()]
        return success_response(data=data, message="Cases retrieved.", request=request)
    except Exception as e:
        logger.exception("Failed to get cases")
        return error_response(message="Internal Server Error", status_code=500, request=request)


@router.get("/activity", summary="Get Cross-Module Activity Feed")
async def get_dashboard_activity(request: Request):
    try:
        data = [a.model_dump(by_alias=True) for a in CommandCenterAggregator.get_activity()]
        return success_response(data=data, message="Activity retrieved.", request=request)
    except Exception as e:
        logger.exception("Failed to get activity")
        return error_response(message="Internal Server Error", status_code=500, request=request)


@router.get("/analytics", summary="Get Investigation Analytics")
async def get_dashboard_analytics(request: Request):
    try:
        data = CommandCenterAggregator.get_analytics()
        return success_response(data=data, message="Analytics retrieved.", request=request)
    except Exception as e:
        logger.exception("Failed to get analytics")
        return error_response(message="Internal Server Error", status_code=500, request=request)


@router.get("/threats", summary="Get Threat Distribution")
async def get_dashboard_threats(request: Request):
    try:
        # Re-using analytics for threats
        data = CommandCenterAggregator.get_analytics()
        return success_response(data=data, message="Threats retrieved.", request=request)
    except Exception as e:
        logger.exception("Failed to get threats")
        return error_response(message="Internal Server Error", status_code=500, request=request)


@router.get("/summary", summary="Get AI Executive Security Summary")
async def get_dashboard_summary(request: Request):
    try:
        start_time = time.perf_counter()
        summary = dashboard_ai_service.generate_summary()
        duration = (time.perf_counter() - start_time) * 1000
        logger.info("AI Executive Summary generated | duration=%.1fms", duration)
        
        return success_response(
            data=summary.model_dump(by_alias=True), 
            message="AI Executive Security Summary generated.", 
            request=request
        )
    except Exception as e:
        logger.exception("Failed to get AI summary")
        return error_response(message="Internal Server Error", status_code=500, request=request)
