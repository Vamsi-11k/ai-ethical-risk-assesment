const RULES = [
  {
    name: 'React',
    category: 'frontend',
    subcategory: 'JavaScript UI Library',
    html: [/data-reactroot/i, /data-reactid/i, /_reactListening/i, /__REACT_DEVTOOLS/i],
    scripts: [/react(?:\.production)?(?:\.min)?\.js/i, /\/static\/js\/[^"']*react/i],
    versionRegex: /react[/@]([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i,
    insight: 'Client-side UI library detected; ensure production builds strip development warnings and validate rendered inputs.'
  },
  {
    name: 'Next.js',
    category: 'frontend',
    subcategory: 'React Framework',
    html: [/__NEXT_DATA__/i, /\/_next\/static\//i],
    scripts: [/\/_next\/static\//i],
    headers: { 'x-powered-by': /Next\.js/i },
    versionRegex: /Next\.js\s+([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i,
    insight: 'Full-stack React framework detected; keep server actions and middleware dependencies patched.'
  },
  {
    name: 'Vue.js',
    category: 'frontend',
    subcategory: 'JavaScript Framework',
    html: [/data-v-[0-9a-f]{6,8}/i, /v-cloak/i],
    scripts: [/vue(?:\.runtime)?(?:\.min)?\.js/i],
    versionRegex: /vue[/@]([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i,
    insight: 'Progressive UI framework detected; avoid unsafe v-html bindings on untrusted inputs.'
  },
  {
    name: 'Angular',
    category: 'frontend',
    subcategory: 'JavaScript Framework',
    html: [/ng-version="/i, /_ngcontent-/i],
    scripts: [/angular(?:\.min)?\.js/i],
    versionRegex: /ng-version="([0-9]+\.[0-9]+(?:\.[0-9]+)?)"/i,
    insight: 'Angular framework detected; rely on built-in contextual escaping and strict CSP.'
  },
  {
    name: 'Tailwind CSS',
    category: 'frontend',
    subcategory: 'Utility CSS Framework',
    html: [/class="[^"]*(?:sm:|md:|lg:|bg-neutral-|text-neutral-|flex-col)[^"]*"/i],
    scripts: [/tailwindcss/i],
    insight: 'Utility-first styling framework detected.'
  },
  {
    name: 'jQuery',
    category: 'frontend',
    subcategory: 'JavaScript Library',
    scripts: [/jquery(?:-[0-9.]+)?(?:\.min)?\.js/i],
    versionRegex: /jquery[/-]([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i,
    insight: 'Verify jQuery is version 3.5+ to avoid legacy XSS and prototype pollution vulnerabilities.'
  },
  {
    name: 'Express.js',
    category: 'backend',
    subcategory: 'Node.js Web Framework',
    headers: { 'x-powered-by': /Express/i },
    insight: 'Consider disabling the X-Powered-By header via app.disable("x-powered-by") or Helmet.'
  },
  {
    name: 'PHP',
    category: 'backend',
    subcategory: 'Server Runtime',
    headers: { 'x-powered-by': /PHP/i },
    cookies: [/PHPSESSID/i],
    versionRegex: /PHP\/([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i,
    insight: 'PHP runtime signature exposed in response headers or session cookies.'
  },
  {
    name: 'ASP.NET',
    category: 'backend',
    subcategory: 'Microsoft Web Framework',
    headers: { 'x-powered-by': /ASP\.NET/i, 'x-aspnet-version': /.+/i },
    cookies: [/ASP\.NET_SessionId/i],
    insight: 'ASP.NET framework signature detected in headers or session cookies.'
  },
  {
    name: 'WordPress',
    category: 'cms',
    subcategory: 'Content Management System',
    html: [/\/wp-content\//i, /\/wp-includes\//i, /<meta[^>]+name="generator"[^>]+WordPress/i],
    versionRegex: /WordPress\s+([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i,
    insight: 'WordPress CMS detected; keep core, themes, and third-party plugins updated regularly.'
  },
  {
    name: 'Shopify',
    category: 'cms',
    subcategory: 'E-Commerce Platform',
    html: [/cdn\.shopify\.com/i, /Shopify\.theme/i],
    headers: { 'x-shopid': /.+/i },
    insight: 'Managed Shopify storefront infrastructure detected.'
  },
  {
    name: 'Nginx',
    category: 'web_server',
    subcategory: 'Web Server / Reverse Proxy',
    headers: { server: /nginx/i },
    versionRegex: /nginx\/([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i,
    insight: 'Nginx web server detected; hiding exact server version tokens is recommended.'
  },
  {
    name: 'Apache HTTP Server',
    category: 'web_server',
    subcategory: 'Web Server',
    headers: { server: /Apache/i },
    versionRegex: /Apache\/([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i,
    insight: 'Apache HTTP server detected; confirm ServerTokens is set to Prod in production.'
  },
  {
    name: 'Cloudflare',
    category: 'cdn_infrastructure',
    subcategory: 'CDN & Edge WAF',
    headers: { server: /cloudflare/i, 'cf-ray': /.+/i },
    cookies: [/__cf_bm/i, /cf_clearance/i],
    insight: 'Cloudflare edge network and DDoS/WAF protection detected.'
  },
  {
    name: 'Vercel',
    category: 'cdn_infrastructure',
    subcategory: 'Edge Deployment Platform',
    headers: { server: /Vercel/i, 'x-vercel-id': /.+/i },
    insight: 'Hosted on Vercel edge network with automated TLS termination.'
  },
  {
    name: 'AWS CloudFront',
    category: 'cdn_infrastructure',
    subcategory: 'CDN Distribution',
    headers: { via: /CloudFront/i, 'x-amz-cf-id': /.+/i },
    insight: 'Amazon CloudFront edge caching headers detected.'
  },
  {
    name: 'Google Analytics',
    category: 'analytics',
    subcategory: 'Web Telemetry',
    html: [/googletagmanager\.com\/gtag\/js/i, /google-analytics\.com\/analytics\.js/i],
    scripts: [/googletagmanager\.com/i, /google-analytics\.com/i],
    insight: 'Third-party analytics script detected; ensure clear cookie consent disclosures are active.'
  },
  {
    name: 'HSTS',
    category: 'security',
    subcategory: 'Transport Security Header',
    headers: { 'strict-transport-security': /.+/i },
    insight: 'HTTP Strict Transport Security (HSTS) enforces encrypted HTTPS connections.'
  },
  {
    name: 'Content Security Policy (CSP)',
    category: 'security',
    subcategory: 'XSS Mitigation Header',
    headers: { 'content-security-policy': /.+/i },
    insight: 'Content-Security-Policy header restricts unauthorized script execution.'
  },
  {
    name: 'Clickjacking Protection',
    category: 'security',
    subcategory: 'Frame Ancestor Header',
    headers: { 'x-frame-options': /.+/i },
    insight: 'X-Frame-Options header protects against UI redressing and clickjacking attacks.'
  }
];

function buildEmptyResult() {
  return {
    total_detected: 0,
    overall_detection_confidence: 0,
    categories: {}
  };
}

export async function detectTechStack(rawUrl) {
  let targetUrl = (rawUrl || '').trim();
  if (!targetUrl) return buildEmptyResult();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  let html = '';
  const headersMap = {};
  let cookieHeader = '';

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EthicalAI-Scanner/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });
    clearTimeout(timer);

    res.headers.forEach((val, key) => {
      headersMap[key.toLowerCase()] = val;
    });
    cookieHeader = headersMap['set-cookie'] || '';
    const text = await res.text();
    html = text.slice(0, 200000);
  } catch {
    return buildEmptyResult();
  }

  const scriptTags = html.match(/<script[^>]+src=["'][^"']+["']/gi) || [];
  const scriptSrcJoined = scriptTags.join('\n');
  const categories = {};
  let totalDetected = 0;
  let confidenceSum = 0;

  for (const rule of RULES) {
    const evidence = [];

    if (rule.headers) {
      for (const [hName, regex] of Object.entries(rule.headers)) {
        const hVal = headersMap[hName];
        if (hVal && regex.test(hVal)) {
          evidence.push(`HTTP header "${hName}: ${hVal.slice(0, 80)}" matched.`);
        }
      }
    }

    if (rule.cookies && cookieHeader) {
      for (const regex of rule.cookies) {
        if (regex.test(cookieHeader)) {
          evidence.push(`Response cookie matched pattern ${regex.source}.`);
        }
      }
    }

    if (rule.html) {
      for (const regex of rule.html) {
        if (regex.test(html)) {
          evidence.push(`HTML signature matched (${regex.source}).`);
        }
      }
    }

    if (rule.scripts && scriptSrcJoined) {
      for (const regex of rule.scripts) {
        if (regex.test(scriptSrcJoined)) {
          evidence.push(`Script source matched (${regex.source}).`);
        }
      }
    }

    if (evidence.length === 0) continue;

    let version = 'Version: Not detected';
    if (rule.versionRegex) {
      const combined = `${Object.values(headersMap).join(' ')} ${scriptSrcJoined} ${html.slice(0, 30000)}`;
      const vMatch = combined.match(rule.versionRegex);
      if (vMatch && vMatch[1]) {
        version = `v${vMatch[1]}`;
      }
    }

    const confidence = Math.min(98, 74 + evidence.length * 10);
    const securityStatus =
      rule.category === 'analytics'
        ? 'Recommendation'
        : rule.name === 'jQuery' || rule.name === 'PHP'
        ? 'Potential Concern'
        : 'Informational';

    if (!categories[rule.category]) {
      categories[rule.category] = { confidence: 0, technologies: [] };
    }

    categories[rule.category].technologies.push({
      name: rule.name,
      version,
      subcategory: rule.subcategory,
      confidence,
      evidence,
      security_status: securityStatus,
      security_insight: rule.insight
    });

    totalDetected += 1;
    confidenceSum += confidence;
  }

  for (const catKey of Object.keys(categories)) {
    const items = categories[catKey].technologies;
    const avg = Math.round(items.reduce((acc, item) => acc + item.confidence, 0) / items.length);
    categories[catKey].confidence = avg;
  }

  return {
    total_detected: totalDetected,
    overall_detection_confidence: totalDetected > 0 ? Math.round(confidenceSum / totalDetected) : 0,
    categories
  };
}
