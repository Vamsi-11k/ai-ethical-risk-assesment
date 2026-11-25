import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaStepBackward,
  FaStepForward,
  FaLock,
  FaGlobe,
  FaSearch,
  FaShieldAlt,
  FaCheckCircle,
  FaBrain,
  FaTimesCircle,
  FaExclamationTriangle,
  FaLink,
  FaCode,
} from "react-icons/fa";

const URL_STAGES = [
  {
    id: "url-ingest",
    num: "01",
    title: "URL Ingestion & Parsing",
    caption: "Parses protocol, domain tokens, and validates target safety before connecting.",
    tag: "INPUT",
  },
  {
    id: "url-tls",
    num: "02",
    title: "TLS Handshake & Headers",
    caption: "Verifies SSL/TLS 1.3 certificates and inspects HSTS, CSP, and framing headers.",
    tag: "NETWORK",
  },
  {
    id: "url-dom",
    num: "03",
    title: "DOM & Dark Pattern Scan",
    caption: "Sweeps page markup for hidden trackers, deceptive consent flows, and policy links.",
    tag: "DOM + NLP",
  },
  {
    id: "url-stack",
    num: "04",
    title: "Stack & Threat Radar",
    caption: "Cross-checks 15+ threat feeds while fingerprinting frameworks, CDNs, and servers.",
    tag: "FINGERPRINT",
  },
  {
    id: "url-ml",
    num: "05",
    title: "ML & 5-Vector Scoring",
    caption: "Combines ML features and SHAP explanations across five ethical risk weights.",
    tag: "ML + SHAP",
  },
  {
    id: "url-scorecard",
    num: "06",
    title: "Risk Scorecard Output",
    caption: "Produces a 0–100 score with red, yellow, or green theme bands and remediation.",
    tag: "SCORECARD",
  },
];

const HALLUCINATION_STAGES = [
  {
    id: "hal-split",
    num: "01",
    title: "Claim & Token Extraction",
    caption: "Splits AI text into atomic sentences and extracts numbers, years, entities, and links.",
    tag: "TOKENIZER",
  },
  {
    id: "hal-citations",
    num: "02",
    title: "Live Citation Verification",
    caption: "Probes every URL, DOI, and arXiv ID live to expose fabricated or 404 references.",
    tag: "LIVE PROBE",
  },
  {
    id: "hal-contradict",
    num: "03",
    title: "Self-Contradiction Matrix",
    caption: "Compares sentence pairs on the same topic to catch opposing claims or conflicting stats.",
    tag: "CONSISTENCY",
  },
  {
    id: "hal-context",
    num: "04",
    title: "Reference Context Matching",
    caption: "Aligns each sentence against pasted reference text or a fetched webpage for mismatches.",
    tag: "GROUNDING",
  },
  {
    id: "hal-wiki",
    num: "05",
    title: "Free Wikipedia Fact Check",
    caption: "Queries the keyless Wikipedia API to verify public entities, summaries, and dates.",
    tag: "OPEN FACTS",
  },
  {
    id: "hal-report",
    num: "06",
    title: "Factuality Integrity Score",
    caption: "Labels every sentence Supported, Unverified, or Contradicted with an integrity score.",
    tag: "VERDICT",
  },
];

function UrlStageVisual({ stageIndex }) {
  if (stageIndex === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-5 sm:p-8">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-lg rounded-2xl border border-neutral-700 bg-neutral-900 p-4 shadow-xl"
        >
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-neutral-400">
            <span>TARGET INPUT STREAM</span>
            <span className="text-sky-400">READY</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5">
            <FaSearch className="text-sky-400" />
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="overflow-hidden whitespace-nowrap font-mono text-xs text-white sm:text-sm"
            >
              https://example-ai.com/platform
            </motion.span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className="h-4 w-0.5 bg-sky-400"
            />
          </div>
        </motion.div>

        <div className="grid w-full max-w-lg grid-cols-3 gap-2.5">
          {[
            { label: "PROTOCOL", val: "HTTPS", delay: 0.2 },
            { label: "HOST", val: "example-ai.com", delay: 0.4 },
            { label: "SSRF GUARD", val: "PASSED", delay: 0.6 },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay }}
              className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-3 text-center"
            >
              <div className="font-mono text-[10px] text-neutral-400">{item.label}</div>
              <div className="mt-1 truncate font-mono text-xs font-bold text-sky-300">
                {item.val}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.25, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
              className="h-2 w-2 rounded-full bg-indigo-400"
            />
          ))}
        </div>
      </div>
    );
  }

  if (stageIndex === 1) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-5 sm:p-8">
        <div className="flex w-full max-w-lg items-center justify-between gap-2">
          <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-3">
            <FaGlobe className="text-lg text-sky-400" />
            <span className="font-mono text-[10px] text-neutral-200">SCANNER</span>
          </div>

          <div className="relative flex-1 space-y-2">
            <div className="relative h-1 overflow-hidden rounded-full bg-neutral-800">
              <motion.div
                animate={{ x: ["-40%", "140%"] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="h-full w-1/3 rounded-full bg-sky-400"
              />
            </div>
            <div className="relative h-1 overflow-hidden rounded-full bg-neutral-800">
              <motion.div
                animate={{ x: ["140%", "-40%"] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.4, ease: "linear" }}
                className="h-full w-1/3 rounded-full bg-emerald-400"
              />
            </div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3"
          >
            <FaLock className="text-lg text-emerald-400" />
            <span className="font-mono text-[10px] text-emerald-300">TLS 1.3</span>
          </motion.div>
        </div>

        <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4">
          <div className="mb-2.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Extracted Security Headers
          </div>
          <div className="space-y-2">
            {[
              { h: "strict-transport-security", status: "ENFORCED", ok: true },
              { h: "content-security-policy", status: "ACTIVE", ok: true },
              { h: "x-frame-options", status: "SAMEORIGIN", ok: true },
            ].map((row, idx) => (
              <motion.div
                key={row.h}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.2 }}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 font-mono text-[11px]"
              >
                <span className="text-neutral-200">{row.h}</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <FaCheckCircle className="text-[10px]" />
                  <span>{row.status}</span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stageIndex === 2) {
    return (
      <div className="flex h-full w-full items-center justify-center p-5 sm:p-8">
        <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 p-4">
            <motion.div
              animate={{ top: ["0%", "95%", "0%"] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-x-0 z-10 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_16px_#38bdf8]"
            />
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-sky-300">
              <span>DOM WIREFRAME</span>
              <span>SCANNING</span>
            </div>
            <div className="space-y-2">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 font-mono text-[10px] text-neutral-300">
                &lt;a href="/privacy-policy"&gt;
              </div>
              <motion.div
                animate={{ borderColor: ["#27272a", "#facc15", "#27272a"] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 font-mono text-[10px] text-amber-300"
              >
                &lt;div class="cookie-consent"&gt;
              </motion.div>
              <motion.div
                animate={{ borderColor: ["#27272a", "#f87171", "#27272a"] }}
                transition={{ repeat: Infinity, duration: 1.6, delay: 0.6 }}
                className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 font-mono text-[10px] text-red-300"
              >
                &lt;script src="tracker.js"&gt;
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2.5 rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              Extracted Signals
            </div>
            {[
              { label: "Privacy Policy Link", val: "FOUND", tone: "text-emerald-400" },
              { label: "Cookie Consent Gate", val: "OPT-OUT OK", tone: "text-amber-300" },
              { label: "3rd-Party Trackers", val: "2 DETECTED", tone: "text-sky-300" },
            ].map((sig, i) => (
              <motion.div
                key={sig.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.22 }}
                className="flex items-center justify-between rounded-lg bg-neutral-950 px-3 py-2 font-mono text-[11px]"
              >
                <span className="text-neutral-300">{sig.label}</span>
                <span className={`font-bold ${sig.tone}`}>{sig.val}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stageIndex === 3) {
    return (
      <div className="flex h-full w-full items-center justify-center p-5 sm:p-8">
        <div className="grid w-full max-w-xl grid-cols-1 items-center gap-6 sm:grid-cols-12">
          <div className="flex flex-col items-center justify-center sm:col-span-5">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-neutral-700" />
              <div className="absolute inset-5 rounded-full border border-neutral-700/80" />
              <div className="absolute inset-10 rounded-full border border-neutral-700/60" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent border-t-sky-400"
              />
              <motion.div
                animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.3 }}
                className="absolute right-6 top-7 h-2.5 w-2.5 rounded-full bg-emerald-400"
              />
              <FaShieldAlt className="text-xl text-sky-400" />
            </div>
            <span className="mt-2 font-mono text-[10px] text-neutral-400">
              15+ THREAT FEEDS
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:col-span-7">
            <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-indigo-300">
              <FaCode />
              <span>Detected Stack Signatures</span>
            </div>
            {[
              { name: "Next.js", cat: "Frontend", conf: "94%" },
              { name: "Cloudflare", cat: "CDN / WAF", conf: "98%" },
              { name: "HSTS + CSP", cat: "Security", conf: "92%" },
            ].map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.2 }}
                className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 font-mono text-xs"
              >
                <div>
                  <span className="font-bold text-white">{tech.name}</span>
                  <span className="ml-2 text-[10px] text-neutral-400">{tech.cat}</span>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                  {tech.conf}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stageIndex === 4) {
    const vectors = [
      { label: "Data Privacy (25%)", val: 92, color: "from-sky-400 to-cyan-300" },
      { label: "Transparency (20%)", val: 86, color: "from-indigo-400 to-sky-400" },
      { label: "Bias & Fairness (20%)", val: 85, color: "from-violet-400 to-indigo-400" },
      { label: "Manipulation (20%)", val: 90, color: "from-purple-400 to-violet-400" },
      { label: "Authenticity (15%)", val: 87, color: "from-emerald-400 to-teal-300" },
    ];

    return (
      <div className="flex h-full w-full flex-col justify-center gap-3.5 p-5 sm:p-8">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between font-mono text-[11px] text-indigo-300">
          <span className="inline-flex items-center gap-2">
            <FaBrain />
            <span>SHAP FEATURE ATTRIBUTION + WEIGHTS</span>
          </span>
          <span className="text-neutral-400">30 FEATURES</span>
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-col gap-2.5">
          {vectors.map((v, i) => (
            <div key={v.label} className="flex items-center gap-3">
              <span className="w-40 shrink-0 font-mono text-[11px] text-neutral-200">
                {v.label}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-800">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${v.val}%` }}
                  transition={{ duration: 0.85, delay: i * 0.12, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${v.color}`}
                />
              </div>
              <span className="w-8 text-right font-mono text-xs font-bold text-white">
                {v.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-5 sm:p-8">
      <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { score: 88, label: "TRUSTED", band: "70–100 GREEN", border: "border-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/15" },
          { score: 58, label: "MODERATE", band: "50–69 YELLOW", border: "border-amber-400", text: "text-amber-300", bg: "bg-amber-400/15" },
          { score: 22, label: "CRITICAL", band: "0–49 RED", border: "border-red-500", text: "text-red-400", bg: "bg-red-500/15" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.16, type: "spring", stiffness: 220, damping: 18 }}
            className={`flex flex-col items-center rounded-2xl border-2 p-4 ${card.border} ${card.bg}`}
          >
            <div className={`font-mono text-3xl font-extrabold ${card.text}`}>{card.score}</div>
            <div className="mt-1 font-mono text-[11px] font-bold text-white">{card.label}</div>
            <div className="mt-0.5 font-mono text-[10px] text-neutral-300">{card.band}</div>
          </motion.div>
        ))}
      </div>
      <div className="font-mono text-xs text-neutral-300">
        Score container changes theme dynamically based on risk threshold
      </div>
    </div>
  );
}

function HallucinationStageVisual({ stageIndex }) {
  if (stageIndex === 0) {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-4 p-5 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-xl rounded-2xl border border-neutral-700 bg-neutral-900 p-4"
        >
          <div className="mb-1.5 font-mono text-[10px] text-neutral-400">
            RAW AI RESPONSE INPUT
          </div>
          <p className="text-xs leading-relaxed text-neutral-200 sm:text-sm">
            "Python was released in 1998. Our model cut latency by 42% in 2023. Study at
            https://fake-study.example/paper."
          </p>
        </motion.div>

        <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { num: "#1", text: "Year: 1998", tag: "ENTITY + DATE", delay: 0.25 },
            { num: "#2", text: "Latency: 42%", tag: "METRIC CLAIM", delay: 0.45 },
            { num: "#3", text: "fake-study.example", tag: "CITATION URL", delay: 0.65 },
          ].map((item) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: item.delay }}
              className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-3"
            >
              <div className="font-mono text-[10px] font-bold text-sky-300">
                SENTENCE {item.num} · {item.tag}
              </div>
              <div className="mt-1 truncate font-mono text-xs text-white">{item.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (stageIndex === 1) {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-3 p-5 sm:p-8">
        <div className="mx-auto flex w-full max-w-lg items-center gap-2 font-mono text-[11px] text-sky-300">
          <FaLink />
          <span>LIVE URL / DOI / ARXIV REACHABILITY PROBE</span>
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-3.5"
          >
            <div className="min-w-0">
              <div className="truncate font-mono text-xs font-bold text-white">
                https://www.nist.gov/itl/ai-risk-management-framework
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-emerald-300">
                DNS Resolved · HTTP 200 OK
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-500 px-2.5 py-0.5 font-mono text-[10px] font-bold text-neutral-950">
              VERIFIED
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-red-500/60 bg-red-500/10 p-3.5"
          >
            <div className="min-w-0">
              <div className="truncate font-mono text-xs font-bold text-white">
                arXiv:9999.99999 · https://fake-study.example
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-red-300">
                Unreachable Host / HTTP 404 Not Found
              </div>
            </div>
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="shrink-0 rounded-full bg-red-600 px-2.5 py-0.5 font-mono text-[10px] font-bold text-white"
            >
              FABRICATED
            </motion.span>
          </motion.div>
        </div>
      </div>
    );
  }

  if (stageIndex === 2) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-5 sm:p-8">
        <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="rounded-2xl border border-neutral-700 bg-neutral-900 p-4"
          >
            <div className="font-mono text-[10px] text-sky-300">SENTENCE #1</div>
            <p className="mt-1.5 text-xs leading-relaxed text-white">
              "Our AI engine <span className="rounded bg-emerald-500/25 px-1 text-emerald-300">reduced latency by 45%</span> in{" "}
              <span className="rounded bg-sky-500/25 px-1 text-sky-300">2023</span>."
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-red-500/60 bg-neutral-900 p-4"
          >
            <div className="font-mono text-[10px] text-red-400">SENTENCE #2</div>
            <p className="mt-1.5 text-xs leading-relaxed text-white">
              "Benchmarks show the AI engine <span className="rounded bg-red-500/30 px-1 text-red-300">increased latency by 22%</span> in{" "}
              <span className="rounded bg-red-500/30 px-1 text-red-300">2021</span>."
            </p>
          </motion.div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-red-500 bg-red-600/20 px-4 py-2 font-mono text-xs font-bold text-red-300"
        >
          <FaTimesCircle />
          <span>SELF-CONTRADICTION DETECTED: Conflicting Metrics & Years</span>
        </motion.div>
      </div>
    );
  }

  if (stageIndex === 3) {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-4 p-5 sm:p-8">
        <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-4">
            <div className="font-mono text-[10px] text-amber-300">AI CLAIM</div>
            <p className="mt-1.5 text-xs leading-relaxed text-white">
              "Python was created by Guido van Rossum and released in{" "}
              <motion.span
                animate={{ backgroundColor: ["rgba(239,68,68,0.2)", "rgba(239,68,68,0.6)", "rgba(239,68,68,0.2)"] }}
                transition={{ repeat: Infinity, duration: 1.3 }}
                className="rounded px-1 font-bold text-red-200"
              >
                1998
              </motion.span>
              ."
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/40 bg-neutral-900 p-4">
            <div className="font-mono text-[10px] text-emerald-300">REFERENCE SOURCE</div>
            <p className="mt-1.5 text-xs leading-relaxed text-white">
              "Python was created by Guido van Rossum and first released in{" "}
              <span className="rounded bg-emerald-500/30 px-1 font-bold text-emerald-200">
                1991
              </span>
              ."
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-xl items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 font-mono text-[11px]">
          <span className="text-neutral-300">Token Overlap: 78% · Year Match:</span>
          <span className="font-bold text-red-400">CONFLICT (1998 != 1991)</span>
        </div>
      </div>
    );
  }

  if (stageIndex === 4) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-5 sm:p-8">
        <div className="flex w-full max-w-lg items-center justify-between gap-3">
          <div className="rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 font-mono text-xs text-white">
            Entity: "NIST AI RMF"
          </div>
          <div className="relative h-0.5 flex-1 bg-neutral-800">
            <motion.div
              animate={{ left: ["0%", "85%"] }}
              transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
              className="absolute -top-1 h-2.5 w-6 rounded-full bg-sky-400"
            />
          </div>
          <div className="rounded-xl border border-sky-500/50 bg-sky-500/10 px-3.5 py-2.5 font-mono text-xs text-sky-300">
            Wikipedia REST API ($0)
          </div>
        </div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="w-full max-w-lg rounded-2xl border border-neutral-700 bg-neutral-900 p-4"
        >
          <div className="flex items-center justify-between font-mono text-[10px] text-emerald-300">
            <span>KEYLESS PUBLIC KNOWLEDGE EXTRACT</span>
            <span>NO API KEY NEEDED</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-neutral-200">
            Compares entity summary &amp; key years from Wikipedia against standalone AI claims when no reference document is supplied.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-5 sm:p-8">
      <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border border-neutral-700 bg-neutral-900 p-5 sm:flex-row">
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-4 border-amber-400 bg-neutral-950 shadow-[0_0_28px_rgba(250,204,21,0.35)]"
        >
          <span className="font-mono text-3xl font-extrabold text-amber-300">62</span>
          <span className="font-mono text-[10px] text-neutral-300">/ 100</span>
        </motion.div>

        <div className="flex flex-1 flex-col gap-2 w-full">
          {[
            { label: "Sentence #1 · Grounded", badge: "SUPPORTED", cls: "bg-emerald-500 text-neutral-950", icon: <FaCheckCircle /> },
            { label: "Sentence #2 · No Source", badge: "UNVERIFIED", cls: "bg-amber-400 text-neutral-950", icon: <FaExclamationTriangle /> },
            { label: "Sentence #3 · Fake URL", badge: "CONTRADICTED", cls: "bg-red-600 text-white", icon: <FaTimesCircle /> },
          ].map((row, idx) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + idx * 0.15 }}
              className="flex items-center justify-between gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2"
            >
              <span className="font-mono text-[11px] text-neutral-200">{row.label}</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${row.cls}`}>
                {row.icon}
                <span>{row.badge}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const [pipelineMode, setPipelineMode] = useState("url");
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const stages = pipelineMode === "url" ? URL_STAGES : HALLUCINATION_STAGES;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPlaying, stages.length]);

  const current = stages[activeStage];

  const switchMode = (mode) => {
    setPipelineMode(mode);
    setActiveStage(0);
    setIsPlaying(true);
  };

  return (
    <section id="workflow" className="py-4">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="inline-block rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
            Interactive Visual Walkthrough
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
            How the engines work in motion
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("url")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                pipelineMode === "url"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-800 hover:text-black"
              }`}
            >
              <FaGlobe className="text-[11px]" />
              <span>URL Risk Audit</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode("hallucination")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                pipelineMode === "hallucination"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-800 hover:text-black"
              }`}
            >
              <FaBrain className="text-[11px]" />
              <span>Hallucination Detection</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="btn-black rounded-xl px-4 py-2 text-xs"
            >
              {isPlaying ? <FaPause className="text-[10px]" /> : <FaPlay className="text-[10px]" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStage((prev) => (prev - 1 + stages.length) % stages.length)}
              aria-label="Previous stage"
              className="btn-outline-mono h-9 w-9 rounded-xl text-xs"
            >
              <FaStepBackward />
            </button>
            <button
              type="button"
              onClick={() => setActiveStage((prev) => (prev + 1) % stages.length)}
              aria-label="Next stage"
              className="btn-outline-mono h-9 w-9 rounded-xl text-xs"
            >
              <FaStepForward />
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveStage(0);
                setIsPlaying(true);
              }}
              aria-label="Restart walkthrough"
              className="btn-outline-mono h-9 w-9 rounded-xl text-xs"
            >
              <FaRedo />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-300 bg-neutral-950 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-sky-500 to-indigo-600 font-mono text-[11px] font-bold text-white">
              {current.num}
            </span>
            <span className="text-sm font-bold text-white">{current.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-neutral-400">
              {pipelineMode === "url" ? "URL PIPELINE" : "HALLUCINATION ENGINE"}
            </span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-sky-300">
              {current.tag}
            </span>
          </div>
        </div>

        <div className="relative min-h-[340px] w-full bg-neutral-950 sm:min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${pipelineMode}-${current.id}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="h-full min-h-[340px] w-full sm:min-h-[360px]"
            >
              {pipelineMode === "url" ? (
                <UrlStageVisual stageIndex={activeStage} />
              ) : (
                <HallucinationStageVisual stageIndex={activeStage} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t border-neutral-800 bg-neutral-900/75 px-5 py-4">
          <p className="text-sm font-medium text-neutral-100">{current.caption}</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
            <motion.div
              key={`${pipelineMode}-${activeStage}-${isPlaying}`}
              initial={{ width: "0%" }}
              animate={{ width: isPlaying ? "100%" : `${((activeStage + 1) / stages.length) * 100}%` }}
              transition={{ duration: isPlaying ? 3.8 : 0.35, ease: "linear" }}
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {stages.map((stage, i) => {
          const active = i === activeStage;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => {
                setActiveStage(i);
                setIsPlaying(false);
              }}
              className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                active
                  ? "border-black bg-black text-white shadow-md"
                  : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
              }`}
            >
              <span
                className={`font-mono text-[10px] font-bold ${
                  active ? "text-sky-300" : "text-neutral-700"
                }`}
              >
                {stage.num} · {stage.tag}
              </span>
              <span className="mt-1 text-xs font-bold">{stage.title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;
