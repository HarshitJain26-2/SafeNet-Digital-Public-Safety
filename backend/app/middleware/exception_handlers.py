"""
ShieldAI Backend — Global Exception Handlers

Centralised handlers for validation errors, HTTP exceptions, and
unexpected exceptions. All return the standard response envelope.
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.logging import get_logger
from app.utils.response import error_response

logger = get_logger("shieldai.exceptions")


def register_exception_handlers(app: FastAPI) -> None:
    """Register all global exception handlers on the application."""

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ):
        """Handle Pydantic / FastAPI validation errors."""
        errors = []
        for err in exc.errors():
            errors.append(
                {
                    "field": " → ".join(str(loc) for loc in err.get("loc", [])),
                    "message": err.get("msg", "Validation error"),
                    "type": err.get("type", "value_error"),
                }
            )
        logger.warning(
            "Validation error on %s %s: %s",
            request.method,
            request.url.path,
            errors,
        )
        return error_response(
            message="Validation failed",
            errors=errors,
            status_code=422,
            request=request,
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request, exc: StarletteHTTPException
    ):
        """Handle explicit HTTP exceptions (404, 403, etc.)."""
        logger.warning(
            "HTTP %d on %s %s: %s",
            exc.status_code,
            request.method,
            request.url.path,
            exc.detail,
        )
        return error_response(
            message=str(exc.detail),
            status_code=exc.status_code,
            request=request,
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request, exc: Exception
    ):
        """Catch-all for unexpected exceptions — never leak stack traces."""
        logger.exception(
            "Unhandled exception on %s %s",
            request.method,
            request.url.path,
        )
        return error_response(
            message="An internal server error occurred. Please try again later.",
            errors=[{"type": type(exc).__name__, "message": str(exc)}],
            status_code=500,
            request=request,
        )
