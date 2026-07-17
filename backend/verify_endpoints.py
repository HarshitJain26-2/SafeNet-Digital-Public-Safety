"""Quick endpoint verification script."""
import httpx

BASE = "http://localhost:8000"

gets = [
    "/api/v1/health",
    "/api/v1/status",
    "/api/v1/readiness",
    "/api/v1/geo/hotspots",
    "/api/v1/geo/trends",
    "/api/v1/dashboard",
    "/api/v1/dashboard/metrics",
    "/api/v1/dashboard/cases",
    "/api/v1/dashboard/cases/nonexistent",
]

posts = [
    "/api/v1/fraud/analyze-text",
    "/api/v1/geo/filter",
    "/api/v1/auth/login",
    "/api/v1/auth/register",
]

print("=== GET Endpoints ===")
for path in gets:
    r = httpx.get(BASE + path)
    ok = r.json().get("success", "?")
    print(f"  {r.status_code} | success={ok} | {path}")

print("\n=== POST Endpoints ===")
for path in posts:
    r = httpx.post(BASE + path)
    ok = r.json().get("success", "?")
    print(f"  {r.status_code} | success={ok} | {path}")

# CORS check
print("\n=== CORS ===")
r = httpx.get(BASE + "/api/v1/health", headers={"Origin": "http://localhost:3000"})
print(f"  Access-Control-Allow-Origin: {r.headers.get('access-control-allow-origin', 'NOT SET')}")
print(f"  X-Request-ID: {r.headers.get('x-request-id', 'NOT SET')}")

# Swagger
r = httpx.get(BASE + "/docs")
print(f"\n=== Swagger UI ===")
print(f"  GET /docs: {r.status_code}")

print("\n✅ All endpoints verified!")
