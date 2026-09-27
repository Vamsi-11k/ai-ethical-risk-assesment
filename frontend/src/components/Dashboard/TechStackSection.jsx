import React, { useState, useEffect } from "react";
import {
  FaTools,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";

// Category display mapping with exact icons and titles
const DISPLAY_CATEGORIES = [
  { key: "frontend", title: "FRONTEND", icon: "🎨" },
  { key: "backend", title: "BACKEND", icon: "⚙️" },
  { key: "cms", title: "CMS", icon: "📝" },
  { key: "web_server", title: "WEB SERVER", icon: "🖥️" },
  { key: "cdn_infrastructure", title: "CDN / INFRASTRUCTURE", icon: "☁️" },
  { key: "analytics", title: "ANALYTICS", icon: "📊" },
  { key: "security", title: "SECURITY", icon: "🔐" },
];

// Fingerprint bar categories
const FINGERPRINT_ITEMS = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "cdn_infrastructure", label: "Infrastructure" },
  { key: "analytics", label: "Analytics" },
  { key: "security", label: "Security" },
];

export default function TechStackSection({ techStack, scanId, url }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(techStack || null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [expandedTechs, setExpandedTechs] = useState({});

  useEffect(() => {
    setData(techStack || null);
  }, [techStack]);

  const handleTogglePanel = async () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    // If opening and no tech data is loaded, lazy load from backend
    if (willOpen && (!data || !data.categories || Object.keys(data.categories).length === 0)) {
      setIsLoading(true);
      setFetchError(null);
      try {
        const endpoint = scanId
          ? `/api/scans/${scanId}/tech-stack`
          : `/api/tech-stack?url=${encodeURIComponent(url || "")}`;

        const res = await fetch(endpoint);
        const json = await res.json();
        if (res.ok && json.data) {
          const loaded = json.data.techStack || json.data.tech_stack || {};
          setData(loaded);
        } else {
          throw new Error(json.message || "Failed to load technology stack.");
        }
      } catch (err) {
        setFetchError(err.message || "Unable to retrieve tools & technologies.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleEvidence = (techId) => {
    setExpandedTechs((prev) => ({
      ...prev,
      [techId]: !prev[techId],
    }));
  };

  // Normalization for data structure
  const categories = data?.categories || {};
  const totalDetected = data?.total_detected ?? 0;
  const overallConfidence = data?.overall_detection_confidence ?? 0;

  // Helper for security insight icon and class
  const getSecurityBadge = (status) => {
    switch (status) {
      case "Potential Concern":
        return {
          icon: <FaExclamationTriangle />,
          badgeClass: "sec-concern",
          symbol: "⚠",
        };
      case "High Risk":
        return {
          icon: <FaExclamationCircle />,
          badgeClass: "sec-risk",
          symbol: "🔴",
        };
      case "Recommendation":
        return {
          icon: <FaInfoCircle />,
          badgeClass: "sec-recommendation",
          symbol: "ℹ",
        };
      case "Informational":
      default:
        return {
          icon: <FaCheckCircle />,
          badgeClass: "sec-info",
          symbol: "✓",
        };
    }
  };

  return (
    <div className="tech-section-wrapper">
      {/* 1. TRIGGER BUTTON */}
      <button
        type="button"
        className={`tech-toggle-btn ${isOpen ? "active" : ""}`}
        onClick={handleTogglePanel}
        aria-expanded={isOpen}
      >
        <div className="tech-toggle-left">
          <span className="tech-toggle-icon">
            <FaTools />
          </span>
          <span className="tech-toggle-label">
            {isOpen ? "🔧 Hide Tools & Technologies" : "🔧 Show Tools & Technologies"}
          </span>
          {totalDetected > 0 && (
            <span className="tech-count-badge">
              {totalDetected} Detected · {overallConfidence}% Confidence
            </span>
          )}
        </div>
        <span className="tech-toggle-arrow">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>

      {/* 2. REVEALED TOOLS & TECHNOLOGIES PANEL */}
      {isOpen && (
        <div className="tech-panel">
          {isLoading && (
            <div className="tech-loading">
              <div className="spinner" style={{ width: 28, height: 28, borderWidth: 2 }} />
              <p>Auditing response headers, cookies, scripts, and DOM signatures…</p>
            </div>
          )}

          {fetchError && !isLoading && (
            <div className="tech-error">
              <p>{fetchError}</p>
            </div>
          )}

          {!isLoading && !fetchError && (
            <>
              {/* Header summary */}
              <div className="tech-panel-header">
                <div className="tech-panel-title-row">
                  <h5>🔧 TOOLS & TECHNOLOGIES</h5>
                  <span className="tech-panel-subtitle">
                    {totalDetected} Technologies Detected · Technology Detection Confidence:{" "}
                    <strong>{overallConfidence}%</strong>
                  </span>
                </div>
              </div>

              {totalDetected === 0 ? (
                <div className="tech-empty-notice">
                  <p>No framework, CMS, or server signatures detected on this landing page.</p>
                </div>
              ) : (
                <div className="tech-categories-list">
                  {DISPLAY_CATEGORIES.map(({ key, title, icon }) => {
                    const catObj = categories[key];
                    const techs = catObj?.technologies || [];

                    // Hide empty categories completely
                    if (!techs || techs.length === 0) return null;

                    return (
                      <div className="tech-category-section" key={key}>
                        <div className="tech-category-title-bar">
                          <span className="tech-cat-emoji">{icon}</span>
                          <h6>{title}</h6>
                          <span className="tech-cat-count-pill">{techs.length}</span>
                        </div>

                        <div className="tech-rows-table">
                          {techs.map((tech, idx) => {
                            const techId = `${key}-${tech.name}-${idx}`;
                            const isExpanded = !!expandedTechs[techId];
                            const sec = getSecurityBadge(tech.security_status);
                            const hasVersion =
                              tech.version && tech.version !== "Version: Not detected";

                            return (
                              <div className="tech-row-container" key={techId}>
                                <div className="tech-row-main">
                                  <div className="tech-name-col">
                                    <span className="tech-name-text">{tech.name}</span>
                                    {hasVersion ? (
                                      <span className="tech-version-pill">{tech.version}</span>
                                    ) : (
                                      <span className="tech-version-muted">
                                        Version: Not detected
                                      </span>
                                    )}
                                    {tech.subcategory && (
                                      <span className="tech-subcat-tag">
                                        {tech.subcategory}
                                      </span>
                                    )}
                                  </div>

                                  <div className="tech-status-col">
                                    <span className="tech-confidence-text">
                                      {tech.confidence}%
                                    </span>
                                    <span
                                      className={`tech-status-symbol ${sec.badgeClass}`}
                                      title={tech.security_status}
                                    >
                                      {sec.symbol}
                                    </span>
                                    <button
                                      type="button"
                                      className="view-evidence-btn"
                                      onClick={() => toggleEvidence(techId)}
                                      aria-expanded={isExpanded}
                                    >
                                      {isExpanded ? "Hide Evidence ▴" : "View Evidence ▾"}
                                    </button>
                                  </div>
                                </div>

                                {/* Expanded Evidence Drawer */}
                                {isExpanded && (
                                  <div className="tech-evidence-drawer">
                                    <div className="evidence-header">
                                      <strong>Detection Evidence:</strong>
                                    </div>
                                    <ul className="evidence-list">
                                      {tech.evidence && tech.evidence.length > 0 ? (
                                        tech.evidence.map((ev, evIdx) => (
                                          <li key={evIdx} className="evidence-item">
                                            <span className="evidence-bullet">•</span>
                                            <span>{ev}</span>
                                          </li>
                                        ))
                                      ) : (
                                        <li className="evidence-item">Direct signature match.</li>
                                      )}
                                    </ul>

                                    {/* Security Insight */}
                                    <div className={`tech-insight-box ${sec.badgeClass}`}>
                                      <div className="insight-badge-row">
                                        <span className="insight-badge">
                                          {sec.icon} {tech.security_status}
                                        </span>
                                      </div>
                                      <p className="insight-text">{tech.security_insight}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. TECHNOLOGY FINGERPRINT SUMMARY */}
              <div className="tech-fingerprint-box">
                <div className="fingerprint-header">
                  <h5>TECHNOLOGY FINGERPRINT</h5>
                </div>

                <div className="fingerprint-bars-list">
                  {FINGERPRINT_ITEMS.map(({ key, label }) => {
                    const catData = categories[key];
                    const confidenceVal = catData ? catData.confidence : 0;
                    const count = catData?.technologies?.length || 0;

                    return (
                      <div className="fingerprint-row" key={key}>
                        <div className="fingerprint-label-col">
                          <span className="fingerprint-name">{label}</span>
                          {count > 0 && (
                            <span className="fingerprint-item-count">({count})</span>
                          )}
                        </div>
                        <div className="fingerprint-bar-col">
                          <div className="fingerprint-track">
                            <div
                              className="fingerprint-fill"
                              style={{ width: `${confidenceVal}%` }}
                            />
                          </div>
                        </div>
                        <span className="fingerprint-val-col">{confidenceVal}%</span>
                      </div>
                    );
                  })}
                </div>

                <div className="fingerprint-footer">
                  <span>
                    Overall Technology Detection Confidence:{" "}
                    <strong>{overallConfidence}%</strong>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
