"""
ShieldAI Backend — Geospatial CSV Parser

Ingests generic CSV datasets (from police databases, logs, etc.) and
translates them into Unified RawCrimeIncidents.
"""

from __future__ import annotations

import uuid
from io import BytesIO
import pandas as pd
from fastapi import UploadFile

from app.core.logging import get_logger
from app.schemas.geo import RawCrimeIncident

logger = get_logger(__name__)


class GeoParserService:
    
    @staticmethod
    async def parse_csv(file: UploadFile) -> list[RawCrimeIncident]:
        content = await file.read()
        if not content:
            raise ValueError("CSV file is empty.")
            
        try:
            df = pd.read_csv(BytesIO(content), encoding="utf-8")
        except Exception:
            raise ValueError("Invalid CSV format or encoding.")
            
        # Map known variations of headers
        col_map = {
            "ThreatCategory": "Category",
            "Threat": "Category",
            "IncidentType": "Category",
            "Time": "Timestamp",
            "Date": "Timestamp",
            "Latitude": "Lat",
            "Longitude": "Lng",
            "Risk": "RiskScore",
            "Score": "RiskScore"
        }
        df = df.rename(columns=col_map)
        
        required = ["Category", "Timestamp"]
        missing = [c for c in required if c not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns: {', '.join(missing)}")
            
        if len(df) > 100_000:
            raise ValueError("Exceeded maximum allowed rows (100,000).")
            
        # Standardise Data
        try:
            df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")
            df = df.dropna(subset=["Timestamp"])
        except Exception:
            pass
            
        incidents = []
        for _, row in df.iterrows():
            lat = row.get("Lat", None)
            lng = row.get("Lng", None)
            if pd.isna(lat): lat = None
            if pd.isna(lng): lng = None
            
            score = row.get("RiskScore", 50)
            if pd.isna(score): score = 50
            score = int(score)
            
            r_level = "High" if score > 75 else ("Medium" if score > 40 else "Low")
            
            state = row.get("State", "Unknown")
            if pd.isna(state): state = "Unknown"
                
            dist = row.get("District", "Unknown")
            if pd.isna(dist): dist = "Unknown"
                
            city = row.get("City", "Unknown")
            if pd.isna(city): city = "Unknown"
                
            incidents.append(RawCrimeIncident(
                id=f"csv_{uuid.uuid4().hex[:8]}",
                category=str(row["Category"]), # type: ignore
                timestamp=row["Timestamp"].isoformat() if pd.notnull(row["Timestamp"]) else "",
                lat=float(lat) if lat is not None else None,
                lng=float(lng) if lng is not None else None,
                state=str(state),
                district=str(dist),
                city=str(city),
                risk_score=score,
                risk_level=r_level # type: ignore
            ))
            
        return incidents
