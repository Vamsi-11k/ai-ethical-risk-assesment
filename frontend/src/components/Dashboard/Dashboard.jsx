import { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  FaBolt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaLock,
  FaHistory,
} from "react-icons/fa";

function scoreBand(v) {
  if (v >= 80) return "low"; // High trust = Low risk (green)
  if (v >= 50) return "medium"; // Medium trust = Medium risk (amber)
  return "high"; // Low trust = High risk (red)
}

function Dashboard({ user }) {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setHistory([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/scans", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const resJson = await response.json();
        if (response.ok) {
          setHistory(resJson.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch scan history:", err);
      }
    };

    fetchHistory();
  }, [user]);

  const runAnalysis = async (targetUrl) => {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({ url: targetUrl }),
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.message || "Failed to analyze website. Verify the URL is valid.");
      }

      const scanData = resJson.data;

      setResult({
        url: scanData.url,
        overall: scanData.trustScore,
        risk: scanData.riskLevel,
        checks: scanData.reasons, // Array of { label, passed }
        notes: scanData.suggestions, // Array of strings
      });

      if (user) {
        const newHistoryItem = {
          id: scanData.id,
          url: scanData.url,
          trustScore: scanData.trustScore,
          riskScore: scanData.riskScore,
          riskLevel: scanData.riskLevel,
          reasons: scanData.reasons,
          suggestions: scanData.suggestions,
          scannedAt: scanData.scannedAt || new Date().toISOString()
        };
        setHistory((prev) => {
          const filtered = prev.filter((item) => item.id !== newHistoryItem.id);
          return [newHistoryItem, ...filtered];
        });
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred during website scan.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    runAnalysis(url.trim());
  };

  const handlePresetClick = (preset) => {
    setUrl(preset);
    runAnalysis(preset);
  };

  return (
    <section className="dashboard" id="dashboard">
      <div className="dashboard-header">
        <span className="badge dash-badge">
          <FaBolt /> Live Risk Engine
        </span>
        <h2>See the Risk Engine in Action</h2>
        <p>
          Enter a website URL to run it through the trust analysis engine and see
          a live risk checklist and security breakdown.
        </p>
      </div>

      <div className="dashboard-grid">
        <div style={{ display: "flex", flexDirection: "column", width: "38%", gap: "25px" }}>
          <form className="dashboard-form" onSubmit={handleAnalyze} style={{ width: "100%" }}>
            <h3>
              <FaLock /> Website Scanner
            </h3>

            <label htmlFor="website-url">Website URL</label>
            <input
              id="website-url"
              type="text"
              placeholder="e.g. https://secure-bank.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />

            <div style={{ marginTop: "12px", fontSize: "13px", color: "#6b7280" }}>
              Try:{" "}
              <span
                onClick={() => handlePresetClick("secure-bank.com")}
                style={{ color: "#2563eb", cursor: "pointer", textDecoration: "underline", marginRight: "8px" }}
              >
                secure-bank.com
              </span>
              <span
                onClick={() => handlePresetClick("shopping-dealz.net")}
                style={{ color: "#2563eb", cursor: "pointer", textDecoration: "underline", marginRight: "8px" }}
              >
                shopping-dealz.net
              </span>
              <span
                onClick={() => handlePresetClick("pay-invoice-verify.com")}
                style={{ color: "#2563eb", cursor: "pointer", textDecoration: "underline" }}
              >
                pay-invoice-verify.com
              </span>
            </div>

            <button type="submit" className="analyze-btn" disabled={isAnalyzing}>
              {isAnalyzing ? "Scanning..." : "Scan Website"}
            </button>
          </form>

          {/* Scan History list */}
          <div className="dashboard-history" style={{ 
            background: "white", 
            borderRadius: "20px", 
            padding: "30px", 
            boxShadow: "0 15px 35px rgba(7, 22, 47, 0.08)",
            width: "100%",
            boxSizing: "border-box"
          }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px 0", fontSize: "18px", color: "#07162f" }}>
              <FaHistory /> Scan History
            </h3>

            {!user ? (
              <p style={{ color: "#6b7280", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                Sign in to save and view your previous scan history.
              </p>
            ) : history.length === 0 ? (
              <p style={{ color: "#6b7280", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                No scans performed yet. Enter a URL above to start!
              </p>
            ) : (
              <div className="history-list" style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "250px", overflowY: "auto", paddingRight: "4px" }}>
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      setResult({
                        url: item.url,
                        overall: item.trustScore,
                        risk: item.riskLevel,
                        checks: item.reasons,
                        notes: item.suggestions
                      });
                      setUrl(item.url);
                    }}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      padding: "10px 12px", 
                      borderRadius: "10px", 
                      border: "1px solid #e2e8f0", 
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    className="history-item-row"
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", overflow: "hidden", marginRight: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {item.url}
                      </span>
                      <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                        {new Date(item.scannedAt).toLocaleDateString([], { month: "short", day: "numeric" })} at {new Date(item.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: "12px", 
                      fontWeight: "bold", 
                      padding: "4px 8px", 
                      borderRadius: "6px",
                      color: "white",
                      background: item.trustScore >= 80 ? "#10b981" : item.trustScore >= 50 ? "#f59e0b" : "#ef4444"
                    }}>
                      {item.trustScore}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-results">
          {!result && !isAnalyzing && !error && (
            <div className="results-empty">
              <FaExclamationTriangle />
              <p>Run a scan to see the trust and risk breakdown here.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="results-loading">
              <div className="spinner" />
              <p>Auditing website security headers, SSL status, and threat indices...</p>
            </div>
          )}

          {error && !isAnalyzing && (
            <div className="results-empty" style={{ borderColor: "#ef4444" }}>
              <FaExclamationTriangle style={{ color: "#ef4444" }} />
              <p style={{ color: "#ef4444", fontWeight: "bold" }}>Scan Failed</p>
              <p style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px" }}>{error}</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <>
              <div className="overall-score">
                <div className={`score-ring ${scoreBand(result.overall)}`}>
                  <span>{result.overall}</span>
                </div>
                <div>
                  <h4 style={{ wordBreak: "break-all" }}>{result.url}</h4>
                  <p className="category-tag">
                    Risk Level: <span style={{ fontWeight: "bold" }} className={scoreBand(result.overall)}>{result.risk}</span>
                  </p>
                </div>
              </div>

              <div className="metric-list">
                {result.checks.map((c, i) => (
                  <div className="metric-row" key={i}>
                    <div className="metric-label" style={{ width: "100%", gap: "10px" }}>
                      {c.passed ? (
                        <FaCheckCircle style={{ color: "#10b981", fontSize: "16px", flexShrink: 0 }} />
                      ) : (
                        <FaTimesCircle style={{ color: "#ef4444", fontSize: "16px", flexShrink: 0 }} />
                      )}
                      <span>{c.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="notes-box">
                <h5>
                  <FaBolt /> Recommended actions
                </h5>
                <ul>
                  {result.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
