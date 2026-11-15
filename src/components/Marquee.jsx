import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/marquee.css';

// Brand keywords for the text wall — repeated to fill each row
const WORDS = [
  'PRECISION', 'PRINT', 'DESIGN', 'CRAFT', 'QUALITY',
  'PRODUCTION', 'FORM', 'DETAIL', 'VISUAL', 'IDENTITY',
  'BRAND', 'PRESS', 'PAPER', 'INK', 'TYPE',
];

// 5 rows, each with a shuffled subset so they don't look identical
const ROWS = [
  ['PRECISION', '✦', 'PRINT', '✦', 'DESIGN', '✦', 'CRAFT', '✦', 'QUALITY', '✦', 'PRECISION', '✦', 'PRINT', '✦', 'DESIGN', '✦', 'CRAFT', '✦', 'QUALITY'],
  ['PRODUCTION', '✦', 'FORM', '✦', 'DETAIL', '✦', 'VISUAL', '✦', 'IDENTITY', '✦', 'PRODUCTION', '✦', 'FORM', '✦', 'DETAIL', '✦', 'VISUAL', '✦', 'IDENTITY'],
  ['BRAND', '✦', 'PRESS', '✦', 'PAPER', '✦', 'INK', '✦', 'TYPE', '✦', 'BRAND', '✦', 'PRESS', '✦', 'PAPER', '✦', 'INK', '✦', 'TYPE'],
  ['CRAFT', '✦', 'QUALITY', '✦', 'PRECISION', '✦', 'DESIGN', '✦', 'PRINT', '✦', 'CRAFT', '✦', 'QUALITY', '✦', 'PRECISION', '✦', 'DESIGN', '✦', 'PRINT'],
  ['VISUAL', '✦', 'IDENTITY', '✦', 'FORM', '✦', 'PRODUCTION', '✦', 'DETAIL', '✦', 'VISUAL', '✦', 'IDENTITY', '✦', 'FORM', '✦', 'PRODUCTION', '✦', 'DETAIL'],
];

export default function Marquee() {
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, i) => {
        if (!row) return;

        // Odd rows (0, 2, 4) scroll left; even rows (1, 3) scroll right
        const direction = i % 2 === 0 ? -1 : 1;
        const distance = 300; // px of travel tied to section scroll

        gsap.fromTo(
          row,
          { x: direction * distance },
          {
            x: direction * -distance,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="marquee" ref={sectionRef}>
      <div className="marquee__inner">
        {ROWS.map((row, rowIndex) => (
          <div
            className="marquee__row"
            key={rowIndex}
            ref={(el) => { rowRefs.current[rowIndex] = el; }}
          >
            {row.map((word, wordIndex) => (
              <span
                key={`${rowIndex}-${wordIndex}`}
                className={word === '✦' ? 'marquee__star' : 'marquee__word'}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
