"""
FastAPI backend for static fake website detection.
This is a hackathon MVP focusing on rule-based static analysis only.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import StaticAnalysisRequest, StaticAnalysisResponse
from app.static_checks import perform_static_analysis

app = FastAPI(
    title="Fake Website Detection System",
    description="Static analysis API for detecting potentially fake websites",
    version="1.0.0"
)

# Enable CORS for frontend integration (when needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Fake Website Detection System API",
        "version": "1.0.0",
        "phase": "Static Analysis Only",
        "endpoints": {
            "POST /analyze/static": "Analyze a website URL using static checks"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/analyze/static", response_model=StaticAnalysisResponse)
async def analyze_static(request: StaticAnalysisRequest):
    """
    Perform static analysis on a website URL.
    
    This endpoint performs rule-based checks including:
    - Domain age (WHOIS)
    - HTTPS presence
    - Suspicious keywords in URL
    - Suspicious TLDs
    
    Returns a risk score (0-100) and detailed reasons.
    """
    try:
        # Validate URL format
        if not request.url.startswith(('http://', 'https://')):
            request.url = 'https://' + request.url
        
        # Perform static analysis
        result = perform_static_analysis(request.url)
        
        return StaticAnalysisResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing URL: {str(e)}"
        )

