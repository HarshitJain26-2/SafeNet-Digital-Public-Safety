"""
ShieldAI Backend — Reusable Entity Extraction Service

Provides deterministic regex-based extraction of critical entities
from text, such as phone numbers, UPI IDs, URLs, and emails.
"""

from __future__ import annotations

import re
from typing import List, Set

from app.schemas.fraud import DetectedEntity


class EntityExtractor:
    """Extracts structured entities from unstructured text."""

    @staticmethod
    def extract_all(text: str) -> List[DetectedEntity]:
        """Extract all known entities from text."""
        if not text:
            return []
            
        entities: List[DetectedEntity] = []
        
        entities.extend(EntityExtractor.extract_phones(text))
        entities.extend(EntityExtractor.extract_upis(text))
        entities.extend(EntityExtractor.extract_urls(text))
        entities.extend(EntityExtractor.extract_emails(text))
        
        # Deduplicate by value and type
        seen: Set[str] = set()
        unique_entities: List[DetectedEntity] = []
        for ent in entities:
            key = f"{ent.type}:{ent.value.lower()}"
            if key not in seen:
                seen.add(key)
                unique_entities.append(ent)
                
        return unique_entities

    @staticmethod
    def extract_phones(text: str) -> List[DetectedEntity]:
        """Extract Indian and international phone numbers."""
        pattern = r"(?:(?:\+|00)91[\s-]?)?(?:\d{10}|\d{3}[\s-]\d{3}[\s-]\d{4})"
        matches = re.findall(pattern, text)
        return [
            DetectedEntity(type="Phone Number", value=match.strip(), copyable=True)
            for match in matches if len(re.sub(r"\D", "", match)) >= 10
        ]

    @staticmethod
    def extract_upis(text: str) -> List[DetectedEntity]:
        """Extract UPI IDs."""
        pattern = r"[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}"
        matches = re.findall(pattern, text)
        upis = [m for m in matches if not m.endswith((".com", ".org", ".net", ".in", ".co.in", ".edu", ".gov"))]
        return [
            DetectedEntity(type="UPI ID", value=match.strip(), copyable=True)
            for match in upis
        ]

    @staticmethod
    def extract_urls(text: str) -> List[DetectedEntity]:
        """Extract URLs and domains."""
        pattern = r"(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})"
        matches = re.findall(pattern, text)
        return [
            DetectedEntity(type="URL", value=match.strip(), copyable=True)
            for match in matches
        ]

    @staticmethod
    def extract_emails(text: str) -> List[DetectedEntity]:
        """Extract email addresses."""
        pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
        matches = re.findall(pattern, text)
        return [
            DetectedEntity(type="Email", value=match.strip(), copyable=True)
            for match in matches
        ]
