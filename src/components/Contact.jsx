import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import emailjs from '@emailjs/browser';
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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact__info, .contact__form',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
    <section className="contact section" id="contact" ref={sectionRef}>
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
                <a href="tel:+917314972922">+91 731 497 2922</a>
              </p>
              <p className="contact__detail-value">
                <a href="tel:+919009992922">+91 900 999 2922</a>
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
                117, Siyaganj, Indore
                <br />
                Madhya Pradesh 452001, India
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
