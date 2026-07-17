"""
ShieldAI Backend — Database Dependency (Placeholder)

Provides a ``get_db`` dependency that will eventually yield
a Supabase client or async database session.

Currently yields ``None``.
"""

from __future__ import annotations

from typing import Any, AsyncGenerator


async def get_db() -> AsyncGenerator[Any, None]:
    """
    Dependency: provide a database session.

    **Future Implementation:**
    - Create Supabase client from ``supabase_url`` / ``supabase_key``
    - Yield the client for the request lifecycle
    - Close / release on teardown

    **Current:** yields ``None``.
    """
    yield None
