import "./Stats.css";
import {
  FaClipboardCheck,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

function Stats() {
  return (
    <section className="stats">
      <div className="stat-card">
        <FaClipboardCheck className="stat-icon" />

        <h2>10,000+</h2>

        <p>Scans Performed</p>
      </div>

      <div className="stat-card">
        <FaChartLine className="stat-icon" />

        <h2>98%</h2>

        <p>Accuracy in Phishing Detection</p>
      </div>

      <div className="stat-card">
        <FaShieldAlt className="stat-icon" />

        <h2>15+</h2>

        <p>Security & Trust Indicators</p>
      </div>

      <div className="stat-card">
        <FaUsers className="stat-icon" />

        <h2>5,000+</h2>

        <p>Websites Analyzed</p>
      </div>
    </section>
  );
}

export default Stats;
