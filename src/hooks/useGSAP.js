import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * useGSAP — creates a gsap.context scoped to a container ref.
 * Returns { containerRef, contextRef } for use in components.
 *
 * @param {Function} setup - receives (gsap, ScrollTrigger, container) and should create animations
 * @param {Array} deps - dependency array
 */
export function useGSAP(setup, deps = []) {
  const containerRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    contextRef.current = gsap.context(() => {
      setup(gsap, ScrollTrigger, containerRef.current);
    }, containerRef);

    return () => {
      if (contextRef.current) {
        contextRef.current.revert();
      }
    };
  }, deps);

  return { containerRef, contextRef };
}

export { gsap, ScrollTrigger };
