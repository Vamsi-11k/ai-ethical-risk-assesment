import { FaBolt, FaRobot, FaLock, FaChartLine, FaCode, FaGlobe } from "react-icons/fa";

const ITEMS = [
  {
    icon: <FaBolt />,
    title: "Sub-4s Scan Time",
    desc: "Full five-category ethical audit completes in under four seconds on average.",
  },
  {
    icon: <FaRobot />,
    title: "ML Threat Detection",
    desc: "Intelligent pattern recognition flags brand spoofing, dark patterns, and consent manipulation.",
  },
  {
    icon: <FaLock />,
    title: "No Data Retention",
    desc: "Scanned URLs and results are never stored beyond your session unless you are signed in.",
  },
  {
    icon: <FaChartLine />,
    title: "Explainable Scores",
    desc: "Every risk score shows the exact signals that contributed — no black box verdicts.",
  },
  {
    icon: <FaCode />,
    title: "Open Methodology",
    desc: "Scoring methodology is documented and follows established AI ethics frameworks.",
  },
  {
    icon: <FaGlobe />,
    title: "Global Threat Coverage",
    desc: "Cross-references 15+ threat intelligence feeds covering phishing, malware, and fraud domains.",
  },
];

function WhyChooseUs() {
  return (
    <section className="py-4">
      <div className="mb-8">
        <span className="inline-block rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-800">
          Rationale
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
          Why trust this scanner
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
          Designed for security teams, developers, and researchers who need auditability.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item, i) => (
          <div key={i} className="card-mono group rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-50 text-base text-neutral-950 transition-colors duration-200 group-hover:border-black group-hover:bg-black group-hover:text-white">
              {item.icon}
            </div>
            <h3 className="mt-4 text-base font-bold tracking-tight text-neutral-950">
              {item.title}
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-neutral-800">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
