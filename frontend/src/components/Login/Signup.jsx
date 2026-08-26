import { useState } from "react";
import "./AuthPage.css";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaShieldAlt,
  FaChartLine,
  FaBalanceScale,
  FaUserShield,
  FaUserPlus,
} from "react-icons/fa";

function Signup({ onGoHome, onGoToLogin, onSignupSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.message || "Failed to create account. User might already exist.");
      }

      setSuccess(true);
      
      setTimeout(() => {
        if (onSignupSuccess) {
          onSignupSuccess(resJson.user);
        }
      }, 1500);
    } catch (err) {
      setError(err.message || "An unexpected error occurred during signup.");
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
          <h2>Start assessing AI risk today.</h2>
          <p>
            Create your free account and get instant access to fairness,
            privacy, and safety assessments for your AI systems.
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
            <h2>Create Your Account</h2>
            <p>Get started with your free risk assessment dashboard.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && (
            <div className="auth-success">
              Account created successfully! You can now sign in.
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="signup-name">Full Name</label>
              <div className="input-wrap">
                <FaUser className="input-icon" />
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="signup-email">Email</label>
              <div className="input-wrap">
                <FaEnvelope className="input-icon" />
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-row">
              <div className="input-group">
                <label htmlFor="signup-password">Password</label>
                <div className="input-wrap">
                  <FaLock className="input-icon" />
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="signup-confirm">Confirm Password</label>
                <div className="input-wrap">
                  <FaLock className="input-icon" />
                  <input
                    id="signup-confirm"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            <p className="password-hint">Use at least 8 characters.</p>

            <label className="terms-check">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </span>
            </label>

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              <FaUserPlus /> {isSubmitting ? "Creating Account..." : "Create Account"}
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
            Already have an account?{" "}
            <button type="button" className="link-btn" onClick={onGoToLogin}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
