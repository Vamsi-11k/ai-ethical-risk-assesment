import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import { FaBolt, FaArrowRight, FaHome, FaEnvelope } from "react-icons/fa";
import "./SubPage.css";

function ContactPage({ onLaunchApp, onGoHome }) {
  return (
    <div className="subpage-container">
      <div className="subpage-hero">
        <div className="subpage-kicker">
          <span className="kicker-dot" />
          <span>RESEARCH & ENTERPRISE INQUIRIES</span>
        </div>
        <h1 className="subpage-title">
          Connect With Our <span className="title-accent">AI Safety & Governance</span> Team
        </h1>
        <p className="subpage-sub">
          Need custom enterprise compliance telemetry, continuous model auditing, or
          academic research collaboration? We are here to support your mission.
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
        <Contact />
      </div>

      <Footer />
    </div>
  );
}

export default ContactPage;
