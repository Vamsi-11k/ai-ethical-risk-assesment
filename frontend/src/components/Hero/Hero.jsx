import { useState } from "react";
import "./Hero.css";
import { FaSearch, FaArrowRight } from "react-icons/fa";

const PRESETS = [
  "https://openai.com",
  "https://facebook.com",
  "https://dark-patterns.com",
];

function Hero({ onScan = () => {}, isScanning = false }) {
  const [url, setUrl] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    if (typeof onScan === "function") {
      onScan(url.trim());
    }
  };

  const handlePreset = (p) => {
    setUrl(p);
    if (typeof onScan === "function") {
      onScan(p);
    }
  };

  return (
    <section className="hero" id="scanner">
      <div className="hero-inner">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          AI Ethical Risk Scanner — v2.0
        </div>

        <h1 className="hero-title">
          Know the ethical risk before<br />
          you <span className="hl-red">deploy</span>,{" "}
          <span className="hl-amber">integrate</span>, or{" "}
          <span className="hl-green">trust</span>.
        </h1>

        <p className="hero-sub">
          Paste any URL and get an independent ethical audit across data privacy,
          transparency, bias, manipulation risk, and content authenticity —
          scored 0–100 in seconds.
        </p>

        {/* Main scanner bar */}
        <form onSubmit={submit}>
          <div className="scanner-bar">
            <div className="scanner-prefix">
              <FaSearch /> scan_target
            </div>
            <input
              className="scanner-input"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <button className="scanner-btn" type="submit" disabled={isScanning}>
              {isScanning ? "Scanning…" : <>Run Audit <FaArrowRight /></>}
            </button>
          </div>

          <div className="hero-presets">
            <span className="hero-presets-label">try:</span>
            {PRESETS.map(p => (
              <button
                key={p}
                type="button"
                className="preset-chip"
                onClick={() => handlePreset(p)}
                disabled={isScanning}
              >
                {p.replace("https://", "")}
              </button>
            ))}
          </div>
        </form>

        {/* Quick stats strip */}
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-val">10,000+</span>
            <span className="hero-stat-label">sites_scanned</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-val green">98.2%</span>
            <span className="hero-stat-label">detection_rate</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-val amber">5</span>
            <span className="hero-stat-label">risk_categories</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-val red">3.2s</span>
            <span className="hero-stat-label">avg_scan_time</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
