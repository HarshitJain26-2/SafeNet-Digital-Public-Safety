"""
ShieldAI Backend — General-Purpose Helpers

Reusable utility functions for UUID generation, timestamps, and common patterns.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone


def generate_uuid() -> str:
    """Generate a random UUID4 string."""
    return str(uuid.uuid4())


def generate_request_id() -> str:
    """Generate a request-scoped trace ID (UUID4)."""
    return generate_uuid()


def generate_timestamp() -> str:
    """Return the current UTC time as an ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()
