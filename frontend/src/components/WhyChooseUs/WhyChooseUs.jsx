import "./WhyChooseUs.css";
import { FaBolt, FaRobot, FaLock, FaChartLine, FaCode, FaGlobe } from "react-icons/fa";

const ITEMS = [
  { icon: <FaBolt />,     title: "sub_4s_scan_time",       desc: "Full five-category ethical audit completes in under four seconds on average." },
  { icon: <FaRobot />,    title: "ml_threat_detection",    desc: "Intelligent pattern recognition flags brand spoofing, dark patterns, and consent manipulation." },
  { icon: <FaLock />,     title: "no_data_retention",      desc: "Scanned URLs and results are never stored beyond your session unless you are signed in." },
  { icon: <FaChartLine />,title: "explainable_scores",     desc: "Every risk score shows the exact signals that contributed — no black box verdicts." },
  { icon: <FaCode />,     title: "open_methodology",       desc: "Scoring methodology is documented and follows established AI ethics frameworks." },
  { icon: <FaGlobe />,    title: "global_threat_coverage", desc: "Cross-references 15+ threat intelligence feeds covering phishing, malware, and fraud domains." },
];

function WhyChooseUs() {
  return (
    <section className="choose">
      <div className="sec-head">
        <div className="sec-label">rationale</div>
        <h2>Why trust this scanner</h2>
        <p>Designed for security teams, developers, and researchers who need auditability.</p>
      </div>

      <div className="choose-grid">
        {ITEMS.map((item, i) => (
          <div className="choose-card" key={i}>
            <div className="choose-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
