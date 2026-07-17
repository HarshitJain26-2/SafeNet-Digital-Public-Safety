"""
ShieldAI Backend — Request Logging Middleware

Enterprise-grade structured request logging with:
- Request ID generation (UUID4)
- HTTP method and path
- Response status code
- Processing duration (ms)
- Client IP address
"""

from __future__ import annotations

import time

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging import get_logger
from app.utils.helpers import generate_request_id

logger = get_logger("shieldai.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Attach a request ID, log every request/response, and record timing."""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Generate and attach request ID
        request_id = generate_request_id()
        request.state.request_id = request_id

        # Client IP
        client_ip = request.client.host if request.client else "unknown"

        # Timing
        start_time = time.perf_counter()

        logger.info(
            "→  %s %s | client=%s | request_id=%s",
            request.method,
            request.url.path,
            client_ip,
            request_id,
        )

        response: Response = await call_next(request)

        duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "←  %s %s | status=%d | %.1fms | client=%s | request_id=%s",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
            client_ip,
            request_id,
        )

        # Attach request ID to response headers for client-side tracing
        response.headers["X-Request-ID"] = request_id

        return response
