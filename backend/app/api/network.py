"""
ShieldAI Backend — Fraud Network Analysis Endpoints

Accepts transaction CSVs, orchestrates NetworkX graph construction,
detects fraud clusters, and provides an InvestigationDataset response.
"""

from __future__ import annotations

import time
import uuid

from fastapi import APIRouter, File, Request, UploadFile

from app.core.logging import get_logger
from app.schemas.network import InvestigationDataset
from app.services.network_parser import NetworkParserService
from app.services.network_graph import NetworkGraphService
from app.services.network_ai import network_ai_service
from app.services.network_cache import network_cache
from app.utils.response import success_response, error_response

logger = get_logger(__name__)

router = APIRouter(prefix="/network", tags=["Fraud Network Analysis"])


@router.post(
    "/upload",
    summary="Upload & Analyse Transaction Network",
    description="Uploads a CSV of transaction or communication records, constructs a relationship graph, runs community detection, and uses Gemini to summarize the findings. Returns a complete `InvestigationDataset`.",
)
async def upload_network_csv(
    request: Request,
    file: UploadFile = File(..., description="CSV file containing SenderID, ReceiverID, Amount, Timestamp"),
):
    """Analyse a CSV to detect fraud networks."""
    start_time = time.perf_counter()
    inv_id = str(uuid.uuid4())
    
    try:
        # 1. Parse CSV
        df = await NetworkParserService.parse_csv(file)
        
        # 2. Build Graph & Compute Metrics
        entities, rels, clusters, timeline, metrics, stats = NetworkGraphService.build_and_analyze(df)
        
        # 3. AI Summary & Risk Recommendations
        summary, recs = network_ai_service.generate_summary_and_recommendations(metrics)
        
        # 4. Construct Final Dataset
        dataset = InvestigationDataset(
            investigationId=inv_id,
            metrics=metrics,
            graph_statistics=stats,
            entities=entities,
            relationships=rels,
            clusters=clusters,
            timeline=timeline,
            summary=summary,
            recommendations=recs
        )
        
        # 5. Cache the result for future export/sample
        network_cache.save_dataset(dataset)
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "Network Analysis Complete | inv_id=%s | nodes=%d | edges=%d | duration=%.1fms",
            inv_id, metrics.total_entities, metrics.total_relationships, duration_ms
        )
        
        return success_response(
            data=dataset.model_dump(by_alias=True),
            message="Network analysis complete.",
            request=request,
        )
    except ValueError as e:
        return error_response(message=str(e), status_code=400, request=request)
    except Exception as e:
        logger.exception("Network analysis failed")
        return error_response(message="Failed to analyze network.", status_code=500, request=request)


@router.get(
    "/sample",
    summary="Get Sample Dataset",
    description="Returns a sample/cached InvestigationDataset for frontend testing without requiring an upload.",
)
async def get_sample_network(request: Request):
    """Returns a sample network dataset."""
    # Try to return the most recently cached dataset, else error
    dataset = network_cache.get_latest_dataset()
    if dataset:
        return success_response(
            data=dataset.model_dump(by_alias=True),
            message="Sample network dataset retrieved.",
            request=request,
        )
    return error_response(message="No sample dataset available. Please upload a CSV first.", status_code=404, request=request)


@router.get(
    "/export/{investigation_id}",
    summary="Export Investigation Graph",
    description="Exports a previously generated investigation graph dataset as serialized JSON.",
)
async def export_network(investigation_id: str, request: Request):
    """Export a cached investigation."""
    dataset = network_cache.get_dataset(investigation_id)
    if not dataset:
        return error_response(message="Investigation not found or expired.", status_code=404, request=request)
        
    return success_response(
        data=dataset.model_dump(by_alias=True),
        message="Investigation exported successfully.",
        request=request,
    )
