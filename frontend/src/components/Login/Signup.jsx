import { useState } from "react";
import BrandLogo from "../BrandLogo";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaChartLine,
  FaBalanceScale,
  FaUserShield,
} from "react-icons/fa";

function Signup({ onGoHome, onGoToLogin, onSignupSuccess }) {
  const [showPw, setShowPw] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
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
      setError("You must accept the terms.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Signup failed.");
      setSuccess(true);
      setTimeout(() => onSignupSuccess?.(json.user), 1500);
    } catch (err) {
      setError(err.message || "Unexpected error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-white lg:grid-cols-12">
      <div className="hidden flex-col justify-between bg-neutral-950 p-10 text-white lg:col-span-5 lg:flex">
        <div className="flex items-center gap-3">
          <BrandLogo size="lg" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">EthicalAI</h1>
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text font-mono text-[11px] font-semibold uppercase tracking-wider text-transparent">
              Risk Intelligence
            </span>
          </div>
        </div>

        <div className="my-auto py-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Start auditing AI risk today.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-200">
            Free account gives you full access to the ethical scanner and saved history.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {[
              {
                icon: <FaBalanceScale />,
                title: "Bias & Fairness Analysis",
                desc: "Detect demographic bias signals in AI-facing content.",
              },
              {
                icon: <FaUserShield />,
                title: "Privacy Assessment",
                desc: "Evaluate personal data handling and consent practices.",
              },
              {
                icon: <FaChartLine />,
                title: "Live Dashboard",
                desc: "Track risk scores and scan history across sessions.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sm text-black">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{f.title}</h4>
                  <p className="mt-0.5 text-xs text-neutral-300">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="font-mono text-xs text-neutral-500">
          © {new Date().getFullYear()} EthicalAI. All rights reserved.
        </div>
      </div>

      <div className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:col-span-7 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={onGoHome}
            className="btn-outline-mono mb-6 rounded-xl px-3.5 py-2 text-xs"
          >
            <FaArrowLeft className="text-[11px]" />
            <span>Back to Home</span>
          </button>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                Create account
              </h2>
              <p className="mt-1 text-sm font-medium text-neutral-800">
                Get started with your free risk assessment dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl bg-black px-4 py-3 text-xs font-medium text-white">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-5 rounded-xl border border-neutral-300 bg-neutral-100 px-4 py-3 text-xs font-semibold text-neutral-950">
                Account created — redirecting…
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={submit}>
              <div>
                <label
                  htmlFor="s-name"
                  className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                >
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <FaUser className="pointer-events-none absolute left-3.5 text-xs text-neutral-400" />
                  <input
                    id="s-name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={change}
                    className="min-h-[46px] w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 text-sm text-neutral-950 placeholder:text-neutral-400 transition-colors focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="s-email"
                  className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <FaEnvelope className="pointer-events-none absolute left-3.5 text-xs text-neutral-400" />
                  <input
                    id="s-email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={change}
                    className="min-h-[46px] w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-4 text-sm text-neutral-950 placeholder:text-neutral-400 transition-colors focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="s-pw"
                    className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <FaLock className="pointer-events-none absolute left-3.5 text-xs text-neutral-400" />
                    <input
                      id="s-pw"
                      name="password"
                      type={showPw ? "text" : "password"}
                      placeholder="Min 6 chars"
                      value={form.password}
                      onChange={change}
                      className="min-h-[46px] w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-10 text-sm text-neutral-950 placeholder:text-neutral-400 transition-colors focus:border-black focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 text-neutral-400 hover:text-black"
                    >
                      {showPw ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="s-cfm"
                    className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Confirm
                  </label>
                  <div className="relative flex items-center">
                    <FaLock className="pointer-events-none absolute left-3.5 text-xs text-neutral-400" />
                    <input
                      id="s-cfm"
                      name="confirmPassword"
                      type={showCfm ? "text" : "password"}
                      placeholder="Repeat"
                      value={form.confirmPassword}
                      onChange={change}
                      className="min-h-[46px] w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-10 pr-10 text-sm text-neutral-950 placeholder:text-neutral-400 transition-colors focus:border-black focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCfm((v) => !v)}
                      className="absolute right-3 text-neutral-400 hover:text-black"
                    >
                      {showCfm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 text-xs text-neutral-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-black"
                />
                <span>
                  I agree to the{" "}
                  <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-black underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-black underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={busy}
                className="btn-black mt-2 min-h-[46px] w-full rounded-xl text-sm"
              >
                {busy ? "Creating Account…" : "Create Account"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-neutral-400">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="font-mono uppercase">or</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="btn-outline-mono min-h-[44px] rounded-xl text-xs"
              >
                <FaGoogle />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="btn-outline-mono min-h-[44px] rounded-xl text-xs"
              >
                <FaGithub />
                <span>GitHub</span>
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-neutral-600">
              Have an account?{" "}
              <button
                type="button"
                onClick={onGoToLogin}
                className="font-semibold text-black underline underline-offset-4 hover:text-neutral-700"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
