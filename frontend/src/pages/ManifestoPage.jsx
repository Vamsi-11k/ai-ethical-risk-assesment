import About from "../components/About/About";
import Footer from "../components/Footer/Footer";
import { FaBolt, FaArrowRight, FaHome, FaBookOpen } from "react-icons/fa";
import "./SubPage.css";

function ManifestoPage({ onLaunchApp, onGoHome }) {
  return (
    <div className="subpage-container">
      <div className="subpage-hero">
        <div className="subpage-kicker">
          <span className="kicker-dot" />
          <span>OUR ETHICAL COMMITMENT // MANIFESTO</span>
        </div>
        <h1 className="subpage-title">
          The <span className="title-accent">EthicalAI Governance</span> Manifesto
        </h1>
        <p className="subpage-sub">
          We believe artificial intelligence must be accountable, human-dignified, and
          auditable by design. Learn the principles that drive our research and algorithms.
        </p>

        <div className="subpage-nav-bar">
          <button
            type="button"
            className="subpage-back-btn"
            onClick={onGoHome}
            title="Return to Overview"
          >
            <FaHome />
            <span>← Back to Overview</span>
          </button>
          <button
            type="button"
            className="subpage-studio-cta"
            onClick={onLaunchApp}
            title="Open Live Scanner Studio"
          >
            <FaBolt />
            <span>Launch Audit Studio</span>
            <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="subpage-content">
        <About />
      </div>

      <div className="subpage-bottom-cta">
        <div className="subpage-bottom-card">
          <div className="subpage-bottom-left">
            <h3>Put Principles into Action</h3>
            <p>
              Join thousands of developers and safety researchers verifying compliance
              before deployment.
            </p>
          </div>
          <button
            type="button"
            className="subpage-bottom-btn"
            onClick={onLaunchApp}
          >
            <FaBolt />
            <span>Run Studio Scan</span>
            <FaArrowRight />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ManifestoPage;
