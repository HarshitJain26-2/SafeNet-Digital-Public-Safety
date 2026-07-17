"""
ShieldAI Backend — Application Factory

Creates and configures the FastAPI application with all middleware,
exception handlers, routers, and lifecycle events.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import get_settings
from app.core.logging import get_logger, setup_logging
from app.middleware.cors import setup_cors
from app.middleware.exception_handlers import register_exception_handlers
from app.middleware.request_logging import RequestLoggingMiddleware

# ── API Routers ──────────────────────────────────────────────────────────────
from app.api.health import router as health_router
from app.api.fraud import router as fraud_router
from app.api.currency import router as currency_router
from app.api.network import router as network_router
from app.api.geo import router as geo_router
from app.api.dashboard import router as dashboard_router
from app.api.auth import router as auth_router


logger = get_logger("shieldai.app")


# ── Lifecycle ────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle events."""
    settings = get_settings()

    # ── Startup ──────────────────────────────────────────
    logger.info("=" * 60)
    logger.info("  %s v%s starting up", settings.app_name, settings.app_version)
    logger.info("  Environment : %s", settings.environment)
    logger.info("  API Prefix  : %s", settings.api_v1_prefix)
    logger.info("  CORS Origins: %s", settings.cors_origins)
    logger.info("  Debug Mode  : %s", settings.debug)
    logger.info("=" * 60)

    # Future: initialise database connections, load AI models, etc.
    settings.upload_path.mkdir(parents=True, exist_ok=True)

    yield

    # ── Shutdown ─────────────────────────────────────────
    logger.info("ShieldAI backend shutting down gracefully.")
    # Future: close database pools, release model memory, etc.


# ── Factory ──────────────────────────────────────────────────────────────────

def create_app() -> FastAPI:
    """Build and return the fully-configured FastAPI application."""

    # Initialise logging before anything else
    setup_logging()

    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        description=settings.app_description,
        version=settings.app_version,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # ── Middleware (order matters: outermost → innermost) ─
    setup_cors(app)
    app.add_middleware(RequestLoggingMiddleware)

    # ── Exception Handlers ───────────────────────────────
    register_exception_handlers(app)

    # ── Router Registration ──────────────────────────────
    api_prefix = settings.api_v1_prefix

    app.include_router(health_router, prefix=api_prefix)
    app.include_router(fraud_router, prefix=api_prefix)
    app.include_router(currency_router, prefix=api_prefix)
    app.include_router(network_router, prefix=api_prefix)
    app.include_router(geo_router, prefix=api_prefix)
    app.include_router(dashboard_router, prefix=api_prefix)
    app.include_router(auth_router, prefix=api_prefix)

    return app
