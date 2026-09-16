import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import emailjs from '@emailjs/browser';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSectionWipe } from '../hooks/useSectionWipe';
import '../styles/components/contact.css';

// EmailJS credentials — set via VITE_EMAILJS_* environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

const INQUIRY_OPTIONS = [
  'Visiting Cards',
  'Bill Books',
  'Flex Printing',
  'Brochures',
  'Packaging',
  'Letterheads',
  'Stickers & Labels',
  'Marketing Collateral',
  'Other',
];

export default function Contact() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [sending, setSending] = useState(false);

  // Section wipe transition
  useSectionWipe(sectionRef);

  // Scroll reveal for info and form columns
  useScrollReveal(sectionRef, '.contact__info, .contact__form', {
    y: 50,
    duration: 1,
    stagger: 0.2,
    start: 'top 75%',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setStatus(null);

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      formRef.current.reset();
    } catch (err) {
      console.error('EmailJS Error:', err);
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact section section-dark" id="contact" ref={sectionRef}>
      <div className="section-wipe" />
      <div className="contact__inner">
        {/* Left — Info */}
        <div className="contact__info">
          <div>
            <h2 className="contact__heading">
              Say
              <br />
              Hello
            </h2>
          </div>
          <div className="contact__details">
            <div>
              <span className="contact__detail-label">Phone</span>
              <p className="contact__detail-value">
                <a href="tel:+919479525913">+91 94795 25913</a>
              </p>
            </div>
            <div>
              <span className="contact__detail-label">Email</span>
              <p className="contact__detail-value">
                <a href="mailto:agpenterprises2019@gmail.com">
                  agpenterprises2019@gmail.com
                </a>
              </p>
            </div>
            <div>
              <span className="contact__detail-label">Address</span>
              <p className="contact__detail-value">
                Treasure Fantasy, Rau, A-36/104, Indore
                <br />
                Madhya Pradesh, India 453331
              </p>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <form className="contact__form" ref={formRef} onSubmit={handleSubmit}>
          <div className="contact__form-group">
            <label className="contact__form-label" htmlFor="name">
              Name
            </label>
            <input
              className="contact__form-input"
              type="text"
              id="name"
              name="user_name"
              required
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div className="contact__form-group">
            <label className="contact__form-label" htmlFor="phone">
              Phone
            </label>
            <input
              className="contact__form-input"
              type="tel"
              id="phone"
              name="user_phone"
              placeholder="+91 XXXXX XXXXX"
              autoComplete="tel"
            />
          </div>

          <div className="contact__form-group">
            <label className="contact__form-label" htmlFor="email">
              Email
            </label>
            <input
              className="contact__form-input"
              type="email"
              id="email"
              name="user_email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="contact__form-group">
            <label className="contact__form-label" htmlFor="inquiry">
              Inquiry Type
            </label>
            <select
              className="contact__form-select"
              id="inquiry"
              name="inquiry_type"
              defaultValue=""
            >
              <option value="" disabled>
                Select a service
              </option>
              {INQUIRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="contact__form-group">
            <label className="contact__form-label" htmlFor="message">
              Message
            </label>
            <textarea
              className="contact__form-textarea"
              id="message"
              name="message"
              required
              placeholder="Tell us about your project..."
              rows={5}
            />
          </div>

          <button
            type="submit"
            className="contact__form-submit"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="contact__form-status success">
              Message sent successfully. We'll get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p className="contact__form-status error">
              Something went wrong. Please try again or contact us directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
