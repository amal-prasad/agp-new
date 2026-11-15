import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * useSectionWipe — clip-path reveal animation when section scrolls into view.
 * Animates clip-path: inset(100% 0 0 0) → inset(0% 0 0 0) on the section itself.
 * No overlay element needed.
 *
 * @param {React.RefObject} containerRef - the section ref
 */
export function useSectionWipe(containerRef) {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;
        if (prefersReducedMotion) return;

        const container = containerRef.current;
        if (!container) return;

        // Set initial clip state
        gsap.set(container, { clipPath: 'inset(100% 0 0 0)' });

        const ctx = gsap.context(() => {
            gsap.to(container, {
                clipPath: 'inset(0% 0 0 0)',
                ease: 'expo.inOut',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: true,
                },
            });
        }, container);

        return () => ctx.revert();
    }, [containerRef]);
}
