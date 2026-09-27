import { useState } from "react";
import "./Navbar.css";
import { FaShieldAlt } from "react-icons/fa";

const NAV = [
  { label: "scanner",    href: "#scanner" },
  { label: "features",   href: "#features" },
  { label: "how_it_works", href: "#workflow" },
  { label: "about",      href: "#about" },
  { label: "contact",    href: "#contact" },
];

function Navbar({ onLoginClick, onSignupClick, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <div className="logo-icon-wrap"><FaShieldAlt /></div>
          <div className="logo-text">
            <h2>EthicalAI</h2>
            <span>risk_scanner_v2</span>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            {NAV.map(l => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-buttons">
          {user ? (
            <>
              <span className="nav-user-greeting">{user.name}</span>
              <button className="nav-login-btn" onClick={onLogout}>logout</button>
            </>
          ) : (
            <>
              <button className="nav-login-btn"    onClick={onLoginClick}>login</button>
              <button className="nav-register-btn" onClick={onSignupClick}>get_access</button>
            </>
          )}
        </div>

        <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </header>

      <nav className={`nav-mobile ${mobileOpen ? "open" : ""}`}>
        {NAV.map(l => (
          <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
        ))}
        <div className="mobile-btns">
          {user ? (
            <button className="nav-login-btn" onClick={() => { onLogout(); setMobileOpen(false); }}>logout</button>
          ) : (
            <>
              <button className="nav-login-btn"    onClick={() => { onLoginClick();  setMobileOpen(false); }}>login</button>
              <button className="nav-register-btn" onClick={() => { onSignupClick(); setMobileOpen(false); }}>get_access</button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
