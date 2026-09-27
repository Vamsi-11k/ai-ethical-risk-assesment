import "./About.css";
import { FaCheckCircle, FaBullseye, FaBookOpen, FaShieldAlt } from "react-icons/fa";

function About() {
  return (
    <section className="about" id="about">
      <div className="about-left">
        <span className="about-badge">mission</span>
        <h2>
          Ethical trust signals shouldn't be <span>invisible</span>.
        </h2>
        <p>
          Most users can't tell whether a site respects their privacy, uses dark
          patterns, or makes honest AI disclosures. We built this scanner so that
          trust is measurable — not assumed.
        </p>
        <ul className="about-list">
          {[
            { title: "grounded_in_standards",   desc: "Scoring logic follows NIST AI RMF, OWASP, and GDPR transparency guidelines." },
            { title: "built_for_auditability",  desc: "Every score is backed by explicit per-check pass/fail signals — no black boxes." },
            { title: "actionable_by_design",    desc: "Each flagged issue includes a plain-language explanation and a remediation step." },
          ].map((item, i) => (
            <li key={i}>
              <div className="about-list-icon"><FaCheckCircle /></div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="about-right">
        <div className="about-card">
          <FaBookOpen className="about-card-icon" />
          <h3>framework_standards</h3>
          <p>The scanner references the frameworks security and ethics teams use daily.</p>
          <div className="standard-chips">
            {["NIST AI RMF", "OWASP Top 10", "GDPR Art.13", "EU AI Act", "Phishing Feeds"].map(s => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
        <div className="about-quote">
          <FaShieldAlt className="quote-icon" />
          <p>
            "Website trust is not a binary. It's an active combination of security
            posture, data transparency, and ethical design — and it should be
            auditable by anyone."
          </p>
          <span>// project_founding_principle</span>
        </div>
      </div>
    </section>
  );
}

export default About;
