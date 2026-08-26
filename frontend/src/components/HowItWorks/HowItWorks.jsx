import "./HowItWorks.css";
import {
  FaUpload,
  FaBrain,
  FaChartBar,
  FaLightbulb,
  FaFileDownload,
} from "react-icons/fa";

function HowItWorks() {
  const steps = [
    {
      icon: <FaUpload />,
      title: "Enter Website URL",
      desc: "Input the full URL of the website you want to scan for trust and security indicators.",
    },
    {
      icon: <FaBrain />,
      title: "Scan & Audit",
      desc: "Our engine inspects SSL records, security headers, domain registration, and threat intelligence.",
    },
    {
      icon: <FaChartBar />,
      title: "Calculate Trust Score",
      desc: "Generate a consolidated Trust Score from 0 to 100 based on the checks passed.",
    },
    {
      icon: <FaLightbulb />,
      title: "Identify Risk Levels",
      desc: "Classify potential threats into Low, Medium, or High risk levels for review.",
    },
    {
      icon: <FaFileDownload />,
      title: "Get Suggestions",
      desc: "Review clear suggestions to fix detected security flaws or privacy omissions.",
    },
  ];

  return (
    <section className="workflow" id="workflow">
      <div className="workflow-header">
        <h2>How It Works</h2>
        <p>Audit any website's trust and security indicators in five simple steps.</p>
      </div>

      <div className="workflow-container">
        {steps.map((step, index) => (
          <div className="workflow-card" key={index}>
            <div className="step-number">{index + 1}</div>

            <div className="workflow-icon">{step.icon}</div>

            <h3>{step.title}</h3>

            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
