"""
ShieldAI Backend — Core Configuration

Centralised application settings loaded from environment variables.
Uses Pydantic v2 BaseSettings for type-safe, validated configuration.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


# Resolve project root (backend/)
_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """Application-wide settings sourced exclusively from environment variables."""

    model_config = SettingsConfigDict(
        env_file=str(_BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────────────────
    app_name: str = "ShieldAI"
    app_version: str = "0.1.0"
    app_description: str = "AI-Powered Digital Public Safety Intelligence Platform"
    environment: str = "development"
    debug: bool = True

    # ── Server ───────────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000

    # ── API Versioning (configurable prefix) ─────────────
    api_v1_prefix: str = "/api/v1"

    # ── CORS ─────────────────────────────────────────────
    cors_origins: List[str] = ["http://localhost:3000"]
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = ["*"]
    cors_allow_headers: List[str] = ["*"]

    # ── Upload ───────────────────────────────────────────
    upload_dir: str = "uploads"
    upload_max_size_mb: int = 10

    # ── Logging ──────────────────────────────────────────
    log_level: str = "INFO"
    log_file: str = "logs/shieldai.log"

    # ── Future: Authentication ───────────────────────────
    jwt_secret: str = ""
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 30

    # ── Future: Database ─────────────────────────────────
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_service_role_key: str = ""

    # ── Future: AI Services ──────────────────────────────
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-flash"

    # ── Derived Properties ───────────────────────────────

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | List[str]) -> List[str]:
        """Accept both JSON strings and Python lists for CORS origins."""
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except (json.JSONDecodeError, TypeError):
                # Treat as comma-separated string
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @property
    def upload_max_size_bytes(self) -> int:
        """Maximum upload file size in bytes."""
        return self.upload_max_size_mb * 1024 * 1024

    @property
    def upload_path(self) -> Path:
        """Absolute path to the upload directory."""
        return _BACKEND_DIR / self.upload_dir

    @property
    def log_file_path(self) -> Path:
        """Absolute path to the log file."""
        return _BACKEND_DIR / self.log_file

    @property
    def is_development(self) -> bool:
        """Whether the application is running in development mode."""
        return self.environment.lower() == "development"


def get_settings() -> Settings:
    """Return a cached Settings instance. Import this wherever config is needed."""
    return _settings


# Module-level singleton — created once at import time.
_settings = Settings()
