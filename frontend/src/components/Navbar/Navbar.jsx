import { useState } from "react";
import "./Navbar.css";
import {
  FaShieldAlt,
  FaBolt,
  FaHome,
  FaLayerGroup,
  FaProjectDiagram,
  FaAward,
  FaBalanceScale,
  FaBookOpen,
  FaEnvelope,
  FaSignOutAlt,
  FaArrowRight,
} from "react-icons/fa";

const NAV_TABS = [
  { id: "landing", label: "Overview", icon: <FaShieldAlt className="tab-ico" /> },
  { id: "features", label: "Features", icon: <FaLayerGroup className="tab-ico" /> },
  { id: "workflow", label: "Workflow", icon: <FaProjectDiagram className="tab-ico" /> },
  { id: "why-us", label: "Why Us", icon: <FaAward className="tab-ico" /> },
  { id: "categories", label: "Taxonomy", icon: <FaBalanceScale className="tab-ico" /> },
  { id: "manifesto", label: "Manifesto", icon: <FaBookOpen className="tab-ico" /> },
  { id: "contact", label: "Contact", icon: <FaEnvelope className="tab-ico" /> },
];

function Navbar({
  currentView = "landing",
  onNavigate,
  onLoginClick,
  onSignupClick,
  user,
  onLogout,
  riskTheme = "safe",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const getBeaconText = () => {
    if (riskTheme === "risky") return "CRITICAL RISK DETECTED";
    if (riskTheme === "moderate") return "MODERATE RISK DETECTED";
    return "ENGINE OPERATIONAL // SAFE";
  };

  return (
    <>
      <header className="navbar">
        {/* Animated Laser Sweeper Beam matching active risk theme */}
        <div className="nav-laser-beam" aria-hidden="true" />

        {/* Logo with Animated Glow Shield Icon */}
        <div
          className="logo"
          onClick={() => onNavigate("landing")}
          title="EthicalAI Home"
        >
          <div className="logo-icon-wrap">
            <FaShieldAlt className="logo-shield" />
            <span className="logo-glow-ring" />
          </div>
          <div className="logo-text">
            <h2>EthicalAI</h2>
            <span className="logo-tag">risk_governance_v2</span>
          </div>
        </div>

        {/* Live Operational Status Beacon */}
        <div className={`nav-status-beacon beacon-${riskTheme}`} title={getBeaconText()}>
          <span className="beacon-dot" />
          <span className="beacon-text">{getBeaconText()}</span>
        </div>

        {/* Separate Page Navigation Tabs with App-Related Icons */}
        <nav className="nav-center">
          <ul className="nav-links">
            {NAV_TABS.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(tab.id)}
                  className={`nav-link-btn ${currentView === tab.id ? "active" : ""}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="nav-buttons">
          {/* Audit Studio Button */}
          {currentView !== "app" ? (
            <button
              type="button"
              className="nav-launch-app-btn"
              onClick={() => onNavigate("app")}
              title="Open full Ethical AI Risk Studio & Scanner"
            >
              <FaBolt className="btn-bolt" />
              <span>Audit Studio</span>
              <FaArrowRight className="btn-arrow-slide" />
            </button>
          ) : (
            <button
              type="button"
              className="nav-back-home-btn"
              onClick={() => onNavigate("landing")}
              title="Return to Overview"
            >
              <FaHome />
              <span>Overview</span>
            </button>
          )}

          {/* User Authentication state */}
          {user ? (
            <div className="nav-user-cluster">
              <span className="nav-user-greeting">
                <span className="user-dot" />
                <span>{user.name}</span>
              </span>
              <button
                type="button"
                className="nav-logout-btn"
                onClick={onLogout}
                title="Log out"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="nav-auth-group">
              <button
                type="button"
                className="nav-login-btn"
                onClick={onLoginClick}
              >
                Sign In
              </button>
              <button
                type="button"
                className="nav-register-btn"
                onClick={onSignupClick}
              >
                Get Access
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`nav-hamburger ${mobileOpen ? "active" : ""}`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      <nav className={`nav-mobile ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-view-switch">
          <button
            type="button"
            className={`mobile-switch-pill ${currentView !== "app" ? "active" : ""}`}
            onClick={() => {
              onNavigate("landing");
              setMobileOpen(false);
            }}
          >
            Documentation & Pages
          </button>
          <button
            type="button"
            className={`mobile-switch-pill ${currentView === "app" ? "active" : ""}`}
            onClick={() => {
              onNavigate("app");
              setMobileOpen(false);
            }}
          >
            Audit Studio (App)
          </button>
        </div>

        <div className="mobile-links">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onNavigate(tab.id);
                setMobileOpen(false);
              }}
              className={`mobile-link-btn ${currentView === tab.id ? "active" : ""}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mobile-btns">
          {user ? (
            <button
              className="nav-logout-btn-full"
              onClick={() => {
                onLogout();
                setMobileOpen(false);
              }}
            >
              Sign Out ({user.name})
            </button>
          ) : (
            <>
              <button
                className="nav-login-btn-full"
                onClick={() => {
                  onLoginClick();
                  setMobileOpen(false);
                }}
              >
                Sign In
              </button>
              <button
                className="nav-register-btn-full"
                onClick={() => {
                  onSignupClick();
                  setMobileOpen(false);
                }}
              >
                Get Access
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
