"""
Tests for the Command Center API endpoints.
"""
from fastapi.testclient import TestClient
from main import app
from app.services.network_cache import session_store
from app.schemas.fraud import ThreatVerdict
from app.schemas.currency import CurrencyAnalysisResult
from app.schemas.network import InvestigationDataset
from app.services.geo_store import geo_store
import pytest

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_teardown():
    session_store._cache.clear()
    geo_store.incidents.clear()
    
    # Add dummy citizen case
    session_store.save_dataset(ThreatVerdict(
        id="cfs_txt_test",
        level="Critical",
        score=99,
        confidence=90,
        category="Digital Arrest Scam",
        assessment="Fake police.",
        timestamp="2026-01-01T00:00:00Z"
    ))
    
    yield
    session_store._cache.clear()
    geo_store.incidents.clear()

def test_dashboard_metrics():
    response = client.get("/api/v1/dashboard/metrics")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "activeCases" in data
    assert data["activeCases"]["value"] >= 1
    assert data["criticalAlerts"]["value"] >= 1

def test_dashboard_cases():
    response = client.get("/api/v1/dashboard/cases")
    assert response.status_code == 200
    data = response.json()["data"]
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["threatCategory"] == "Digital Arrest Scam"

def test_dashboard_activity():
    response = client.get("/api/v1/dashboard/activity")
    assert response.status_code == 200
    data = response.json()["data"]
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["moduleName"] == "Citizen Fraud Shield"

def test_dashboard_analytics():
    response = client.get("/api/v1/dashboard/analytics")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "threatDistribution" in data
    assert "trends" in data
    assert len(data["threatDistribution"]) >= 1

def test_dashboard_summary():
    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "executive_summary" in data
    assert "module_health" in data
    assert len(data["module_health"]) > 0

def test_full_dashboard():
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "metrics" in data
    assert "cases" in data
    assert "activity" in data
