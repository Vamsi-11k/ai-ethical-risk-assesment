import "./Features.css";
import {
  FaLock,
  FaGlobe,
  FaExclamationTriangle,
  FaShieldAlt,
  FaChartLine,
  FaLightbulb,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaLock />,
      title: "SSL & HTTPS Verification",
      desc: "Verify if the website enforces secure SSL/TLS connections and automatically redirects HTTP traffic.",
    },
    {
      icon: <FaGlobe />,
      title: "Domain Age & Reputation Check",
      desc: "Analyze domain registration history, age, and global threat feed blacklists for potential risks.",
    },
    {
      icon: <FaExclamationTriangle />,
      title: "Phishing Pattern Detection",
      desc: "Detect deceptive content structures, lookalike brand assets, and suspicious subdomain patterns.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Security Header Audit",
      desc: "Inspect server responses for essential protection headers like Content Security Policy (CSP) and HSTS.",
    },
    {
      icon: <FaChartLine />,
      title: "Explainable Trust Scoring",
      desc: "Receive a transparent Trust Score between 0 and 100 with clear details on why a check failed.",
    },
    {
      icon: <FaLightbulb />,
      title: "Actionable Suggestions",
      desc: "Get concrete, guided recommendations to patch detected vulnerabilities and improve web security.",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="section-title">
        <h2>Core Features</h2>
        <p>
          Everything you need to evaluate website trustworthiness, domain integrity, and security postures.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
