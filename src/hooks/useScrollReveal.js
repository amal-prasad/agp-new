import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * useScrollReveal — scroll-triggered reveal animation for elements.
 *
 * @param {React.RefObject} containerRef - scope container
 * @param {string} selector - CSS selector for elements to animate
 * @param {object} options - override defaults
 */
export function useScrollReveal(containerRef, selector, options = {}) {
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
            y = 50,
            opacity = 0,
            duration = 0.8,
            stagger = 0.1,
            ease = 'power3.out',
            start = 'top 80%',
            triggerEl = null,
        } = options;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                elements,
                { opacity, y },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    stagger,
                    ease,
                    force3D: true,
                    scrollTrigger: {
                        trigger: triggerEl || container,
                        start,
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, container);

        return () => ctx.revert();
    }, [containerRef, selector]);
}
