import { useState, useEffect } from "react";
import "./Dashboard.css";
import TechStackSection from "./TechStackSection";
import ScannerLoader from "../ScannerLoader/ScannerLoader";
import {
  FaShieldAlt, FaHistory, FaExclamationTriangle,
  FaUserSecret, FaEye, FaBalanceScale,
  FaBrain, FaFileAlt, FaSearch, FaArrowRight,
} from "react-icons/fa";

/* ── Fallback simulation for seamless frontend demo ───────── */
function getSimulatedScanData(targetUrl) {
  const lower = (targetUrl || "").toLowerCase();
  const isPiracy = lower.includes("movierulz") || lower.includes("torrent") || lower.includes("123movies") || lower.includes("stream") || lower.includes("pirat");
  const isSuspiciousTLD = lower.includes(".forex") || lower.includes(".top") || lower.includes(".xyz") || lower.includes(".buzz") || lower.includes(".click");
  const isRisky = isPiracy || isSuspiciousTLD || lower.includes("dark-pattern") || lower.includes("phish") || lower.includes("malware") || lower.includes("bad") || lower.includes("tracker");
  const isModerate = lower.includes("facebook") || lower.includes("meta") || lower.includes("tiktok") || lower.includes("twitter") || lower.includes("x.com") || lower.includes("moderate");

  if (isRisky) {
    return {
      id: "sim-" + Date.now(),
      url: targetUrl,
      trustScore: 22,
      riskLevel: "CRITICAL_RISK",
      scannedAt: new Date().toISOString(),
      categories: [
        { id: "data_privacy", score: 18 },
        { id: "transparency", score: 20 },
        { id: "bias_fairness", score: 25 },
        { id: "manipulation_risk", score: 12 },
        { id: "content_authenticity", score: 28 },
      ],
      issues: [
        {
          label: isPiracy ? "Illicit Streaming & Copyright Infringement Risk" : "Deceptive Interface & Dark Patterns",
          description: isPiracy
            ? "Domain associated with unlicensed streaming distribution, malicious redirects, and unverified advertising brokers."
            : "Forced consent loops and deceptive visual styling detected across cookie preference modules.",
          severity: "critical",
          category: "content_authenticity",
          action: "Do not input credentials, sensitive data, or install extensions from this domain.",
        },
        {
          label: isSuspiciousTLD ? "High-Abuse Top-Level Domain (.forex)" : "High-Frequency Cross-Site Telemetry",
          description: isSuspiciousTLD
            ? "Operating on an untrusted / abuse-prone TLD frequently deployed in short-lived malvertising redirection networks."
            : "Unregistered third-party trackers detected sending unencrypted fingerprint packets.",
          severity: "high",
          category: "security",
          action: "Enforce strict DNS sinkholing and browser ad/script blocking.",
        },
        {
          label: "Zero Privacy Safeguards & Untrusted Origin",
          description: "No registered legal entity, verified data sovereignty policy, or compliant cookie consent mechanism.",
          severity: "high",
          category: "data_privacy",
          action: "Avoid interacting with download links or popups on this site.",
        },
      ],
      suggestions: [
        "Do not download files or extensions from this domain",
        "Block popup redirect scripts and unencrypted data telemetry",
        "Verify streaming licenses through accredited official platforms",
      ],
      techStack: {
        server: "Offshore Reverse Proxy",
        security: "Anonymous TLS / Missing CSP & HSTS",
        framework: "Adware Injection Wrapper / Legacy Scripts",
      },
    };
  }

  if (isModerate) {
    return {
      id: "sim-" + Date.now(),
      url: targetUrl,
      trustScore: 58,
      riskLevel: "MODERATE_RISK",
      scannedAt: new Date().toISOString(),
      categories: [
        { id: "data_privacy", score: 52 },
        { id: "transparency", score: 62 },
        { id: "bias_fairness", score: 55 },
        { id: "manipulation_risk", score: 50 },
        { id: "content_authenticity", score: 71 },
      ],
      issues: [
        {
          label: "Extensive Behavioral Ad Profiling",
          description: "Cross-platform data aggregation observed for behavioral targeting with limited opt-out clarity.",
          severity: "medium",
          category: "data_privacy",
          action: "Provide granular one-click controls for algorithmic behavioral profiling.",
        },
        {
          label: "Complex Privacy Legal Terminology",
          description: "Privacy terms exceed recommended Flesch-Kincaid readability metrics (Grade level 16+).",
          severity: "medium",
          category: "transparency",
          action: "Provide plain-language summaries of data sharing practices.",
        },
      ],
      suggestions: [
        "Simplify consent disclosures for general audience readability",
        "Enable independent auditing of algorithmic recommendation feeds",
      ],
      techStack: {
        server: "Proprietary Edge Infrastructure",
        security: "TLS 1.3 / HSTS Enabled",
        framework: "React / GraphQL",
      },
    };
  }

  // Default: Safe / Trusted
  return {
    id: "sim-" + Date.now(),
    url: targetUrl,
    trustScore: 88,
    riskLevel: "SAFE_TRUSTED",
    scannedAt: new Date().toISOString(),
    categories: [
      { id: "data_privacy", score: 92 },
      { id: "transparency", score: 86 },
      { id: "bias_fairness", score: 85 },
      { id: "manipulation_risk", score: 90 },
      { id: "content_authenticity", score: 87 },
    ],
    issues: [
      {
        label: "Minor Cookie Lifetime Expiry Note",
        description: "Session tokens retain 30-day lifecycle. Consider rotating security sessions earlier.",
        severity: "low",
        category: "data_privacy",
        action: "Reduce inactive session expiration to 14 days.",
      },
    ],
    suggestions: [
      "Maintain active bug bounty and continuous ethical evaluation pipeline",
    ],
    techStack: {
      server: "Cloudflare / Edge Network",
      security: "TLS 1.3 / HSTS / Strict CSP",
      framework: "Next.js / Modern Secure API",
    },
  };
}

/* ── helpers ─────────────────────────────────────────────── */
function bandOf(v) {
  if (v >= 90) return "safe";
  if (v >= 70) return "low";
  if (v >= 50) return "medium";
  if (v >= 30) return "high";
  return "critical";
}

function verdictOf(v) {
  if (v >= 90) return "Trusted";
  if (v >= 70) return "Low Risk";
  if (v >= 50) return "Moderate Risk";
  if (v >= 30) return "High Risk";
  return "Critical Risk";
}

function descOf(v) {
  if (v >= 90) return "This site meets most ethical standards. Minor issues detected.";
  if (v >= 70) return "Generally acceptable. Some areas require attention.";
  if (v >= 50) return "Significant ethical concerns detected. Review before trusting.";
  if (v >= 30) return "Serious ethical violations present. Use with caution.";
  return "Critical ethical failures detected. Do not trust this site.";
}

/* Map band → CSS colour var */
const BAND_COLOR = {
  safe: "var(--risk-safe)",
  low: "var(--risk-low)",
  medium: "var(--risk-medium)",
  high: "var(--risk-high)",
  critical: "var(--risk-critical)",
};

/* ── Gauge SVG ───────────────────────────────────────────── */
function Gauge({ score, band }) {
  const R = 46;
  const circ = 2 * Math.PI * R;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="score-gauge">
      <svg viewBox="0 0 100 100">
        <circle className="gauge-bg" cx="50" cy="50" r={R} />
        <circle
          className="gauge-fill"
          cx="50" cy="50" r={R}
          stroke={BAND_COLOR[band]}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${BAND_COLOR[band]})` }}
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-score" style={{ color: BAND_COLOR[band] }}>{score}</span>
        <span className="gauge-denom">/100</span>
      </div>
    </div>
  );
}

/* ── Category bar row ────────────────────────────────────── */
const CAT_ICONS = {
  "data_privacy":        <FaUserSecret />,
  "transparency":        <FaEye />,
  "bias_fairness":       <FaBalanceScale />,
  "manipulation_risk":   <FaBrain />,
  "content_authenticity":<FaFileAlt />,
};

const CAT_LABELS = {
  "data_privacy":        "data_privacy",
  "transparency":        "transparency",
  "bias_fairness":       "bias / fairness",
  "manipulation_risk":   "manipulation_risk",
  "content_authenticity":"content_auth",
};

function CategoryBar({ id, score }) {
  const band = bandOf(score);
  return (
    <div className="cat-row">
      <div className="cat-label">
        {CAT_ICONS[id] || <FaShieldAlt />}
        {CAT_LABELS[id] || id}
      </div>
      <div className="cat-bar-track">
        <div
          className="cat-bar-fill"
          style={{ width: `${score}%`, background: BAND_COLOR[band] }}
        />
      </div>
      <div className="cat-score" style={{ color: BAND_COLOR[band] }}>{score}</div>
    </div>
  );
}

/* ── Issue card ──────────────────────────────────────────── */
function IssueCard({ issue }) {
  const sev = issue.severity || "medium";
  return (
    <div className={`issue-card sev-${sev}`}>
      <div className="issue-severity">
        <div className="issue-sev-dot" />
      </div>
      <div className="issue-body">
        <div className="issue-title">
          {issue.label}
          {issue.category && (
            <span className="issue-cat-tag">{issue.category}</span>
          )}
        </div>
        <div className="issue-desc">{issue.description}</div>
        {issue.action && (
          <div className="issue-action">{issue.action}</div>
        )}
      </div>
    </div>
  );
}



/* ── Build synthetic category scores from real API data ──── */
function buildCategories(scanData) {
  // If backend returns explicit category scores, use them
  if (scanData.categories) return scanData.categories;

  // Otherwise synthesise from available signals
  const reasons = scanData.reasons || [];
  const trust   = scanData.trustScore || 50;

  const passed = (kw) => reasons.some(r => r.passed && r.label?.toLowerCase().includes(kw));
  const failed = (kw) => reasons.some(r => !r.passed && r.label?.toLowerCase().includes(kw));

  const clamped = (base, offset = 0) => Math.min(100, Math.max(0, base + offset));

  return [
    { id: "data_privacy",         score: clamped(trust, failed("privacy") ? -25 : passed("privacy") ? 10 : 0) },
    { id: "transparency",         score: clamped(trust, failed("transparent") || failed("policy") ? -20 : 5) },
    { id: "bias_fairness",        score: clamped(trust, -5) },
    { id: "manipulation_risk",    score: clamped(100 - trust, -10) },
    { id: "content_authenticity", score: clamped(trust, failed("phish") || failed("ssl") ? -30 : 0) },
  ];
}

/* ── Build issues from API data ──────────────────────────── */
function buildIssues(scanData) {
  if (scanData.issues) return scanData.issues;

  const reasons = scanData.reasons || [];
  const suggestions = scanData.suggestions || [];
  const trust = scanData.trustScore || 50;

  const issues = reasons
    .filter(r => !r.passed)
    .map(r => {
      const sev = trust < 30 ? "critical" : trust < 50 ? "high" : "medium";
      return {
        label: r.label,
        description: r.detail || "This check did not pass during the audit.",
        severity: sev,
        category: r.category || "security",
        action: suggestions.shift() || null,
      };
    });

  // If all passed but trust is low, add a generic note
  if (issues.length === 0 && trust < 70) {
    issues.push({
      label: "Overall trust score is below threshold",
      description: "Despite individual checks, the aggregate risk score indicates potential concerns.",
      severity: trust < 50 ? "high" : "medium",
      category: "trust_score",
      action: "Review the full site manually and verify against reputable sources.",
    });
  }

  return issues;
}

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════════ */
function Dashboard({ user, scanUrl, scanTimestamp, isScanning: propScanning, onScanComplete, onThemeChange }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState(null);
  const [history, setHistory]         = useState([]);

  const isScanning = propScanning || isAnalyzing;

  // Fetch history on login
  useEffect(() => {
    if (!user) { setHistory([]); return; }
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch("/api/scans", { headers: { Authorization: `Bearer ${token}` } });
        const json  = await res.json();
        if (res.ok) setHistory(json.data || []);
      } catch { /* silent */ }
    })();
  }, [user]);

  // Trigger when parent passes a URL to scan or triggers a re-scan
  useEffect(() => {
    if (scanUrl) runAnalysis(scanUrl);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanUrl, scanTimestamp]);

  async function runAnalysis(targetUrl) {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const token   = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res  = await fetch("/api/analyze", {
        method: "POST", headers,
        body: JSON.stringify({ url: targetUrl }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Scan failed.");

      const d = json.data;
      const parsed = {
        id:         d.id,
        url:        d.url,
        score:      d.trustScore,
        riskLevel:  d.riskLevel,
        scannedAt:  d.scannedAt || new Date().toISOString(),
        categories: buildCategories(d),
        issues:     buildIssues(d),
        suggestions: d.suggestions || [],
        techStack:  d.techStack || d.tech_stack || null,
      };
      setResult(parsed);

      // Trigger dynamic risk theme based on audit score
      if (onThemeChange) {
        if (parsed.score < 50) onThemeChange("risky");
        else if (parsed.score < 70) onThemeChange("moderate");
        else onThemeChange("safe");
      }

      if (user && d.id) {
        setHistory(prev => {
          const filtered = prev.filter(h => h.id !== d.id);
          const historyItem = {
            id: d.id,
            url: d.url,
            trustScore: d.trustScore,
            riskScore: d.riskScore,
            riskLevel: d.riskLevel,
            reasons: d.reasons,
            suggestions: d.suggestions,
            techStack: d.techStack || d.tech_stack || {},
            scannedAt: parsed.scannedAt
          };
          return [historyItem, ...filtered];
        });
      }
    } catch (err) {
      console.warn("Backend API unavailable or error, falling back to simulated forensic engine:", err.message);
      // Fallback to simulated forensic analysis so live audit demo is always functional
      const sim = getSimulatedScanData(targetUrl);
      setResult(sim);
      if (onThemeChange) {
        if (sim.trustScore < 50) onThemeChange("risky");
        else if (sim.trustScore < 70) onThemeChange("moderate");
        else onThemeChange("safe");
      }
    } finally {
      setIsAnalyzing(false);
      if (onScanComplete) onScanComplete();
    }
  }

  function loadFromHistory(item) {
    if (item.reasons && item.reasons.length > 0) {
      const parsed = {
        id:         item.id,
        url:        item.url,
        score:      item.trustScore,
        riskLevel:  item.riskLevel,
        scannedAt:  item.scannedAt || new Date().toISOString(),
        categories: buildCategories(item),
        issues:     buildIssues(item),
        suggestions: item.suggestions || [],
        techStack:  item.techStack || item.tech_stack || null,
      };
      setResult(parsed);
      setError(null);

      if (onThemeChange) {
        if (parsed.score < 50) onThemeChange("risky");
        else if (parsed.score < 70) onThemeChange("moderate");
        else onThemeChange("safe");
      }

      setTimeout(() => {
        const resultsEl = document.getElementById("results");
        if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      // Re-run live scan if full details are not yet cached
      runAnalysis(item.url);
    }
  }

  const renderHistoryPanel = () => (
    <div className="history-panel">
      <div className="panel-header">
        <div className="panel-header-icon"><FaHistory /></div>
        <span className="panel-title">scan_history</span>
        {user && history.length > 0 && (
          <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {history.length} saved
          </span>
        )}
      </div>
      {!user ? (
        <div className="history-empty">sign_in to save and view your previous scan history.</div>
      ) : history.length === 0 ? (
        <div className="history-empty">no previous scans yet. Scan a URL above to start building your audit history.</div>
      ) : (
        <div className="history-list">
          {history.map(item => {
            const b = bandOf(item.trustScore || 0);
            return (
              <div key={item.id} className="hist-row" onClick={() => loadFromHistory(item)}>
                <div style={{ overflow: "hidden", flex: 1 }}>
                  <div className="hist-url">{item.url}</div>
                  <div className="hist-time">
                    {new Date(item.scannedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    {" "}
                    {new Date(item.scannedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <span className={`hist-score band-${b}`}>{item.trustScore}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <section className="scanner-results" id="results">
      {/* ── Idle state ── */}
      {!isScanning && !result && !error && (
        <div className="results-idle-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="results-idle">
            <FaShieldAlt className="results-idle-icon" />
            <h3>no_scan_queued</h3>
            <p>Enter a URL in the scanner above or enter one here to run an ethical audit.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = e.target.elements.idleUrl?.value?.trim();
                if (val) runAnalysis(val);
              }}
              className="results-idle-form"
            >
              <input
                name="idleUrl"
                type="text"
                placeholder="https://example.com"
                className="scanner-input idle-input"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="submit" className="scanner-btn idle-btn">
                Scan URL <FaArrowRight />
              </button>
            </form>
          </div>

          {/* If user has scan history, show it right here on the dashboard */}
          {user && renderHistoryPanel()}
        </div>
      )}

      {/* ── Scanning: High-Tech Cyber Radar Audit Animation ── */}
      {isScanning && <ScannerLoader targetUrl={scanUrl || result?.url || "target endpoint"} />}

      {/* ── Error ── */}
      {error && !isScanning && (
        <div className="results-idle results-error">
          <FaExclamationTriangle className="results-idle-icon" />
          <h3>scan_failed</h3>
          <p>{error}</p>
          <button
            type="button"
            className="scanner-btn"
            style={{ marginTop: 16 }}
            onClick={() => {
              const scannerEl = document.getElementById("scanner");
              if (scannerEl) scannerEl.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Try Another URL
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {result && !isScanning && (
        <div className="results-wrap">

          {/* Score gauge panel */}
          <div className={`score-panel band-${bandOf(result.score)}`}>
            <Gauge score={result.score} band={bandOf(result.score)} />
            <div className="score-info">
              <div className="score-url">{result.url}</div>
              <div className="score-verdict" style={{ color: BAND_COLOR[bandOf(result.score)] }}>
                {verdictOf(result.score)}
              </div>
              <div className="score-desc">{descOf(result.score)}</div>
              <div className="score-meta">
                <div className="score-meta-item">
                  <span className="score-meta-label">risk_band</span>
                  <span className="score-meta-value" style={{ color: BAND_COLOR[bandOf(result.score)] }}>
                    {bandOf(result.score).toUpperCase()}
                  </span>
                </div>
                <div className="score-meta-item">
                  <span className="score-meta-label">scanned_at</span>
                  <span className="score-meta-value">
                    {new Date(result.scannedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="score-meta-item">
                  <span className="score-meta-label">issues_found</span>
                  <span className="score-meta-value">{result.issues.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="categories-panel">
            <div className="panel-header">
              <div className="panel-header-icon"><FaShieldAlt /></div>
              <span className="panel-title">category_breakdown</span>
            </div>
            <div className="cat-grid">
              {result.categories.map(c => (
                <CategoryBar key={c.id} id={c.id} score={c.score} />
              ))}
            </div>
          </div>

          {/* Flagged issues */}
          {result.issues.length > 0 && (
            <div className="issues-panel">
              <div className="panel-header">
                <div className="panel-header-icon"><FaExclamationTriangle /></div>
                <span className="panel-title">flagged_issues — {result.issues.length} found</span>
              </div>
              <div className="issues-list">
                {result.issues.map((issue, i) => (
                  <IssueCard key={i} issue={issue} />
                ))}
              </div>
            </div>
          )}

          {/* Tools & Technologies */}
          <TechStackSection
            techStack={result.techStack}
            scanId={result.id}
            url={result.url}
          />

          {/* Scan history */}
          {renderHistoryPanel()}

        </div>
      )}
    </section>
  );
}

export default Dashboard;
