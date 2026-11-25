import { useState } from "react";
import {
  FaSearch,
  FaArrowRight,
  FaCheckCircle,
  FaTerminal,
  FaLock,
  FaBalanceScale,
  FaEye,
  FaBrain,
  FaChevronDown,
} from "react-icons/fa";

const PRESETS = [
  { name: "OpenAI", url: "https://openai.com" },
  { name: "Anthropic", url: "https://anthropic.com" },
  { name: "Meta AI", url: "https://facebook.com" },
  { name: "Dark Patterns", url: "https://dark-patterns.com" },
];

function Hero({ onLaunchApp, onQuickScan }) {
  const [targetUrl, setTargetUrl] = useState("");

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      onLaunchApp();
      return;
    }
    onQuickScan(targetUrl.trim());
  };

  const handlePresetClick = (url) => {
    setTargetUrl(url);
    onQuickScan(url);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24" id="overview">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3.5 py-1.5">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-900">
              Autonomous AI Governance
            </span>
            <span className="rounded-full bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 px-2.5 py-0.5 font-mono text-[10px] font-bold text-white">
              AI ENGINE
            </span>
          </div>

          <h1 className="text-[2.25rem] font-extrabold tracking-[-0.035em] leading-[1.08] text-neutral-950 sm:text-5xl lg:text-[3.75rem]">
            Measurable Ethical Risk Across Every AI Endpoint.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium leading-relaxed text-neutral-800 sm:mt-6 sm:text-lg">
            Inspect websites and AI deployments for data privacy, algorithmic fairness,
            dark patterns, and transparency compliance — scored in real time from 0 to 100.
          </p>

          <form onSubmit={handleQuickSubmit} className="mx-auto mt-8 max-w-2xl sm:mt-10">
            <div className="flex flex-col gap-2 rounded-2xl border border-neutral-300 bg-white p-2 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.12)] transition-all duration-300 focus-within:border-black sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <FaSearch className="shrink-0 text-sm text-neutral-600" />
                <input
                  type="text"
                  placeholder="Enter target URL (e.g. https://openai.com)"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  spellCheck={false}
                  className="w-full bg-transparent text-sm font-medium text-neutral-950 placeholder:text-neutral-500 focus:outline-none sm:text-[15px]"
                />
              </div>
              <button
                type="submit"
                className="btn-black group min-h-[46px] w-full rounded-xl px-6 py-3 text-sm sm:w-auto"
              >
                <span>Run Audit</span>
                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700">
              Quick targets:
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handlePresetClick(p.url)}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => scrollToSection("telemetry")}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors duration-200 hover:text-black"
            >
              <span>Explore Telemetry</span>
              <FaChevronDown className="text-[10px]" />
            </button>
          </div>
        </div>

        <div id="telemetry" className="mt-12 sm:mt-16">
          <div className="overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-950" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-400" />
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-neutral-800">
                <FaTerminal className="text-neutral-950" />
                <span className="truncate">ETHICAL_AI_INSPECTOR // LIVE TELEMETRY</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold text-neutral-900">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                <span>MONITORING</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-8">
              <div className="flex flex-col gap-3 lg:col-span-8">
                {[
                  {
                    icon: <FaLock />,
                    name: "Data Sovereignty & Privacy",
                    desc: "GDPR Art. 13 & CCPA tracker evaluation",
                    score: "94/100 SAFE",
                    dark: false,
                  },
                  {
                    icon: <FaBalanceScale />,
                    name: "Algorithmic Fairness & Bias",
                    desc: "Disparate impact & parity demographic analysis",
                    score: "88/100 SAFE",
                    dark: false,
                  },
                  {
                    icon: <FaEye />,
                    name: "Dark Pattern & UX Manipulation",
                    desc: "Deceptive design & forced consent telemetry",
                    score: "76/100 MODERATE",
                    dark: true,
                  },
                  {
                    icon: <FaBrain />,
                    name: "Transparency & Explainability",
                    desc: "NIST AI RMF 1.0 source attribution validation",
                    score: "91/100 SAFE",
                    dark: false,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all duration-200 hover:border-neutral-400 hover:bg-white sm:flex-row sm:items-center"
                  >
                    <div className="flex items-start gap-3.5 sm:items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-950">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-950">{item.name}</div>
                        <div className="mt-0.5 text-xs font-medium text-neutral-700">{item.desc}</div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-semibold tabular-nums ${
                        item.dark
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-300 bg-white text-neutral-900"
                      }`}
                    >
                      {!item.dark && <FaCheckCircle className="text-[10px] text-neutral-900" />}
                      <span>{item.score}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center justify-between rounded-2xl bg-neutral-950 p-6 text-center text-white sm:p-8 lg:col-span-4">
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-2 border-neutral-600 bg-neutral-900">
                  <span className="font-mono text-4xl font-bold tracking-tight tabular-nums text-white">
                    87
                  </span>
                  <span className="font-mono text-[11px] text-neutral-300">/ 100</span>
                </div>

                <div className="mt-5">
                  <span className="inline-block rounded-full border border-neutral-600 bg-neutral-900 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-100">
                    LOW RISK // TRUSTED
                  </span>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-neutral-200">
                    Compliant across 18 of 20 ethical governance benchmarks.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onLaunchApp}
                  className="btn-black group mt-6 w-full rounded-xl border-white/25 bg-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-neutral-800 hover:border-white/50"
                >
                  <span>Open Audit Studio</span>
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-700">
            Aligned With Global Standards
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "NIST AI RMF 1.0",
              "EU AI ACT",
              "OWASP TOP 10 LLMs",
              "GDPR ART. 13/14",
              "ISO/IEC 42001",
            ].map((fw) => (
              <span
                key={fw}
                className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-1.5 font-mono text-[11px] font-semibold text-neutral-900"
              >
                {fw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
