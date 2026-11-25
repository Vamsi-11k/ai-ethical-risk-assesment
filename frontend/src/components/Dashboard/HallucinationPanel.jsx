import { useState } from "react";
import {
  FaBrain,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaLink,
  FaFileAlt,
} from "react-icons/fa";

const DEMO_CASES = [
  {
    name: "Grounded Text",
    tag: "Safe",
    theme: "green",
    text: "The NIST AI Risk Management Framework was released in 2023 to help organizations manage AI risks. More details are available at https://www.nist.gov/itl/ai-risk-management-framework.",
    context:
      "The NIST AI Risk Management Framework (AI RMF 1.0) was released in January 2023 to help organizations design and deploy trustworthy AI systems.",
    sourceUrl: "",
  },
  {
    name: "Contradiction & Fake Link",
    tag: "Risky",
    theme: "red",
    text: "Our AI model reduced error rates by 42% in 2023 across all clinics. Later benchmarks showed the same AI model increased error rates by 18% in 2021. The full study is published at https://nonexistent-domain-xyz-999123.example/paper and arXiv:9999.99999.",
    context: "",
    sourceUrl: "",
  },
  {
    name: "Context Mismatch",
    tag: "Moderate",
    theme: "yellow",
    text: "Python was created by Guido van Rossum and first released in 1998. It emphasizes code readability and supports multiple programming paradigms.",
    context:
      "Python is a high-level programming language created by Guido van Rossum and first released in 1991. Its design philosophy emphasizes code readability.",
    sourceUrl: "",
  },
];

const THEMES = {
  green: {
    scorePanel:
      "border-emerald-400 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.28)]",
    section:
      "border-emerald-300 bg-emerald-50/35 shadow-[0_12px_32px_-16px_rgba(16,185,129,0.18)]",
    headerBorder: "border-emerald-200",
    headerIcon: "bg-emerald-600 text-white",
    verdictText: "text-emerald-900",
    badge: "bg-emerald-600 text-white",
    stroke: "#22c55e",
    glow: "rgba(34, 197, 94, 0.75)",
    brightText: "#4ade80",
    divider: "border-emerald-200",
  },
  yellow: {
    scorePanel:
      "border-amber-400 bg-gradient-to-br from-amber-50 via-white to-yellow-100/75 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.28)]",
    section:
      "border-amber-300 bg-amber-50/40 shadow-[0_12px_32px_-16px_rgba(245,158,11,0.18)]",
    headerBorder: "border-amber-200",
    headerIcon: "bg-amber-500 text-neutral-950",
    verdictText: "text-amber-950",
    badge: "bg-amber-400 text-neutral-950",
    stroke: "#facc15",
    glow: "rgba(250, 204, 21, 0.8)",
    brightText: "#fde047",
    divider: "border-amber-200",
  },
  red: {
    scorePanel:
      "border-red-400 bg-gradient-to-br from-red-50 via-white to-rose-100/75 shadow-[0_20px_50px_-15px_rgba(239,68,68,0.3)]",
    section:
      "border-red-300 bg-red-50/40 shadow-[0_12px_32px_-16px_rgba(239,68,68,0.2)]",
    headerBorder: "border-red-200",
    headerIcon: "bg-red-600 text-white",
    verdictText: "text-red-950",
    badge: "bg-red-600 text-white",
    stroke: "#ef4444",
    glow: "rgba(239, 68, 68, 0.8)",
    brightText: "#f87171",
    divider: "border-red-200",
  },
};

function themeForScore(score) {
  if (score >= 70) return "green";
  if (score >= 50) return "yellow";
  return "red";
}

function HallucinationPanel({ onThemeChange }) {
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const runCheck = async (payloadText, payloadContext, payloadUrl) => {
    const clean = (payloadText ?? text).trim();
    if (clean.length < 12) {
      setError("Please enter at least 12 characters of AI-generated text.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/hallucination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: clean,
          context: (payloadContext ?? context).trim(),
          sourceUrl: (payloadUrl ?? sourceUrl).trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Hallucination check failed.");
      setResult(json.data);

      if (onThemeChange) {
        const s = json.data.score;
        if (s < 50) onThemeChange("risky");
        else if (s < 70) onThemeChange("moderate");
        else onThemeChange("safe");
      }
    } catch (err) {
      setError(err.message || "Unable to complete hallucination analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runCheck();
  };

  const applyDemo = (demo) => {
    setText(demo.text);
    setContext(demo.context);
    setSourceUrl(demo.sourceUrl);
    runCheck(demo.text, demo.context, demo.sourceUrl);
  };

  const activeTheme = result ? themeForScore(result.score) : "green";
  const palette = THEMES[activeTheme];
  const R = 43;
  const circ = 2 * Math.PI * R;
  const offset = result ? circ - (result.score / 100) * circ : circ;

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span>Zero-Cost Text Verification</span>
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
            AI Hallucination & Claim Detector
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-neutral-800 sm:text-[15px]">
            Paste AI-generated text to detect internal contradictions, broken or fabricated
            citations, Wikipedia fact mismatches, and ungrounded claims against optional
            reference text or a source URL.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-7 flex max-w-4xl flex-col gap-4">
          <div>
            <label
              htmlFor="hallucination-text"
              className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-800"
            >
              AI-Generated Text to Inspect
            </label>
            <textarea
              id="hallucination-text"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste AI output here (e.g. claims, summaries, citations, URLs, statistics)..."
              className="w-full rounded-2xl border border-neutral-300 bg-white p-4 text-sm font-medium text-neutral-950 placeholder:text-neutral-500 transition-colors focus:border-black focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label
                htmlFor="hallucination-context"
                className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-800"
              >
                Optional Reference Text
              </label>
              <textarea
                id="hallucination-context"
                rows={3}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Paste trusted ground-truth text to compare against..."
                className="w-full rounded-2xl border border-neutral-300 bg-white p-3.5 text-sm font-medium text-neutral-950 placeholder:text-neutral-500 transition-colors focus:border-black focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-between gap-3">
              <div>
                <label
                  htmlFor="hallucination-url"
                  className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-800"
                >
                  Optional Reference Source URL
                </label>
                <input
                  id="hallucination-url"
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://example.com/official-doc"
                  spellCheck={false}
                  className="min-h-[46px] w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-950 placeholder:text-neutral-500 transition-colors focus:border-black focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-black group min-h-[48px] w-full rounded-xl px-6 py-3 text-sm"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-white" />
                    <span>Verifying Claims…</span>
                  </>
                ) : (
                  <>
                    <FaBrain className="text-xs text-sky-300" />
                    <span>Detect Hallucinations</span>
                    <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-600 px-4 py-3 text-xs font-semibold text-white">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="mr-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700">
              Demo Cases:
            </span>
            {DEMO_CASES.map((demo) => (
              <button
                key={demo.name}
                type="button"
                disabled={loading}
                onClick={() => applyDemo(demo)}
                className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white disabled:opacity-50"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    demo.theme === "red"
                      ? "bg-red-500"
                      : demo.theme === "yellow"
                      ? "bg-amber-400"
                      : "bg-emerald-500"
                  }`}
                />
                <span>{demo.name}</span>
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-neutral-800 group-hover:bg-neutral-800 group-hover:text-neutral-100">
                  {demo.tag}
                </span>
              </button>
            ))}
          </div>
        </form>
      </section>

      {result && (
        <div className="flex flex-col gap-6 animate-fade-up">
          <div
            className={`flex flex-col items-center gap-6 rounded-3xl border-2 p-6 sm:flex-row sm:p-8 ${palette.scorePanel}`}
          >
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-neutral-950 p-2 shadow-xl sm:h-40 sm:w-40">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 overflow-visible">
                <circle cx="50" cy="50" r={R} fill="none" stroke="#27272a" strokeWidth="7.5" />
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke={palette.stroke}
                  strokeWidth="7.5"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  style={{ filter: `drop-shadow(0 0 8px ${palette.glow})` }}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="font-mono text-4xl font-extrabold tracking-tight tabular-nums sm:text-[2.75rem]"
                  style={{
                    color: palette.brightText,
                    textShadow: `0 0 18px ${palette.glow}`,
                  }}
                >
                  {result.score}
                </span>
                <span className="font-mono text-xs font-semibold text-neutral-300">/100</span>
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Factuality Integrity · {result.mode}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                <h2 className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${palette.verdictText}`}>
                  {result.verdict}
                </h2>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${palette.badge}`}
                >
                  Hallucination Risk: {result.hallucinationRisk}%
                </span>
              </div>

              <div className={`mt-5 grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-4 ${palette.divider}`}>
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-700">
                    Sentences
                  </div>
                  <div className="mt-0.5 font-mono text-sm font-bold text-neutral-950">
                    {result.summary.totalSentences}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-700">
                    Supported
                  </div>
                  <div className="mt-0.5 font-mono text-sm font-bold text-emerald-700">
                    {result.summary.supportedCount}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-700">
                    Unverified
                  </div>
                  <div className="mt-0.5 font-mono text-sm font-bold text-amber-700">
                    {result.summary.unverifiedCount}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-700">
                    Contradicted
                  </div>
                  <div className="mt-0.5 font-mono text-sm font-bold text-red-700">
                    {result.summary.contradictedCount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl border p-5 sm:p-6 ${palette.section}`}>
            <div className={`mb-4 flex items-center gap-2.5 border-b pb-3 ${palette.headerBorder}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs ${palette.headerIcon}`}>
                <FaFileAlt />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
                Sentence-by-Sentence Analysis
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {result.sentenceAnalysis.map((item) => {
                const style =
                  item.status === "supported"
                    ? {
                        card: "border-emerald-300 bg-white",
                        badge: "bg-emerald-600 text-white",
                        icon: <FaCheckCircle />,
                        label: "SUPPORTED",
                      }
                    : item.status === "contradicted"
                    ? {
                        card: "border-red-300 bg-white",
                        badge: "bg-red-600 text-white",
                        icon: <FaTimesCircle />,
                        label: "CONTRADICTED / FABRICATED",
                      }
                    : {
                        card: "border-amber-300 bg-white",
                        badge: "bg-amber-400 text-neutral-950",
                        icon: <FaExclamationTriangle />,
                        label: "UNVERIFIED",
                      };

                return (
                  <div key={item.index} className={`rounded-2xl border p-4 ${style.card}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-700">
                        Sentence #{item.index}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${style.badge}`}
                      >
                        {style.icon}
                        <span>{style.label}</span>
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-neutral-950">{item.sentence}</p>
                    <p className="mt-1.5 text-xs font-medium text-neutral-800">{item.reason}</p>
                    {item.evidence && (
                      <div className="mt-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800">
                        <span className="font-mono font-bold text-neutral-950">Evidence: </span>
                        <span>{item.evidence}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {result.citations.length > 0 && (
            <div className={`rounded-3xl border p-5 sm:p-6 ${palette.section}`}>
              <div className={`mb-4 flex items-center gap-2.5 border-b pb-3 ${palette.headerBorder}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs ${palette.headerIcon}`}>
                  <FaLink />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
                  Citation & Link Verification
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {result.citations.map((cit, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 rounded-xl border border-neutral-200 bg-white p-3.5 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-xs font-semibold text-neutral-950">
                        {cit.target}
                      </div>
                      <div className="mt-0.5 text-xs font-medium text-neutral-700">
                        {cit.detail}
                      </div>
                    </div>
                    <span
                      className={`w-fit shrink-0 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
                        cit.status === "verified"
                          ? "bg-emerald-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {cit.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`rounded-3xl border p-5 sm:p-6 ${palette.section}`}>
            <div className={`mb-4 flex items-center gap-2.5 border-b pb-3 ${palette.headerBorder}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs ${palette.headerIcon}`}>
                <FaExclamationTriangle />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
                Verification Summary
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {result.findings.map((f, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-neutral-950">{f.label}</h4>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        f.severity === "critical" || f.severity === "high"
                          ? "bg-red-600 text-white"
                          : f.severity === "medium"
                          ? "bg-amber-400 text-neutral-950"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {f.severity}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-neutral-800">{f.description}</p>
                  <p className="mt-1.5 text-xs font-semibold text-neutral-950">
                    Action: {f.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HallucinationPanel;
