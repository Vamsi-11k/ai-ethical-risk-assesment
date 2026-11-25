import { useState, useEffect, useCallback } from "react";
import TechStackSection from "./TechStackSection";
import ScannerLoader from "../ScannerLoader/ScannerLoader";
import {
  FaShieldAlt,
  FaHistory,
  FaExclamationTriangle,
  FaUserSecret,
  FaEye,
  FaBalanceScale,
  FaBrain,
  FaFileAlt,
  FaArrowRight,
} from "react-icons/fa";

function getSimulatedScanData(targetUrl) {
  const lower = (targetUrl || "").toLowerCase();
  const isPiracy =
    lower.includes("movierulz") ||
    lower.includes("torrent") ||
    lower.includes("123movies") ||
    lower.includes("stream") ||
    lower.includes("pirat");
  const isSuspiciousTLD =
    lower.includes(".forex") ||
    lower.includes(".top") ||
    lower.includes(".xyz") ||
    lower.includes(".buzz") ||
    lower.includes(".click");
  const isRisky =
    isPiracy ||
    isSuspiciousTLD ||
    lower.includes("dark-pattern") ||
    lower.includes("phish") ||
    lower.includes("malware") ||
    lower.includes("bad") ||
    lower.includes("tracker");
  const isModerate =
    lower.includes("facebook") ||
    lower.includes("meta") ||
    lower.includes("tiktok") ||
    lower.includes("twitter") ||
    lower.includes("x.com") ||
    lower.includes("moderate");

  if (isRisky) {
    return {
      id: "sim-" + Date.now(),
      url: targetUrl,
      score: 22,
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
          label: isPiracy
            ? "Illicit Streaming & Copyright Infringement Risk"
            : "Deceptive Interface & Dark Patterns",
          description: isPiracy
            ? "Domain associated with unlicensed streaming distribution, malicious redirects, and unverified advertising brokers."
            : "Forced consent loops and deceptive visual styling detected across cookie preference modules.",
          severity: "critical",
          category: "content_authenticity",
          action: "Do not input credentials, sensitive data, or install extensions from this domain.",
        },
        {
          label: isSuspiciousTLD
            ? "High-Abuse Top-Level Domain"
            : "High-Frequency Cross-Site Telemetry",
          description: isSuspiciousTLD
            ? "Operating on an untrusted or abuse-prone TLD frequently deployed in short-lived malvertising redirection networks."
            : "Unregistered third-party trackers detected sending unencrypted fingerprint packets.",
          severity: "high",
          category: "security",
          action: "Enforce strict DNS sinkholing and browser script blocking.",
        },
        {
          label: "Zero Privacy Safeguards & Untrusted Origin",
          description:
            "No registered legal entity, verified data sovereignty policy, or compliant cookie consent mechanism.",
          severity: "high",
          category: "data_privacy",
          action: "Avoid interacting with download links or popups on this site.",
        },
      ],
      suggestions: [
        "Do not download files or extensions from this domain",
        "Block popup redirect scripts and unencrypted data telemetry",
        "Verify licenses through accredited official platforms",
      ],
      techStack: null,
    };
  }

  if (isModerate) {
    return {
      id: "sim-" + Date.now(),
      url: targetUrl,
      score: 58,
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
          description:
            "Cross-platform data aggregation observed for behavioral targeting with limited opt-out clarity.",
          severity: "medium",
          category: "data_privacy",
          action: "Provide granular one-click controls for algorithmic behavioral profiling.",
        },
        {
          label: "Complex Privacy Legal Terminology",
          description:
            "Privacy terms exceed recommended readability metrics (Grade level 16+).",
          severity: "medium",
          category: "transparency",
          action: "Provide plain-language summaries of data sharing practices.",
        },
      ],
      suggestions: [
        "Simplify consent disclosures for general audience readability",
        "Enable independent auditing of algorithmic recommendation feeds",
      ],
      techStack: null,
    };
  }

  return {
    id: "sim-" + Date.now(),
    url: targetUrl,
    score: 88,
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
        description:
          "Session tokens retain 30-day lifecycle. Consider rotating security sessions earlier.",
        severity: "low",
        category: "data_privacy",
        action: "Reduce inactive session expiration to 14 days.",
      },
    ],
    suggestions: ["Maintain active bug bounty and continuous ethical evaluation pipeline"],
    techStack: null,
  };
}

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

function themeOf(v) {
  if (v >= 70) return "green";
  if (v >= 50) return "yellow";
  return "red";
}

const RISK_THEMES = {
  green: {
    scorePanel:
      "border-emerald-400 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.28)]",
    sectionContainer:
      "border-emerald-300 bg-emerald-50/35 shadow-[0_12px_32px_-16px_rgba(16,185,129,0.18)]",
    headerBorder: "border-emerald-200",
    headerIcon: "bg-emerald-600 text-white",
    verdictText: "text-emerald-900",
    badge: "bg-emerald-600 text-white shadow-sm",
    stroke: "#22c55e",
    glow: "rgba(34, 197, 94, 0.75)",
    brightText: "#4ade80",
    barFill: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.45)]",
    scoreChip: "text-emerald-700",
    metaDivider: "border-emerald-200",
    countPill: "bg-emerald-100 text-emerald-900 border border-emerald-300",
  },
  yellow: {
    scorePanel:
      "border-amber-400 bg-gradient-to-br from-amber-50 via-white to-yellow-100/75 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.28)]",
    sectionContainer:
      "border-amber-300 bg-amber-50/40 shadow-[0_12px_32px_-16px_rgba(245,158,11,0.18)]",
    headerBorder: "border-amber-200",
    headerIcon: "bg-amber-500 text-neutral-950",
    verdictText: "text-amber-950",
    badge: "bg-amber-400 text-neutral-950 shadow-sm",
    stroke: "#facc15",
    glow: "rgba(250, 204, 21, 0.8)",
    brightText: "#fde047",
    barFill: "bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.45)]",
    scoreChip: "text-amber-700",
    metaDivider: "border-amber-200",
    countPill: "bg-amber-100 text-amber-950 border border-amber-300",
  },
  red: {
    scorePanel:
      "border-red-400 bg-gradient-to-br from-red-50 via-white to-rose-100/75 shadow-[0_20px_50px_-15px_rgba(239,68,68,0.3)]",
    sectionContainer:
      "border-red-300 bg-red-50/40 shadow-[0_12px_32px_-16px_rgba(239,68,68,0.2)]",
    headerBorder: "border-red-200",
    headerIcon: "bg-red-600 text-white",
    verdictText: "text-red-950",
    badge: "bg-red-600 text-white shadow-sm",
    stroke: "#ef4444",
    glow: "rgba(239, 68, 68, 0.8)",
    brightText: "#f87171",
    barFill: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]",
    scoreChip: "text-red-700",
    metaDivider: "border-red-200",
    countPill: "bg-red-100 text-red-900 border border-red-300",
  },
};

function Gauge({ score, theme }) {
  const R = 43;
  const circ = 2 * Math.PI * R;
  const offset = circ - (score / 100) * circ;
  const palette = RISK_THEMES[theme];

  return (
    <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-neutral-950 p-2 shadow-xl sm:h-40 sm:w-40">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 overflow-visible">
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="#27272a"
          strokeWidth="7.5"
        />
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke={palette.stroke}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${palette.glow})` }}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono text-4xl font-extrabold tracking-tight tabular-nums sm:text-[2.75rem]"
          style={{
            color: palette.brightText,
            textShadow: `0 0 18px ${palette.glow}`,
          }}
        >
          {score}
        </span>
        <span className="font-mono text-xs font-semibold text-neutral-300">/100</span>
      </div>
    </div>
  );
}

const CAT_ICONS = {
  data_privacy: <FaUserSecret />,
  transparency: <FaEye />,
  bias_fairness: <FaBalanceScale />,
  manipulation_risk: <FaBrain />,
  content_authenticity: <FaFileAlt />,
};

const CAT_LABELS = {
  data_privacy: "Data Privacy",
  transparency: "Transparency",
  bias_fairness: "Bias & Fairness",
  manipulation_risk: "Manipulation Risk",
  content_authenticity: "Content Authenticity",
};

function CategoryBar({ id, score }) {
  const palette = RISK_THEMES[themeOf(score)];

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white/95 p-3.5 transition-colors duration-200 hover:border-neutral-300 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-[180px] items-center gap-2.5 text-sm font-semibold text-neutral-950">
        <span className={palette.scoreChip}>{CAT_ICONS[id] || <FaShieldAlt />}</span>
        <span>{CAT_LABELS[id] || id}</span>
      </div>

      <div className="flex flex-1 items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${palette.barFill}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span
          className={`w-10 text-right font-mono text-sm font-extrabold tabular-nums ${palette.scoreChip}`}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

function IssueCard({ issue }) {
  const sev = issue.severity || "medium";
  const sevStyles =
    sev === "critical" || sev === "high"
      ? {
          card: "border-red-300 bg-white hover:border-red-400",
          badge: "bg-red-600 text-white",
          action: "border-red-200 bg-red-50/70 text-red-950",
        }
      : sev === "medium"
      ? {
          card: "border-amber-300 bg-white hover:border-amber-400",
          badge: "bg-amber-400 text-neutral-950",
          action: "border-amber-200 bg-amber-50/70 text-amber-950",
        }
      : {
          card: "border-emerald-300 bg-white hover:border-emerald-400",
          badge: "bg-emerald-600 text-white",
          action: "border-emerald-200 bg-emerald-50/70 text-emerald-950",
        };

  return (
    <div className={`rounded-2xl border p-4 transition-all duration-200 sm:p-5 ${sevStyles.card}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${sevStyles.badge}`}
          >
            {sev}
          </span>
          <h4 className="text-sm font-bold text-neutral-950 sm:text-[15px]">
            {issue.label}
          </h4>
        </div>
        {issue.category && (
          <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-medium text-neutral-800">
            {issue.category}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-neutral-800 sm:text-sm">
        {issue.description}
      </p>

      {issue.action && (
        <div className={`mt-3 rounded-xl border px-3.5 py-2.5 text-xs ${sevStyles.action}`}>
          <span className="font-mono font-bold uppercase tracking-wider">Action: </span>
          <span>{issue.action}</span>
        </div>
      )}
    </div>
  );
}

function buildCategories(scanData) {
  if (scanData.categories) return scanData.categories;

  const reasons = scanData.reasons || [];
  const trust = scanData.trustScore || 50;

  const passed = (kw) => reasons.some((r) => r.passed && r.label?.toLowerCase().includes(kw));
  const failed = (kw) => reasons.some((r) => !r.passed && r.label?.toLowerCase().includes(kw));
  const clamped = (base, offset = 0) => Math.min(100, Math.max(0, base + offset));

  return [
    { id: "data_privacy", score: clamped(trust, failed("privacy") ? -25 : passed("privacy") ? 10 : 0) },
    { id: "transparency", score: clamped(trust, failed("transparent") || failed("policy") ? -20 : 5) },
    { id: "bias_fairness", score: clamped(trust, -5) },
    { id: "manipulation_risk", score: clamped(100 - trust, -10) },
    { id: "content_authenticity", score: clamped(trust, failed("phish") || failed("ssl") ? -30 : 0) },
  ];
}

function buildIssues(scanData) {
  if (scanData.issues) return scanData.issues;

  const reasons = scanData.reasons || [];
  const suggestions = [...(scanData.suggestions || [])];
  const trust = scanData.trustScore || 50;

  const issues = reasons
    .filter((r) => !r.passed)
    .map((r) => {
      const sev = trust < 30 ? "critical" : trust < 50 ? "high" : "medium";
      return {
        label: r.label,
        description: r.detail || "This check did not pass during the audit.",
        severity: sev,
        category: r.category || "security",
        action: suggestions.shift() || null,
      };
    });

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

function Dashboard({
  user,
  scanUrl,
  scanTimestamp,
  isScanning: propScanning,
  onScanComplete,
  onThemeChange,
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const isScanning = propScanning || isAnalyzing;
  const visibleHistory = user ? history : [];

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/scans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!cancelled && res.ok) setHistory(json.data || []);
      } catch {
        if (!cancelled) setHistory([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const runAnalysis = useCallback(
    async (targetUrl) => {
      setIsAnalyzing(true);
      setResult(null);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers,
          body: JSON.stringify({ url: targetUrl }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Scan failed.");

        const d = json.data;
        const parsed = {
          id: d.id,
          url: d.url,
          score: d.trustScore,
          riskLevel: d.riskLevel,
          scannedAt: d.scannedAt || new Date().toISOString(),
          categories: buildCategories(d),
          issues: buildIssues(d),
          suggestions: d.suggestions || [],
          techStack: d.techStack || d.tech_stack || null,
        };
        setResult(parsed);

        if (onThemeChange) {
          if (parsed.score < 50) onThemeChange("risky");
          else if (parsed.score < 70) onThemeChange("moderate");
          else onThemeChange("safe");
        }

        if (user && d.id) {
          setHistory((prev) => {
            const filtered = prev.filter((h) => h.id !== d.id);
            const historyItem = {
              id: d.id,
              url: d.url,
              trustScore: d.trustScore,
              riskScore: d.riskScore,
              riskLevel: d.riskLevel,
              reasons: d.reasons,
              suggestions: d.suggestions,
              techStack: d.techStack || d.tech_stack || {},
              scannedAt: parsed.scannedAt,
            };
            return [historyItem, ...filtered];
          });
        }
      } catch {
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
    },
    [user, onScanComplete, onThemeChange]
  );

  useEffect(() => {
    if (!scanUrl) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) runAnalysis(scanUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [scanUrl, scanTimestamp, runAnalysis]);

  function loadFromHistory(item) {
    if (item.reasons && item.reasons.length > 0) {
      const parsed = {
        id: item.id,
        url: item.url,
        score: item.trustScore,
        riskLevel: item.riskLevel,
        scannedAt: item.scannedAt || new Date().toISOString(),
        categories: buildCategories(item),
        issues: buildIssues(item),
        suggestions: item.suggestions || [],
        techStack: item.techStack || item.tech_stack || null,
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
      runAnalysis(item.url);
    }
  }

  const renderHistoryPanel = () => (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-xs text-white">
            <FaHistory />
          </div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-950">
            Scan History
          </span>
        </div>
        {user && visibleHistory.length > 0 && (
          <span className="font-mono text-[11px] font-medium text-neutral-700">
            {visibleHistory.length} saved
          </span>
        )}
      </div>

      {!user ? (
        <p className="py-4 text-center text-sm font-medium text-neutral-700">
          Sign in to save and review your audit history across sessions.
        </p>
      ) : visibleHistory.length === 0 ? (
        <p className="py-4 text-center text-sm font-medium text-neutral-700">
          No previous scans yet. Run a URL audit above to build your history.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleHistory.map((item) => {
            const palette = RISK_THEMES[themeOf(item.trustScore || 0)];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => loadFromHistory(item)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 text-left transition-all duration-200 hover:border-black hover:bg-white"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-neutral-950">
                    {item.url}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] font-medium text-neutral-700">
                    {new Date(item.scannedAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(item.scannedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 font-mono text-xs font-bold tabular-nums ${palette.badge}`}
                >
                  {item.trustScore}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const activeTheme = result ? themeOf(result.score) : "green";
  const activePalette = RISK_THEMES[activeTheme];

  return (
    <section className="flex flex-col gap-6" id="results">
      {!isScanning && !result && !error && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center rounded-3xl border border-neutral-200 bg-white px-5 py-12 text-center sm:px-10 sm:py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-xl text-white">
              <FaShieldAlt />
            </div>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-neutral-950">
              No Audit Queued
            </h3>
            <p className="mt-2 max-w-md text-sm font-medium text-neutral-800">
              Enter a URL in the console above or launch a quick evaluation below.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = e.target.elements.idleUrl?.value?.trim();
                if (val) runAnalysis(val);
              }}
              className="mt-6 flex w-full max-w-lg flex-col gap-2 sm:flex-row"
            >
              <input
                name="idleUrl"
                type="text"
                placeholder="https://example.com"
                autoComplete="off"
                spellCheck={false}
                className="min-h-[46px] flex-1 rounded-xl border border-neutral-300 bg-neutral-50 px-4 text-sm text-neutral-950 placeholder:text-neutral-500 transition-colors focus:border-black focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="btn-black group min-h-[46px] rounded-xl px-5 py-3 text-sm"
              >
                <span>Scan URL</span>
                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </div>

          {user && renderHistoryPanel()}
        </div>
      )}

      {isScanning && <ScannerLoader targetUrl={scanUrl || result?.url || "target endpoint"} />}

      {error && !isScanning && (
        <div className="flex flex-col items-center rounded-3xl border border-red-300 bg-red-50/60 px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-lg text-white">
            <FaExclamationTriangle />
          </div>
          <h3 className="mt-4 text-lg font-bold text-neutral-950">Scan Failed</h3>
          <p className="mt-1.5 max-w-md text-sm font-medium text-neutral-800">{error}</p>
          <button
            type="button"
            onClick={() => {
              const scannerEl = document.getElementById("scanner");
              if (scannerEl) scannerEl.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-black mt-6 rounded-xl px-5 py-2.5 text-sm"
          >
            Try Another URL
          </button>
        </div>
      )}

      {result && !isScanning && (
        <div className="flex flex-col gap-6 animate-fade-up">
          <div
            className={`flex flex-col items-center gap-6 rounded-3xl border-2 p-6 transition-all duration-300 sm:flex-row sm:items-center sm:p-8 ${activePalette.scorePanel}`}
          >
            <Gauge score={result.score} theme={activeTheme} />

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="truncate font-mono text-xs font-semibold text-neutral-700">
                {result.url}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                <h2
                  className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${activePalette.verdictText}`}
                >
                  {verdictOf(result.score)}
                </h2>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${activePalette.badge}`}
                >
                  {bandOf(result.score)}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-neutral-900">
                {descOf(result.score)}
              </p>

              <div
                className={`mt-5 grid grid-cols-3 gap-3 border-t pt-4 ${activePalette.metaDivider}`}
              >
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-700">
                    Band
                  </div>
                  <div className="mt-0.5 font-mono text-xs font-bold uppercase text-neutral-950">
                    {bandOf(result.score)}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-700">
                    Scanned
                  </div>
                  <div className="mt-0.5 font-mono text-xs font-bold tabular-nums text-neutral-950">
                    {new Date(result.scannedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-700">
                    Issues
                  </div>
                  <div className="mt-0.5 font-mono text-xs font-bold tabular-nums text-neutral-950">
                    {result.issues.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            id="category-breakdown"
            className={`rounded-3xl border p-5 transition-colors duration-300 sm:p-6 ${activePalette.sectionContainer}`}
          >
            <div
              className={`mb-4 flex items-center gap-2.5 border-b pb-3 ${activePalette.headerBorder}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs ${activePalette.headerIcon}`}
              >
                <FaShieldAlt />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
                Category Breakdown
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {result.categories.map((c) => (
                <CategoryBar key={c.id} id={c.id} score={c.score} />
              ))}
            </div>
          </div>

          {result.issues.length > 0 && (
            <div
              className={`rounded-3xl border p-5 transition-colors duration-300 sm:p-6 ${activePalette.sectionContainer}`}
            >
              <div
                className={`mb-4 flex items-center justify-between gap-2 border-b pb-3 ${activePalette.headerBorder}`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs ${activePalette.headerIcon}`}
                  >
                    <FaExclamationTriangle />
                  </div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
                    Flagged Issues
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${activePalette.countPill}`}
                >
                  {result.issues.length} found
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {result.issues.map((issue, i) => (
                  <IssueCard key={i} issue={issue} />
                ))}
              </div>
            </div>
          )}

          <TechStackSection
            techStack={result.techStack}
            scanId={result.id}
            url={result.url}
          />

          {renderHistoryPanel()}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
