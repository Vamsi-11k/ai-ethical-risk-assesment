import { useState } from "react";
import "./Hero.css";
import Scene from "./Scene";
import {
  FaSearch,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaBolt,
  FaTerminal,
  FaLock,
  FaBalanceScale,
  FaEye,
  FaBrain,
  FaChevronDown,
} from "react-icons/fa";

const PRESETS = [
  { name: "OpenAI", url: "https://openai.com" },
  { name: "Anthropic", url: "https://anthropic.com" },
  { name: "Meta AI", url: "https://facebook.com" },
  { name: "Dark Patterns", url: "https://dark-patterns.com" },
  { name: "GitHub", url: "https://github.com" },
];

function Hero({ onLaunchApp, onQuickScan }) {
  const [targetUrl, setTargetUrl] = useState("");

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      onLaunchApp();
      return;
    }
    onQuickScan(targetUrl.trim());
  };

  const handlePresetClick = (url) => {
    setTargetUrl(url);
    onQuickScan(url);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-landing" id="overview">
      {/* ── 1. The 3D ThreeUI Living Green Hero Scene ───────────────── */}
      <div className="sylva-scene-viewport">
        <Scene onExplore={onLaunchApp} />

        {/* Floating Quick Action Overlay at base of 3D Scene */}
        <div className="sylva-overlay-dock">
          <div className="sylva-overlay-inner">
            <div className="overlay-badge">
              <span className="overlay-dot" />
              <span>ETHICAL AI GOVERNANCE // v2.4 ENGINE</span>
            </div>

            <form onSubmit={handleQuickSubmit} className="overlay-scan-bar">
              <FaSearch className="overlay-search-icon" />
              <input
                type="text"
                placeholder="Enter AI model or web target URL (e.g. https://openai.com)"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                spellCheck={false}
                className="overlay-input"
              />
              <button type="submit" className="overlay-submit-btn">
                <span>Run Audit in Studio</span>
                <FaArrowRight />
              </button>
            </form>

            <div className="overlay-bottom-row">
              <div className="overlay-presets">
                <span className="presets-label">QUICK TARGETS:</span>
                {PRESETS.slice(0, 4).map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    className="overlay-chip"
                    onClick={() => handlePresetClick(p.url)}
                  >
                    <span className="chip-dot" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="overlay-scroll-down"
                onClick={() => scrollToSection("telemetry")}
                title="Scroll down to explore features"
              >
                <span>Explore Platform</span>
                <FaChevronDown className="bounce-arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Live Telemetry & Platform Deep Dive Section ─────────── */}
      <div className="hero-container" id="telemetry">
        {/* Top Intelligence Tag */}
        <div className="hero-eyebrow-badge">
          <span className="eyebrow-radar-dot" />
          <span className="eyebrow-text">
            AUTONOMOUS AI GOVERNANCE // NIST AI RMF 1.0 & EU AI ACT
          </span>
          <span className="eyebrow-pill">v2.4 AUDIT ENGINE</span>
        </div>

        {/* Headline */}
        <h2 className="hero-headline">
          Continuous <span className="highlight-emerald">Ethical Governance</span> Across{" "}
          <span className="highlight-mint">Every AI Vector</span>
        </h2>

        <p className="hero-description">
          The premier autonomous intelligence engine for scanning AI models and web
          deployments. Detect algorithmic bias, manipulative UX dark patterns, data
          sovereignty violations, and hallucination telemetry in real time — scored
          with 0–100 explainable compliance ratings.
        </p>

        {/* Live Interactive Forensic Telemetry Preview Card */}
        <div className="hero-telemetry-preview">
          <div className="telemetry-card">
            {/* Terminal Window Header */}
            <div className="telemetry-bar">
              <div className="terminal-dots">
                <span className="tdot tdot-red" />
                <span className="tdot tdot-yellow" />
                <span className="tdot tdot-green" />
              </div>
              <div className="telemetry-title">
                <FaTerminal className="term-icon" />
                <span>ETHICAL_AI_INSPECTOR // ACTIVE AUDIT TELEMETRY</span>
              </div>
              <div className="telemetry-live-tag">
                <span className="live-pulse" />
                <span>MONITORING</span>
              </div>
            </div>

            {/* Telemetry Body: 4 Vector Status Checks + Scorecard */}
            <div className="telemetry-content">
              <div className="telemetry-vectors">
                <div className="vector-row vector-passed">
                  <div className="vector-info">
                    <FaLock className="vector-icon text-emerald" />
                    <div>
                      <div className="vector-name">Data Sovereignty & Privacy</div>
                      <div className="vector-desc">GDPR Art. 13 & CCPA tracker evaluation</div>
                    </div>
                  </div>
                  <div className="vector-badge badge-safe">
                    <FaCheckCircle /> <span>94/100 SAFE</span>
                  </div>
                </div>

                <div className="vector-row vector-passed">
                  <div className="vector-info">
                    <FaBalanceScale className="vector-icon text-green" />
                    <div>
                      <div className="vector-name">Algorithmic Fairness & Bias</div>
                      <div className="vector-desc">Disparate impact & parity demographic analysis</div>
                    </div>
                  </div>
                  <div className="vector-badge badge-safe">
                    <FaCheckCircle /> <span>88/100 SAFE</span>
                  </div>
                </div>

                <div className="vector-row vector-warning">
                  <div className="vector-info">
                    <FaEye className="vector-icon text-gold" />
                    <div>
                      <div className="vector-name">Dark Pattern & UX Manipulation</div>
                      <div className="vector-desc">Deceptive design & forced consent telemetry</div>
                    </div>
                  </div>
                  <div className="vector-badge badge-moderate">
                    <span>76/100 MODERATE</span>
                  </div>
                </div>

                <div className="vector-row vector-passed">
                  <div className="vector-info">
                    <FaBrain className="vector-icon text-mint" />
                    <div>
                      <div className="vector-name">Transparency & Model Explainability</div>
                      <div className="vector-desc">NIST AI RMF 1.0 source attribution validation</div>
                    </div>
                  </div>
                  <div className="vector-badge badge-safe">
                    <FaCheckCircle /> <span>91/100 SAFE</span>
                  </div>
                </div>
              </div>

              {/* Overall Score Dial Preview */}
              <div className="telemetry-score-dial">
                <div className="score-radial">
                  <div className="score-num">87</div>
                  <div className="score-max">/ 100</div>
                </div>
                <div className="score-meta">
                  <span className="score-level-badge">LOW RISK // TRUSTED</span>
                  <p className="score-expl">
                    Certified compliant across 18/20 ethical governance benchmarks.
                  </p>
                  <button
                    type="button"
                    className="telemetry-inspect-btn"
                    onClick={onLaunchApp}
                  >
                    <span>Open Full Audit Studio</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Compliance Frameworks Ribbon */}
        <div className="hero-frameworks-strip">
          <span className="frameworks-title">BENCHMARKED & ALIGNED WITH:</span>
          <div className="frameworks-list">
            <span className="fw-chip">NIST AI RMF 1.0</span>
            <span className="fw-chip">EU AI ACT DIRECTIVE</span>
            <span className="fw-chip">OWASP TOP 10 FOR LLMS</span>
            <span className="fw-chip">GDPR COMPLIANCE (ART. 13/14)</span>
            <span className="fw-chip">ISO/IEC 42001 (AI MANAGEMENT)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
