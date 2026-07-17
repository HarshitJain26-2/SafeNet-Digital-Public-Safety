"""
ShieldAI Backend — Network CSV Parser

Ingests and validates CSV uploads, returning a standardized DataFrame 
ready for NetworkX graph construction.
"""

from __future__ import annotations

from io import BytesIO
from typing import List, Dict, Any

import pandas as pd
from fastapi import UploadFile

from app.core.logging import get_logger

logger = get_logger(__name__)


class NetworkParserService:
    """Handles parsing and validation of uploaded transaction CSVs."""

    # Required columns in the uploaded CSV
    REQUIRED_COLUMNS = ["SenderID", "ReceiverID", "Amount", "Timestamp"]

    @staticmethod
    async def parse_csv(file: UploadFile) -> pd.DataFrame:
        """
        Reads an uploaded CSV file, validates its structure, cleans it, 
        and returns a pandas DataFrame.
        """
        content = await file.read()
        
        # Guard against massive files
        if len(content) > 50 * 1024 * 1024:  # 50MB
            raise ValueError("CSV file too large. Limit is 50MB.")
            
        if not content:
            raise ValueError("CSV file is empty.")

        try:
            df = pd.read_csv(BytesIO(content), encoding="utf-8")
        except Exception as e:
            logger.error("Failed to parse CSV: %s", str(e))
            raise ValueError("Invalid CSV format or encoding. Ensure UTF-8.")

        # Validate required columns
        missing = [col for col in NetworkParserService.REQUIRED_COLUMNS if col not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns: {', '.join(missing)}")

        # Guard against too many rows (e.g. limit to 100k for sync processing)
        if len(df) > 100_000:
            raise ValueError("Exceeded maximum allowed rows (100,000).")

        # Clean data
        df = df.dropna(subset=NetworkParserService.REQUIRED_COLUMNS)
        
        # Standardise Timestamp
        try:
            df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")
            df = df.dropna(subset=["Timestamp"])
        except Exception:
            raise ValueError("Timestamp column contains invalid dates.")

        # Standardise Amount
        df["Amount"] = pd.to_numeric(df["Amount"], errors="coerce").fillna(0.0)

        # Ensure string IDs
        df["SenderID"] = df["SenderID"].astype(str).str.strip()
        df["ReceiverID"] = df["ReceiverID"].astype(str).str.strip()

        logger.info("Successfully parsed %d transaction rows.", len(df))
        return df
