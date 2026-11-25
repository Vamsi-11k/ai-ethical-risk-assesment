import Footer from "./Footer/Footer";
import { FaBolt, FaArrowRight, FaHome } from "react-icons/fa";

function SubPageLayout({
  kicker,
  title,
  subtitle,
  onLaunchApp,
  onGoHome,
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  children,
}) {
  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-800">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span>{kicker}</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] leading-[1.12] text-neutral-950 sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 text-[15px] font-medium leading-relaxed text-neutral-800 sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onGoHome}
              className="btn-outline-mono min-h-[44px] rounded-xl px-4 py-2.5 text-sm"
            >
              <FaHome className="text-xs" />
              <span>Back to Overview</span>
            </button>
            <button
              type="button"
              onClick={onLaunchApp}
              className="btn-black group min-h-[44px] rounded-xl px-5 py-2.5 text-sm"
            >
              <FaBolt className="text-xs text-neutral-300" />
              <span>Launch Audit Studio</span>
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="mt-10 sm:mt-12">{children}</div>

        {ctaTitle && (
          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">
                {ctaTitle}
              </h3>
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-neutral-800">
                {ctaDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchApp}
              className="btn-black group min-h-[46px] w-full shrink-0 rounded-xl px-6 py-3 text-sm lg:w-auto"
            >
              <FaBolt className="text-xs text-neutral-300" />
              <span>{ctaButtonText}</span>
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default SubPageLayout;
