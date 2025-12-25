# Fake Website Detection System - Backend

## Overview

This is the backend API for the **Fake Website Detection System** hackathon project. This phase focuses **ONLY** on static website analysis using rule-based checks.

## Current Phase: Static Analysis Only

### ✅ What is Implemented

- **Static Rule-Based Detection**
  - Domain age verification (WHOIS)
  - HTTPS presence check
  - Suspicious keyword detection in URLs
  - Suspicious TLD (Top-Level Domain) detection
  - Risk scoring (0-100) with explainable reasons

### ❌ What is NOT Implemented (Planned for Next Phase)

The following features will be added **ONLY if the project is shortlisted**:

- ❌ Dynamic website execution
- ❌ Playwright / Selenium automation
- ❌ AI-powered analysis (LangChain, Gemini)
- ❌ Machine learning models
- ❌ Database storage
- ❌ Frontend integration

## Installation

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## API Endpoints

### POST `/analyze/static`

Analyze a website URL using static checks only.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "static_risk_score": 45,
  "static_reasons": [
    "Website uses HTTPS encryption",
    "Domain is relatively new (60 days old) - moderate risk",
    "Found 2 suspicious keyword(s) in URL: login, verify",
    "Domain uses a standard TLD"
  ],
  "static_analysis": {
    "domain": "example.com",
    "tld": ".com",
    "has_https": true,
    "domain_age_days": 60,
    "suspicious_keywords": ["login", "verify"],
    "suspicious_tld": false
  }
}
```

**Example using curl:**
```bash
curl -X POST "http://localhost:8000/analyze/static" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## Risk Scoring

The risk score (0-100) is calculated based on:

- **HTTPS Check** (0-20 points): Missing HTTPS adds 20 points
- **Domain Age** (0-30 points): 
  - < 30 days: +30 points
  - < 90 days: +20 points
  - < 365 days: +10 points
  - Unknown: +15 points
- **Suspicious Keywords** (0-30 points): 5 points per keyword found
- **Suspicious TLD** (0-20 points): +20 points if TLD is suspicious

**Risk Levels:**
- 0-30: Low risk
- 31-60: Moderate risk
- 61-80: High risk
- 81-100: Very high risk

## Project Structure

```
server/
├── app/
│   ├── main.py          # FastAPI application
│   ├── static_checks.py # Static detection logic
│   └── schemas.py       # Request/Response models
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Dependencies

- **FastAPI**: Modern web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI
- **Pydantic**: Data validation using Python type annotations
- **python-whois**: WHOIS lookup for domain information
- **tldextract**: Extract domain and TLD from URLs

## Notes

- This is a **hackathon MVP** - not production-ready software
- WHOIS lookups may fail for some domains (handled gracefully)
- All checks are rule-based - no machine learning involved
- Results are explainable - every risk score comes with clear reasons

## Future Enhancements (If Shortlisted)

If the project advances, we plan to add:

1. **Dynamic Analysis**
   - Automated browser execution with Playwright
   - Screenshot analysis
   - JavaScript execution monitoring

2. **AI-Powered Detection**
   - LangChain integration for content analysis
   - Google Gemini for advanced pattern recognition
   - Natural language processing of page content

3. **Enhanced Features**
   - Database for storing analysis history
   - User authentication and API keys
   - Batch URL analysis
   - Real-time monitoring

## License

See LICENSE file in the project root.

