import "./About.css";
import {
  FaCheckCircle,
  FaBullseye,
  FaBookOpen,
  FaShieldAlt,
} from "react-icons/fa";

function About() {
  return (
    <section className="about" id="about">
      <div className="about-left">
        <span className="badge about-badge">
          <FaBullseye /> Our Mission
        </span>

        <h2>
          Knowing If a Website Is Safe <span>Shouldn't Be a Guessing Game</span>
        </h2>

        <p>
          Most internet users can only guess whether a website is secure, private, or legitimate. We built 
          this automated scan framework so trust and security indicators can be audited in real-time, 
          helping users spot security lapses, phishing indicators, and privacy shortcomings before they share 
          sensitive data.
        </p>

        <ul className="about-list">
          <li>
            <FaCheckCircle />
            <div>
              <h4>Grounded in web security best practices</h4>
              <p>
                Our scanning logic evaluates elements defined by security standards, privacy guidelines, 
                and global threat databases.
              </p>
            </div>
          </li>
          <li>
            <FaCheckCircle />
            <div>
              <h4>Built for proactive auditing</h4>
              <p>
                Check site trustworthiness before checkouts, logins, or during developer QA reviews.
              </p>
            </div>
          </li>
          <li>
            <FaCheckCircle />
            <div>
              <h4>Actionable, not just scores</h4>
              <p>
                Every trust check is backed by concrete guidelines to address vulnerability gaps immediately.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="about-right">
        <div className="about-card">
          <FaBookOpen className="about-card-icon" />
          <h3>Built on established standards</h3>
          <p>
            Our scoring engine references the frameworks security teams already use.
          </p>

          <div className="standard-chips">
            <span>SSL/TLS Standards</span>
            <span>OWASP Guidelines</span>
            <span>Phishing Threat Intel</span>
            <span>Domain Reputation</span>
          </div>
        </div>

        <div className="about-quote">
          <FaShieldAlt className="quote-icon" />
          <p>
            "Website trust isn't just about an SSL padlock — it is an active combination of security 
            practices, domain authenticity, and user transparency. Our goal is to make those parameters 
            clear and accessible to everyone."
          </p>
          <span>— Project Founding Principle</span>
        </div>
      </div>
    </section>
  );
}

export default About;
