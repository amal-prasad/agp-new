import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/herocube.css';

export default function HeroCube() {
  const cubeRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Skip on reduced motion or narrow screens
    if (prefersReducedMotion || window.innerWidth < 768) return;

    const cube = cubeRef.current;
    if (!cube) return;

    // --- Auto-rotation: gentle continuous Y-axis spin ---
    const autoTween = gsap.to(cube, {
      rotateY: '+=360',
      duration: 25,
      repeat: -1,
      ease: 'none',
      force3D: true,
    });

    // --- Scroll-driven rotation: overrides auto-rotation during scroll ---
    const heroEl = document.getElementById('hero');
    let scrollCtx;

    if (heroEl) {
      scrollCtx = gsap.context(() => {
        gsap.to(cube, {
          rotateY: 360,
          rotateX: 15,
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onEnter: () => autoTween.pause(),
            onLeaveBack: () => autoTween.resume(),
          },
          force3D: true,
        });
      });
    }

    // --- Resize handler: hide on mobile ---
    const handleResize = () => {
      if (window.innerWidth < 768) {
        cube.style.display = 'none';
      } else {
        cube.style.display = '';
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      autoTween.kill();
      window.removeEventListener('resize', handleResize);
      if (scrollCtx) scrollCtx.revert();
    };
  }, []);

  return (
    <div className="hero-cube-scene" aria-hidden="true">
      <div className="hero-cube" ref={cubeRef}>
        {/* Face 1 — Front: Company name + tagline */}
        <div className="hero-cube__face hero-cube__face--front">
          <span className="hero-cube__face-label">(01)</span>
          <div className="hero-cube__face-content">
            <h2 className="hero-cube__face-title">AGP</h2>
            <p className="hero-cube__face-subtitle">Enterprises</p>
            <span className="hero-cube__face-meta">Est. 2019</span>
          </div>
        </div>

        {/* Face 2 — Right: Coordinates + services */}
        <div className="hero-cube__face hero-cube__face--right">
          <span className="hero-cube__face-label">(02)</span>
          <div className="hero-cube__face-content">
            <p className="hero-cube__face-coords">22.7196° N</p>
            <p className="hero-cube__face-coords">75.8577° E</p>
            <ul className="hero-cube__face-list">
              <li>Print</li>
              <li>Design</li>
              <li>Package</li>
            </ul>
          </div>
        </div>

        {/* Face 3 — Back: Bold typographic statement */}
        <div className="hero-cube__face hero-cube__face--back">
          <span className="hero-cube__face-label">(03)</span>
          <div className="hero-cube__face-content">
            <h2 className="hero-cube__face-title hero-cube__face-title--bold">
              PRECISION
            </h2>
            <h2 className="hero-cube__face-title hero-cube__face-title--bold">
              IN PRINT
            </h2>
          </div>
        </div>

        {/* Face 4 — Left: Location + contact hint */}
        <div className="hero-cube__face hero-cube__face--left">
          <span className="hero-cube__face-label">(04)</span>
          <div className="hero-cube__face-content">
            <p className="hero-cube__face-location">INDORE</p>
            <p className="hero-cube__face-location">INDIA</p>
            <span className="hero-cube__face-meta">info@agp.co.in</span>
          </div>
        </div>

        {/* Face 5 — Top */}
        <div className="hero-cube__face hero-cube__face--top">
          <div className="hero-cube__face-content">
            <span className="hero-cube__face-meta">CRAFT</span>
          </div>
        </div>

        {/* Face 6 — Bottom */}
        <div className="hero-cube__face hero-cube__face--bottom">
          <div className="hero-cube__face-content">
            <span className="hero-cube__face-meta">QUALITY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
