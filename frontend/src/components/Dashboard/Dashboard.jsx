import { useState, useEffect } from "react";
import "./Dashboard.css";
import TechStackSection from "./TechStackSection";
import {
  FaShieldAlt, FaHistory, FaExclamationTriangle,
  FaUserSecret, FaEye, FaBalanceScale,
  FaBrain, FaFileAlt, FaSearch, FaArrowRight,
} from "react-icons/fa";

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

/* ── Scanning overlay ────────────────────────────────────── */
const SCAN_STEPS = [
  "resolving_domain",
  "checking_ssl_certificate",
  "auditing_privacy_policy",
  "analyzing_content_patterns",
  "scoring_ethical_indicators",
];

function ScanOverlay() {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setActiveStep(s => Math.min(s + 1, SCAN_STEPS.length - 1)), 600);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="scan-overlay">
      <div className="scan-spinner">
        <div className="scan-spinner-ring" />
        <div className="scan-spinner-ring" />
        <div className="scan-spinner-ring" />
      </div>
      <div className="scan-status-text">running_ethical_audit…</div>
      <div className="scan-progress-bar">
        <div className="scan-progress-fill" />
      </div>
      <div className="scan-steps">
        {SCAN_STEPS.map((s, i) => (
          <div
            key={s}
            className={`scan-step ${i < activeStep ? "done" : i === activeStep ? "active" : ""}`}
          >
            <div className="scan-step-dot" />
            {i < activeStep ? `✓ ${s}` : s}
          </div>
        ))}
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
function Dashboard({ user, scanUrl, isScanning: propScanning, onScanComplete }) {
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

  // Trigger when parent passes a URL to scan
  useEffect(() => {
    if (scanUrl) runAnalysis(scanUrl);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanUrl]);

  async function runAnalysis(targetUrl) {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const token   = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res  = await fetch("/api/analyze", {
        method: "POST", headers,
        body: JSON.stringify({ url: targetUrl }),
      });
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
      setError(err.message || "Unexpected error.");
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

      {/* ── Scanning ── */}
      {isScanning && <ScanOverlay />}

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
