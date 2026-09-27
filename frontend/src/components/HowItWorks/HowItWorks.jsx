import "./HowItWorks.css";

const STEPS = [
  { title: "01_input_url",           desc: "Paste any URL into the scanner bar. No account required for a basic audit.",           tag: "input" },
  { title: "02_domain_resolution",   desc: "The engine resolves the domain, fetches HTTP headers, and checks the SSL certificate.", tag: "network" },
  { title: "03_policy_analysis",     desc: "Content is checked for privacy policy presence, terms of service, and consent signals.", tag: "nlp" },
  { title: "04_threat_intelligence", desc: "Domain is cross-referenced with global phishing feeds and malicious URL databases.",    tag: "threat_intel" },
  { title: "05_ethical_scoring",     desc: "All signals are weighted across five ethical categories to produce a 0–100 score.",     tag: "ml_model" },
  { title: "06_report_generated",    desc: "Flagged issues are ranked by severity and returned with plain-language explanations.",  tag: "output" },
];

function HowItWorks() {
  return (
    <section className="workflow" id="workflow">
      <div className="sec-head">
        <div className="sec-label">pipeline</div>
        <h2>How the audit runs</h2>
        <p>Six deterministic stages run in under 4 seconds on every scan.</p>
      </div>

      <div className="workflow-pipeline">
        {STEPS.map((s, i) => (
          <div className="workflow-step" key={i}>
            <div className="step-node">
              <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="step-body">
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
              <span className="step-tag">{s.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
