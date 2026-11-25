import { useState, useEffect } from "react";
import { FaShieldAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";

const AUDIT_STAGES = [
  { label: "INITIALIZING_AUDIT", desc: "Resolving DNS & probing TLS cipher suites..." },
  { label: "DATA_SOVEREIGNTY", desc: "Auditing third-party telemetry, tracking pixels & cookies..." },
  { label: "ALGORITHMIC_BIAS", desc: "Analyzing demographic parity & linguistic disparate impact..." },
  { label: "UX_MANIPULATION", desc: "Scanning for forced consent, dark patterns & deceptive flows..." },
  { label: "MODEL_TRANSPARENCY", desc: "Benchmarking against NIST AI RMF 1.0 & EU AI Act standards..." },
  { label: "COMPILING_SCORECARD", desc: "Synthesizing 0–100 weighted risk telemetry..." },
];

function ScannerLoader({ targetUrl = "target endpoint" }) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prev) => (prev < AUDIT_STAGES.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(timer);
  }, []);

  const progress = ((currentStage + 1) / AUDIT_STAGES.length) * 100;

  return (
    <div className="flex justify-center py-6">
      <div className="w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] sm:p-8">
        <div className="mx-auto relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-neutral-200" />
          <div className="absolute inset-3 rounded-full border border-neutral-300" />
          <div className="animate-radar-spin absolute inset-0 rounded-full border-t-2 border-black" />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-xl text-white shadow-md">
            <FaShieldAlt />
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-800">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-black" />
            <span>Autonomous Forensic Inspection</span>
          </div>

          <h3 className="mt-3 truncate text-lg font-bold tracking-tight text-neutral-950 sm:text-xl">
            Auditing: <span className="font-mono font-semibold text-neutral-800">{targetUrl}</span>
          </h3>

          <p className="mt-1.5 text-sm font-medium text-neutral-800">
            {AUDIT_STAGES[currentStage].desc}
          </p>
        </div>

        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {AUDIT_STAGES.map((stage, idx) => {
            const done = idx < currentStage;
            const active = idx === currentStage;
            return (
              <div
                key={stage.label}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 font-mono text-[11px] transition-all duration-200 ${
                  done
                    ? "border-neutral-200 bg-neutral-50 text-neutral-700"
                    : active
                    ? "border-black bg-black text-white"
                    : "border-neutral-100 bg-white text-neutral-400"
                }`}
              >
                <span className="shrink-0">
                  {done ? (
                    <FaCheckCircle className="text-neutral-900" />
                  ) : active ? (
                    <FaSpinner className="animate-spin text-white" />
                  ) : (
                    <span className="block h-2 w-2 rounded-full bg-neutral-300" />
                  )}
                </span>
                <span className="truncate font-medium">{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ScannerLoader;
