import pytest
from bs4 import BeautifulSoup
from features.tech_detector import detect_technologies, TECH_CACHE

class MockResponse:
    def __init__(self, headers=None, text="", cookies=None):
        self.headers = headers or {}
        self.text = text
        self.cookies = cookies or []

class MockCookie:
    def __init__(self, name):
        self.name = name

def test_wordpress_detection_with_evidence_and_insights():
    html = """
    <html>
      <head>
        <meta name="generator" content="WordPress 6.4.2" />
        <link rel="stylesheet" href="/wp-content/themes/twentytwentyfour/style.css" />
      </head>
      <body>
        <script src="/wp-includes/js/jquery/jquery-3.4.1.min.js"></script>
      </body>
    </html>
    """
    soup = BeautifulSoup(html, "html.parser")
    resp = MockResponse(
        headers={
            "Server": "nginx/1.24.0",
            "X-Powered-By": "PHP/8.2.14",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
        },
        text=html,
        cookies=[MockCookie("wordpress_logged_in_123")]
    )
    
    result = detect_technologies(response=resp, soup=soup, domain="wp-test-site.org")
    
    # Verify top-level structure
    assert "total_detected" in result
    assert "overall_detection_confidence" in result
    assert "categories" in result
    assert result["total_detected"] >= 4
    assert 0 <= result["overall_detection_confidence"] <= 100

    categories = result["categories"]

    # 1. CMS Category
    assert "cms" in categories
    cms_techs = categories["cms"]["technologies"]
    wp = next(t for t in cms_techs if t["name"] == "WordPress")
    assert wp["version"] == "6.4.2"
    assert wp["confidence"] >= 90
    assert len(wp["evidence"]) >= 2  # Meta generator + cookie + html patterns
    assert any("WordPress" in e for e in wp["evidence"])
    assert wp["security_status"] == "Recommendation"
    assert "WordPress installation detected" in wp["security_insight"]

    # 2. Web Server Category
    assert "web_server" in categories
    nginx = next(t for t in categories["web_server"]["technologies"] if t["name"] == "Nginx")
    assert nginx["version"] == "1.24.0"
    assert nginx["confidence"] >= 80
    assert any("Server: nginx" in e for e in nginx["evidence"])
    assert nginx["security_status"] == "Informational"

    # 3. Backend Category
    assert "backend" in categories
    php = next(t for t in categories["backend"]["technologies"] if t["name"] == "PHP")
    assert php["version"] == "8.2.14"
    assert php["security_status"] == "Informational"  # PHP 8.2 >= 8.1.0 threshold

    # 4. Frontend Category - jQuery 3.4.1 (Older than 3.5.0)
    assert "frontend" in categories
    jquery = next(t for t in categories["frontend"]["technologies"] if t["name"] == "jQuery")
    assert jquery["version"] == "3.4.1"
    assert jquery["security_status"] == "Potential Concern"
    assert "prototype pollution" in jquery["security_insight"].lower()

    # 5. Security Category - HSTS
    assert "security" in categories
    hsts = next(t for t in categories["security"]["technologies"] if t["name"] == "HSTS")
    assert hsts["version"] == "Version: Not detected"
    assert any("Strict-Transport-Security" in e for e in hsts["evidence"])
    assert hsts["security_status"] == "Informational"

def test_no_version_and_confidence_scoring():
    html = """
    <html>
      <body class="flex items-center justify-center bg-gray-900 text-white">
        <div id="__next" data-reactroot="">
          <div id="__NEXT_DATA__">{}</div>
        </div>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js"></script>
        <script src="https://www.googletagmanager.com/gtm.js?id=GTM-TEST123"></script>
      </body>
    </html>
    """
    soup = BeautifulSoup(html, "html.parser")
    resp = MockResponse(
        headers={
            "server": "cloudflare",
            "cf-ray": "823489123891-IAD"
        },
        text=html
    )
    
    result = detect_technologies(response=resp, soup=soup, domain="next-test-site.dev")
    categories = result["categories"]

    # React without explicit version
    assert "frontend" in categories
    react = next(t for t in categories["frontend"]["technologies"] if t["name"] == "React")
    assert react["version"] == "Version: Not detected"
    assert react["confidence"] > 0
    assert len(react["evidence"]) > 0

    # CDN / Infrastructure: Cloudflare
    assert "cdn_infrastructure" in categories
    cf = next(t for t in categories["cdn_infrastructure"]["technologies"] if t["name"] == "Cloudflare")
    assert cf["security_status"] == "Informational"
    assert "Cloudflare edge network detected" in cf["security_insight"]

def test_cache_functionality():
    domain = "cached-domain.com"
    TECH_CACHE.clear()
    
    resp = MockResponse(headers={"server": "Apache/2.4.52"})
    res1 = detect_technologies(response=resp, soup=None, domain=domain)
    
    assert domain in TECH_CACHE
    res2 = detect_technologies(response=MockResponse(), soup=None, domain=domain)
    assert res1 == res2
    assert "web_server" in res2["categories"]
