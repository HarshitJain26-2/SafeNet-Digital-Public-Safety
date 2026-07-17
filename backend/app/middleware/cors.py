"""
ShieldAI Backend — CORS Middleware Configuration

Sets up Cross-Origin Resource Sharing based on application settings,
allowing the Next.js frontend to communicate with this API.
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings


def setup_cors(app: FastAPI) -> None:
    """Attach CORS middleware to the FastAPI application."""
    settings = get_settings()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )
