import re
import socket
import urllib.parse
import requests
from bs4 import BeautifulSoup
import whois
from datetime import datetime
import time
import os
import ssl
import logging

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ethicalai-ml")

# Shortening service list
SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "shorte.st", "go2l.ink", "x.co", 
    "ow.ly", "db.tt", "qr.ae", "adf.ly", "bit.do", "cur.to", "short.to", 
    "is.gd", "buff.ly", "adfoc.us", "lnkd.in", "rebrand.ly", "tiny.cc"
}

def query_rdap(domain: str) -> dict:
    """
    Queries RDAP for domain registration details.
    """
    url = f"https://rdap.org/domain/{domain}"
    try:
        response = requests.get(url, timeout=5)
        logger.info(f"[RDAP] Request for {domain} returned status code {response.status_code}")
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 302:
            redirect_url = response.headers.get("Location")
            if redirect_url:
                resp = requests.get(redirect_url, timeout=5)
                if resp.status_code == 200:
                    return resp.json()
    except Exception as e:
        logger.error(f"[RDAP] Query failed for {domain}: {e}")
    return None

def parse_rdap_dates(rdap_data: dict) -> tuple:
    """
    Extracts creation and expiration dates from RDAP JSON events list.
    """
    creation_date = None
    expiration_date = None
    if not rdap_data or "events" not in rdap_data:
        return None, None
        
    for event in rdap_data.get("events", []):
        action = event.get("eventAction")
        date_str = event.get("eventDate")
        if not action or not date_str:
            continue
        try:
            # Parse prefix date string "YYYY-MM-DDTHH:MM:SS"
            clean_date_str = date_str[:19]
            dt = datetime.strptime(clean_date_str, "%Y-%m-%dT%H:%M:%S")
            if action == "registration":
                creation_date = dt
            elif action == "expiration":
                expiration_date = dt
        except Exception as e:
            logger.error(f"[RDAP] Date parsing failed for {date_str}: {e}")
            
    return creation_date, expiration_date

def make_naive(dt):
    if dt and hasattr(dt, "tzinfo") and dt.tzinfo is not None:
        return dt.replace(tzinfo=None)
    return dt

def get_domain_dates(domain: str) -> tuple:
    """
    Retrieves creation and expiration dates for a domain using RDAP,
    falling back to legacy WHOIS, with retry logic and backoff.
    Returns: (creation_date, expiration_date, age_status)
    where age_status is "OLD", "NEW", or "UNAVAILABLE".
    """
    # 1. Primary: Try RDAP with retries
    for attempt in range(2):
        try:
            rdap_data = query_rdap(domain)
            if rdap_data:
                c_date, e_date = parse_rdap_dates(rdap_data)
                c_date = make_naive(c_date)
                e_date = make_naive(e_date)
                if c_date:
                    age_days = (datetime.now() - c_date).days
                    status = "OLD" if age_days >= 180 else "NEW"
                    logger.info(f"[RDAP] Successful lookup for {domain} (Created: {c_date})")
                    return c_date, e_date, status
        except Exception as e:
            logger.error(f"[RDAP] Attempt {attempt+1} failed for {domain}: {e}")
        time.sleep(0.5 * (attempt + 1))

    # 2. Fallback: Try WHOIS with retries
    for attempt in range(2):
        try:
            whois_record = whois.whois(domain)
            if whois_record and hasattr(whois_record, "creation_date") and whois_record.creation_date:
                c_date = whois_record.creation_date
                e_date = whois_record.expiration_date
                if isinstance(c_date, list):
                    c_date = c_date[0]
                if isinstance(e_date, list):
                    e_date = e_date[0]
                c_date = make_naive(c_date)
                e_date = make_naive(e_date)
                if c_date:
                    age_days = (datetime.now() - c_date).days
                    status = "OLD" if age_days >= 180 else "NEW"
                    logger.info(f"[WHOIS] Successful fallback lookup for {domain} (Created: {c_date})")
                    return c_date, e_date, status
        except Exception as e:
            logger.error(f"[WHOIS] Fallback attempt {attempt+1} failed for {domain}: {e}")
        time.sleep(0.5 * (attempt + 1))

    return None, None, "UNAVAILABLE"

def verify_ssl_cert(domain: str) -> dict:
    """
    Inspects SSL certificate issuer, validity window, and chain over port 443.
    Returns: {"status": "VALID" | "INVALID" | "UNAVAILABLE", "reason": str}
    """
    context = ssl.create_default_context()
    try:
        with socket.create_connection((domain, 443), timeout=4) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                not_after_str = cert.get("notAfter")
                if not_after_str:
                    # Format e.g., "Feb 23 12:00:00 2027 GMT"
                    not_after = datetime.strptime(not_after_str, "%b %d %H:%M:%S %Y %Z")
                    if not_after < datetime.utcnow():
                        return {"status": "INVALID", "reason": "Certificate has expired"}
                return {"status": "VALID", "reason": "Verified chain & expiration"}
    except ssl.SSLCertVerificationError as e:
        logger.error(f"[SSL] Certificate validation failed for {domain}: {e}")
        return {"status": "INVALID", "reason": f"Verification failed: {e.reason}"}
    except Exception as e:
        logger.error(f"[SSL] Handshake connection failed for {domain}: {e}")
        return {"status": "UNAVAILABLE", "reason": str(e)}

def check_threat_db(domain: str) -> dict:
    """
    Queries reputation databases to verify if domain matches malware or phishing logs.
    """
    api_key = os.environ.get("THREAT_DB_API_KEY")
    if not api_key:
        logger.warning(f"[ThreatDB] API key not found. Skipping lookup for {domain}")
        return {"status": "UNAVAILABLE", "reason": "API Key missing"}
        
    url = f"https://api.threatdatabase.com/v1/check?domain={domain}"
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        response = requests.get(url, headers=headers, timeout=4)
        logger.info(f"[ThreatDB] Request for {domain} returned code {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            is_malicious = data.get("is_malicious", False)
            return {"status": "MALICIOUS" if is_malicious else "CLEAN", "reason": "API success"}
        else:
            return {"status": "UNAVAILABLE", "reason": f"API returned code {response.status_code}"}
    except Exception as e:
        logger.error(f"[ThreatDB] Lookup failed for {domain}: {e}")
        return {"status": "UNAVAILABLE", "reason": str(e)}

def extract_features(url: str) -> dict:
    """
    Extracts 30 features matching the Kaggle Phishing Dataset schema.
    Returns:
      {
        "features": dict,           # Flat -1, 0, 1 feature mappings for model
        "confidence": dict,         # Data retrieval statuses for scoring overlay
        "confidence_score": int     # Metrics retrieval quality percentage
      }
    """
    # Normalize URL scheme
    input_url = url.strip()
    if not input_url.startswith(("http://", "https://")):
        input_url = "http://" + input_url
        
    parsed_url = urllib.parse.urlparse(input_url)
    input_domain = parsed_url.netloc.split(":")[0]
    
    # Live URL resolution (follows redirects to audit the live landing target)
    resolved_url = input_url
    html_content = ""
    redirect_count = 0
    dns_resolved = False
    
    try:
        socket.gethostbyname(input_domain)
        dns_resolved = True
    except socket.gaierror as e:
        logger.error(f"[DNS] Resolution failed for {input_domain}: {e}")
        
    # Attempt connecting to resolve final redirected URL and extract HTML
    if dns_resolved:
        try:
            response = requests.get(input_url, timeout=5, verify=False)
            resolved_url = response.url
            redirect_count = len(response.history)
            html_content = response.text
        except Exception as e:
            logger.error(f"[HTTP] Failed to retrieve landing page content for {input_url}: {e}")
            
    # Clean domains from resolved live URL
    parsed_resolved = urllib.parse.urlparse(resolved_url)
    resolved_domain = parsed_resolved.netloc.split(":")[0]
    is_https = parsed_resolved.scheme == "https"
    
    features = {}
    
    # 1. having_IP_Address
    ip_pattern = r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
    if re.match(ip_pattern, resolved_domain) or ":" in resolved_domain:
        features["having_IP_Address"] = -1
    else:
        features["having_IP_Address"] = 1
        
    # 2. URL_Length
    if len(resolved_url) < 54:
        features["URL_Length"] = 1
    elif 54 <= len(resolved_url) <= 75:
        features["URL_Length"] = 0
    else:
        features["URL_Length"] = -1
        
    # 3. Shortining_Service
    if any(s in resolved_domain for s in SHORTENERS):
        features["Shortining_Service"] = -1
    else:
        features["Shortining_Service"] = 1
        
    # 4. having_At_Symbol
    if "@" in resolved_url:
        features["having_At_Symbol"] = -1
    else:
        features["having_At_Symbol"] = 1
        
    # 5. double_slash_redirecting
    if resolved_url.rfind("//") > 7:
        features["double_slash_redirecting"] = -1
    else:
        features["double_slash_redirecting"] = 1
        
    # 6. Prefix_Suffix
    if "-" in resolved_domain:
        features["Prefix_Suffix"] = -1
    else:
        features["Prefix_Suffix"] = 1
        
    # 7. having_Sub_Domain
    sub_domain_str = resolved_domain
    if sub_domain_str.startswith("www."):
        sub_domain_str = sub_domain_str[4:]
    dot_count = sub_domain_str.count(".")
    if dot_count <= 1:
        features["having_Sub_Domain"] = 1
    elif dot_count == 2:
        features["having_Sub_Domain"] = 0
    else:
        features["having_Sub_Domain"] = -1
        
    # 8. SSLfinal_State (Map to numeric model schema)
    ssl_result = verify_ssl_cert(resolved_domain)
    ssl_status = ssl_result["status"]
    if ssl_status == "VALID":
        features["SSLfinal_State"] = 1
    elif ssl_status == "INVALID":
        features["SSLfinal_State"] = -1
    else:
        features["SSLfinal_State"] = 0 # Neutral fallback for model
        
    # 9. Domain Registration Length & Age Check (RDAP -> WHOIS)
    c_date, e_date, age_status = get_domain_dates(resolved_domain)
    if age_status == "OLD":
        features["age_of_domain"] = 1
    elif age_status == "NEW":
        features["age_of_domain"] = -1
    else:
        features["age_of_domain"] = 0
        
    if e_date:
        reg_days = (e_date - datetime.now()).days
        features["Domain_registeration_length"] = 1 if reg_days >= 365 else -1
    else:
        features["Domain_registeration_length"] = 0
        
    # 10. Favicon
    soup = BeautifulSoup(html_content, "html.parser") if html_content else None
    features["Favicon"] = 1
    if soup:
        try:
            favicon_tag = soup.find("link", rel=lambda x: x and "icon" in x.lower())
            if favicon_tag and favicon_tag.get("href"):
                fav_url = favicon_tag.get("href")
                parsed_fav = urllib.parse.urlparse(fav_url)
                if parsed_fav.netloc and parsed_fav.netloc != resolved_domain:
                    features["Favicon"] = -1
        except Exception as e:
            logger.error(f"[Extractor] Favicon parse error: {e}")
            
    # 11. port
    if parsed_resolved.port and parsed_resolved.port not in (80, 443):
        features["port"] = -1
    else:
        features["port"] = 1
        
    # 12. HTTPS_token
    if "https" in resolved_domain or "http" in resolved_domain:
        features["HTTPS_token"] = -1
    else:
        features["HTTPS_token"] = 1
        
    # HTML Parsing Heuristics
    features["Request_URL"] = 1
    features["URL_of_Anchor"] = 1
    features["Links_in_tags"] = 1
    features["SFH"] = 1
    features["Submitting_to_email"] = 1
    features["Iframe"] = 1
    features["on_mouseover"] = 1
    features["RightClick"] = 1
    features["popUpWidnow"] = 1
    
    if soup:
        try:
            # 13. Request_URL
            tags = soup.find_all(["img", "audio", "embed", "iframe"])
            ext_count = sum(1 for tag in tags if (tag.get("src") or tag.get("href")) and urllib.parse.urlparse(tag.get("src") or tag.get("href")).netloc and urllib.parse.urlparse(tag.get("src") or tag.get("href")).netloc != resolved_domain)
            if tags:
                pct = (ext_count / len(tags)) * 100
                features["Request_URL"] = 1 if pct < 22 else 0 if pct <= 61 else -1
                
            # 14. URL_of_Anchor
            anchors = soup.find_all("a")
            ext_anchor = sum(1 for a in anchors if a.get("href") and (a.get("href").strip() in ("", "#", "#content", "javascript:void(0)") or (urllib.parse.urlparse(a.get("href")).netloc and urllib.parse.urlparse(a.get("href")).netloc != resolved_domain)))
            if anchors:
                pct = (ext_anchor / len(anchors)) * 100
                features["URL_of_Anchor"] = 1 if pct < 31 else 0 if pct <= 67 else -1
                
            # 15. Links_in_tags
            meta_links = soup.find_all(["meta", "script", "link"])
            ext_tags = sum(1 for tag in meta_links if (tag.get("src") or tag.get("href")) and urllib.parse.urlparse(tag.get("src") or tag.get("href")).netloc and urllib.parse.urlparse(tag.get("src") or tag.get("href")).netloc != resolved_domain)
            if meta_links:
                pct = (ext_tags / len(meta_links)) * 100
                features["Links_in_tags"] = 1 if pct < 17 else 0 if pct <= 81 else -1
                
            # 16. SFH (Server Form Handler)
            forms = soup.find_all("form")
            sfh_vals = []
            for f in forms:
                action = f.get("action", "").strip()
                if not action or action.lower() == "about:blank":
                    sfh_vals.append(-1)
                elif action.startswith("http") and urllib.parse.urlparse(action).netloc != resolved_domain:
                    sfh_vals.append(0)
                else:
                    sfh_vals.append(1)
            if sfh_vals:
                features["SFH"] = min(sfh_vals)
                
            # 17. Submitting_to_email
            has_mailto = any("mailto:" in f.get("action", "").strip().lower() or "mail(" in f.get("action", "").strip().lower() for f in forms)
            if has_mailto or "mailto:" in html_content.lower():
                features["Submitting_to_email"] = -1
                
            # 23. Iframe
            if soup.find("iframe"):
                features["Iframe"] = -1
                
            # 20. on_mouseover
            if "window.status" in html_content:
                features["on_mouseover"] = -1
                
            # 21. RightClick
            if "event.button==2" in html_content or "preventDefault()" in html_content or "contextmenu" in html_content:
                features["RightClick"] = -1
                
            # 22. popUpWidnow
            if "prompt(" in html_content or "window.open(" in html_content:
                features["popUpWidnow"] = -1
        except Exception as e:
            logger.error(f"[Extractor] HTML parse failed: {e}")
            
    # 18. Abnormal_URL
    features["Abnormal_URL"] = 1
    if age_status != "UNAVAILABLE":
        # Check abnormal parameters
        pass
        
    # 19. Redirect
    if redirect_count <= 1:
        features["Redirect"] = 1
    elif 1 < redirect_count < 4:
        features["Redirect"] = 0
    else:
        features["Redirect"] = -1
        
    # 25. DNSRecord
    features["DNSRecord"] = 1 if dns_resolved else -1
    
    # Model fallbacks for paid metrics
    features["web_traffic"] = 1 if dns_resolved and resolved_domain.split(".")[-1] in ("com", "org", "edu", "gov", "net") else 0 if dns_resolved else -1
    features["Page_Rank"] = 1 if dns_resolved and is_https and ssl_status == "VALID" else -1
    features["Google_Index"] = 1 if dns_resolved else -1
    features["Links_pointing_to_page"] = 1 if soup and len(soup.find_all("a")) > 10 else 0 if soup else -1
    
    # 30. Statistical_report (Blacklist Check)
    threat_result = check_threat_db(resolved_domain)
    threat_status = threat_result["status"]
    if threat_status == "MALICIOUS":
        features["Statistical_report"] = -1
    else:
        features["Statistical_report"] = 1 # Neutral model fallback
        
    # Calculate Data Confidence
    successful_signals = 0
    total_signals = 4
    if age_status != "UNAVAILABLE":
        successful_signals += 1
    if ssl_status != "UNAVAILABLE":
        successful_signals += 1
    if threat_status != "UNAVAILABLE":
        successful_signals += 1
    if soup is not None:
        successful_signals += 1
    confidence_score = round((successful_signals / total_signals) * 100)
    
    confidence = {
        "age_of_domain": age_status,  # "OLD" | "NEW" | "UNAVAILABLE"
        "ssl_state": ssl_status,      # "VALID" | "INVALID" | "UNAVAILABLE"
        "threat_db": threat_status    # "CLEAN" | "MALICIOUS" | "UNAVAILABLE"
    }
    
    return {
        "features": features,
        "confidence": confidence,
        "confidence_score": confidence_score
    }
