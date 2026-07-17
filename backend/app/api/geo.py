"""
ShieldAI Backend — Geospatial Crime Intelligence Endpoints

Aggregates fraud and crime data into Leaflet-ready hotspot payloads,
heatmap statistics, trends, and AI deployment recommendations.
"""

from __future__ import annotations

import time

from fastapi import APIRouter, File, Request, UploadFile

from app.core.logging import get_logger
from app.schemas.geo import (
    GeospatialFilterState,
    GeospatialAnalyticsSummary,
    ThreatTrendDataPoint,
    RegionalIntelligenceBrief
)
from app.services.geo_store import geo_store
from app.services.geo_parser import GeoParserService
from app.services.geo_analytics import GeoAnalyticsService
from app.services.geo_ai import geo_ai_service
from app.utils.response import success_response, error_response

logger = get_logger(__name__)

router = APIRouter(prefix="/geo", tags=["Geospatial Intelligence"])


@router.post(
    "/upload",
    summary="Upload Crime CSV",
    description="Uploads a CSV of crime incidents, parses locations, and adds them to the Unified GeoDataStore.",
)
async def upload_geo_csv(
    request: Request,
    file: UploadFile = File(..., description="CSV file with Category, Timestamp, Lat, Lng, State, etc."),
):
    try:
        incidents = await GeoParserService.parse_csv(file)
        geo_store.add_uploaded_incidents(incidents)
        return success_response(
            data={"added": len(incidents), "total": len(geo_store.incidents)},
            message="CSV uploaded and unified successfully.",
            request=request,
        )
    except ValueError as e:
        return error_response(message=str(e), status_code=400, request=request)
    except Exception as e:
        logger.exception("Geo upload failed")
        return error_response(message="Failed to process CSV.", status_code=500, request=request)


@router.get(
    "/hotspots",
    summary="Get All Hotspots",
    description="Fetches aggregated hotspots from the unified datastore, enriched by Gemini deployment recommendations.",
)
async def get_hotspots(request: Request):
    # Automatically sync network data if needed (simplistic approach for hackathon)
    geo_store.refresh_from_network_cache()
    
    start_time = time.perf_counter()
    raw_hotspots = GeoAnalyticsService.generate_hotspots(geo_store.incidents)
    enriched = geo_ai_service.enrich_hotspots_with_ai(raw_hotspots)
    
    duration = (time.perf_counter() - start_time) * 1000
    logger.info("Generated %d hotspots in %.1fms", len(enriched), duration)
    
    return success_response(
        data=[h.model_dump(by_alias=True) for h in enriched],
        message="Hotspots retrieved.",
        request=request,
    )


@router.post(
    "/filter",
    summary="Filter Geo Analytics",
    description="Applies geospatial filters and returns a composite payload of Hotspots, Summary, and Trends.",
)
async def filter_geo(filters: GeospatialFilterState, request: Request):
    # This endpoint returns a composite to satisfy all UI charts simultaneously based on the filter
    geo_store.refresh_from_network_cache()
    
    raw_hotspots = GeoAnalyticsService.generate_hotspots(geo_store.incidents, filters)
    enriched_hotspots = geo_ai_service.enrich_hotspots_with_ai(raw_hotspots)
    
    summary = GeoAnalyticsService.generate_summary(geo_store.incidents, filters)
    trends = GeoAnalyticsService.generate_trends(geo_store.incidents, filters)
    
    return success_response(
        data={
            "hotspots": [h.model_dump(by_alias=True) for h in enriched_hotspots],
            "summary": summary.model_dump(by_alias=True),
            "trends": [t.model_dump(by_alias=True) for t in trends]
        },
        message="Filtered geo analytics successfully.",
        request=request,
    )


@router.get(
    "/summary",
    summary="Get Analytics Summary",
    description="Returns high-level geospatial metrics for the command center.",
)
async def get_summary(request: Request):
    geo_store.refresh_from_network_cache()
    summary = GeoAnalyticsService.generate_summary(geo_store.incidents)
    return success_response(
        data=summary.model_dump(by_alias=True),
        message="Summary retrieved.",
        request=request,
    )


@router.get(
    "/trends",
    summary="Get Threat Trends",
    description="Returns daily threat incident counts grouped by category.",
)
async def get_trends(request: Request):
    geo_store.refresh_from_network_cache()
    trends = GeoAnalyticsService.generate_trends(geo_store.incidents)
    return success_response(
        data=[t.model_dump(by_alias=True) for t in trends],
        message="Trends retrieved.",
        request=request,
    )
