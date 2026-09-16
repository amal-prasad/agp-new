import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  const [onDark, setOnDark] = useState(false); // Hero is now light
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pillRef = useRef(null);
  const linksRef = useRef(null);
  const navRef = useRef(null);
  const buttonsRef = useRef({});

  // Show navbar after preloader with slide-down entrance
  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        setVisible(true);
        // Slide-down entrance for nav items
        const links = navRef.current?.querySelectorAll('.navbar__link');
        if (links?.length) {
          gsap.fromTo(links, {
            y: -15,
            opacity: 0,
          }, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.1,
          });
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Frosted glass on scroll past hero
  useEffect(() => {
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;

    const st = ScrollTrigger.create({
      trigger: heroEl,
      start: 'bottom top+=100',
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });

    return () => st.kill();
  }, []);

  // Slide the pill to the active button's position
  const movePill = useCallback((label, immediate = false) => {
    const container = linksRef.current;
    const pill = pillRef.current;
    const activeBtn = buttonsRef.current[label];
    if (!container || !pill || !activeBtn) return;

    const props = {
      x: activeBtn.offsetLeft,
      y: activeBtn.offsetTop,
      width: activeBtn.offsetWidth,
      height: activeBtn.offsetHeight,
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
      // Small delay on initial render to ensure layout calculations are complete
      const timer = setTimeout(() => {
        requestAnimationFrame(() => movePill(active, true));
      }, 50);
      return () => clearTimeout(timer);
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

  // Reposition pill on window resize
  useEffect(() => {
    const handleResize = () => movePill(active, true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [active, movePill]);

  const handleClick = useCallback((target) => {
    setMobileOpen(false);
    gsap.to(window, {
      scrollTo: { y: target, offsetY: 80 },
      duration: 1.5,
      ease: 'power3.inOut',
    });
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  return (
    <>
      <nav
        className={`navbar ${visible ? 'visible' : ''} ${onDark ? 'navbar--dark' : ''} ${scrolled ? 'navbar--scrolled' : ''}`}
        role="navigation"
        ref={navRef}
      >
        <img
          src="/logo.png"
          alt="AGP Enterprises"
          className="navbar__logo"
        />

        {/* Desktop links */}
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

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={toggleMobile}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div className={`navbar__overlay ${mobileOpen ? 'navbar__overlay--open' : ''}`}>
        <div className="navbar__overlay-links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className="navbar__overlay-link"
              onClick={() => handleClick(item.target)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
