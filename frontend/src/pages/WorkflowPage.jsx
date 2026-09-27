import HowItWorks from "../components/HowItWorks/HowItWorks";
import Footer from "../components/Footer/Footer";
import { FaBolt, FaArrowRight, FaHome, FaProjectDiagram } from "react-icons/fa";
import "./SubPage.css";

function WorkflowPage({ onLaunchApp, onGoHome }) {
  return (
    <div className="subpage-container">
      <div className="subpage-hero">
        <div className="subpage-kicker">
          <span className="kicker-dot" />
          <span>PIPELINE ARCHITECTURE // 06 DETERMINISTIC STAGES</span>
        </div>
        <h1 className="subpage-title">
          How the <span className="title-accent">Autonomous Audit Pipeline</span> Executes
        </h1>
        <p className="subpage-sub">
          From domain resolution and TLS inspection to NLP policy extraction, dark pattern
          detection, and aggregate weighted scoring — every stage runs in under 4 seconds.
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
        <HowItWorks />
      </div>

      <div className="subpage-bottom-cta">
        <div className="subpage-bottom-card">
          <div className="subpage-bottom-left">
            <h3>Test the 6-Stage Pipeline Live</h3>
            <p>
              Submit any public endpoint and observe all six deterministic analysis
              modules executing with live telemetry feeds.
            </p>
          </div>
          <button
            type="button"
            className="subpage-bottom-btn"
            onClick={onLaunchApp}
          >
            <FaBolt />
            <span>Test Pipeline</span>
            <FaArrowRight />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default WorkflowPage;
