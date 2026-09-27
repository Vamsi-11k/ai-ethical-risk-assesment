import "./RiskCategories.css";
import { FaUserSecret, FaEye, FaBalanceScale, FaBrain, FaFileAlt } from "react-icons/fa";

const CATS = [
  {
    icon: <FaUserSecret />,
    name: "data_privacy",
    desc: "Evaluates presence of a privacy policy, cookie consent, and personal data handling disclosures.",
    weight: "25%",
    status: "CRITICAL",
    statusColor: "var(--risk-critical)",
    statusBg: "rgba(239,68,68,.1)",
  },
  {
    icon: <FaEye />,
    name: "transparency",
    desc: "Checks for clear terms of service, ownership disclosure, and identifiable contact information.",
    weight: "20%",
    status: "HIGH",
    statusColor: "var(--risk-high)",
    statusBg: "rgba(249,115,22,.1)",
  },
  {
    icon: <FaBalanceScale />,
    name: "bias_fairness",
    desc: "Detects demographic targeting patterns, exclusionary language, and unfair content segmentation.",
    weight: "20%",
    status: "MEDIUM",
    statusColor: "var(--risk-medium)",
    statusBg: "rgba(245,158,11,.1)",
  },
  {
    icon: <FaBrain />,
    name: "manipulation_risk",
    desc: "Identifies dark patterns, urgency triggers, social proof manipulation, and deceptive UX practices.",
    weight: "20%",
    status: "HIGH",
    statusColor: "var(--risk-high)",
    statusBg: "rgba(249,115,22,.1)",
  },
  {
    icon: <FaFileAlt />,
    name: "content_authenticity",
    desc: "Validates SSL/TLS integrity, checks for phishing indicators, and cross-checks against threat feeds.",
    weight: "15%",
    status: "CRITICAL",
    statusColor: "var(--risk-critical)",
    statusBg: "rgba(239,68,68,.1)",
  },
];

function RiskCategories() {
  return (
    <section className="risk-section">
      <div className="sec-head">
        <div className="sec-label">methodology</div>
        <h2>Risk category reference</h2>
        <p>Five weighted categories make up the final ethical trust score.</p>
      </div>

      <div className="risk-table">
        <div className="risk-table-head">
          <span className="risk-th">category</span>
          <span className="risk-th">what we check</span>
          <span className="risk-th">weight</span>
          <span className="risk-th">impact</span>
        </div>
        {CATS.map((c, i) => (
          <div className="risk-row" key={i}>
            <div className="risk-cat-name">
              {c.icon} {c.name}
            </div>
            <div className="risk-cat-desc">{c.desc}</div>
            <div className="risk-weight">{c.weight}</div>
            <div className="risk-badge-cell">
              <span
                className="risk-badge"
                style={{ color: c.statusColor, background: c.statusBg, border: `1px solid ${c.statusColor}33` }}
              >
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RiskCategories;
