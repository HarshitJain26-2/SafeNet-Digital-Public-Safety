"""
ShieldAI Backend — Structured Enterprise Logging

Configures Python's standard logging with:
- Console handler (coloured, human-readable)
- File handler (structured, persistent)
- Configurable log levels via environment
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path

from app.core.config import get_settings


_LOG_FORMAT = (
    "%(asctime)s | %(levelname)-8s | %(name)-25s | %(message)s"
)
_DATE_FORMAT = "%Y-%m-%dT%H:%M:%S"


def setup_logging() -> None:
    """Initialise application-wide logging. Call once at startup."""
    settings = get_settings()
    level = getattr(logging, settings.log_level.upper(), logging.INFO)

    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    # Avoid duplicate handlers on repeated calls
    if root_logger.handlers:
        return

    formatter = logging.Formatter(fmt=_LOG_FORMAT, datefmt=_DATE_FORMAT)

    # ── Console Handler ──────────────────────────────────
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)

    # ── File Handler ─────────────────────────────────────
    log_path: Path = settings.log_file_path
    log_path.parent.mkdir(parents=True, exist_ok=True)

    file_handler = logging.FileHandler(str(log_path), encoding="utf-8")
    file_handler.setLevel(level)
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)

    # Silence noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)


def get_logger(name: str) -> logging.Logger:
    """Return a named logger. Use as: ``logger = get_logger(__name__)``."""
    return logging.getLogger(name)
