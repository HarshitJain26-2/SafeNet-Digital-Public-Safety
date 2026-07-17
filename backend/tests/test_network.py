import pytest
import pandas as pd
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_gemini_network():
    with patch("app.services.network_ai.NetworkAIService.generate_summary_and_recommendations") as mock:
        from app.schemas.network import InvestigationSummary, InvestigationRecommendation
        summary = InvestigationSummary(
            overview="Mock overview",
            totalEntities=10,
            totalRelationships=15,
            clustersIdentified=2,
            highPriorityEntities=1,
            potentialMules=1,
            connectedVictims=0,
            totalAnalyzedValue="N/A",
            keyPatterns=["Pattern A"]
        )
        rec = InvestigationRecommendation(
            id="r1", priority="High", action="Block", reason="Mule activity"
        )
        mock.return_value = (summary, [rec])
        yield mock

def test_network_upload_csv(client, mock_gemini_network, tmp_path):
    # Create valid mock CSV
    csv_path = tmp_path / "test_transactions.csv"
    df = pd.DataFrame({
        "SenderID": ["A", "B", "C", "A"],
        "ReceiverID": ["B", "C", "A", "C"],
        "Amount": [100, 200, 300, 400],
        "Timestamp": ["2023-01-01T10:00:00", "2023-01-01T10:05:00", "2023-01-01T10:10:00", "2023-01-01T10:15:00"]
    })
    df.to_csv(csv_path, index=False)

    with open(csv_path, "rb") as f:
        response = client.post(
            "/api/v1/network/upload",
            files={"file": ("test_transactions.csv", f, "text/csv")}
        )

    assert response.status_code == 200
    data = response.json()["data"]
    
    assert "investigationId" in data
    assert "metrics" in data
    assert data["metrics"]["totalEntities"] == 3
    assert data["metrics"]["totalTransactions"] == 4
    
    # Store ID to test export
    inv_id = data["investigationId"]
    
    # Test sample endpoint
    res_sample = client.get("/api/v1/network/sample")
    assert res_sample.status_code == 200
    
    # Test export endpoint
    res_export = client.get(f"/api/v1/network/export/{inv_id}")
    assert res_export.status_code == 200
    assert res_export.json()["data"]["investigationId"] == inv_id
    
def test_network_invalid_csv(client, tmp_path):
    # Missing ReceiverID
    csv_path = tmp_path / "bad.csv"
    df = pd.DataFrame({
        "SenderID": ["A", "B"],
        "Amount": [100, 200],
        "Timestamp": ["2023-01-01T10:00:00", "2023-01-01T10:05:00"]
    })
    df.to_csv(csv_path, index=False)

    with open(csv_path, "rb") as f:
        response = client.post(
            "/api/v1/network/upload",
            files={"file": ("bad.csv", f, "text/csv")}
        )

    assert response.status_code == 400
    assert "Missing required columns" in response.json()["message"]
