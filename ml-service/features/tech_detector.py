import re
import time
from typing import Dict, List, Any, Optional, Tuple

# Categories matching the user specification
CATEGORIES = {
    "frontend": {"title": "Frontend", "icon": "🎨", "summary_key": "Frontend"},
    "backend": {"title": "Backend / Framework", "icon": "⚙️", "summary_key": "Backend"},
    "cms": {"title": "CMS", "icon": "📝", "summary_key": "CMS"},
    "web_server": {"title": "Web Server", "icon": "🖥️", "summary_key": "Web Server"},
    "cdn_infrastructure": {"title": "CDN / Infrastructure", "icon": "☁️", "summary_key": "Infrastructure"},
    "analytics": {"title": "Analytics", "icon": "📊", "summary_key": "Analytics"},
    "security": {"title": "Security", "icon": "🔐", "summary_key": "Security"}
}

# In-memory 24-hour domain cache
TECH_CACHE: Dict[str, Tuple[float, Dict[str, Any]]] = {}
CACHE_TTL_SECONDS = 86400  # 24 hours

# Outdated version thresholds for security insights
OUTDATED_THRESHOLDS = {
    "jQuery": ("3.5.0", "Legacy jQuery version detected (prior to 3.5.0). Older releases may contain known cross-site scripting (XSS) or prototype pollution issues; consider upgrading to jQuery 3.7+."),
    "Bootstrap": ("5.0.0", "Legacy Bootstrap major release detected. Consider upgrading to modern Bootstrap 5 for improved accessibility and current security maintenance."),
    "PHP": ("8.1.0", "Legacy PHP runtime detected. Versions older than PHP 8.1 have reached End-of-Life (EOL) and no longer receive official security patches; consider upgrading to PHP 8.2 or 8.3."),
    "Apache": ("2.4.50", "Older Apache HTTP Server version detected; verify that critical security patches (such as path traversal fixes) are applied."),
    "WordPress": ("6.0.0", "Older WordPress core version detected; consider updating to the latest stable release to ensure patched core vulnerabilities.")
}

def parse_semver(v_str: str) -> List[int]:
    """Extracts numeric segments from a version string for safe comparison."""
    try:
        parts = re.findall(r"\d+", v_str)
        return [int(p) for p in parts[:3]]
    except Exception:
        return []

def is_version_older(version: str, threshold: str) -> bool:
    """Returns True if version is strictly older than threshold."""
    v_parts = parse_semver(version)
    t_parts = parse_semver(threshold)
    if not v_parts or not t_parts:
        return False
    # Pad to equal length
    max_len = max(len(v_parts), len(t_parts))
    v_parts += [0] * (max_len - len(v_parts))
    t_parts += [0] * (max_len - len(t_parts))
    return v_parts < t_parts

# Signature ruleset (30+ technologies covering all 7 categories)
RULES = [
    # ------------------ FRONTEND ------------------
    {
        "name": "React",
        "category": "frontend",
        "subcategory": "JavaScript UI Library",
        "detection_rules": {
            "html_patterns": [(r"data-reactroot", "DOM element with 'data-reactroot' attribute detected"),
                              (r"data-reactid", "DOM element with 'data-reactid' attribute detected"),
                              (r"_reactListening", "React event listener attribute '_reactListening' detected")],
            "script_src_patterns": [(r"react(?:\.production)?(?:\.min)?\.js", "React script bundle detected in script tag"),
                                    (r"/static/js/[^/]*react", "React production bundle path detected in script src")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"react[/@]([0-9.]+)", r"react(?:\.production)?(?:\.min)?\.js\?v=([0-9.]+)"]
    },
    {
        "name": "Next.js",
        "category": "frontend",
        "subcategory": "React Framework",
        "detection_rules": {
            "html_patterns": [(r"__NEXT_DATA__", "Next.js hydration script '__NEXT_DATA__' detected in HTML"),
                              (r"/_next/static/", "Next.js static assets directory '/_next/static/' detected")],
            "script_src_patterns": [(r"/_next/static/", "Next.js chunk detected in script src")],
            "headers": {"x-powered-by": (r"Next\.js(?:\s+([\d.]+))?", "HTTP response header 'X-Powered-By: Next.js' detected")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"Next\.js\s+([0-9.]+)", r"/_next/static/chunks/([0-9.]+)/"]
    },
    {
        "name": "Vue.js",
        "category": "frontend",
        "subcategory": "JavaScript Framework",
        "detection_rules": {
            "html_patterns": [(r"data-v-[0-9a-f]{6,8}", "Vue.js scoped CSS attribute 'data-v-*' detected in HTML"),
                              (r"v-cloak", "Vue.js 'v-cloak' directive detected in DOM")],
            "script_src_patterns": [(r"vue(?:\.runtime)?(?:\.min)?\.js", "Vue.js runtime library detected in script src")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"vue[/@]([0-9.]+)", r"vue(?:\.runtime)?(?:\.min)?\.js\?v=([0-9.]+)"]
    },
    {
        "name": "Angular",
        "category": "frontend",
        "subcategory": "JavaScript Framework",
        "detection_rules": {
            "html_patterns": [(r"ng-version=\"([0-9.]+)\"", "Angular version attribute 'ng-version' detected in DOM"),
                              (r"_ngcontent-", "Angular view encapsulation attribute '_ngcontent' detected"),
                              (r"ng-app", "AngularJS bootstrap directive 'ng-app' detected")],
            "script_src_patterns": [(r"angular(?:\.min)?\.js", "Angular script source detected")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"ng-version=\"([0-9.]+)\"", r"angular[/@]([0-9.]+)"]
    },
    {
        "name": "Svelte",
        "category": "frontend",
        "subcategory": "JavaScript Framework",
        "detection_rules": {
            "html_patterns": [(r"class=\"svelte-[0-9a-z]{5,8}\"", "Svelte component class signature 'svelte-*' detected in DOM"),
                              (r"__svelte", "Svelte runtime identifier detected in HTML")],
            "script_src_patterns": [],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Bootstrap",
        "category": "frontend",
        "subcategory": "CSS Framework",
        "detection_rules": {
            "html_patterns": [(r"bootstrap(?:\.min)?\.css", "Bootstrap stylesheet link detected in HTML"),
                              (r"class=\"[^\"]*(?:container-fluid|col-(?:sm|md|lg|xl)-[0-9]+)[^\"]*\"", "Bootstrap-specific grid classes detected in HTML")],
            "script_src_patterns": [(r"bootstrap(?:-([\d.]+))?(?:\.bundle)?(?:\.min)?\.js", "Bootstrap JavaScript bundle detected in script tag")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"bootstrap[/-]([0-9.]+)", r"bootstrap(?:\.min)?\.css\?v=([0-9.]+)"]
    },
    {
        "name": "Tailwind CSS",
        "category": "frontend",
        "subcategory": "CSS Framework",
        "detection_rules": {
            "html_patterns": [(r"tailwind(?:\.min)?\.css", "Tailwind CSS stylesheet detected"),
                              (r"class=\"[^\"]*(?:flex|grid)\s+(?:items-|justify-|p-|m-|text-|bg-)[^\"]*\"", "Tailwind utility classes pattern detected in HTML")],
            "script_src_patterns": [],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"tailwind(?:css)?[/-]([0-9.]+)"]
    },
    {
        "name": "Foundation",
        "category": "frontend",
        "subcategory": "CSS Framework",
        "detection_rules": {
            "html_patterns": [(r"foundation(?:\.min)?\.css", "Foundation stylesheet link detected in HTML"),
                              (r"class=\"[^\"]*(?:small-|medium-|large-)[0-9]+[^\"]*\"", "Foundation responsive grid classes detected")],
            "script_src_patterns": [(r"foundation(?:\.min)?\.js", "Foundation JavaScript library detected")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"foundation[/-]([0-9.]+)"]
    },
    {
        "name": "jQuery",
        "category": "frontend",
        "subcategory": "JavaScript Library",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [(r"jquery(?:-([0-9.]+))?(?:\.min)?\.js", "jQuery script library detected in script src"),
                                    (r"code\.jquery\.com/jquery-([0-9.]+)", "Official jQuery CDN script URL detected")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"jquery[/-]([0-9.]+)", r"jquery\.min\.js\?v=([0-9.]+)"]
    },
    {
        "name": "Three.js",
        "category": "frontend",
        "subcategory": "3D Graphics Library",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [(r"three(?:\.min)?\.js", "Three.js 3D library detected in script tag")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"three[/-]r?([0-9.]+)"]
    },
    {
        "name": "Lodash",
        "category": "frontend",
        "subcategory": "JavaScript Utility Library",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [(r"lodash(?:\.min)?\.js", "Lodash utility library detected in script tag")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"lodash[/-]([0-9.]+)"]
    },
    {
        "name": "Axios",
        "category": "frontend",
        "subcategory": "HTTP Client Library",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [(r"axios(?:\.min)?\.js", "Axios HTTP library detected in script tag")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"axios[/-]([0-9.]+)"]
    },

    # ------------------ BACKEND / FRAMEWORK ------------------
    {
        "name": "Node.js",
        "category": "backend",
        "subcategory": "JavaScript Runtime",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"x-powered-by": (r"Express", "HTTP response header 'X-Powered-By: Express' confirms Node.js runtime")},
            "cookies": [(r"connect\.sid", "Node.js express-session cookie 'connect.sid' detected")],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Express",
        "category": "backend",
        "subcategory": "Node.js Web Framework",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"x-powered-by": (r"Express", "HTTP response header 'X-Powered-By: Express' detected")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "PHP",
        "category": "backend",
        "subcategory": "Programming Language",
        "detection_rules": {
            "html_patterns": [(r"\.php(?:[\?#]|$)", "Direct PHP script link (.php) detected in DOM")],
            "script_src_patterns": [],
            "headers": {"x-powered-by": (r"PHP(?:/([\d.]+))?", "HTTP response header 'X-Powered-By: PHP' detected")},
            "cookies": [(r"PHPSESSID", "Standard PHP session cookie 'PHPSESSID' detected")],
            "meta_generator": []
        },
        "version_patterns": [r"PHP/([0-9.]+)"]
    },
    {
        "name": "ASP.NET",
        "category": "backend",
        "subcategory": "Web Application Framework",
        "detection_rules": {
            "html_patterns": [(r"__VIEWSTATE", "ASP.NET state management hidden input '__VIEWSTATE' detected"),
                              (r"\.aspx(?:[\?#]|$)", "ASP.NET page extension (.aspx) detected in URL links")],
            "script_src_patterns": [],
            "headers": {"x-powered-by": (r"ASP\.NET", "HTTP response header 'X-Powered-By: ASP.NET' detected"),
                        "x-aspnet-version": (r"([\d.]+)", "HTTP response header 'X-AspNet-Version' detected")},
            "cookies": [(r"ASP\.NET_SessionId", "ASP.NET session cookie 'ASP.NET_SessionId' detected")],
            "meta_generator": []
        },
        "version_patterns": [r"X-AspNet-Version:\s*([0-9.]+)"]
    },
    {
        "name": "Laravel",
        "category": "backend",
        "subcategory": "PHP Framework",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {},
            "cookies": [(r"laravel_session", "Laravel session cookie 'laravel_session' detected"),
                        (r"XSRF-TOKEN", "Laravel standard CSRF protection cookie detected")],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Django",
        "category": "backend",
        "subcategory": "Python Web Framework",
        "detection_rules": {
            "html_patterns": [(r"csrfmiddlewaretoken", "Django CSRF protection token 'csrfmiddlewaretoken' detected in form")],
            "script_src_patterns": [],
            "headers": {},
            "cookies": [(r"csrftoken", "Django session cookie 'csrftoken' detected")],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Ruby on Rails",
        "category": "backend",
        "subcategory": "Ruby Web Framework",
        "detection_rules": {
            "html_patterns": [(r"csrf-param=\"authenticity_token\"", "Ruby on Rails 'authenticity_token' meta tag detected")],
            "script_src_patterns": [],
            "headers": {"x-powered-by": (r"Phusion Passenger", "Phusion Passenger application server header detected")},
            "cookies": [(r"_rails_session", "Ruby on Rails session cookie detected")],
            "meta_generator": []
        },
        "version_patterns": []
    },

    # ------------------ CMS ------------------
    {
        "name": "WordPress",
        "category": "cms",
        "subcategory": "Content Management System",
        "detection_rules": {
            "html_patterns": [(r"/wp-content/", "WordPress content directory '/wp-content/' referenced in DOM"),
                              (r"/wp-includes/", "WordPress core library directory '/wp-includes/' referenced in DOM"),
                              (r"/wp-json/", "WordPress REST API endpoint '/wp-json/' link detected")],
            "script_src_patterns": [(r"wp-content", "WordPress plugin/theme asset detected in script tag"),
                                    (r"wp-includes", "WordPress core script detected in script tag")],
            "headers": {},
            "cookies": [(r"wp-settings", "WordPress user cookie 'wp-settings' detected"),
                        (r"wordpress_logged_in", "WordPress login cookie detected")],
            "meta_generator": [(r"WordPress(?:\s+([\d.]+))?", "Meta generator tag specifies WordPress")]
        },
        "version_patterns": [r"WordPress\s+([0-9.]+)", r"ver=([0-9.]+)\" id=\"wordpress"]
    },
    {
        "name": "Shopify",
        "category": "cms",
        "subcategory": "Ecommerce CMS",
        "detection_rules": {
            "html_patterns": [(r"cdn\.shopify\.com", "Shopify CDN asset domain 'cdn.shopify.com' detected in HTML"),
                              (r"Shopify\.theme", "Shopify JavaScript theme object detected")],
            "script_src_patterns": [(r"cdn\.shopify\.com", "Shopify storefront script loaded in script src")],
            "headers": {"x-shopify-stage": (r".*", "Shopify infrastructure header 'x-shopify-stage' detected"),
                        "x-shopid": (r".*", "Shopify store identifier header 'x-shopid' detected")},
            "cookies": [(r"_shopify_s", "Shopify storefront session cookie '_shopify_s' detected")],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Drupal",
        "category": "cms",
        "subcategory": "Content Management System",
        "detection_rules": {
            "html_patterns": [(r"Drupal\.settings", "Drupal JavaScript settings object 'Drupal.settings' detected in HTML"),
                              (r"/sites/default/files/", "Drupal standard asset path '/sites/default/files/' detected")],
            "script_src_patterns": [(r"drupal(?:\.min)?\.js", "Drupal core JavaScript library detected in script src")],
            "headers": {"x-drupal-cache": (r".*", "HTTP response header 'X-Drupal-Cache' detected"),
                        "x-generator": (r"Drupal(?:\s+([\d.]+))?", "HTTP response header 'X-Generator: Drupal' detected")},
            "cookies": [],
            "meta_generator": [(r"Drupal(?:\s+([\d.]+))?", "Meta generator tag specifies Drupal")]
        },
        "version_patterns": [r"Drupal\s+([0-9.]+)"]
    },
    {
        "name": "Joomla",
        "category": "cms",
        "subcategory": "Content Management System",
        "detection_rules": {
            "html_patterns": [(r"/media/jui/", "Joomla media UI library '/media/jui/' detected"),
                              (r"/components/com_", "Joomla component URL pattern '/components/com_' detected")],
            "script_src_patterns": [],
            "headers": {},
            "cookies": [],
            "meta_generator": [(r"Joomla!(?:\s+([\d.]+))?", "Meta generator tag specifies Joomla!")]
        },
        "version_patterns": [r"Joomla!\s+([0-9.]+)"]
    },
    {
        "name": "Wix",
        "category": "cms",
        "subcategory": "Website Builder",
        "detection_rules": {
            "html_patterns": [(r"static\.wixstatic\.com", "Wix static asset storage domain 'static.wixstatic.com' detected in HTML"),
                              (r"wix-warmup-data", "Wix server-side warmup data script detected")],
            "script_src_patterns": [(r"wixstatic\.com", "Wix static bundle script detected")],
            "headers": {"x-wix-request-id": (r".*", "HTTP response header 'X-Wix-Request-Id' detected")},
            "cookies": [],
            "meta_generator": [(r"Wix\.com Website Builder", "Meta generator specifies Wix.com")]
        },
        "version_patterns": []
    },
    {
        "name": "Webflow",
        "category": "cms",
        "subcategory": "Visual CMS / Website Builder",
        "detection_rules": {
            "html_patterns": [(r"assets\.website-files\.com", "Webflow asset hosting domain 'assets.website-files.com' detected in HTML"),
                              (r"wf-page=", "Webflow page identifier attribute 'wf-page' detected in HTML tag")],
            "script_src_patterns": [(r"webflow(?:\.min)?\.js", "Webflow client JavaScript library detected")],
            "headers": {},
            "cookies": [],
            "meta_generator": [(r"Webflow", "Meta generator specifies Webflow")]
        },
        "version_patterns": []
    },

    # ------------------ WEB SERVER ------------------
    {
        "name": "Nginx",
        "category": "web_server",
        "subcategory": "HTTP Web Server",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"server": (r"nginx(?:/([\d.]+))?", "HTTP response header 'Server: nginx' detected")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"nginx/([0-9.]+)"]
    },
    {
        "name": "Apache",
        "category": "web_server",
        "subcategory": "HTTP Web Server",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"server": (r"Apache(?:/([\d.]+))?", "HTTP response header 'Server: Apache' detected")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"Apache/([0-9.]+)"]
    },
    {
        "name": "IIS",
        "category": "web_server",
        "subcategory": "Microsoft HTTP Server",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"server": (r"Microsoft-IIS(?:/([\d.]+))?", "HTTP response header 'Server: Microsoft-IIS' detected")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": [r"Microsoft-IIS/([0-9.]+)"]
    },
    {
        "name": "LiteSpeed",
        "category": "web_server",
        "subcategory": "High-Performance Web Server",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"server": (r"LiteSpeed", "HTTP response header 'Server: LiteSpeed' detected")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Caddy",
        "category": "web_server",
        "subcategory": "Automated HTTPS Web Server",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"server": (r"Caddy", "HTTP response header 'Server: Caddy' detected")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },

    # ------------------ CDN / INFRASTRUCTURE ------------------
    {
        "name": "Cloudflare",
        "category": "cdn_infrastructure",
        "subcategory": "CDN & Edge Network",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"server": (r"cloudflare", "HTTP response header 'Server: cloudflare' detected"),
                        "cf-ray": (r".*", "Cloudflare Ray ID header 'CF-Ray' detected in response")},
            "cookies": [(r"__cf_bm", "Cloudflare bot management cookie '__cf_bm' detected"),
                        (r"cf_clearance", "Cloudflare clearance cookie 'cf_clearance' detected")],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Amazon CloudFront",
        "category": "cdn_infrastructure",
        "subcategory": "CDN & Edge Network",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"x-amz-cf-id": (r".*", "Amazon CloudFront tracking header 'X-Amz-Cf-Id' detected in response"),
                        "via": (r"cloudfront", "HTTP 'Via' header identifies Amazon CloudFront edge proxy")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Fastly",
        "category": "cdn_infrastructure",
        "subcategory": "Edge Cloud Platform",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"x-fastly-request-id": (r".*", "Fastly request tracking header 'X-Fastly-Request-Id' detected"),
                        "x-served-by": (r"cache-", "Fastly edge cache node signature in 'X-Served-By' header detected")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Akamai",
        "category": "cdn_infrastructure",
        "subcategory": "Global CDN Network",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"x-akamai-transformed": (r".*", "Akamai transformation header 'X-Akamai-Transformed' detected"),
                        "server": (r"AkamaiGHost", "Akamai Global Host server signature 'AkamaiGHost' detected")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },

    # ------------------ ANALYTICS ------------------
    {
        "name": "Google Analytics",
        "category": "analytics",
        "subcategory": "Web Analytics",
        "detection_rules": {
            "html_patterns": [(r"gtag\('config',\s*['\"]G-[A-Z0-9]+['\"]", "Google Analytics 4 configuration call 'gtag(config, G-...)' detected in HTML"),
                              (r"ga\('create',\s*['\"]UA-[0-9]+-[0-9]+['\"]", "Legacy Google Universal Analytics snippet 'UA-...' detected in HTML")],
            "script_src_patterns": [(r"google-analytics\.com/(?:ga|analytics)\.js", "Google Analytics tracker script loaded from google-analytics.com"),
                                    (r"googletagmanager\.com/gtag/js\?id=G-", "Google Analytics 4 gtag.js script loaded in script tag")],
            "headers": {},
            "cookies": [(r"_ga", "Google Analytics primary client cookie '_ga' detected"),
                        (r"_gid", "Google Analytics session cookie '_gid' detected")],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Google Tag Manager",
        "category": "analytics",
        "subcategory": "Tag Management System",
        "detection_rules": {
            "html_patterns": [(r"www\.googletagmanager\.com/gtm\.js\?id=GTM-", "Google Tag Manager embed code detected in HTML")],
            "script_src_patterns": [(r"googletagmanager\.com/gtm\.js", "Google Tag Manager container script 'gtm.js' loaded in script src")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Hotjar",
        "category": "analytics",
        "subcategory": "Behavior Analytics & Heatmaps",
        "detection_rules": {
            "html_patterns": [(r"static\.hotjar\.com/c/hotjar-", "Hotjar tracking snippet embedded in HTML")],
            "script_src_patterns": [(r"static\.hotjar\.com/c/hotjar-", "Hotjar recording script loaded in script src")],
            "headers": {},
            "cookies": [(r"_hjSession", "Hotjar user session cookie '_hjSession' detected")],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Microsoft Clarity",
        "category": "analytics",
        "subcategory": "Behavior Analytics",
        "detection_rules": {
            "html_patterns": [(r"www\.clarity\.ms/tag/", "Microsoft Clarity script initializer detected in HTML")],
            "script_src_patterns": [(r"www\.clarity\.ms/tag/", "Microsoft Clarity tracking library loaded in script src")],
            "headers": {},
            "cookies": [(r"_clck", "Microsoft Clarity user identifier cookie '_clck' detected")],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Facebook Pixel",
        "category": "analytics",
        "subcategory": "Conversion Tracking",
        "detection_rules": {
            "html_patterns": [(r"fbq\('init'", "Meta/Facebook Pixel initialization call 'fbq(init)' detected in HTML")],
            "script_src_patterns": [(r"connect\.facebook\.net/[a-zA-Z_]+/fbevents\.js", "Meta/Facebook Pixel events script 'fbevents.js' loaded")],
            "headers": {},
            "cookies": [(r"_fbp", "Facebook browser tracker cookie '_fbp' detected")],
            "meta_generator": []
        },
        "version_patterns": []
    },

    # ------------------ SECURITY ------------------
    {
        "name": "reCAPTCHA",
        "category": "security",
        "subcategory": "Bot & Abuse Prevention",
        "detection_rules": {
            "html_patterns": [(r"class=\"g-recaptcha\"", "reCAPTCHA form container 'g-recaptcha' detected in HTML"),
                              (r"data-sitekey=", "reCAPTCHA sitekey configuration attribute detected in HTML")],
            "script_src_patterns": [(r"google\.com/recaptcha/api\.js", "Google reCAPTCHA API client script loaded")],
            "headers": {},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "HSTS",
        "category": "security",
        "subcategory": "Transport Security Header",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"strict-transport-security": (r"max-age=[0-9]+", "HTTP 'Strict-Transport-Security' header enforces encrypted HTTPS connections")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Content Security Policy",
        "category": "security",
        "subcategory": "Content Isolation Policy",
        "detection_rules": {
            "html_patterns": [(r"http-equiv=[\"']Content-Security-Policy[\"']", "Content-Security-Policy meta tag enforced in HTML")],
            "script_src_patterns": [],
            "headers": {"content-security-policy": (r".+", "HTTP 'Content-Security-Policy' response header enforced by server")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "Permissions Policy",
        "category": "security",
        "subcategory": "Feature & Sensor Policy",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"permissions-policy": (r".+", "HTTP 'Permissions-Policy' header restricts browser features and device APIs"),
                        "feature-policy": (r".+", "HTTP 'Feature-Policy' header restricts browser permissions")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    },
    {
        "name": "X-Frame-Options (Clickjacking Protection)",
        "category": "security",
        "subcategory": "Frame Embedding Control",
        "detection_rules": {
            "html_patterns": [],
            "script_src_patterns": [],
            "headers": {"x-frame-options": (r"(?:DENY|SAMEORIGIN)", "HTTP 'X-Frame-Options' header defends against clickjacking iframe attacks")},
            "cookies": [],
            "meta_generator": []
        },
        "version_patterns": []
    }
]


def generate_security_insight(tech_name: str, version: str) -> Tuple[str, str]:
    """
    Generates security insight classification and actionable context.
    Classifications:
    - ✓ Informational
    - ⚠ Potential Concern
    - 🔴 High Risk
    - ℹ Recommendation
    """
    clean_version = ""
    if version and version != "Version: Not detected":
        clean_version = version.replace("v", "").strip()

    # 1. Outdated version threshold check
    if clean_version and tech_name in OUTDATED_THRESHOLDS:
        threshold, advice = OUTDATED_THRESHOLDS[tech_name]
        if is_version_older(clean_version, threshold):
            return "Potential Concern", advice

    # 2. CMS-specific security recommendations
    if tech_name == "WordPress":
        return "Recommendation", "WordPress installation detected. Ensure core files, active plugins, and themes are regularly updated to minimize attack surface."
    if tech_name in ("Drupal", "Joomla"):
        return "Recommendation", f"{tech_name} CMS detected. Monitor vendor security advisories and apply core security patches promptly."

    # 3. CDN / Edge Infrastructure
    if tech_name == "Cloudflare":
        return "Informational", "Cloudflare edge network detected. Provides CDN performance and potential DDoS/WAF protection, though specific active security rules cannot be validated remotely."
    if tech_name in ("Amazon CloudFront", "Fastly", "Akamai"):
        return "Informational", f"{tech_name} infrastructure detected; routes traffic through global edge distribution with origin shielding."

    # 4. Security Headers & Controls
    if tech_name == "HSTS":
        return "Informational", "HTTP Strict Transport Security (HSTS) is actively enforced, preventing man-in-the-middle protocol downgrade attacks."
    if tech_name == "Content Security Policy":
        return "Informational", "Content Security Policy (CSP) is actively enforced, restricting unauthorized script execution and mitigating Cross-Site Scripting (XSS)."
    if tech_name == "Permissions Policy":
        return "Informational", "Permissions-Policy header is configured, limiting browser access to sensitive features like camera, microphone, and geolocation."
    if tech_name == "reCAPTCHA":
        return "Informational", "Automated bot verification is deployed to safeguard interactive endpoints against credential stuffing and automated abuse."
    if tech_name == "X-Frame-Options (Clickjacking Protection)":
        return "Informational", "Frame embedding is restricted, defending visitors against UI redressing and clickjacking exploits."

    # 5. Default Informational Insight
    return "Informational", "No immediate security concern identified."


def detect_technologies(response=None, soup=None, domain: str = "") -> Dict[str, Any]:
    """
    Main detection pipeline that analyzes the already-fetched HTTP response
    and parsed DOM in order:
    HTML -> <script> tags -> <link> tags -> meta tags -> HTTP headers -> cookies.
    
    Returns structured data adhering strictly to the contract:
    {
      "tech_stack": {
        "total_detected": int,
        "overall_detection_confidence": int,
        "categories": {
          "frontend": { "confidence": int, "technologies": [ ... ] },
          ...
        }
      }
    }
    """
    clean_domain = domain.lower().strip()
    now = time.time()

    # 1. Check in-memory 24-hour cache
    if clean_domain and clean_domain in TECH_CACHE:
        cache_time, cached_result = TECH_CACHE[clean_domain]
        if now - cache_time < CACHE_TTL_SECONDS:
            return cached_result

    # Initialize categorized container
    categorized_results: Dict[str, List[Dict[str, Any]]] = {
        cat_id: [] for cat_id in CATEGORIES.keys()
    }

    try:
        # Pre-extract data points from response & soup
        headers: Dict[str, str] = {}
        cookies_list: List[str] = []
        html_text = ""
        meta_generators: List[str] = []
        script_srcs: List[str] = []
        link_hrefs: List[str] = []

        if response is not None:
            headers = {str(k).lower(): str(v) for k, v in getattr(response, "headers", {}).items()}
            if hasattr(response, "cookies") and response.cookies:
                cookies_list = [c.name for c in response.cookies]
            html_text = getattr(response, "text", "") or ""

        if soup is not None:
            # 1. Meta generator tags
            for meta in soup.find_all("meta"):
                name_attr = (meta.get("name") or meta.get("property") or "").lower()
                if name_attr in ("generator", "wp-generator"):
                    content = meta.get("content")
                    if content:
                        meta_generators.append(content)

            # 2. Script source attributes
            for script in soup.find_all("script"):
                src = script.get("src")
                if src:
                    script_srcs.append(src)

            # 3. Link tags (stylesheets, icons)
            for link in soup.find_all("link"):
                href = link.get("href")
                if href:
                    link_hrefs.append(href)

        # Evaluate ruleset in strict evidence order
        for entry in RULES:
            name = entry["name"]
            category = entry["category"]
            subcategory = entry["subcategory"]
            d_rules = entry["detection_rules"]
            v_patterns = entry.get("version_patterns", [])

            evidence_list: List[str] = []
            detected_version: Optional[str] = None
            signal_weights: List[int] = []

            # -------------------------------------------------------------
            # 1. HTML Patterns (weight: 40-50)
            # -------------------------------------------------------------
            for pattern, evidence_desc in d_rules.get("html_patterns", []):
                if html_text and re.search(pattern, html_text, re.IGNORECASE):
                    if evidence_desc not in evidence_list:
                        evidence_list.append(evidence_desc)
                        signal_weights.append(45)

            # -------------------------------------------------------------
            # 2. Script src Patterns (weight: 60-70)
            # -------------------------------------------------------------
            for pattern, evidence_desc in d_rules.get("script_src_patterns", []):
                for src in script_srcs:
                    if re.search(pattern, src, re.IGNORECASE):
                        if evidence_desc not in evidence_list:
                            evidence_list.append(evidence_desc)
                            signal_weights.append(65)
                        break

            # -------------------------------------------------------------
            # 3. Link href Patterns (weight: 55-65)
            # -------------------------------------------------------------
            if "link_href_patterns" in d_rules:
                for pattern, evidence_desc in d_rules["link_href_patterns"]:
                    for href in link_hrefs:
                        if re.search(pattern, href, re.IGNORECASE):
                            if evidence_desc not in evidence_list:
                                evidence_list.append(evidence_desc)
                                signal_weights.append(60)
                            break

            # -------------------------------------------------------------
            # 4. Meta Generator (weight: 85-90)
            # -------------------------------------------------------------
            for pattern, evidence_desc in d_rules.get("meta_generator", []):
                for gen in meta_generators:
                    m = re.search(pattern, gen, re.IGNORECASE)
                    if m:
                        if evidence_desc not in evidence_list:
                            evidence_list.append(evidence_desc)
                            signal_weights.append(85)
                        if m.groups() and m.group(1):
                            detected_version = m.group(1)
                        break

            # -------------------------------------------------------------
            # 5. HTTP Response Headers (weight: 80-90)
            # -------------------------------------------------------------
            for h_name, (h_pattern, evidence_desc) in d_rules.get("headers", {}).items():
                h_val = headers.get(h_name.lower())
                if h_val:
                    m = re.search(h_pattern, h_val, re.IGNORECASE)
                    if m:
                        if evidence_desc not in evidence_list:
                            evidence_list.append(evidence_desc)
                            signal_weights.append(85)
                        if m.groups() and m.group(1):
                            detected_version = m.group(1)

            # -------------------------------------------------------------
            # 6. Cookies (weight: 70-80)
            # -------------------------------------------------------------
            for c_pattern, evidence_desc in d_rules.get("cookies", []):
                for cookie_name in cookies_list:
                    if re.search(c_pattern, cookie_name, re.IGNORECASE):
                        if evidence_desc not in evidence_list:
                            evidence_list.append(evidence_desc)
                            signal_weights.append(75)
                        break

            # If evidence was found, compute version, confidence, and security insights
            if evidence_list:
                # Attempt version extraction across version patterns if not yet found
                if not detected_version and v_patterns:
                    # Search headers first
                    for h_val in headers.values():
                        for v_pat in v_patterns:
                            vm = re.search(v_pat, h_val, re.IGNORECASE)
                            if vm and vm.groups() and vm.group(1):
                                detected_version = vm.group(1)
                                break
                        if detected_version:
                            break

                if not detected_version and v_patterns:
                    # Search script srcs
                    for src in script_srcs:
                        for v_pat in v_patterns:
                            vm = re.search(v_pat, src, re.IGNORECASE)
                            if vm and vm.groups() and vm.group(1):
                                detected_version = vm.group(1)
                                break
                        if detected_version:
                            break

                if not detected_version and v_patterns:
                    # Search HTML text
                    for v_pat in v_patterns:
                        vm = re.search(v_pat, html_text, re.IGNORECASE)
                        if vm and vm.groups() and vm.group(1):
                            detected_version = vm.group(1)
                            break

                # Strict version string formatting as required
                if detected_version:
                    detected_version = detected_version.rstrip(".")
                final_version = detected_version if detected_version else "Version: Not detected"

                # -------------------------------------------------------------
                # Confidence Calculation (0-100%)
                # Documented logic:
                # - Single signal: based on signal reliability (e.g. 70-85%).
                # - Multiple signals: compounded confidence:
                #   combined_prob = 1 - product(1 - weight/100)
                #   scaled to a realistic 85-99% range.
                # -------------------------------------------------------------
                if len(signal_weights) == 1:
                    confidence = min(88, max(60, signal_weights[0]))
                else:
                    # Compounded independent signals formula
                    miss_prob = 1.0
                    for w in signal_weights:
                        miss_prob *= (1.0 - (w / 100.0))
                    compounded = int((1.0 - miss_prob) * 100)
                    confidence = min(99, max(85, compounded))

                # Security Insight evaluation
                sec_status, sec_insight = generate_security_insight(name, final_version)

                tech_obj = {
                    "name": name,
                    "category": CATEGORIES[category]["title"],
                    "subcategory": subcategory,
                    "version": final_version,
                    "confidence": confidence,
                    "evidence": evidence_list,
                    "security_status": sec_status,
                    "security_insight": sec_insight
                }

                categorized_results[category].append(tech_obj)

    except Exception as e:
        # Absolute resilience: tech detection must never affect the core scan
        print(f"[TechDetector Critical Error] Detection failed safely for {clean_domain}: {e}")

    # Build category summaries and filter empty categories
    categories_output: Dict[str, Dict[str, Any]] = {}
    all_confidences: List[int] = []
    total_detected = 0

    for cat_id, tech_list in categorized_results.items():
        if tech_list:
            cat_conf = int(sum(t["confidence"] for t in tech_list) / len(tech_list))
            categories_output[cat_id] = {
                "title": CATEGORIES[cat_id]["title"],
                "icon": CATEGORIES[cat_id]["icon"],
                "summary_key": CATEGORIES[cat_id]["summary_key"],
                "confidence": cat_conf,
                "technologies": tech_list
            }
            all_confidences.extend(t["confidence"] for t in tech_list)
            total_detected += len(tech_list)

    overall_confidence = int(sum(all_confidences) / len(all_confidences)) if all_confidences else 0

    final_payload = {
        "total_detected": total_detected,
        "overall_detection_confidence": overall_confidence,
        "categories": categories_output
    }

    # Store in cache
    if clean_domain:
        TECH_CACHE[clean_domain] = (now, final_payload)

    return final_payload
