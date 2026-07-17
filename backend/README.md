# ShieldAI Backend

**AI-Powered Digital Public Safety Intelligence Platform — Backend Infrastructure**

Production-grade FastAPI backend foundation for the ShieldAI platform. This milestone provides a clean, scalable architecture that all future AI modules will build upon.

---

## Architecture

```
┌──────────────────────────────┐
│        Next.js Frontend       │
│    (http://localhost:3000)     │
└──────────────┬───────────────┘
               │  HTTP / JSON
               ▼
┌──────────────────────────────┐
│      FastAPI API Gateway      │
│    (http://localhost:8000)     │
│                               │
│  ┌─────────────────────────┐  │
│  │   /api/v1/ (Versioned)  │  │
│  │  ┌───────┐ ┌─────────┐ │  │
│  │  │Health │ │  Fraud   │ │  │
│  │  └───────┘ └─────────┘ │  │
│  │  ┌───────┐ ┌─────────┐ │  │
│  │  │ Auth  │ │Currency │ │  │
│  │  └───────┘ └─────────┘ │  │
│  │  ┌───────┐ ┌─────────┐ │  │
│  │  │Network│ │   Geo   │ │  │
│  │  └───────┘ └─────────┘ │  │
│  │  ┌───────────────────┐  │  │
│  │  │    Dashboard      │  │  │
│  │  └───────────────────┘  │  │
│  └─────────────────────────┘  │
│                               │
│  Middleware Layer:             │
│  • CORS • Request Logging     │
│  • Exception Handling         │
│  • Request ID Generation      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     AI Services (Future)      │
│  • Gemini API                 │
│  • TensorFlow Models          │
│  • NetworkX Graph Engine      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Database (Future)        │
│  • Supabase (PostgreSQL)      │
│  • JWT Authentication         │
└──────────────────────────────┘
```

---

## Folder Structure

```
backend/
├── main.py                     # Uvicorn entrypoint
├── requirements.txt            # Python dependencies
├── .env                        # Local environment variables (not committed)
├── .env.example                # Environment template
├── pytest.ini                  # Pytest configuration
├── README.md                   # This file
│
├── app/
│   ├── __init__.py             # Application factory (create_app)
│   │
│   ├── api/                    # Route handlers
│   │   ├── health.py           # GET /health, /status, /readiness
│   │   ├── fraud.py            # POST /fraud/analyze-text, analyze-image, analyze-voice
│   │   ├── currency.py         # POST /currency/analyze
│   │   ├── network.py          # POST /network/upload
│   │   ├── geo.py              # GET /geo/hotspots, POST /geo/filter, GET /geo/trends
│   │   ├── dashboard.py        # GET /dashboard, /metrics, /cases, /cases/{id}
│   │   └── auth.py             # POST /auth/login, /auth/register
│   │
│   ├── core/                   # Core infrastructure
│   │   ├── config.py           # Pydantic v2 BaseSettings (env-driven)
│   │   └── logging.py          # Structured enterprise logging
│   │
│   ├── middleware/             # Request pipeline
│   │   ├── cors.py             # CORS configuration
│   │   ├── request_logging.py  # Request ID, timing, IP logging
│   │   └── exception_handlers.py  # Global error handling
│   │
│   ├── dependencies/           # FastAPI dependency injection
│   │   ├── auth.py             # get_current_user (placeholder)
│   │   ├── database.py         # get_db (placeholder)
│   │   └── services.py         # get_ai_service (placeholder)
│   │
│   ├── schemas/                # Pydantic v2 data models
│   │   ├── response.py         # Standard API envelope
│   │   ├── fraud.py            # Citizen threat analysis types
│   │   ├── currency.py         # Currency verification types
│   │   ├── network.py          # Graph investigation types
│   │   ├── geospatial.py       # Geospatial intelligence types
│   │   └── dashboard.py        # Command center types
│   │
│   ├── services/               # (Future) Business logic / AI services
│   ├── models/                 # (Future) Database models
│   ├── prompts/                # (Future) AI prompt templates
│   │
│   └── utils/                  # Shared utilities
│       ├── helpers.py          # UUID, timestamp generation
│       ├── response.py         # Response envelope helpers
│       └── upload.py           # File upload validation & storage
│
├── uploads/                    # Temporary file storage
├── logs/                       # Application log files
└── tests/                      # Test suite
    ├── conftest.py             # Shared fixtures
    └── test_health.py          # Health & placeholder endpoint tests
```

---

## Getting Started

### Prerequisites

- **Python 3.12+** installed
- **pip** package manager

### Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
# Edit .env with your local settings if needed
```

### Run the Development Server

```bash
python main.py
```

The API will be available at: **http://localhost:8000**

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Run Tests

```bash
pytest -v
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | `ShieldAI` | Application name |
| `APP_VERSION` | `0.1.0` | Application version |
| `ENVIRONMENT` | `development` | `development` or `production` |
| `DEBUG` | `true` | Enable debug mode |
| `HOST` | `0.0.0.0` | Server host |
| `PORT` | `8000` | Server port |
| `API_V1_PREFIX` | `/api/v1` | Configurable API version prefix |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed CORS origins (JSON array) |
| `UPLOAD_DIR` | `uploads` | Upload file storage directory |
| `UPLOAD_MAX_SIZE_MB` | `10` | Maximum upload file size in MB |
| `LOG_LEVEL` | `INFO` | Logging level |
| `LOG_FILE` | `logs/shieldai.log` | Log file path |

---

## API Overview

All endpoints are versioned under the configurable prefix (default: `/api/v1`).

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check with metadata |
| `GET` | `/api/v1/status` | Extended system status |
| `GET` | `/api/v1/readiness` | Readiness probe |

### Citizen Fraud Shield
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/fraud/analyze-text` | Analyse suspicious text |
| `POST` | `/api/v1/fraud/analyze-image` | Analyse suspicious image |
| `POST` | `/api/v1/fraud/analyze-voice` | Analyse voice recording |

### Currency Verification
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/currency/analyze` | Analyse currency image |

### Fraud Network Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/network/upload` | Upload CSV dataset |

### Geospatial Intelligence
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/geo/hotspots` | Get crime hotspots |
| `POST` | `/api/v1/geo/filter` | Filter geospatial data |
| `GET` | `/api/v1/geo/trends` | Get threat trends |

### Command Center
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/dashboard` | Full dashboard data |
| `GET` | `/api/v1/dashboard/metrics` | Dashboard metrics |
| `GET` | `/api/v1/dashboard/cases` | List cases |
| `GET` | `/api/v1/dashboard/cases/{id}` | Case detail |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | User login |
| `POST` | `/api/v1/auth/register` | User registration |

---

## Standard Response Format

Every endpoint returns a consistent JSON envelope:

```json
{
  "success": true,
  "message": "Description of the result",
  "data": { },
  "errors": null,
  "timestamp": "2026-07-17T08:30:00+00:00",
  "request_id": "uuid-v4"
}
```

On error:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    { "field": "text", "message": "Field required", "type": "missing" }
  ],
  "timestamp": "2026-07-17T08:30:00+00:00",
  "request_id": "uuid-v4"
}
```

---

## Development Workflow

1. **Make changes** in the relevant module under `app/`
2. **Run tests**: `pytest -v`
3. **Start the dev server**: `python main.py` (auto-reloads in development)
4. **Check Swagger**: http://localhost:8000/docs
5. **View logs**: Check `logs/shieldai.log` or console output

---

## Future Milestones

- [ ] AI Citizen Fraud Shield (Gemini API integration)
- [ ] Currency Verification (TensorFlow / Gemini Vision)
- [ ] Fraud Network Analysis (NetworkX graph engine)
- [ ] Geospatial Intelligence (real data pipeline)
- [ ] Authentication (JWT + Supabase)
- [ ] Database Integration (Supabase PostgreSQL)
- [ ] Investigation Command Center (cross-module aggregation)

---

*Built for the AI for Digital Public Safety hackathon.*
