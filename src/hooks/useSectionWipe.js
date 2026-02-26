import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * useSectionWipe — reveal-wipe animation when section scrolls into view.
 * Requires a `.section-wipe` child element inside the section.
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

        const wipe = container.querySelector('.section-wipe');
        if (!wipe) return;

        const ctx = gsap.context(() => {
            gsap.to(wipe, {
                scaleX: 0,
                duration: 0.9,
                ease: 'expo.inOut',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
            });
        }, container);

        return () => ctx.revert();
    }, [containerRef]);
}
