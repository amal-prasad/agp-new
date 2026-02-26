import '../styles/components/footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <img src="/logo.png" alt="AGP" className="footer__logo" />
            <span className="footer__brand-name">AGP Enterprises</span>
          </div>
          <div className="footer__coords">
            <div>22.7196° N, 75.8577° E</div>
            <div>INDORE — MADHYA PRADESH</div>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">
            &copy; {year} AGP Enterprises. All rights reserved.
          </span>
          <span className="footer__meta">
            BUILT WITH PRECISION — VITE + REACT + GSAP
          </span>
        </div>
      </div>
    </footer>
  );
}
