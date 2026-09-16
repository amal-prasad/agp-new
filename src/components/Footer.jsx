import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useWordReveal } from '../hooks/useWordReveal';
import { useScrollReveal } from '../hooks/useScrollReveal';
import '../styles/components/footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef(null);

  // Word-by-word reveal on brand name
  useWordReveal(footerRef, '.footer__brand-name', { stagger: 0.05, duration: 1 });

  // Slide-up reveal on entire footer
  useScrollReveal(footerRef, '.footer__inner', {
    y: 40,
    duration: 1,
    start: 'top 90%',
  });

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <img src="/logo.png" alt="AGP" className="footer__logo" />
            <span className="footer__brand-name">AGP Enterprises</span>
          </div>
        </div>

        <div className="footer__middle">
          <div className="footer__coords">
            <div>22.7196° N, 75.8577° E</div>
            <div>INDORE — MADHYA PRADESH</div>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">
            &copy;AGP ENTERPRISES {year}
          </span>
          <span className="footer__meta">
            BUILT WITH PRECISION — VITE + REACT + GSAP
          </span>
        </div>
      </div>
    </footer>
  );
}
