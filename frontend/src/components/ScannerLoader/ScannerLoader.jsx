import { useState, useEffect } from "react";
import "./ScannerLoader.css";
import { FaShieldAlt, FaTerminal, FaSearch, FaCheckCircle, FaSpinner } from "react-icons/fa";

const AUDIT_STAGES = [
  { label: "INITIALIZING_AUDIT", desc: "Resolving DNS & probing TLS cipher suites..." },
  { label: "DATA_SOVEREIGNTY", desc: "Auditing third-party telemetry, tracking pixels & GDPR cookies..." },
  { label: "ALGORITHMIC_BIAS", desc: "Analyzing demographic parity & linguistic disparate impact..." },
  { label: "UX_MANIPULATION", desc: "Scanning for forced consent, dark patterns & deceptive flows..." },
  { label: "MODEL_TRANSPARENCY", desc: "Benchmarking against NIST AI RMF 1.0 & EU AI Act standards..." },
  { label: "COMPILING_SCORECARD", desc: "Synthesizing 0–100 weighted risk telemetry..." },
];

function ScannerLoader({ targetUrl = "target endpoint" }) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prev) => (prev < AUDIT_STAGES.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="scanner-loader-overlay">
      <div className="scanner-loader-card">
        {/* Radar Scanner Visualizer */}
        <div className="loader-radar-wrapper">
          <div className="radar-circle radar-c1" />
          <div className="radar-circle radar-c2" />
          <div className="radar-circle radar-c3" />
          <div className="radar-sweep" />
          <div className="radar-core">
            <FaShieldAlt className="radar-shield-icon" />
          </div>
          <div className="radar-blip blip-1" />
          <div className="radar-blip blip-2" />
          <div className="radar-blip blip-3" />
        </div>

        {/* Audit Status Info */}
        <div className="loader-meta">
          <div className="loader-tag">
            <span className="loader-pulse-dot" />
            <span>AUTONOMOUS FORENSIC INSPECTION</span>
          </div>

          <h3 className="loader-target">
            Auditing: <span className="highlight-url">{targetUrl}</span>
          </h3>

          <p className="loader-desc">
            {AUDIT_STAGES[currentStage].desc}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="loader-progress-track">
          <div
            className="loader-progress-bar"
            style={{ width: `${((currentStage + 1) / AUDIT_STAGES.length) * 100}%` }}
          />
        </div>

        {/* Steps Telemetry Log */}
        <div className="loader-stages-list">
          {AUDIT_STAGES.map((stage, idx) => (
            <div
              key={stage.label}
              className={`loader-stage-item ${
                idx < currentStage
                  ? "completed"
                  : idx === currentStage
                  ? "active"
                  : "pending"
              }`}
            >
              <div className="stage-status-icon">
                {idx < currentStage ? (
                  <FaCheckCircle className="check-done" />
                ) : idx === currentStage ? (
                  <FaSpinner className="spin-active" />
                ) : (
                  <span className="dot-pending" />
                )}
              </div>
              <span className="stage-label">{stage.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScannerLoader;
