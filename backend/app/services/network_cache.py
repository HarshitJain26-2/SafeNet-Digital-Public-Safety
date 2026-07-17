"""
ShieldAI Backend — Network Investigation Store Abstraction

An abstraction for persisting Investigation Sessions. This allows future
migration to Redis, Supabase, or PostgreSQL without changing business logic.
"""

from __future__ import annotations

import time
from abc import ABC, abstractmethod
from typing import Dict, Optional, Tuple, Any
from pydantic import BaseModel


class InvestigationSessionStore(ABC):
    """Base abstraction for storing investigation session datasets."""
    
    @abstractmethod
    def save_dataset(self, dataset: Any) -> None:
        """Saves a dataset/session to the store."""
        pass

    @abstractmethod
    def get_dataset(self, investigation_id: str) -> Optional[Any]:
        """Retrieves a session from the store if available."""
        pass

    @abstractmethod
    def get_latest_dataset(self) -> Optional[Any]:
        """Retrieves the most recently stored session."""
        pass

    @abstractmethod
    def clear_expired(self) -> None:
        """Cleans up expired datasets."""
        pass


class InMemorySessionStore(InvestigationSessionStore):
    """Simple in-memory implementation of InvestigationSessionStore."""
    
    def __init__(self, ttl_seconds: int = 3600 * 24):
        # Key: investigation_id, Value: (timestamp, Session)
        self._cache: Dict[str, Tuple[float, Any]] = {}
        self.ttl_seconds = ttl_seconds

    def save_dataset(self, dataset: Any) -> None:
        # Assuming dataset has 'investigation_id' or 'id'
        item_id = getattr(dataset, "investigation_id", getattr(dataset, "id", None))
        if item_id:
            self._cache[item_id] = (time.time(), dataset)

    def get_dataset(self, investigation_id: str) -> Optional[Any]:
        if investigation_id not in self._cache:
            return None
            
        timestamp, dataset = self._cache[investigation_id]
        if time.time() - timestamp > self.ttl_seconds:
            del self._cache[investigation_id]
            return None
            
        return dataset
        
    def get_latest_dataset(self) -> Optional[Any]:
        if not self._cache:
            return None
        # Get the item with the highest timestamp
        latest = max(self._cache.values(), key=lambda x: x[0])
        timestamp, dataset = latest
        if time.time() - timestamp > self.ttl_seconds:
            return None
        return dataset
        
    def clear_expired(self) -> None:
        current_time = time.time()
        expired_keys = [
            k for k, (t, _) in self._cache.items() 
            if current_time - t > self.ttl_seconds
        ]
        for k in expired_keys:
            del self._cache[k]


# Export a singleton instance. 
# For future DI, this can be injected via FastAPI dependencies.
network_cache: InvestigationSessionStore = InMemorySessionStore()
session_store = network_cache # Alias for generic use
