import pytest
from fastapi.testclient import TestClient
from app.__init__ import create_app
import pandas as pd
from unittest.mock import patch, MagicMock

app = create_app()

@pytest.fixture
def mock_gemini_geo():
    with patch("app.services.geo_ai.GeoAIService.enrich_hotspots_with_ai") as mock:
        # Just return the passed hotspots for simplicity, 
        # or we could mock genai directly. Mocking enrich_hotspots_with_ai is easier.
        def mock_enrich(hotspots):
            for hs in hotspots:
                from app.schemas.geo import AIRecommendation
                hs.recommendation = AIRecommendation(
                    priority="High", summary="Mock", actions=["A"],
                    deployment_priority=1, recommended_units=5,
                    confidence=90, recommended_action="Mock Action"
                )
            return hotspots
        mock.side_effect = mock_enrich
        yield mock

def test_geo_upload_and_hotspots(client: TestClient, mock_gemini_geo, tmp_path):
    # Create valid mock CSV
    csv_path = tmp_path / "test_geo.csv"
    df = pd.DataFrame({
        "Category": ["Phishing", "Phishing", "Digital Arrest Scam"],
        "Timestamp": ["2023-01-01T10:00:00", "2023-01-01T10:05:00", "2023-01-02T10:10:00"],
        "State": ["Maharashtra", "Maharashtra", "Karnataka"],
        "District": ["Pune", "Pune", "Bengaluru"],
        "Lat": [18.5, 18.5, 12.9],
        "Lng": [73.8, 73.8, 77.6],
        "RiskScore": [80, 85, 90]
    })
    df.to_csv(csv_path, index=False)

    with open(csv_path, "rb") as f:
        res = client.post(
            "/api/v1/geo/upload",
            files={"file": ("test_geo.csv", f, "text/csv")}
        )
    assert res.status_code == 200
    assert res.json()["data"]["added"] == 3

    # Test Hotspots
    res_hs = client.get("/api/v1/geo/hotspots")
    assert res_hs.status_code == 200
    data = res_hs.json()["data"]
    assert len(data) >= 2 # Pune and Bengaluru
    
    # Verify AI recommendation attached
    assert "recommendation" in data[0]
    assert data[0]["recommendation"]["recommended_units"] == 5

def test_geo_filter(client: TestClient, mock_gemini_geo):
    payload = {
        "state": "Maharashtra",
        "district": "Pune",
        "threatCategory": "Phishing",
        "riskLevel": "All Risk Levels",
        "timeRange": "Last 90 Days"
    }
    res = client.post("/api/v1/geo/filter", json=payload)
    assert res.status_code == 200
    data = res.json()["data"]
    assert "hotspots" in data
    assert "summary" in data
    assert "trends" in data

def test_geo_summary_and_trends(client: TestClient):
    res_s = client.get("/api/v1/geo/summary")
    assert res_s.status_code == 200
    assert "totalIncidents" in res_s.json()["data"]
    
    res_t = client.get("/api/v1/geo/trends")
    assert res_t.status_code == 200
    assert isinstance(res_t.json()["data"], list)
