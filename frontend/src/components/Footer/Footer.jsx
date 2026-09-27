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
            An AI-powered ethical risk assessment framework for teams building
            fair, private, secure, and compliant AI systems.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Product</h4>
          <a href="#home">Home</a>
          <a href="#dashboard">Live Demo</a>
          <a href="#features">Features</a>
          <a href="#workflow">How It Works</a>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
        </div>

        <div className="footer-links">
          <h4>Resources</h4>
          <a href="#">Documentation</a>
          <a href="#">NIST AI RMF Guide</a>
          <a href="#">EU AI Act Overview</a>
          <a href="#">API Reference</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} EthicalAI. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
