import { FaCheckCircle, FaBookOpen, FaShieldAlt } from "react-icons/fa";

function About() {
  return (
    <section id="about" className="grid grid-cols-1 gap-8 py-4 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <span className="inline-block rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-800">
          Mission
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
          Ethical trust signals should never be invisible.
        </h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
          Most users cannot tell whether a site respects their privacy, uses dark
          patterns, or makes honest AI disclosures. We built this scanner so that
          trust is measurable — not assumed.
        </p>

        <ul className="mt-6 flex flex-col gap-3">
          {[
            {
              title: "Grounded in Standards",
              desc: "Scoring logic follows NIST AI RMF, OWASP, and GDPR transparency guidelines.",
            },
            {
              title: "Built for Auditability",
              desc: "Every score is backed by explicit per-check pass/fail signals — no black boxes.",
            },
            {
              title: "Actionable by Design",
              desc: "Each flagged issue includes a plain-language explanation and a remediation step.",
            },
          ].map((item, i) => (
            <li
              key={i}
              className="card-mono flex items-start gap-3.5 rounded-2xl p-4"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-xs text-white">
                <FaCheckCircle />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-950">{item.title}</h4>
                <p className="mt-1 text-xs font-medium leading-relaxed text-neutral-800 sm:text-sm">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-5">
        <div className="card-mono rounded-3xl p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-base text-white">
            <FaBookOpen />
          </div>
          <h3 className="mt-4 text-lg font-bold tracking-tight text-neutral-950">
            Framework Standards
          </h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-neutral-800">
            The scanner references the frameworks security and ethics teams use daily.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["NIST AI RMF", "OWASP Top 10", "GDPR Art.13", "EU AI Act", "Phishing Feeds"].map(
              (s) => (
                <span
                  key={s}
                  className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-1 font-mono text-[11px] font-semibold text-neutral-900"
                >
                  {s}
                </span>
              )
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-neutral-950 p-6 text-white">
          <FaShieldAlt className="text-lg text-neutral-300" />
          <p className="mt-4 text-sm leading-relaxed text-neutral-100">
            "Website trust is not a binary. It is an active combination of security
            posture, data transparency, and ethical design — and it should be auditable
            by anyone."
          </p>
          <span className="mt-4 block font-mono text-[11px] uppercase tracking-wider text-neutral-300">
            Founding Principle
          </span>
        </div>
      </div>
    </section>
  );
}

export default About;
