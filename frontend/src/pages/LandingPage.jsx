import Hero from "../components/Hero/Hero";
import Stats from "../components/Stats/Stats";
import Footer from "../components/Footer/Footer";
import { FaBolt, FaArrowRight, FaShieldAlt } from "react-icons/fa";

function LandingPage({ onLaunchApp, onQuickScan }) {
  return (
    <div className="flex flex-col">
      <Hero onLaunchApp={onLaunchApp} onQuickScan={onQuickScan} />

      <div id="metrics">
        <Stats />
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-10 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
              <FaShieldAlt className="text-lg" />
            </div>
            <div className="max-w-xl">
              <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700">
                Zero-Setup Autonomous Scanning
              </span>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                Ready to Audit Your AI Infrastructure?
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
                Analyze model endpoints, privacy agreements, algorithmic fairness, and
                dark pattern manipulation in seconds.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLaunchApp}
            className="btn-black group min-h-[48px] w-full shrink-0 rounded-xl px-6 py-3.5 text-sm lg:w-auto"
          >
            <FaBolt className="text-xs text-neutral-300" />
            <span>Launch Audit Studio</span>
            <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
