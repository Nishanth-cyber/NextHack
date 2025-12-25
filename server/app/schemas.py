from pydantic import BaseModel, HttpUrl
from typing import List, Optional


class StaticAnalysisRequest(BaseModel):
    url: str


class StaticAnalysisMetadata(BaseModel):
    domain: str
    tld: str
    has_https: bool
    domain_age_days: Optional[int] = None
    suspicious_keywords: List[str]
    suspicious_tld: bool


class StaticAnalysisResponse(BaseModel):
    static_risk_score: int
    static_reasons: List[str]
    static_analysis: StaticAnalysisMetadata

