import urllib.parse

def convert_score(prob_legitimate: float, features_dict: dict = None, url: str = None, confidence_dict: dict = None) -> dict:
    """
    Converts model prediction probability of 'legitimate' class into:
      - trust_score: 0-100 (higher means more trustworthy)
      - risk_score: 0-100 (100 - trust_score)
      - risk_level: 'Low', 'Medium', or 'High'
    
    If features_dict and url are provided, applies cybersecurity heuristic checks
    and hard risk caps from the Website Trust & Risk Analysis Engine specification.
    """
    # 1. Base model score (ML Random Forest prediction)
    model_score = round(prob_legitimate * 100)
    model_score = max(0, min(100, model_score))
    
    final_score = model_score
    confidence_warning = False
    
    # 2. Heuristic Adjustment (if features and url context are available)
    if features_dict is not None and url is not None:
        # Start at neutral 50
        score = 50.0
        
        # --- POSITIVE SIGNALS ---
        ssl_state = features_dict.get("SSLfinal_State", 1)
        if ssl_state == 1:
            score += 10 # Valid SSL cert
            
        age = features_dict.get("age_of_domain", -1)
        if age == 1:
            score += 15 # Verified old domain (> 6 months)
            
        reg_len = features_dict.get("Domain_registeration_length", -1)
        if reg_len == 1:
            score += 5 # Registered for >= 1 year into the future
            
        prefix_suffix = features_dict.get("Prefix_Suffix", 1)
        if prefix_suffix == 1:
            score += 5 # No hyphen in domain name
            
        threat_db = features_dict.get("Statistical_report", 1)
        if threat_db == 1:
            score += 15 # Clean threat database reputation
            
        # --- NEGATIVE SIGNALS (Deductions) ---
        if ssl_state == -1:
            score -= 20 # Invalid/self-signed/mismatched SSL cert
            
        if age == -1:
            score -= 15 # Domain age < 6 months or unknown
            
        if reg_len == -1:
            score -= 5 # Domain registration expires in < 1 year
            
        if threat_db == -1:
            score -= 40 # Matches active phishing/malware threat database
            
        if prefix_suffix == -1:
            score -= 15 # Typosquatting / hyphen mimic brand name
            
        # URL Keyword & TLD checks
        parsed_url = urllib.parse.urlparse(url)
        domain = parsed_url.netloc.lower().split(":")[0]
        
        suspicious_tlds = {".xyz", ".top", ".click", ".work", ".link", ".info", ".biz", ".cc", ".icu", ".online", ".site", ".forex", ".buzz", ".fit", ".gq", ".cf", ".ml", ".tk"}
        urgency_keywords = {"secure", "login", "verify", "update", "bank", "signin", "pay", "free", "invoice", "wallet", "support"}
        piracy_keywords = {
            "movierulz", "netmirror", "torrent", "123movies", "fmovies", "putlocker",
            "pirate", "warez", "yts", "rarbg", "freemovie", "watchfree", "solarmovie",
            "primewire", "gostream", "soap2day", "hdmovie", "tamildbox", "ibomma",
            "filmywap", "bolly4u", "khatrimaza", "todaypk", "moviesda", "cinebloom"
        }
        
        has_suspicious_tld = any(domain.endswith(tld) for tld in suspicious_tlds)
        has_urgency_keyword = any(word in domain for word in urgency_keywords)
        has_piracy_term = any(term in domain for term in piracy_keywords)
        
        if has_piracy_term:
            score -= 40 # Severe penalty for illicit streaming / piracy mirror
        elif has_suspicious_tld and has_urgency_keyword:
            score -= 20 # Suspicious TLD combined with urgency/financial term
        elif has_suspicious_tld:
            score -= 15
        elif has_urgency_keyword:
            score -= 5
            
        # Excessive subdomains
        subdomains = features_dict.get("having_Sub_Domain", 1)
        if subdomains == -1:
            score -= 10
            
        # URL shortener used
        shortener = features_dict.get("Shortining_Service", 1)
        if shortener == -1:
            score -= 15
            
        # Redirect behavior
        redirects = features_dict.get("Redirect", 1)
        if redirects == -1:
            score -= 20
            
        # Content signals
        anchor = features_dict.get("URL_of_Anchor", 1)
        links_tags = features_dict.get("Links_in_tags", 1)
        if anchor == -1 or links_tags == -1:
            score -= 10
            
        # Clamp score between 0 and 100
        heuristic_score = max(0.0, min(100.0, score))
        
        # --- HARD CAPPING RULES ---
        # Rule 0: Piracy / illicit streaming / unauthorized mirror domains must be <= 18
        if has_piracy_term:
            heuristic_score = min(heuristic_score, 18.0)

        # Resolve status from confidence_dict or fallback to features_dict mapping
        if confidence_dict:
            ssl_status = confidence_dict.get("ssl_state", "UNAVAILABLE")
            age_status = confidence_dict.get("age_of_domain", "UNAVAILABLE")
            threat_status = confidence_dict.get("threat_db", "UNAVAILABLE")
        else:
            # Fallback to feature values
            ssl_status = "VALID" if ssl_state == 1 else "INVALID" if ssl_state == -1 else "UNAVAILABLE"
            age_status = "OLD" if age == 1 else "NEW" if age == -1 else "UNAVAILABLE"
            threat_status = "MALICIOUS" if threat_db == -1 else "CLEAN"

        # Rule 1: If ANY blacklist/malware/phishing match is found -> trust_score must be <= 20
        if threat_status == "MALICIOUS":
            heuristic_score = min(heuristic_score, 20.0)
            
        # Rule 2: If typosquatting/brand-impersonation detected -> cap at 30
        if prefix_suffix == -1 and has_urgency_keyword:
            heuristic_score = min(heuristic_score, 30.0)
            
        # Rule 3: Do not let valid SSL alone push score above 60 if domain is new (not unverified/unavailable)
        if ssl_status == "VALID" and age_status == "UNAVAILABLE":
            # Don't punish for missing data — flag it instead
            confidence_warning = True
        elif ssl_status == "VALID" and age_status == "NEW":
            heuristic_score = min(heuristic_score, 60.0)
            
        # Take the conservative minimum between ML prediction and Heuristic checks
        final_score = min(final_score, round(heuristic_score))

    risk_score = 100 - final_score
    
    # Severity classification (aligned with frontend risk bands)
    if final_score >= 80:
        risk_level = "Low"
    elif final_score >= 50:
        risk_level = "Medium"
    else:
        risk_level = "High"
        
    return {
        "trust_score": final_score,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence_warning": confidence_warning
    }
