import { useState } from "react";
import "./AuthPage.css";
import {
  FaArrowLeft, FaEnvelope, FaLock,
  FaEye, FaEyeSlash, FaGoogle, FaGithub,
  FaShieldAlt, FaChartLine, FaBalanceScale, FaUserShield,
} from "react-icons/fa";

function Login({ onGoHome, onGoToSignup, onLoginSuccess, initialEmail = "" }) {
  const [showPw, setShowPw] = useState(false);
  const [form,   setForm]   = useState({ email: initialEmail, password: "" });
  const [remember, setRemember] = useState(false);
  const [error, setError]   = useState("");
  const [busy,  setBusy]    = useState(false);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("email and password required."); return; }
    setError(""); setBusy(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "invalid credentials.");
      localStorage.setItem("token", json.token);
      localStorage.setItem("user",  JSON.stringify(json.user));
      onLoginSuccess?.(json.user);
    } catch (err) {
      setError(err.message || "unexpected error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand-top">
          <div className="auth-brand-logo"><FaShieldAlt /></div>
          <div><h1>EthicalAI</h1><span>risk_scanner_v2</span></div>
        </div>
        <div className="auth-brand-mid">
          <h2>Assess AI risk with confidence.</h2>
          <p>Sign in to access the full ethical audit dashboard and saved scan history.</p>
          <div className="auth-brand-features">
            {[
              { icon: <FaBalanceScale />, title: "bias_fairness_analysis",  desc: "Detect demographic bias signals in AI-facing content." },
              { icon: <FaUserShield />,   title: "privacy_assessment",       desc: "Evaluate personal data handling and consent practices." },
              { icon: <FaChartLine />,    title: "live_dashboard",           desc: "Track risk scores and scan history across sessions." },
            ].map((f, i) => (
              <div className="auth-brand-feature" key={i}>
                <div className="auth-brand-feature-icon">{f.icon}</div>
                <div className="auth-brand-feature-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-brand-bottom">© {new Date().getFullYear()} EthicalAI. All rights reserved.</div>
      </div>

      <div className="auth-form-panel">
        <button className="auth-back-home" onClick={onGoHome}><FaArrowLeft /> back_to_home</button>
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Sign in</h2>
            <p>Access your risk assessment dashboard.</p>
          </div>

          {error && <div className="auth-error">error: {error}</div>}

          <form className="auth-form" onSubmit={submit}>
            <div className="input-group">
              <label htmlFor="l-email">email_address</label>
              <div className="input-wrap">
                <FaEnvelope className="input-icon" />
                <input id="l-email" name="email" type="email" placeholder="you@company.com"
                  value={form.email} onChange={change} />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="l-pw">password</label>
              <div className="input-wrap">
                <FaLock className="input-icon" />
                <input id="l-pw" name="password" type={showPw ? "text" : "password"}
                  placeholder="••••••••" value={form.password} onChange={change} />
                <button type="button" className="toggle-password" onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? "Hide" : "Show"}>
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                remember_me
              </label>
              <a href="#" className="forgot-link">forgot_password?</a>
            </div>
            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? "authenticating…" : "sign_in →"}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>
          <div className="social-login">
            <button type="button" className="social-btn"><FaGoogle /> google</button>
            <button type="button" className="social-btn"><FaGithub /> github</button>
          </div>
          <p className="auth-footer">
            no account?{" "}
            <button type="button" className="link-btn" onClick={onGoToSignup}>create_account →</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
