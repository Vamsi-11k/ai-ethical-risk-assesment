import Features from "../components/Features/Features";
import Footer from "../components/Footer/Footer";
import { FaBolt, FaArrowRight, FaHome, FaLayerGroup } from "react-icons/fa";
import "./SubPage.css";

function FeaturesPage({ onLaunchApp, onGoHome }) {
  return (
    <div className="subpage-container">
      <div className="subpage-hero">
        <div className="subpage-kicker">
          <span className="kicker-dot" />
          <span>ETHICAL AI CAPABILITIES // 06 CORE VECTORS</span>
        </div>
        <h1 className="subpage-title">
          Automated <span className="title-accent">Ethical & Cyber Risk</span> Detection
        </h1>
        <p className="subpage-sub">
          Deterministic neural heuristics, threat telemetry, and compliance scanners
          evaluating AI model endpoints and web platforms in real-time.
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
        <Features />
      </div>

      <div className="subpage-bottom-cta">
        <div className="subpage-bottom-card">
          <div className="subpage-bottom-left">
            <h3>Ready to Run a Full Feature Audit?</h3>
            <p>
              Inspect SSL certificates, privacy policies, phishing vectors, and security
              headers instantly with our zero-setup engine.
            </p>
          </div>
          <button
            type="button"
            className="subpage-bottom-btn"
            onClick={onLaunchApp}
          >
            <FaBolt />
            <span>Run Ethical Scan</span>
            <FaArrowRight />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default FeaturesPage;
