"""
ShieldAI Backend — Health Endpoint Tests

Verifies the health, status, and readiness endpoints return
the standard response envelope with correct data.
"""

from __future__ import annotations


class TestHealthEndpoint:
    """Tests for GET /api/v1/health."""

    def test_health_returns_200(self, client):
        response = client.get("/api/v1/health")
        assert response.status_code == 200

    def test_health_response_envelope(self, client):
        response = client.get("/api/v1/health")
        body = response.json()

        # Standard envelope fields
        assert body["success"] is True
        assert "message" in body
        assert "data" in body
        assert "errors" in body
        assert body["errors"] is None
        assert "timestamp" in body
        assert "request_id" in body

    def test_health_data_fields(self, client):
        response = client.get("/api/v1/health")
        data = response.json()["data"]

        assert data["app_name"] == "ShieldAI"
        assert "app_version" in data
        assert "api_version" in data
        assert "python_version" in data
        assert "environment" in data
        assert "uptime_seconds" in data
        assert data["status"] == "healthy"

    def test_health_has_request_id_header(self, client):
        response = client.get("/api/v1/health")
        assert "X-Request-ID" in response.headers


class TestStatusEndpoint:
    """Tests for GET /api/v1/status."""

    def test_status_returns_200(self, client):
        response = client.get("/api/v1/status")
        assert response.status_code == 200

    def test_status_has_services(self, client):
        response = client.get("/api/v1/status")
        data = response.json()["data"]
        assert "services" in data
        assert isinstance(data["services"], dict)


class TestReadinessEndpoint:
    """Tests for GET /api/v1/readiness."""

    def test_readiness_returns_200(self, client):
        response = client.get("/api/v1/readiness")
        assert response.status_code == 200

    def test_readiness_is_ready(self, client):
        response = client.get("/api/v1/readiness")
        assert response.json()["data"]["ready"] is True


class TestPlaceholderEndpoints:
    """Smoke tests for all placeholder endpoints."""

    def test_fraud_analyze_text(self, client):
        # We need to send a valid ThreatInputSchema payload
        # but since Gemini API key is missing in tests, it will fall back safely.
        payload = {"text": "Suspicious message", "source": "WhatsApp"}
        response = client.post("/api/v1/fraud/analyze-text", json=payload)
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_dashboard(self, client):
        response = client.get("/api/v1/dashboard")
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_geo_hotspots(self, client):
        response = client.get("/api/v1/geo/hotspots")
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_geo_filter(self, client):
        payload = {
            "state": "All",
            "district": "All",
            "threatCategory": "All Threat Categories",
            "riskLevel": "All Risk Levels",
            "timeRange": "Last 90 Days"
        }
        response = client.post("/api/v1/geo/filter", json=payload)
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_auth_login(self, client):
        response = client.post("/api/v1/auth/login")
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_auth_register(self, client):
        response = client.post("/api/v1/auth/register")
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_dashboard_case_not_found(self, client):
        response = client.get("/api/v1/dashboard/cases/nonexistent")
        assert response.status_code == 404
        assert response.json()["success"] is False
