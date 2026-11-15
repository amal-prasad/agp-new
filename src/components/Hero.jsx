import { useRef, useEffect } from 'react';
import gsap from 'gsap';

import '../styles/components/hero.css';

export default function Hero({ isLoading }) {
  const heroRef = useRef(null);

  useEffect(() => {
    if (isLoading) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Just show everything immediately
      const spans = heroRef.current?.querySelectorAll('.hero__title-line > span, .hero__subtitle > span');
      spans?.forEach((span) => {
        span.style.transform = 'translateY(0)';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const titleSpans = heroRef.current.querySelectorAll('.hero__title-line > span');
      const subtitleSpan = heroRef.current.querySelector('.hero__subtitle > span');

      const tl = gsap.timeline({ delay: 0.2 });

      // Title lines reveal
      tl.to(titleSpans, {
        y: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power4.out',
        force3D: true,
      });

      // Subtitle reveal
      tl.to(
        subtitleSpan,
        {
          y: 0,
          duration: 1,
          ease: 'power3.out',
          force3D: true,
        },
        '-=0.8'
      );

      // Parallax on scroll
      gsap.to('.hero__content', {
        yPercent: -15,
        opacity: 0.3,
        force3D: true,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <section className="hero section-light" id="hero" ref={heroRef}>
      <div className="hero__content">
        <h1 className="hero__title">
          <span className="hero__title-line">
            <span className="hero__title-agp">
              <img src="/logo.png" alt="" className="hero__logo" />
            </span>
          </span>
          <span className="hero__title-line">
            <span>ENTERPRISES</span>
          </span>
        </h1>
        <p className="hero__subtitle">
          <span>PRECISION IN PRINT. — EST. 2019</span>
        </p>
      </div>

      {/* Corner metadata */}
      <span className="hero__meta hero__meta--top-right">
        INDORE, INDIA
      </span>
      <span className="hero__meta hero__meta--bottom-right">
        SCROLL <span className="arrow">↓</span>
      </span>
      <span className="hero__meta hero__meta--bottom-left mono-font">
        22.7196° N, 75.8577° E
      </span>
    </section>
  );
}
