import { useState, useEffect } from "react";
import "./MainApp.css";
import Dashboard from "../components/Dashboard/Dashboard";
import Dock from "../components/Dock/Dock";
import {
  FaSearch,
  FaArrowRight,
  FaShieldAlt,
  FaHome,
  FaBolt,
  FaChartLine,
  FaBalanceScale,
  FaFingerprint,
  FaArrowUp,
  FaHistory,
} from "react-icons/fa";

const PRESETS = [
  { name: "OpenAI", tag: "Safe", url: "https://openai.com", theme: "safe" },
  { name: "Meta AI", tag: "Moderate", url: "https://facebook.com", theme: "moderate" },
  { name: "Dark Patterns", tag: "Risky", url: "https://dark-patterns.com", theme: "risky" },
  { name: "Anthropic", tag: "Safe", url: "https://anthropic.com", theme: "safe" },
  { name: "GitHub", tag: "Safe", url: "https://github.com", theme: "safe" },
];

function MainApp({
  user,
  scanUrl,
  scanTimestamp,
  isScanning,
  onScan,
  onScanComplete,
  onGoHome,
  riskTheme = "safe",
  onThemeChange,
}) {
  const [inputUrl, setInputUrl] = useState(scanUrl || "");

  // Sync internal input when external scanUrl updates
  useEffect(() => {
    if (scanUrl) {
      setInputUrl(scanUrl);
    }
  }, [scanUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onScan(inputUrl.trim());
  };

  const handlePreset = (preset) => {
    setInputUrl(preset.url);
    if (preset.theme && onThemeChange) {
      onThemeChange(preset.theme);
    }
    onScan(preset.url);
  };

  // Studio Dock Items
  const dockItems = [
    {
      icon: <FaChartLine size={18} />,
      label: "Audit Results",
      onClick: () => {
        const el = document.getElementById("results");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: <FaBalanceScale size={18} />,
      label: "5 Risk Vectors",
      onClick: () => {
        const el = document.querySelector(".dash-cards-grid");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: <FaFingerprint size={18} />,
      label: "Forensic Evidence",
      onClick: () => {
        const el = document.querySelector(".tech-drawer") || document.getElementById("results");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: <FaBolt size={18} />,
      label: "Quick Scan Demo",
      onClick: () => {
        handlePreset("https://openai.com");
      },
    },
    {
      icon: <FaArrowUp size={18} />,
      label: "Top of Studio",
      onClick: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    },
    {
      icon: <FaHome size={18} />,
      label: "Landing Page",
      onClick: onGoHome,
    },
  ];

  return (
    <div className="main-app-workspace">
      {/* ── Studio Top Utility Bar ──────────────────────────────────── */}
      <div className="studio-topbar">
        <div className="studio-topbar-left">
          <button
            type="button"
            className="studio-back-btn"
            onClick={onGoHome}
            title="Return to Landing Page"
          >
            <FaHome />
            <span>← Landing Page</span>
          </button>

          <div className="studio-title-badge">
            <span className="studio-radar-dot" />
            <span className="studio-badge-title">AI ETHICAL RISK STUDIO</span>
            <span className="studio-badge-ver">v2.4</span>
          </div>
        </div>

        <div className="studio-topbar-right">
          <div className="studio-status-indicator">
            <span className="status-ping" />
            <span>PIPELINE ONLINE // NIST AI RMF</span>
          </div>
        </div>
      </div>

      {/* ── Scanner Control Console ─────────────────────────────────── */}
      <section className="studio-scanner-section">
        <div className="studio-scanner-container">
          <div className="scanner-header-text">
            <div className="scanner-kicker">AUTONOMOUS AUDIT CONSOLE</div>
            <h1 className="scanner-main-title">Inspect & Score Any AI Web Target</h1>
            <p className="scanner-subtitle">
              Input a web application, model API interface, or service URL. The audit
              pipeline examines data sovereignty, algorithmic fairness, dark pattern
              manipulation, and compliance telemetry in real-time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="studio-scanner-form">
            <div className="studio-bar">
              <div className="studio-bar-prefix">
                <FaSearch className="prefix-search-icon" />
                <span>scan_target</span>
              </div>
              <input
                type="text"
                className="studio-input"
                placeholder="Enter URL to audit (e.g. https://openai.com or https://anthropic.com)"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                className="studio-submit-btn"
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <span className="studio-spinner" />
                    <span>Auditing Target…</span>
                  </>
                ) : (
                  <>
                    <span>Run Ethical Audit</span>
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>

            {/* Quick target chips */}
            <div className="studio-presets-row">
              <span className="presets-lead">DEMO TARGETS:</span>
              <div className="presets-list">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    className={`studio-preset-chip preset-chip-${p.theme}`}
                    onClick={() => handlePreset(p)}
                    disabled={isScanning}
                    title={`Test scan with ${p.tag} Risk profile`}
                  >
                    <span className={`preset-dot preset-dot-${p.theme}`} />
                    <span>{p.name}</span>
                    <span className={`preset-badge-tag tag-${p.theme}`}>{p.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ── Results & Real-time Audit Dashboard ─────────────────────── */}
      <section className="studio-dashboard-section" id="results">
        <Dashboard
          user={user}
          scanUrl={scanUrl}
          scanTimestamp={scanTimestamp}
          isScanning={isScanning}
          onScanComplete={onScanComplete}
          onThemeChange={onThemeChange}
        />
      </section>

      {/* ── Studio Navigation Floating Dock ─────────────────────────── */}
      <div className="dock-floating-container">
        <Dock
          items={dockItems}
          panelHeight={64}
          baseItemSize={48}
          magnification={68}
          distance={180}
        />
      </div>
    </div>
  );
}

export default MainApp;
