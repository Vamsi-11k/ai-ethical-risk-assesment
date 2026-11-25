import { FaUserSecret, FaEye, FaBalanceScale, FaBrain, FaFileAlt } from "react-icons/fa";

const CATS = [
  {
    icon: <FaUserSecret />,
    name: "Data Privacy",
    desc: "Evaluates presence of a privacy policy, cookie consent, and personal data handling disclosures.",
    weight: "25%",
    status: "CRITICAL",
    badgeClass: "bg-black text-white",
  },
  {
    icon: <FaEye />,
    name: "Transparency",
    desc: "Checks for clear terms of service, ownership disclosure, and identifiable contact information.",
    weight: "20%",
    status: "HIGH",
    badgeClass: "bg-neutral-800 text-white",
  },
  {
    icon: <FaBalanceScale />,
    name: "Bias & Fairness",
    desc: "Detects demographic targeting patterns, exclusionary language, and unfair content segmentation.",
    weight: "20%",
    status: "MEDIUM",
    badgeClass: "bg-neutral-200 text-neutral-900",
  },
  {
    icon: <FaBrain />,
    name: "Manipulation Risk",
    desc: "Identifies dark patterns, urgency triggers, social proof manipulation, and deceptive UX practices.",
    weight: "20%",
    status: "HIGH",
    badgeClass: "bg-neutral-800 text-white",
  },
  {
    icon: <FaFileAlt />,
    name: "Content Authenticity",
    desc: "Validates SSL/TLS integrity, checks for phishing indicators, and cross-checks against threat feeds.",
    weight: "15%",
    status: "CRITICAL",
    badgeClass: "bg-black text-white",
  },
];

function RiskCategories() {
  return (
    <section className="py-4">
      <div className="mb-8">
        <span className="inline-block rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-800">
          Methodology
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
          Risk category reference
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
          Five weighted categories make up the final ethical trust score.
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white md:block">
        <div className="grid grid-cols-12 gap-4 border-b border-neutral-200 bg-neutral-50 px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          <div className="col-span-3">Category</div>
          <div className="col-span-6">What We Check</div>
          <div className="col-span-1 text-center">Weight</div>
          <div className="col-span-2 text-right">Impact</div>
        </div>

        <div className="divide-y divide-neutral-100">
          {CATS.map((c, i) => (
            <div
              key={i}
              className="grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors duration-150 hover:bg-neutral-50/80"
            >
              <div className="col-span-3 flex items-center gap-3 font-semibold text-neutral-950">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-900">
                  {c.icon}
                </span>
                <span className="text-sm">{c.name}</span>
              </div>
              <div className="col-span-6 text-sm font-medium text-neutral-800">{c.desc}</div>
              <div className="col-span-1 text-center font-mono text-xs font-bold tabular-nums text-neutral-950">
                {c.weight}
              </div>
              <div className="col-span-2 flex justify-end">
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${c.badgeClass}`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {CATS.map((c, i) => (
          <div key={i} className="card-mono rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 font-semibold text-neutral-950">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-900">
                  {c.icon}
                </span>
                <span className="text-sm">{c.name}</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${c.badgeClass}`}
              >
                {c.status}
              </span>
            </div>
            <p className="mt-2.5 text-xs font-medium leading-relaxed text-neutral-800">{c.desc}</p>
            <div className="mt-3 border-t border-neutral-100 pt-2.5 font-mono text-[11px] font-medium text-neutral-700">
              Weight: <strong className="text-neutral-950">{c.weight}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RiskCategories;
