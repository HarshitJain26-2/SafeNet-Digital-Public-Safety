"""
ShieldAI Backend — Uvicorn Entrypoint

Run with:
    python main.py
    # or
    uvicorn app:create_app --factory --reload --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import uvicorn

from app import create_app
from app.core.config import get_settings

# Create the application instance (used by uvicorn when running as module)
app = create_app()


if __name__ == "__main__":
    settings = get_settings()
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.is_development,
        log_level=settings.log_level.lower(),
    )
