import "./Features.css";
import {
  FaLock, FaGlobe, FaExclamationTriangle,
  FaShieldAlt, FaChartLine, FaLightbulb,
} from "react-icons/fa";

const FEATURES = [
  { icon: <FaLock />,                title: "ssl_verification",      desc: "Checks SSL/TLS enforcement, certificate validity, and HTTP-to-HTTPS redirect behaviour." },
  { icon: <FaGlobe />,               title: "domain_reputation",     desc: "Analyses domain age, registration history, and cross-references global threat intelligence feeds." },
  { icon: <FaExclamationTriangle />, title: "phishing_detection",    desc: "Identifies deceptive content structures, lookalike brand assets, and suspicious subdomain patterns." },
  { icon: <FaShieldAlt />,           title: "security_header_audit", desc: "Inspects server responses for CSP, HSTS, X-Frame-Options, and other mandatory protection headers." },
  { icon: <FaChartLine />,           title: "trust_scoring",         desc: "Produces a transparent 0–100 Trust Score with per-check explanations for full auditability." },
  { icon: <FaLightbulb />,           title: "actionable_remediation", desc: "Generates concrete, prioritised steps to close detected security gaps and improve posture." },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="sec-head" style={{ marginBottom: 36 }}>
        <div className="sec-label">capabilities</div>
        <h2>What the scanner checks</h2>
        <p>Six automated checks run on every audit, mapped to the ethical risk framework.</p>
      </div>

      <div className="features-grid">
        {FEATURES.map((f, i) => (
          <div className="feature-card" key={i}>
            <span className="feature-index">0{i + 1}</span>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
