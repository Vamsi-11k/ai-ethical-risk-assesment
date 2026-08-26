import "./RiskCategories.css";
import {
  FaLock,
  FaGlobe,
  FaFileContract,
  FaShieldAlt,
  FaLink,
  FaExclamationTriangle,
} from "react-icons/fa";

function RiskCategories() {
  const risks = [
    {
      title: "HTTPS & SSL Verification",
      value: 95,
      color: "#10b981", // green
      status: "Secure",
      icon: <FaLock />,
    },
    {
      title: "Domain Reputation & Age",
      value: 85,
      color: "#10b981", // green
      status: "Trusted",
      icon: <FaGlobe />,
    },
    {
      title: "Privacy & Terms Presence",
      value: 40,
      color: "#f59e0b", // amber
      status: "Warning",
      icon: <FaFileContract />,
    },
    {
      title: "Security Headers",
      value: 55,
      color: "#f59e0b", // amber
      status: "Moderate",
      icon: <FaShieldAlt />,
    },
    {
      title: "Suspicious URL Patterns",
      value: 20,
      color: "#ef4444", // red
      status: "High Risk",
      icon: <FaLink />,
    },
    {
      title: "Phishing Indicators",
      value: 15,
      color: "#ef4444", // red
      status: "High Risk",
      icon: <FaExclamationTriangle />,
    },
  ];

  return (
    <section className="risk-section">
      <div className="risk-heading">
        <h2>Risk Categories</h2>

        <p>
          Understand the critical indicators evaluated during our website trust
          assessment.
        </p>
      </div>

      <div className="risk-grid">
        {risks.map((risk, index) => (
          <div className="risk-card" key={index}>
            <div
              className="circle"
              style={{
                background: `conic-gradient(${risk.color} ${risk.value * 3.6}deg,#e5e7eb 0deg)`,
              }}
            >
              <div className="inner-circle" style={{ fontSize: "32px", color: risk.color }}>
                {risk.icon}
              </div>
            </div>

            <h3>{risk.title}</h3>

            <p style={{ color: risk.color }}>{risk.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RiskCategories;
