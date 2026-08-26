import "./WhyChooseUs.css";
import {
  FaBolt,
  FaRobot,
  FaShieldAlt,
  FaChartLine,
  FaFilePdf,
  FaGlobe,
} from "react-icons/fa";

function WhyChooseUs() {
  const reasons = [
    {
      icon: <FaBolt />,
      title: "Fast Assessment",
      desc: "Analyze site status, SSL certificates, and security headers within seconds.",
    },
    {
      icon: <FaRobot />,
      title: "AI Powered",
      desc: "Intelligent threat evaluation flags lookalike branding, domain spoofing, and reputation anomalies.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Platform",
      desc: "Your searches and scan results are processed privately without exposing personal search logs.",
    },
    {
      icon: <FaChartLine />,
      title: "Interactive Dashboard",
      desc: "Visualize check checklists and risk flags in a clear, interactive web dashboard.",
    },
    {
      icon: <FaFilePdf />,
      title: "Professional Reports",
      desc: "Generate downloadable PDF safety reports of any audited domain instantly.",
    },
    {
      icon: <FaGlobe />,
      title: "Global Compliance",
      desc: "Check alignment with modern web security best practices, GDPR policies, and privacy standards.",
    },
  ];

  return (
    <section className="choose">
      <div className="choose-title">
        <h2>Why Choose Our Platform?</h2>

        <p>
          A complete website audit framework for evaluating security posture and user trust signals.
        </p>
      </div>

      <div className="choose-grid">
        {reasons.map((item, index) => (
          <div className="choose-card" key={index}>
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
