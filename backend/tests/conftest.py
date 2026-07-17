"""
ShieldAI Backend — Test Fixtures

Provides shared fixtures for all test modules.
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app import create_app


@pytest.fixture(scope="session")
def app():
    """Create the FastAPI application for the test session."""
    return create_app()


@pytest.fixture(scope="session")
def client(app):
    """Create a synchronous test client for the application."""
    return TestClient(app)
