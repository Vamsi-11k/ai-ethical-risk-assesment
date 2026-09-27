import "./Footer.css";
import { FaShieldAlt, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <FaShieldAlt />
            </div>
            <span>EthicalAI</span>
          </div>
          <p>
            An autonomous AI-powered ethical risk assessment framework for organizations
            building fair, private, transparent, and compliant digital experiences.
          </p>
          <div className="footer-status">
            <span className="status-dot" />
            <span>Audit Engine v2.4 • Operational</span>
          </div>
          <div className="footer-socials">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Platform</h4>
          <a href="#scanner">URL Scanner</a>
          <a href="#results">Live Audit Engine</a>
          <a href="#features">Ethical Capabilities</a>
          <a href="#workflow">Audit Pipeline</a>
        </div>

        <div className="footer-links">
          <h4>Governance</h4>
          <a href="#about">Ethics Framework</a>
          <a href="#contact">Compliance Contact</a>
          <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noreferrer">NIST AI RMF</a>
          <a href="https://artificialintelligenceact.eu" target="_blank" rel="noreferrer">EU AI Act</a>
        </div>

        <div className="footer-links">
          <h4>Framework Standards</h4>
          <a href="#scanner">OWASP Top 10</a>
          <a href="#scanner">GDPR Art. 13/14</a>
          <a href="#scanner">Dark Pattern Shield</a>
          <a href="#scanner">Transparency Metrics</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} EthicalAI Risk Assessment Framework. Open-source audit methodology.</p>
        <div className="footer-legal">
          <a href="#about">Privacy Standards</a>
          <a href="#about">Responsible AI Terms</a>
          <a href="#about">Security Posture</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
