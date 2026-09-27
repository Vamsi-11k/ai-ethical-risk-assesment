import Hero from "../components/Hero/Hero";
import Stats from "../components/Stats/Stats";
import Footer from "../components/Footer/Footer";
import { FaBolt, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import "./LandingPage.css";

function LandingPage({ onLaunchApp, onQuickScan }) {
  return (
    <div className="landing-page-container">
      {/* 1. Main Hero (Ethical AI Risk Governance with Living Green 3D World) */}
      <Hero onLaunchApp={onLaunchApp} onQuickScan={onQuickScan} />

      {/* 2. Platform Telemetry & Benchmarks */}
      <div id="metrics">
        <Stats />
      </div>

      {/* 3. Bottom CTA Banner: Launch Studio */}
      <section className="landing-bottom-cta">
        <div className="cta-card">
          <div className="cta-icon-wrap">
            <FaShieldAlt className="cta-shield" />
          </div>
          <div className="cta-content">
            <div className="cta-badge">ZERO-SETUP AUTONOMOUS SCANNING</div>
            <h2 className="cta-heading">Ready to Audit Your AI Infrastructure?</h2>
            <p className="cta-sub">
              Analyze model endpoints, privacy agreements, algorithmic fairness, and
              dark pattern manipulation in seconds.
            </p>
          </div>
          <button
            type="button"
            className="cta-action-btn"
            onClick={onLaunchApp}
          >
            <FaBolt />
            <span>Launch Audit Studio</span>
            <FaArrowRight />
          </button>
        </div>
      </section>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
