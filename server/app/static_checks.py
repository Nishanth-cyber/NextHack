"""
Static checks for fake website detection.
This module contains rule-based checks that don't require dynamic execution.
"""
from datetime import datetime
from typing import List, Tuple, Optional
from urllib.parse import urlparse
import tldextract
import whois


# Suspicious keywords that often appear in phishing URLs
SUSPICIOUS_KEYWORDS = [
    'login', 'verify', 'secure', 'update', 'account', 'confirm',
    'validate', 'authenticate', 'signin', 'sign-in', 'signup',
    'sign-up', 'password', 'reset', 'unlock', 'suspended',
    'locked', 'expired', 'warning', 'urgent', 'action-required'
]

# Suspicious TLDs that are commonly used for fake websites
SUSPICIOUS_TLDS = [
    '.xyz', '.top', '.site', '.online', '.click', '.download',
    '.stream', '.gq', '.ml', '.cf', '.tk', '.ga', '.loan',
    '.review', '.accountant', '.science', '.work', '.party'
]


def extract_domain_info(url: str) -> Tuple[str, str, bool]:
    """
    Extract domain, TLD, and HTTPS status from URL.
    
    Returns:
        Tuple of (domain, tld, has_https)
    """
    parsed = urlparse(url)
    has_https = parsed.scheme.lower() == 'https'
    
    extracted = tldextract.extract(url)
    domain = f"{extracted.domain}.{extracted.suffix}" if extracted.suffix else extracted.domain
    tld = f".{extracted.suffix}" if extracted.suffix else ""
    
    return domain, tld, has_https


def check_suspicious_keywords(url: str) -> List[str]:
    """
    Check for suspicious keywords in the URL.
    
    Returns:
        List of suspicious keywords found
    """
    url_lower = url.lower()
    found_keywords = []
    
    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in url_lower:
            found_keywords.append(keyword)
    
    return found_keywords


def check_suspicious_tld(tld: str) -> bool:
    """
    Check if the TLD is in the suspicious list.
    
    Returns:
        True if TLD is suspicious
    """
    tld_lower = tld.lower()
    return tld_lower in SUSPICIOUS_TLDS


def get_domain_age(domain: str) -> Optional[int]:
    """
    Get domain age in days using WHOIS.
    
    Returns:
        Domain age in days, or None if unavailable
    """
    try:
        domain_info = whois.whois(domain)
        
        # Try to get creation date
        creation_date = None
        if hasattr(domain_info, 'creation_date'):
            if isinstance(domain_info.creation_date, list):
                creation_date = domain_info.creation_date[0] if domain_info.creation_date else None
            else:
                creation_date = domain_info.creation_date
        
        if creation_date and isinstance(creation_date, datetime):
            age_days = (datetime.now() - creation_date).days
            return max(0, age_days)  # Ensure non-negative
        
        return None
    except Exception:
        # If WHOIS fails, return None (we'll handle this in scoring)
        return None


def calculate_risk_score(
    has_https: bool,
    domain_age_days: Optional[int],
    suspicious_keywords: List[str],
    suspicious_tld: bool
) -> Tuple[int, List[str]]:
    """
    Calculate risk score based on static checks.
    
    Returns:
        Tuple of (risk_score, reasons)
    """
    score = 0
    reasons = []
    
    # HTTPS check (0-20 points)
    if not has_https:
        score += 20
        reasons.append("Website does not use HTTPS encryption")
    else:
        reasons.append("Website uses HTTPS encryption")
    
    # Domain age check (0-30 points)
    if domain_age_days is None:
        score += 15
        reasons.append("Could not verify domain age (WHOIS unavailable)")
    elif domain_age_days < 30:
        score += 30
        reasons.append(f"Domain is very new ({domain_age_days} days old) - high risk of being fake")
    elif domain_age_days < 90:
        score += 20
        reasons.append(f"Domain is relatively new ({domain_age_days} days old) - moderate risk")
    elif domain_age_days < 365:
        score += 10
        reasons.append(f"Domain is less than 1 year old ({domain_age_days} days)")
    else:
        reasons.append(f"Domain is established ({domain_age_days} days old)")
    
    # Suspicious keywords check (0-30 points)
    keyword_count = len(suspicious_keywords)
    if keyword_count > 0:
        keyword_score = min(30, keyword_count * 5)
        score += keyword_score
        reasons.append(f"Found {keyword_count} suspicious keyword(s) in URL: {', '.join(suspicious_keywords)}")
    else:
        reasons.append("No suspicious keywords found in URL")
    
    # Suspicious TLD check (0-20 points)
    if suspicious_tld:
        score += 20
        reasons.append("Domain uses a suspicious top-level domain (TLD)")
    else:
        reasons.append("Domain uses a standard TLD")
    
    # Ensure score is between 0-100
    # CAP: Always ensure at least 5% risk for static analysis limitations
    # This ensures the trust score (100 - risk) never exceeds 95%
    score = min(100, max(5, score))
    
    return score, reasons


def perform_static_analysis(url: str) -> dict:
    """
    Perform all static checks on a URL.
    
    Returns:
        Dictionary with risk score, reasons, and metadata
    """
    # Extract domain information
    domain, tld, has_https = extract_domain_info(url)
    
    # Check for suspicious keywords
    suspicious_keywords = check_suspicious_keywords(url)
    
    # Check for suspicious TLD
    suspicious_tld = check_suspicious_tld(tld)
    
    # Get domain age
    domain_age_days = get_domain_age(domain)
    
    # Calculate risk score
    risk_score, reasons = calculate_risk_score(
        has_https=has_https,
        domain_age_days=domain_age_days,
        suspicious_keywords=suspicious_keywords,
        suspicious_tld=suspicious_tld
    )
    
    return {
        "static_risk_score": risk_score,
        "static_reasons": reasons,
        "static_analysis": {
            "domain": domain,
            "tld": tld,
            "has_https": has_https,
            "domain_age_days": domain_age_days,
            "suspicious_keywords": suspicious_keywords,
            "suspicious_tld": suspicious_tld
        }
    }

