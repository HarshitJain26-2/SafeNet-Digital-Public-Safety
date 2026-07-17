"""
ShieldAI Backend — File Upload Utilities

Reusable upload validation and storage helpers.
Supports images (jpg, png, webp), CSV, and audio (mp3, wav, ogg).
"""

from __future__ import annotations

import re
import uuid
from pathlib import Path
from typing import Dict, List, Optional, Set

from fastapi import UploadFile

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# ── Allowed file types ───────────────────────────────────────────────────────

ALLOWED_EXTENSIONS: Dict[str, Set[str]] = {
    "image": {".jpg", ".jpeg", ".png", ".webp"},
    "csv": {".csv"},
    "audio": {".mp3", ".wav", ".ogg"},
}

ALLOWED_MIME_TYPES: Dict[str, Set[str]] = {
    "image": {"image/jpeg", "image/png", "image/webp"},
    "csv": {"text/csv", "application/vnd.ms-excel", "text/plain"},
    "audio": {"audio/mpeg", "audio/wav", "audio/ogg"},
}

ALL_ALLOWED_EXTENSIONS: Set[str] = set()
for exts in ALLOWED_EXTENSIONS.values():
    ALL_ALLOWED_EXTENSIONS |= exts

ALL_ALLOWED_MIME_TYPES: Set[str] = set()
for mimes in ALLOWED_MIME_TYPES.values():
    ALL_ALLOWED_MIME_TYPES |= mimes


# ── Validation ───────────────────────────────────────────────────────────────

def sanitize_filename(filename: str) -> str:
    """
    Strip directory components, collapse whitespace, and prefix with a UUID
    to guarantee uniqueness and prevent path-traversal attacks.
    """
    # Remove directory separators
    safe_name = Path(filename).name
    # Collapse non-alphanumeric sequences (except dots and hyphens)
    safe_name = re.sub(r"[^\w.\-]", "_", safe_name)
    # Prefix with UUID
    return f"{uuid.uuid4().hex[:12]}_{safe_name}"


def validate_file_extension(
    filename: str,
    allowed_categories: Optional[List[str]] = None,
) -> bool:
    """Check whether the file extension belongs to an allowed category."""
    ext = Path(filename).suffix.lower()
    if allowed_categories:
        allowed = set()
        for cat in allowed_categories:
            allowed |= ALLOWED_EXTENSIONS.get(cat, set())
        return ext in allowed
    return ext in ALL_ALLOWED_EXTENSIONS


def validate_file_size(file_size: int) -> bool:
    """Check whether the file size is within the configured maximum."""
    settings = get_settings()
    return file_size <= settings.upload_max_size_bytes


def validate_mime_type(
    content_type: Optional[str],
    allowed_categories: Optional[List[str]] = None,
) -> bool:
    """Check whether the MIME type belongs to an allowed category."""
    if not content_type:
        return False
    if allowed_categories:
        allowed = set()
        for cat in allowed_categories:
            allowed |= ALLOWED_MIME_TYPES.get(cat, set())
        return content_type in allowed
    return content_type in ALL_ALLOWED_MIME_TYPES


# ── Storage ──────────────────────────────────────────────────────────────────

async def save_upload_file(
    file: UploadFile,
    allowed_categories: Optional[List[str]] = None,
) -> Path:
    """
    Validate and save an uploaded file to the configured upload directory.

    Returns the absolute path to the saved file.
    Raises ``ValueError`` on validation failure.
    """
    settings = get_settings()

    if not file.filename:
        raise ValueError("Upload is missing a filename.")

    # Extension check
    if not validate_file_extension(file.filename, allowed_categories):
        raise ValueError(
            f"File type not allowed. Accepted extensions: "
            f"{_format_allowed(allowed_categories)}"
        )

    # MIME check
    if not validate_mime_type(file.content_type, allowed_categories):
        raise ValueError(
            f"MIME type '{file.content_type}' is not allowed."
        )

    # Read contents and check size
    contents = await file.read()
    if not validate_file_size(len(contents)):
        raise ValueError(
            f"File exceeds maximum size of {settings.upload_max_size_mb} MB."
        )

    # Save
    safe_name = sanitize_filename(file.filename)
    upload_dir: Path = settings.upload_path
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / safe_name
    file_path.write_bytes(contents)

    logger.info("File saved: %s (%d bytes)", file_path.name, len(contents))
    return file_path


def _format_allowed(categories: Optional[List[str]]) -> str:
    """Return a human-readable string of allowed extensions."""
    if categories:
        exts: Set[str] = set()
        for cat in categories:
            exts |= ALLOWED_EXTENSIONS.get(cat, set())
        return ", ".join(sorted(exts))
    return ", ".join(sorted(ALL_ALLOWED_EXTENSIONS))
