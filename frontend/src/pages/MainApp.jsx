import { useState } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import HallucinationPanel from "../components/Dashboard/HallucinationPanel";
import Dock from "../components/Dock/Dock";
import {
  FaSearch,
  FaArrowRight,
  FaHome,
  FaBolt,
  FaChartLine,
  FaBalanceScale,
  FaFingerprint,
  FaArrowUp,
  FaBrain,
  FaGlobe,
} from "react-icons/fa";

const PRESETS = [
  { name: "OpenAI", tag: "Safe", url: "https://openai.com", theme: "safe" },
  { name: "Meta AI", tag: "Moderate", url: "https://facebook.com", theme: "moderate" },
  { name: "Dark Patterns", tag: "Risky", url: "https://dark-patterns.com", theme: "risky" },
  { name: "Anthropic", tag: "Safe", url: "https://anthropic.com", theme: "safe" },
  { name: "GitHub", tag: "Safe", url: "https://github.com", theme: "safe" },
];

function MainApp({
  user,
  scanUrl,
  scanTimestamp,
  isScanning,
  onScan,
  onScanComplete,
  onGoHome,
  onThemeChange,
}) {
  const [studioMode, setStudioMode] = useState("url");
  const [inputUrl, setInputUrl] = useState(scanUrl || "");
  const [prevScanUrl, setPrevScanUrl] = useState(scanUrl);

  if (scanUrl && scanUrl !== prevScanUrl) {
    setPrevScanUrl(scanUrl);
    setInputUrl(scanUrl);
    setStudioMode("url");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onScan(inputUrl.trim());
  };

  const handlePreset = (preset) => {
    setInputUrl(preset.url);
    if (preset.theme && onThemeChange) {
      onThemeChange(preset.theme);
    }
    onScan(preset.url);
  };

  const dockItems = [
    {
      icon: <FaGlobe size={17} />,
      label: "URL Scanner",
      onClick: () => setStudioMode("url"),
    },
    {
      icon: <FaBrain size={17} />,
      label: "Hallucination Check",
      onClick: () => setStudioMode("hallucination"),
    },
    {
      icon: <FaChartLine size={17} />,
      label: "Audit Results",
      onClick: () => {
        const el = document.getElementById("results");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: <FaBalanceScale size={17} />,
      label: "5 Risk Vectors",
      onClick: () => {
        const el = document.getElementById("category-breakdown");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: <FaFingerprint size={17} />,
      label: "Forensic Stack",
      onClick: () => {
        const el = document.getElementById("tech-stack-section") || document.getElementById("results");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: <FaBolt size={17} />,
      label: "Quick Scan Demo",
      onClick: () => {
        setStudioMode("url");
        handlePreset(PRESETS[0]);
      },
    },
    {
      icon: <FaArrowUp size={17} />,
      label: "Top of Studio",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      icon: <FaHome size={17} />,
      label: "Landing Page",
      onClick: onGoHome,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onGoHome}
            className="btn-outline-mono rounded-xl px-3.5 py-2 text-xs"
          >
            <FaHome className="text-[11px]" />
            <span>Landing Page</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-900">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600" />
            <span>AI Ethical Risk Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setStudioMode("url")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              studioMode === "url"
                ? "bg-black text-white shadow-xs"
                : "text-neutral-700 hover:text-black"
            }`}
          >
            <FaGlobe className="text-[11px]" />
            <span>URL Scanner</span>
          </button>
          <button
            type="button"
            onClick={() => setStudioMode("hallucination")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              studioMode === "hallucination"
                ? "bg-black text-white shadow-xs"
                : "text-neutral-700 hover:text-black"
            }`}
          >
            <FaBrain className="text-[11px]" />
            <span>Hallucination Detector</span>
          </button>
        </div>
      </div>

      {studioMode === "hallucination" ? (
        <HallucinationPanel onThemeChange={onThemeChange} />
      ) : (
        <>
          <section id="scanner" className="mb-10 rounded-3xl border border-neutral-200 bg-neutral-50/70 p-5 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full border border-neutral-300 bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-800">
                Autonomous Audit Console
              </span>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
                Inspect & Score Any AI Web Target
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-neutral-800 sm:text-[15px]">
                Enter a web application, model API interface, or service URL to evaluate
                data privacy, algorithmic fairness, dark patterns, and compliance telemetry.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-3xl">
              <div className="flex flex-col gap-2 rounded-2xl border border-neutral-300 bg-white p-2 shadow-sm transition-all duration-300 focus-within:border-black sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3 px-3 py-2">
                  <FaSearch className="shrink-0 text-sm text-neutral-600" />
                  <span className="hidden font-mono text-xs font-semibold text-neutral-600 sm:inline">
                    target://
                  </span>
                  <input
                    type="text"
                    placeholder="https://openai.com or https://anthropic.com"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-transparent text-sm font-medium text-neutral-950 placeholder:text-neutral-500 focus:outline-none sm:text-[15px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isScanning}
                  className="btn-black group min-h-[46px] w-full rounded-xl px-6 py-3 text-sm sm:w-auto"
                >
                  {isScanning ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-white" />
                      <span>Auditing Target…</span>
                    </>
                  ) : (
                    <>
                      <span>Run Ethical Audit</span>
                      <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <span className="mr-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700">
                  Demo Targets:
                </span>
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handlePreset(p)}
                    disabled={isScanning}
                    className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white disabled:opacity-50"
                  >
                    <span
                      className={`h-2 w-2 rounded-full transition-colors ${
                        p.theme === "risky"
                          ? "bg-red-500"
                          : p.theme === "moderate"
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                      }`}
                    />
                    <span>{p.name}</span>
                    <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-neutral-800 transition-colors group-hover:bg-neutral-800 group-hover:text-neutral-100">
                      {p.tag}
                    </span>
                  </button>
                ))}
              </div>
            </form>
          </section>

          <section id="results">
            <Dashboard
              user={user}
              scanUrl={scanUrl}
              scanTimestamp={scanTimestamp}
              isScanning={isScanning}
              onScanComplete={onScanComplete}
              onThemeChange={onThemeChange}
            />
          </section>
        </>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3">
        <div className="pointer-events-auto">
          <Dock
            items={dockItems}
            panelHeight={58}
            baseItemSize={42}
            magnification={60}
            distance={160}
          />
        </div>
      </div>
    </div>
  );
}

export default MainApp;
