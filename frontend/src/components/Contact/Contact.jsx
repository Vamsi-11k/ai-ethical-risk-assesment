import { useState } from "react";
import { FaEnvelope, FaArrowRight, FaCheckCircle } from "react-icons/fa";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Send failed.");
      setSent(true);
    } catch (err) {
      setError(err.message || "Network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="contact" className="py-4">
      <div className="mb-8">
        <span className="inline-block rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-800">
          Contact
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
          Get in touch
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
          Questions about the framework or integrations — reach out directly via email or the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-3 lg:col-span-4">
          <a
            href="mailto:konikivenkat438@gmail.com"
            className="card-mono flex items-center gap-4 rounded-2xl p-5 hover:border-black"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-sm text-white">
              <FaEnvelope />
            </div>
            <div className="min-w-0">
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Email
              </h4>
              <p className="mt-0.5 truncate text-sm font-semibold text-neutral-950">
                konikivenkat438@gmail.com
              </p>
            </div>
          </a>
        </div>

        <form
          onSubmit={submit}
          className="card-mono rounded-3xl p-5 sm:p-8 lg:col-span-8"
        >
          {sent ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-xl text-white">
                <FaCheckCircle />
              </div>
              <h3 className="mt-4 text-xl font-bold text-neutral-950">Message Sent</h3>
              <p className="mt-1.5 text-sm font-medium text-neutral-800">
                Thank you for reaching out.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", subject: "", message: "" });
                }}
                className="btn-black mt-6 rounded-xl px-5 py-2.5 text-sm"
              >
                Send Another
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {error && (
                <div className="rounded-xl border border-neutral-900 bg-neutral-950 px-4 py-3 text-xs font-medium text-white">
                  Error: {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="c-name"
                    className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700"
                  >
                    Name
                  </label>
                  <input
                    id="c-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={change}
                    required
                    className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 text-sm text-neutral-950 placeholder:text-neutral-500 transition-colors focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c-email"
                    className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700"
                  >
                    Email
                  </label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={change}
                    required
                    className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 text-sm text-neutral-950 placeholder:text-neutral-500 transition-colors focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="c-subject"
                  className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700"
                >
                  Subject
                </label>
                <input
                  id="c-subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={change}
                  required
                  className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 text-sm text-neutral-950 placeholder:text-neutral-500 transition-colors focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="c-message"
                  className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700"
                >
                  Message
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  rows="5"
                  placeholder="Describe your question or use case…"
                  value={form.message}
                  onChange={change}
                  required
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 p-3.5 text-sm text-neutral-950 placeholder:text-neutral-500 transition-colors focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="btn-black group mt-2 min-h-[46px] w-full rounded-xl px-6 py-3 text-sm sm:w-fit"
              >
                <span>{busy ? "Sending…" : "Send Message"}</span>
                {!busy && (
                  <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;
