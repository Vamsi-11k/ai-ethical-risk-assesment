import "./Navbar.css";
import { FaShieldAlt } from "react-icons/fa";

function Navbar({ onLoginClick, onSignupClick, user, onLogout }) {
  return (
    <header className="navbar">
      {/* Logo */}
      <div className="logo">
        <FaShieldAlt className="logo-icon" />

        <div className="logo-text">
          <h2>EthicalAI</h2>
          <span>Risk Assessment Framework</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#workflow">How It Works</a>
          </li>
          <li>
            <a href="#dashboard">Dashboard</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      {/* Action Buttons */}
      <div className="nav-buttons">
        {user ? (
          <>
            <span className="user-greeting" style={{ marginRight: "16px", color: "#e2e8f0", fontSize: "14px", fontWeight: "500" }}>
              Hello, {user.name}
            </span>
            <button className="login-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="login-btn" onClick={onLoginClick}>
              Login
            </button>

            <button className="register-btn" onClick={onSignupClick}>
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
