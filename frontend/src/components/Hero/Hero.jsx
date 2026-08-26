import "./Hero.css";
import { FaArrowRight, FaPlayCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <span className="badge">AI-Powered Website Trust Analysis</span>

        <h1>
          Know Before You <span>Trust a Website</span>
        </h1>

        <p>
          Scan and analyze websites for SSL verification, domain age, privacy policies,
          security headers, and phishing risk factors in real-time.
        </p>
        

        <div className="hero-buttons">
          
          <button className="primary-btn" onClick={() => window.location.href = "#dashboard"}>
            Start Assessment <FaArrowRight />
          </button>

          <button className="secondary-btn">
            <FaPlayCircle />
            Watch Demo
          </button>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-card">
          <h3>Scan Preview</h3>

          <div className="risk-item">
            <span>HTTPS Status</span>
            <span className="low">Pass</span>
          </div>

          <div className="risk-item">
            <span>SSL Certificate</span>
            <span className="low">Pass</span>
          </div>

          <div className="risk-item">
            <span>Privacy Policy</span>
            <span className="high">Missing</span>
          </div>

          <div className="risk-item">
            <span>Security Headers</span>
            <span className="medium">Warning</span>
          </div>

          <button className="analyze-btn" onClick={() => window.location.href = "#dashboard"}>Scan Website</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
