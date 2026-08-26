import { useState } from "react";
import "./Contact.css";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.message || "Failed to send message. Verify the input values.");
      }

      setSent(true);
    } catch (err) {
      setError(err.message || "A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-header">
        <span className="badge contact-badge">Get in Touch</span>
        <h2>Let's Talk About Your AI System</h2>
        <p>
          Questions about the framework, partnership ideas, or need help scoping
          an assessment — reach out and we'll get back within one business day.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="info-card">
            <FaEnvelope />
            <div>
              <h4>Email</h4>
              <p>hello@airiskframework.com</p>
            </div>
          </div>

          <div className="info-card">
            <FaPhoneAlt />
            <div>
              <h4>Phone</h4>
              <p>+1 (555) 018-2044</p>
            </div>
          </div>

          <div className="info-card">
            <FaMapMarkerAlt />
            <div>
              <h4>Location</h4>
              <p>Remote-first — San Francisco, CA</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {sent ? (
            <div className="form-success">
              <FaCheckCircle />
              <h3>Message sent</h3>
              <p>
                Thanks for reaching out — we'll reply within one business day.
              </p>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", subject: "", message: "" });
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ color: "#ef4444", marginBottom: "16px", fontSize: "14px", fontWeight: "bold" }}>
                  {error}
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tell us a bit about your AI system or question..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="primary-btn" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"} <FaPaperPlane />
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;
