import { useState } from "react";
import "./Contact.css";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaArrowRight, FaCheckCircle } from "react-icons/fa";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const res  = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "send failed.");
      setSent(true);
    } catch (err) {
      setError(err.message || "network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="sec-head" style={{ marginBottom: 36 }}>
        <div className="sec-label">contact</div>
        <h2>Get in touch</h2>
        <p>Questions about the framework, integrations, or enterprise access — we reply within one business day.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          {[
            { icon: <FaEnvelope />,     label: "email",    val: "hello@airiskframework.com" },
            { icon: <FaPhoneAlt />,     label: "phone",    val: "+1 (555) 018-2044" },
            { icon: <FaMapMarkerAlt />, label: "location", val: "Remote — San Francisco, CA" },
          ].map((c, i) => (
            <div className="info-card" key={i}>
              <div className="info-card-icon">{c.icon}</div>
              <div><h4>{c.label}</h4><p>{c.val}</p></div>
            </div>
          ))}
        </div>

        <form className="contact-form" onSubmit={submit}>
          {sent ? (
            <div className="form-success">
              <FaCheckCircle />
              <h3>message_sent</h3>
              <p>We'll reply within one business day.</p>
              <button type="button" className="form-success-btn"
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                send_another →
              </button>
            </div>
          ) : (
            <>
              {error && <div className="form-error">error: {error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-name">name</label>
                  <input id="c-name" name="name" type="text" placeholder="Jane Doe"
                    value={form.name} onChange={change} required />
                </div>
                <div className="form-group">
                  <label htmlFor="c-email">email</label>
                  <input id="c-email" name="email" type="email" placeholder="you@company.com"
                    value={form.email} onChange={change} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-subject">subject</label>
                <input id="c-subject" name="subject" type="text" placeholder="What's this about?"
                  value={form.subject} onChange={change} required />
              </div>
              <div className="form-group">
                <label htmlFor="c-message">message</label>
                <textarea id="c-message" name="message" rows="5"
                  placeholder="Describe your question or use case…"
                  value={form.message} onChange={change} required />
              </div>
              <button type="submit" className="contact-submit-btn" disabled={busy}>
                {busy ? "sending…" : <>send_message <FaArrowRight /></>}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;
