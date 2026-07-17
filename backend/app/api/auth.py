"""
ShieldAI Backend — Authentication Endpoints (Placeholder)

Future: implement JWT-based authentication with Supabase.
"""

from __future__ import annotations

from fastapi import APIRouter, Request

from app.utils.response import success_response

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", summary="User Login")
async def login(request: Request):
    """
    Authenticate a user and return a JWT token.

    **Future Implementation:**
    - Validate credentials against Supabase
    - Generate JWT with user claims
    - Return token + user profile

    **Current:** returns a placeholder response.
    """
    return success_response(
        data={
            "token": "placeholder-token",
            "user": {
                "id": "dev-user-001",
                "email": "dev@shieldai.local",
                "role": "analyst",
            },
        },
        message="Placeholder: login endpoint ready for authentication integration",
        request=request,
    )


@router.post("/register", summary="User Registration")
async def register(request: Request):
    """
    Register a new user account.

    **Future Implementation:**
    - Validate registration data
    - Create user in Supabase
    - Send verification email
    - Return user profile

    **Current:** returns a placeholder response.
    """
    return success_response(
        data={
            "user": {
                "id": "new-user-placeholder",
                "email": "placeholder@shieldai.local",
                "role": "citizen",
            },
        },
        message="Placeholder: registration endpoint ready for authentication integration",
        request=request,
    )
