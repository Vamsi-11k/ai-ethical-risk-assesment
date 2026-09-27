import { useState } from "react";
import "./AuthPage.css";
import {
  FaArrowLeft, FaEnvelope, FaLock, FaUser,
  FaEye, FaEyeSlash, FaGoogle, FaGithub,
  FaShieldAlt, FaChartLine, FaBalanceScale, FaUserShield,
} from "react-icons/fa";

function Signup({ onGoHome, onGoToLogin, onSignupSuccess }) {
  const [showPw,  setShowPw]  = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [agreed, setAgreed]   = useState(false);
  const [error,  setError]    = useState("");
  const [success,setSuccess]  = useState(false);
  const [busy,   setBusy]     = useState(false);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) { setError("all fields required."); return; }
    if (form.password.length < 6) { setError("password must be ≥ 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("passwords do not match."); return; }
    if (!agreed) { setError("you must accept the terms."); return; }
    setError(""); setBusy(true);
    try {
      const res  = await fetch("/api/auth/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "signup failed.");
      setSuccess(true);
      setTimeout(() => onSignupSuccess?.(json.user), 1500);
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
          <h2>Start auditing AI risk today.</h2>
          <p>Free account gives you full access to the ethical scanner and saved history.</p>
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
            <h2>Create account</h2>
            <p>Get started with your free risk assessment dashboard.</p>
          </div>

          {error   && <div className="auth-error">error: {error}</div>}
          {success && <div className="auth-success">account_created — redirecting…</div>}

          <form className="auth-form" onSubmit={submit}>
            <div className="input-group">
              <label htmlFor="s-name">full_name</label>
              <div className="input-wrap">
                <FaUser className="input-icon" />
                <input id="s-name" name="name" type="text" placeholder="Jane Doe"
                  value={form.name} onChange={change} />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="s-email">email_address</label>
              <div className="input-wrap">
                <FaEnvelope className="input-icon" />
                <input id="s-email" name="email" type="email" placeholder="you@company.com"
                  value={form.email} onChange={change} />
              </div>
            </div>
            <div className="auth-row">
              <div className="input-group">
                <label htmlFor="s-pw">password</label>
                <div className="input-wrap">
                  <FaLock className="input-icon" />
                  <input id="s-pw" name="password" type={showPw ? "text" : "password"}
                    placeholder="min 6 chars" value={form.password} onChange={change} />
                  <button type="button" className="toggle-password" onClick={() => setShowPw(v => !v)}>
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="s-cfm">confirm</label>
                <div className="input-wrap">
                  <FaLock className="input-icon" />
                  <input id="s-cfm" name="confirmPassword" type={showCfm ? "text" : "password"}
                    placeholder="repeat" value={form.confirmPassword} onChange={change} />
                  <button type="button" className="toggle-password" onClick={() => setShowCfm(v => !v)}>
                    {showCfm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            <label className="terms-check">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
              I agree to the <a href="#" onClick={e => e.preventDefault()}>terms_of_service</a>
              {" "}and <a href="#" onClick={e => e.preventDefault()}>privacy_policy</a>
            </label>
            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? "creating_account…" : "create_account →"}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>
          <div className="social-login">
            <button type="button" className="social-btn"><FaGoogle /> google</button>
            <button type="button" className="social-btn"><FaGithub /> github</button>
          </div>
          <p className="auth-footer">
            have an account?{" "}
            <button type="button" className="link-btn" onClick={onGoToLogin}>sign_in →</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
