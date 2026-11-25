import {
  FaLock,
  FaGlobe,
  FaExclamationTriangle,
  FaShieldAlt,
  FaChartLine,
  FaLightbulb,
} from "react-icons/fa";

const FEATURES = [
  {
    icon: <FaLock />,
    title: "SSL Verification",
    desc: "Checks SSL/TLS enforcement, certificate validity, and HTTP-to-HTTPS redirect behavior.",
  },
  {
    icon: <FaGlobe />,
    title: "Domain Reputation",
    desc: "Analyzes domain age, registration history, and cross-references global threat intelligence feeds.",
  },
  {
    icon: <FaExclamationTriangle />,
    title: "Phishing Detection",
    desc: "Identifies deceptive content structures, lookalike brand assets, and suspicious subdomain patterns.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Security Header Audit",
    desc: "Inspects server responses for CSP, HSTS, X-Frame-Options, and other mandatory protection headers.",
  },
  {
    icon: <FaChartLine />,
    title: "Trust Scoring",
    desc: "Produces a transparent 0–100 Trust Score with per-check explanations for full auditability.",
  },
  {
    icon: <FaLightbulb />,
    title: "Actionable Remediation",
    desc: "Generates concrete, prioritized steps to close detected security gaps and improve posture.",
  },
];

function Features() {
  return (
    <section id="features" className="py-4">
      <div className="mb-8">
        <span className="inline-block rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-800">
          Capabilities
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
          What the scanner checks
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
          Six automated checks run on every audit, mapped to the ethical risk framework.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="card-mono group relative flex flex-col rounded-2xl p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-950 text-base text-white transition-transform duration-300 group-hover:scale-105">
                {f.icon}
              </div>
              <span className="font-mono text-xs font-bold text-neutral-600">
                0{i + 1}
              </span>
            </div>
            <h3 className="text-base font-bold tracking-tight text-neutral-950">
              {f.title}
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-neutral-800">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
