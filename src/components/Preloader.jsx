import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/components/preloader.css';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const counterRef = useRef(null);
  const lineRef = useRef(null);
  const panelLeftRef = useRef(null);
  const panelRightRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    // Counter animation: 0% → 100%
    tl.to(counter, {
      value: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = `${Math.round(counter.value)}%`;
        }
      },
    });

    // Progress line — use scaleX instead of width to avoid layout thrashing
    tl.to(
      lineRef.current,
      {
        scaleX: 1,
        duration: 2.5,
        ease: 'power2.inOut',
        force3D: true,
      },
      0
    );

    // Fade out counter, label, brand, and line before split
    tl.to(
      [counterRef.current, lineRef.current,
       preloaderRef.current.querySelector('.preloader__label'),
       preloaderRef.current.querySelector('.preloader__brand')],
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      },
      '+=0.3'
    );

    // Split-panel reveal: left panel slides left, right panel slides right
    tl.to(panelLeftRef.current, {
      xPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
      force3D: true,
    }, '>');

    tl.to(panelRightRef.current, {
      xPercent: 100,
      duration: 1,
      ease: 'power4.inOut',
      force3D: true,
    }, '<'); // simultaneous with left panel

    tl.set(preloaderRef.current, { display: 'none' });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className="preloader" ref={preloaderRef}>
      {/* Split panels — background layers that slide apart */}
      <div className="preloader__panel preloader__panel--left" ref={panelLeftRef} />
      <div className="preloader__panel preloader__panel--right" ref={panelRightRef} />

      {/* Content — sits above panels */}
      <div className="preloader__label">Loading</div>
      <div className="preloader__brand">AGP Enterprises</div>
      <div className="preloader__counter" ref={counterRef}>
        0%
      </div>
      <div className="preloader__line" ref={lineRef} />
    </div>
  );
}
