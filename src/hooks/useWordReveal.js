import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

/**
 * useWordReveal — word-by-word scroll-triggered text reveal with line-mask effect.
 *
 * Uses split-type to split text into words, then wraps each line in an
 * overflow-hidden container. Words animate from translateY(100%) opacity:0
 * to translateY(0) opacity:1 with stagger.
 *
 * @param {React.RefObject} containerRef - scope container
 * @param {string} selector - CSS selector for elements to animate
 * @param {object} options - override defaults
 */
export function useWordReveal(containerRef, selector, options = {}) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (!elements.length) return;

    const {
      stagger = 0.04,
      duration = 0.8,
      ease = 'power3.out',
      start = 'top 85%',
    } = options;

    const splits = [];

    const ctx = gsap.context(() => {
      elements.forEach((el) => {
        // Split text into words and lines
        const split = new SplitType(el, {
          types: 'words,lines',
          tagName: 'span',
        });
        splits.push(split);

        // Add overflow hidden to each line wrapper for mask effect
        if (split.lines) {
          split.lines.forEach((line) => {
            line.style.overflow = 'hidden';
            line.style.display = 'block';
          });
        }

        // Set initial state for words
        if (split.words) {
          gsap.set(split.words, {
            y: '100%',
            opacity: 0,
          });

          // Animate words in on scroll
          gsap.to(split.words, {
            y: '0%',
            opacity: 1,
            duration,
            stagger,
            ease,
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }, container);

    return () => {
      ctx.revert();
      // Revert split-type to restore original DOM
      splits.forEach((split) => {
        try { split.revert(); } catch (e) { /* already reverted */ }
      });
    };
  }, [containerRef, selector]);
}
