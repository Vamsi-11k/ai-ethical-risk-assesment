import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import BrandLogo from "../BrandLogo";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-neutral-200 bg-neutral-50/80">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <BrandLogo size="sm" />
              <span className="text-base font-bold tracking-tight text-neutral-950">
                EthicalAI
              </span>
            </div>

            <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-neutral-800">
              An autonomous AI-powered ethical risk assessment framework for organizations
              building fair, private, transparent, and compliant digital experiences.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1 font-mono text-[11px] font-semibold text-neutral-900">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              <span>Audit Engine · Operational</span>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {[
                { href: "https://twitter.com", label: "Twitter", icon: <FaTwitter /> },
                { href: "https://linkedin.com", label: "LinkedIn", icon: <FaLinkedin /> },
                { href: "https://github.com", label: "GitHub", icon: <FaGithub /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 lg:col-span-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
              Platform
            </h4>
            <a href="#scanner" className="text-sm font-medium text-neutral-800 hover:text-black">
              URL Scanner
            </a>
            <a href="#results" className="text-sm font-medium text-neutral-800 hover:text-black">
              Live Audit Engine
            </a>
            <a href="#features" className="text-sm font-medium text-neutral-800 hover:text-black">
              Capabilities
            </a>
            <a href="#workflow" className="text-sm font-medium text-neutral-800 hover:text-black">
              Audit Pipeline
            </a>
          </div>

          <div className="flex flex-col gap-2.5 lg:col-span-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
              Governance
            </h4>
            <a href="#about" className="text-sm font-medium text-neutral-800 hover:text-black">
              Ethics Framework
            </a>
            <a href="#contact" className="text-sm font-medium text-neutral-800 hover:text-black">
              Compliance Contact
            </a>
            <a
              href="https://www.nist.gov/itl/ai-risk-management-framework"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-neutral-800 hover:text-black"
            >
              NIST AI RMF
            </a>
            <a
              href="https://artificialintelligenceact.eu"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-neutral-800 hover:text-black"
            >
              EU AI Act
            </a>
          </div>

          <div className="flex flex-col gap-2.5 lg:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
              Standards
            </h4>
            <a href="#scanner" className="text-sm font-medium text-neutral-800 hover:text-black">
              OWASP Top 10
            </a>
            <a href="#scanner" className="text-sm font-medium text-neutral-800 hover:text-black">
              GDPR Art. 13/14
            </a>
            <a href="#scanner" className="text-sm font-medium text-neutral-800 hover:text-black">
              Dark Pattern Shield
            </a>
            <a href="#scanner" className="text-sm font-medium text-neutral-800 hover:text-black">
              Transparency Metrics
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-6 text-xs font-medium text-neutral-700 sm:flex-row sm:items-center">
          <p>© {year} EthicalAI Risk Assessment Framework.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#about" className="hover:text-black">
              Privacy Standards
            </a>
            <a href="#about" className="hover:text-black">
              Responsible AI Terms
            </a>
            <a href="#about" className="hover:text-black">
              Security Posture
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
