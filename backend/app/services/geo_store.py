"""
ShieldAI Backend — Geospatial Data Store

An in-memory store unifying crime incidents from the Fraud Network Analysis 
sessions and direct CSV uploads.
"""

from __future__ import annotations

import datetime
import uuid
from typing import List, Dict

from app.schemas.geo import RawCrimeIncident
from app.services.network_cache import network_cache

# Simple mapping to fallback coordinates if missing
FALLBACK_COORDINATES = {
    "Maharashtra": (19.7515, 75.7139),
    "Pune": (18.5204, 73.8567),
    "Mumbai": (19.0760, 72.8777),
    "Delhi": (28.7041, 77.1025),
    "Karnataka": (15.3173, 75.7139),
    "Bengaluru": (12.9716, 77.5946),
    "Default": (20.5937, 78.9629) # Center of India
}

class GeoDataStore:
    def __init__(self):
        self.incidents: List[RawCrimeIncident] = []

    def _get_fallback_coords(self, state: str | None, district: str | None, city: str | None) -> tuple[float, float]:
        """Provides rough lat/lng based on administrative strings."""
        if city and city in FALLBACK_COORDINATES:
            return FALLBACK_COORDINATES[city]
        if district and district in FALLBACK_COORDINATES:
            return FALLBACK_COORDINATES[district]
        if state and state in FALLBACK_COORDINATES:
            return FALLBACK_COORDINATES[state]
        return FALLBACK_COORDINATES["Default"]

    def refresh_from_network_cache(self) -> None:
        """Pulls spatial entities from network investigations to unify intelligence."""
        # Note: In a real app we'd iterate over network_cache efficiently, 
        # but since this is in-memory for the session, we will just sync.
        # Ensure we don't duplicate existing ones by wiping or checking IDs.
        # For simplicity, we just rebuild from cache on request or periodically.
        
        # We will collect everything anew to keep it simple.
        new_incidents = []
        for (ts, dataset) in network_cache._cache.values():
            if type(dataset).__name__ != "InvestigationDataset":
                continue
            for entity in dataset.entities:
                # We only want entities that actually have some location info or are explicitly mules
                if getattr(entity, "state", None) or entity.type in ("Potential Money Mule", "Suspected Coordinator", "High-Risk Account"):
                    
                    lat = entity.latitude
                    lng = entity.longitude
                    if lat is None or lng is None:
                        lat, lng = self._get_fallback_coords(entity.state, entity.district, entity.city)
                        
                    # Map Network types to Geo Threat Categories
                    category_map = {
                        "Potential Money Mule": "Money Mule Activity",
                        "Suspected Coordinator": "Investment Fraud", # Guess
                        "High-Risk Account": "Digital Arrest Scam" 
                    }
                    cat = category_map.get(entity.type, "Phishing")
                    
                    new_incidents.append(
                        RawCrimeIncident(
                            id=f"net_{entity.id}",
                            category=cat, # type: ignore
                            timestamp=entity.lastObserved or datetime.datetime.now().isoformat(),
                            lat=lat,
                            lng=lng,
                            state=entity.state or "Unknown",
                            district=entity.district or "Unknown",
                            city=entity.city or "Unknown",
                            risk_score=entity.riskScore,
                            risk_level="High" if entity.riskScore > 75 else ("Medium" if entity.riskScore > 40 else "Low")
                        )
                    )
        
        # Merge new_incidents with existing non-network ones (uploaded CSVs)
        manual_incidents = [i for i in self.incidents if not i.id.startswith("net_")]
        
        # Deduplicate
        seen_ids = set()
        final_incidents = []
        for i in manual_incidents + new_incidents:
            if i.id not in seen_ids:
                seen_ids.add(i.id)
                final_incidents.append(i)
                
        self.incidents = final_incidents
        
    def add_uploaded_incidents(self, new_incidents: List[RawCrimeIncident]) -> None:
        for i in new_incidents:
            if i.lat is None or i.lng is None:
                lat, lng = self._get_fallback_coords(i.state, i.district, i.city)
                i.lat = lat
                i.lng = lng
                
        self.incidents.extend(new_incidents)

geo_store = GeoDataStore()
