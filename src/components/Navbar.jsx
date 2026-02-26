import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import '../styles/components/navbar.css';

const NAV_ITEMS = [
  { label: 'HOME', target: '#hero' },
  { label: 'SERVICES', target: '#services' },
  { label: 'WORK', target: '#work' },
  { label: 'CONTACT', target: '#contact' },
];

export default function Navbar({ isLoading }) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState('HOME');
  const [onDark, setOnDark] = useState(false); // Hero is light now
  const pillRef = useRef(null);
  const linksRef = useRef(null);
  const navRef = useRef(null);
  const buttonsRef = useRef({});

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Slide the pill to the active button's position
  const movePill = useCallback((label, immediate = false) => {
    const container = linksRef.current;
    const pill = pillRef.current;
    const activeBtn = buttonsRef.current[label];
    if (!container || !pill || !activeBtn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const props = {
      x: btnRect.left - containerRect.left,
      y: btnRect.top - containerRect.top,
      width: btnRect.width,
      height: btnRect.height,
    };

    if (immediate) {
      gsap.set(pill, props);
    } else {
      gsap.to(pill, { ...props, duration: 0.4, ease: 'power3.out' });
    }
  }, []);

  // Set initial pill position once navbar becomes visible
  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => movePill(active, true));
    }
  }, [visible, movePill, active]);

  // Animate pill whenever the active section changes
  useEffect(() => {
    if (visible) movePill(active);
  }, [active, visible, movePill]);

  // Track active section on scroll + detect dark/light section
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.querySelector(item.target)
    ).filter(Boolean);

    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const threshold = window.innerHeight / 3;
        // Walk backwards — first section whose visual top is above the threshold wins
        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i].getBoundingClientRect().top <= threshold) {
            setActive(NAV_ITEMS[i].label);
            break;
          }
        }

        // Detect if navbar overlaps a dark section
        const nav = navRef.current;
        if (nav) {
          const navRect = nav.getBoundingClientRect();
          const navMidY = navRect.top + navRect.height / 2;
          const navMidX = navRect.left + navRect.width / 2;
          // Temporarily hide nav to get element behind it
          nav.style.pointerEvents = 'none';
          const elBehind = document.elementFromPoint(navMidX, navMidY);
          nav.style.pointerEvents = '';
          if (elBehind) {
            const darkSection = elBehind.closest('.section-dark');
            setOnDark(!!darkSection);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Reposition pill on window resize to prevent drift
  useEffect(() => {
    const handleResize = () => movePill(active, true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [active, movePill]);

  const handleClick = useCallback((target) => {
    gsap.to(window, {
      scrollTo: { y: target, offsetY: 80 },
      duration: 1.5,
      ease: 'power3.inOut',
    });
  }, []);

  return (
    <nav
      className={`navbar ${visible ? 'visible' : ''} ${onDark ? 'navbar--dark' : ''}`}
      role="navigation"
      ref={navRef}
    >
      <img
        src="/logo.png"
        alt="AGP Enterprises"
        className="navbar__logo"
      />
      <div className="navbar__links" ref={linksRef}>
        <span className="navbar__pill" ref={pillRef} />
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            ref={(el) => { buttonsRef.current[item.label] = el; }}
            className={`navbar__link ${active === item.label ? 'active' : ''}`}
            onClick={() => handleClick(item.target)}
            aria-label={`Navigate to ${item.label}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
