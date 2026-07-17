import pytest
from unittest.mock import patch, MagicMock
from pathlib import Path

@pytest.fixture
def mock_gemini_call():
    with patch("app.services.gemini.GeminiFraudService._call_gemini") as mock:
        mock.return_value = {
            "category": "Digital Arrest Scam",
            "base_score": 90,
            "confidence": 95,
            "assessment": "The sender claims to be police and threatens digital arrest.",
            "evidence": [
                {"label": "Fear Tactic", "severity": "Critical", "explanation": "Threatens immediate arrest."}
            ],
            "extracted_entities": [
                {"type": "Phone Number", "value": "+919876543210"}
            ]
        }
        yield mock

@pytest.fixture
def mock_transcribe_audio():
    with patch("app.services.gemini.GeminiFraudService.transcribe_audio") as mock:
        mock.return_value = "This is a suspicious call from Mumbai Police threatening arrest."
        yield mock

@pytest.fixture
def mock_genai_upload():
    with patch("google.generativeai.upload_file") as mock:
        mock.return_value = MagicMock()
        yield mock


def test_analyze_text(client, mock_gemini_call):
    payload = {
        "text": "Send money or CBI will arrest you.",
        "source": "WhatsApp",
        "phoneNumber": "+919876543210"
    }
    response = client.post("/api/v1/fraud/analyze-text", json=payload)
    assert response.status_code == 200
    
    body = response.json()
    assert body["success"] is True
    data = body["data"]
    assert data["category"] == "Digital Arrest Scam"
    assert data["level"] == "Critical"
    assert data["score"] >= 90
    assert any(e["value"] == "+919876543210" for e in data["entities"])


def test_analyze_image(client, mock_gemini_call, mock_genai_upload, tmp_path):
    img_path = tmp_path / "screenshot.jpg"
    img_path.write_bytes(b"dummy image content")
    
    with patch("app.api.fraud.save_upload_file", return_value=img_path):
        with open(img_path, "rb") as f:
            response = client.post(
                "/api/v1/fraud/analyze-image",
                files={"file": ("screenshot.jpg", f, "image/jpeg")}
            )
            
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["category"] == "Digital Arrest Scam"
    assert body["data"]["score"] >= 90


def test_analyze_voice(client, mock_gemini_call, mock_transcribe_audio, tmp_path):
    audio_path = tmp_path / "voice_note.wav"
    audio_path.write_bytes(b"dummy audio content")
    
    with patch("app.api.fraud.save_upload_file", return_value=audio_path):
        with open(audio_path, "rb") as f:
            response = client.post(
                "/api/v1/fraud/analyze-voice",
                files={"file": ("voice_note.wav", f, "audio/wav")}
            )
            
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["category"] == "Digital Arrest Scam"
    # Ensure that our mocked transcription was used
    mock_transcribe_audio.assert_called_once_with(audio_path, "audio/wav")


def test_generate_complaint(client):
    payload = {
        "input": {
            "text": "Send money or CBI will arrest you.",
            "source": "WhatsApp",
            "phoneNumber": "+919876543210"
        },
        "verdict": {
            "id": "cfs_txt_123",
            "level": "Critical",
            "score": 95,
            "confidence": 99,
            "category": "Digital Arrest Scam",
            "assessment": "The sender claims to be police and threatens arrest.",
            "evidence": [
                {"label": "Fear Tactic", "severity": "Critical", "explanation": "Threatens immediate arrest."}
            ],
            "entities": [
                {"type": "Phone Number", "value": "+919876543210", "copyable": True}
            ],
            "recommendations": ["Do not pay.", "Report to police."],
            "timestamp": "2024-01-01T12:00:00Z"
        }
    }
    
    # We patch _call_gemini for the complaint model
    with patch("app.services.gemini.GeminiFraudService._call_gemini") as mock_complaint:
        mock_complaint.return_value = {
            "summary": "Digital Arrest Scam WhatsApp message.",
            "incident_description": "I received a message claiming I am under digital arrest...",
            "evidence": ["Sender: +919876543210"],
            "suggested_complaint": "To Cyber Cell, I am reporting...",
            "pdf_ready_json": {"title": "Cybercrime Complaint", "category": "Digital Arrest Scam"}
        }
        
        response = client.post("/api/v1/fraud/generate-complaint", json=payload)
        
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["summary"] == "Digital Arrest Scam WhatsApp message."
