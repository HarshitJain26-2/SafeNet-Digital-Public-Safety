"""
ShieldAI Backend — Authentication Dependency (Placeholder)

Provides a ``get_current_user`` dependency that will eventually
validate JWT tokens and return authenticated user details.

Currently returns a mock user for development purposes.
"""

from __future__ import annotations

from typing import Any, Dict

from fastapi import Depends, Request


async def get_current_user(request: Request) -> Dict[str, Any]:
    """
    Dependency: resolve the current authenticated user.

    **Future Implementation:**
    - Extract ``Authorization: Bearer <token>`` header
    - Validate JWT using ``jwt_secret`` from settings
    - Query Supabase for user record
    - Raise ``HTTPException(401)`` on failure

    **Current:** returns a mock user object for placeholder endpoints.
    """
    return {
        "id": "dev-user-001",
        "email": "dev@shieldai.local",
        "role": "analyst",
        "name": "Development User",
    }
