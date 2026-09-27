import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import Footer from "../components/Footer/Footer";
import { FaBolt, FaArrowRight, FaHome, FaAward } from "react-icons/fa";
import "./SubPage.css";

function WhyUsPage({ onLaunchApp, onGoHome }) {
  return (
    <div className="subpage-container">
      <div className="subpage-hero">
        <div className="subpage-kicker">
          <span className="kicker-dot" />
          <span>GOVERNANCE & TRUST // NIST AI RMF & EU AI ACT</span>
        </div>
        <h1 className="subpage-title">
          Why Organizations <span className="title-accent">Trust Our Ethical AI</span> Scanner
        </h1>
        <p className="subpage-sub">
          Unlike opaque proprietary black boxes, our evaluation pipeline operates on
          explainable indicators, strict zero-retention policies, and empirical threat intelligence.
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
        <WhyChooseUs />
      </div>

      <div className="subpage-bottom-cta">
        <div className="subpage-bottom-card">
          <div className="subpage-bottom-left">
            <h3>Benchmark Your AI Footprint</h3>
            <p>
              Compare your systems against global threat databases and ethical governance
              standards in seconds.
            </p>
          </div>
          <button
            type="button"
            className="subpage-bottom-btn"
            onClick={onLaunchApp}
          >
            <FaBolt />
            <span>Benchmark URL</span>
            <FaArrowRight />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default WhyUsPage;
