import { FaClipboardCheck, FaChartLine, FaShieldAlt, FaGlobe } from "react-icons/fa";

const STATS = [
  { icon: <FaClipboardCheck />, value: "10,000+", label: "Scans Performed" },
  { icon: <FaChartLine />, value: "98.2%", label: "Detection Accuracy" },
  { icon: <FaShieldAlt />, value: "05", label: "Risk Vectors" },
  { icon: <FaGlobe />, value: "3.2s", label: "Avg Audit Time" },
];

function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="card-mono flex items-center gap-4 rounded-2xl p-5 sm:p-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-lg text-white">
              {s.icon}
            </div>
            <div>
              <div className="font-mono text-2xl font-bold tracking-tight tabular-nums text-neutral-950">
                {s.value}
              </div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-neutral-700">
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
