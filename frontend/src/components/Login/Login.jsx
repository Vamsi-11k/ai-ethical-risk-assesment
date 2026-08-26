import { useState } from "react";
import "./AuthPage.css";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaShieldAlt,
  FaChartLine,
  FaBalanceScale,
  FaUserShield,
  FaSignInAlt,
} from "react-icons/fa";

function Login({ onGoHome, onGoToSignup, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.message || "Invalid email or password.");
      }

      localStorage.setItem("token", resJson.token);
      localStorage.setItem("user", JSON.stringify(resJson.user));

      if (onLoginSuccess) {
        onLoginSuccess(resJson.user);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <div className="auth-brand">
        <div className="auth-brand-top">
          <div className="auth-brand-logo">
            <FaShieldAlt />
          </div>
          <div>
            <h1>EthicalAI</h1>
            <span>Risk Assessment Framework</span>
          </div>
        </div>

        <div className="auth-brand-mid">
          <h2>Assess AI risk with confidence.</h2>
          <p>
            Sign in to access fairness, privacy, and safety assessments for your
            AI systems, all in one dashboard.
          </p>

          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <div className="auth-brand-feature-icon">
                <FaBalanceScale />
              </div>
              <div className="auth-brand-feature-text">
                <h4>Fairness Analysis</h4>
                <p>Detect gender, age, and demographic bias in AI models.</p>
              </div>
            </div>
            <div className="auth-brand-feature">
              <div className="auth-brand-feature-icon">
                <FaUserShield />
              </div>
              <div className="auth-brand-feature-text">
                <h4>Privacy Assessment</h4>
                <p>Evaluate sensitive data handling and privacy compliance.</p>
              </div>
            </div>
            <div className="auth-brand-feature">
              <div className="auth-brand-feature-icon">
                <FaChartLine />
              </div>
              <div className="auth-brand-feature-text">
                <h4>Live Dashboard</h4>
                <p>Track risk scores and trends across every project.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-brand-bottom">
          © {new Date().getFullYear()} EthicalAI. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <button className="auth-back-home" onClick={onGoHome}>
          <FaArrowLeft /> Back to home
        </button>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your risk assessment dashboard.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
              <div className="input-wrap">
                <FaEnvelope className="input-icon" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrap">
                <FaLock className="input-icon" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              <FaSignInAlt /> {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn">
              <FaGoogle /> Google
            </button>
            <button type="button" className="social-btn">
              <FaGithub /> GitHub
            </button>
          </div>

          <p className="auth-footer">
            Don't have an account?{" "}
            <button type="button" className="link-btn" onClick={onGoToSignup}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
