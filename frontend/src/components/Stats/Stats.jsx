import "./Stats.css";
import { FaClipboardCheck, FaChartLine, FaShieldAlt, FaGlobe } from "react-icons/fa";

const STATS = [
  { icon: <FaClipboardCheck />, value: "10,000+", label: "scans_performed" },
  { icon: <FaChartLine />,      value: "98.2%",   label: "detection_accuracy" },
  { icon: <FaShieldAlt />,      value: "5",        label: "risk_categories" },
  { icon: <FaGlobe />,          value: "3.2s",     label: "avg_scan_time" },
];

function Stats() {
  return (
    <div className="stats">
      {STATS.map((s, i) => (
        <div className="stat-card" key={i}>
          <div className="stat-icon-wrap">{s.icon}</div>
          <div className="stat-text">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Stats;
