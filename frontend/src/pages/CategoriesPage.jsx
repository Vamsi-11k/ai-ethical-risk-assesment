import RiskCategories from "../components/RiskCategories/RiskCategories";
import Footer from "../components/Footer/Footer";
import { FaBolt, FaArrowRight, FaHome, FaBalanceScale } from "react-icons/fa";
import "./SubPage.css";

function CategoriesPage({ onLaunchApp, onGoHome }) {
  return (
    <div className="subpage-container">
      <div className="subpage-hero">
        <div className="subpage-kicker">
          <span className="kicker-dot" />
          <span>SCORING TAXONOMY // 05 RISK DOMAINS</span>
        </div>
        <h1 className="subpage-title">
          Five Ethical <span className="title-accent">Risk Domains & Thresholds</span>
        </h1>
        <p className="subpage-sub">
          Every audit aggregates data privacy, transparency, algorithmic bias, manipulation
          mechanisms, and authenticity into a weighted, normalized 0–100 index.
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
        <RiskCategories />
      </div>

      <div className="subpage-bottom-cta">
        <div className="subpage-bottom-card">
          <div className="subpage-bottom-left">
            <h3>Explore How Your Site Scores</h3>
            <p>
              Receive an itemized breakdown of scores across all five ethical categories
              with immediate remedial guidance.
            </p>
          </div>
          <button
            type="button"
            className="subpage-bottom-btn"
            onClick={onLaunchApp}
          >
            <FaBolt />
            <span>Calculate Score</span>
            <FaArrowRight />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CategoriesPage;
