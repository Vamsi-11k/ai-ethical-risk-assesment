import { useState } from "react";
import {
  FaTools,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaCheckCircle,
  FaCode,
  FaServer,
  FaFileCode,
  FaNetworkWired,
  FaCloud,
  FaChartBar,
  FaLock,
} from "react-icons/fa";

const DISPLAY_CATEGORIES = [
  { key: "frontend", title: "FRONTEND", icon: <FaCode /> },
  { key: "backend", title: "BACKEND", icon: <FaServer /> },
  { key: "cms", title: "CMS", icon: <FaFileCode /> },
  { key: "web_server", title: "WEB SERVER", icon: <FaNetworkWired /> },
  { key: "cdn_infrastructure", title: "CDN / INFRASTRUCTURE", icon: <FaCloud /> },
  { key: "analytics", title: "ANALYTICS", icon: <FaChartBar /> },
  { key: "security", title: "SECURITY", icon: <FaLock /> },
];

const FINGERPRINT_ITEMS = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "cdn_infrastructure", label: "Infrastructure" },
  { key: "analytics", label: "Analytics" },
  { key: "security", label: "Security" },
];

export default function TechStackSection({ techStack, scanId, url }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fetched, setFetched] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [expandedTechs, setExpandedTechs] = useState({});

  const targetKey = `${scanId || ""}:${url || ""}`;
  const data = fetched?.key === targetKey ? fetched.value : techStack || null;

  const handleTogglePanel = async () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (willOpen && (!data || !data.categories || Object.keys(data.categories).length === 0)) {
      setIsLoading(true);
      setFetchError(null);
      try {
        const queryUrl = encodeURIComponent(url || "");
        const endpoint = scanId
          ? `/api/scans/${scanId}/tech-stack?url=${queryUrl}`
          : `/api/tech-stack?url=${queryUrl}`;

        const res = await fetch(endpoint);
        const json = await res.json();
        if (res.ok && json.data) {
          const loaded = json.data.techStack || json.data.tech_stack || {};
          setFetched({ key: targetKey, value: loaded });
        } else {
          throw new Error(json.message || "Failed to load technology stack.");
        }
      } catch (err) {
        setFetchError(err.message || "Unable to retrieve tools and technologies.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleEvidence = (techId) => {
    setExpandedTechs((prev) => ({
      ...prev,
      [techId]: !prev[techId],
    }));
  };

  const categories = data?.categories || {};
  const totalDetected = data?.total_detected ?? 0;
  const overallConfidence = data?.overall_detection_confidence ?? 0;

  const getSecurityBadge = (status) => {
    switch (status) {
      case "Potential Concern":
        return {
          icon: <FaExclamationTriangle />,
          badgeClass: "bg-amber-400 text-neutral-950",
        };
      case "High Risk":
        return {
          icon: <FaExclamationCircle />,
          badgeClass: "bg-red-600 text-white",
        };
      case "Recommendation":
        return {
          icon: <FaInfoCircle />,
          badgeClass: "border border-amber-300 bg-amber-50 text-amber-950",
        };
      case "Informational":
      default:
        return {
          icon: <FaCheckCircle />,
          badgeClass: "border border-emerald-300 bg-emerald-50 text-emerald-900",
        };
    }
  };

  return (
    <div id="tech-stack-section" className="tech-drawer rounded-3xl border border-neutral-200 bg-white p-4 sm:p-6">
      <button
        type="button"
        onClick={handleTogglePanel}
        aria-expanded={isOpen}
        className="btn-black flex w-full items-center justify-between rounded-2xl px-5 py-3.5 text-left text-sm"
      >
        <div className="flex flex-wrap items-center gap-3">
          <FaTools className="text-xs text-neutral-300" />
          <span className="font-semibold">
            {isOpen ? "Hide Tools & Technologies" : "Show Tools & Technologies"}
          </span>
          {totalDetected > 0 && (
            <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 font-mono text-[11px] text-neutral-200">
              {totalDetected} Detected · {overallConfidence}%
            </span>
          )}
        </div>
        <span className="text-xs text-neutral-300">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>

      {isOpen && (
        <div className="mt-5 flex flex-col gap-5 animate-fade-up">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />
              <p className="text-sm text-neutral-600">
                Auditing response headers, cookies, scripts, and DOM signatures…
              </p>
            </div>
          )}

          {fetchError && !isLoading && (
            <div className="rounded-2xl border border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-700">
              {fetchError}
            </div>
          )}

          {!isLoading && !fetchError && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3">
                <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
                  Tools & Technologies
                </h5>
                <span className="font-mono text-xs font-medium text-neutral-700">
                  {totalDetected} Detected · Confidence{" "}
                  <strong className="text-neutral-950">{overallConfidence}%</strong>
                </span>
              </div>

              {totalDetected === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-600">
                  No framework, CMS, or server signatures detected on this landing page.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {DISPLAY_CATEGORIES.map(({ key, title, icon }) => {
                    const catObj = categories[key];
                    const techs = catObj?.technologies || [];
                    if (!techs || techs.length === 0) return null;

                    return (
                      <div key={key} className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="text-xs text-neutral-700">{icon}</span>
                          <h6 className="font-mono text-xs font-semibold tracking-wider text-neutral-900">
                            {title}
                          </h6>
                          <span className="rounded-full bg-neutral-200 px-2 py-0.5 font-mono text-[10px] font-bold text-neutral-800">
                            {techs.length}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {techs.map((tech, idx) => {
                            const techId = `${key}-${tech.name}-${idx}`;
                            const isExpanded = !!expandedTechs[techId];
                            const sec = getSecurityBadge(tech.security_status);
                            const hasVersion =
                              tech.version && tech.version !== "Version: Not detected";

                            return (
                              <div
                                key={techId}
                                className="rounded-xl border border-neutral-200 bg-white p-3.5"
                              >
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-semibold text-neutral-950">
                                      {tech.name}
                                    </span>
                                    {hasVersion ? (
                                      <span className="rounded-md bg-neutral-950 px-2 py-0.5 font-mono text-[10px] text-white">
                                        {tech.version}
                                      </span>
                                    ) : (
                                      <span className="font-mono text-[11px] text-neutral-400">
                                        Version: Not detected
                                      </span>
                                    )}
                                    {tech.subcategory && (
                                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                                        {tech.subcategory}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2.5">
                                    <span className="font-mono text-xs font-semibold tabular-nums text-neutral-700">
                                      {tech.confidence}%
                                    </span>
                                    <span
                                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${sec.badgeClass}`}
                                      title={tech.security_status}
                                    >
                                      {sec.icon}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => toggleEvidence(techId)}
                                      aria-expanded={isExpanded}
                                      className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-900 transition-all duration-200 hover:border-black hover:bg-black hover:text-white"
                                    >
                                      {isExpanded ? "Hide Evidence" : "View Evidence"}
                                    </button>
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="mt-3 border-t border-neutral-100 pt-3">
                                    <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                      Detection Evidence
                                    </div>
                                    <ul className="mt-1.5 flex flex-col gap-1 text-xs text-neutral-700">
                                      {tech.evidence && tech.evidence.length > 0 ? (
                                        tech.evidence.map((ev, evIdx) => (
                                          <li key={evIdx} className="flex items-start gap-2">
                                            <span className="text-neutral-400">•</span>
                                            <span>{ev}</span>
                                          </li>
                                        ))
                                      ) : (
                                        <li className="flex items-start gap-2">
                                          <span className="text-neutral-400">•</span>
                                          <span>Direct signature match.</span>
                                        </li>
                                      )}
                                    </ul>

                                    <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                                      <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${sec.badgeClass}`}
                                      >
                                        {sec.icon}
                                        <span>{tech.security_status}</span>
                                      </span>
                                      {tech.security_insight && (
                                        <p className="mt-2 text-xs leading-relaxed text-neutral-700">
                                          {tech.security_insight}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                <h5 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-900">
                  Technology Fingerprint
                </h5>
                <div className="flex flex-col gap-2.5">
                  {FINGERPRINT_ITEMS.map(({ key, label }) => {
                    const catData = categories[key];
                    const confidenceVal = catData ? catData.confidence : 0;
                    const count = catData?.technologies?.length || 0;

                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className="w-32 shrink-0 text-xs font-medium text-neutral-700">
                          {label}{" "}
                          {count > 0 && (
                            <span className="font-mono text-[11px] text-neutral-400">({count})</span>
                          )}
                        </div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                          <div
                            className="h-full rounded-full bg-neutral-900 transition-all duration-500"
                            style={{ width: `${confidenceVal}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-xs font-semibold tabular-nums text-neutral-800">
                          {confidenceVal}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 border-t border-neutral-200 pt-3 font-mono text-xs text-neutral-600">
                  Overall Detection Confidence:{" "}
                  <strong className="text-neutral-950">{overallConfidence}%</strong>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
