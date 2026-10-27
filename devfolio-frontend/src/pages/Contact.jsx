
import { useState } from "react";
import api from "../services/api";
import SectionTitle from "../components/SectionTitle";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setMessage("");

    try {
      await api.post("/contact-messages/", form);
      setForm(initialForm);
      setMessage("Your message has been sent successfully.");
    } catch {
      setMessage("Unable to send the message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section container">
      <SectionTitle
        eyebrow="GET IN TOUCH"
        title="Contact Me"
        description="Have a question or an opportunity? Send me a message."
      />

      <div className="contact-layout">
        <div>
          <h2>Let's connect</h2>
          <p>You can use this form to contact me about projects, collaboration or professional opportunities.</p>
        </div>

        <form className="form-stack card contact-form" onSubmit={handleSubmit}>
          <label>
            Your name
            <input name="name" required maxLength={100} value={form.name} onChange={updateField} />
          </label>

          <label>
            Email address
            <input name="email" required type="email" value={form.email} onChange={updateField} />
          </label>

          <label>
            Subject
            <input name="subject" required maxLength={200} value={form.subject} onChange={updateField} />
          </label>

          <label>
            Message
            <textarea name="message" required maxLength={5000} rows={6} value={form.message} onChange={updateField} />
          </label>

          <button className="button" type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send message"}
          </button>

          {message && <p role="status" className="form-message">{message}</p>}
        </form>
      </div>
    </section>
  );
}
