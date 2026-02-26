import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import '../styles/components/cursor.css';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        // Only enable on hover-capable devices
        const canHover = window.matchMedia('(hover: hover)').matches;
        if (!canHover) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;
        if (prefersReducedMotion) return;

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        // Show custom cursor
        document.body.classList.add('custom-cursor-active');

        const onMouseMove = (e) => {
            gsap.to(dot, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out',
            });
            gsap.to(ring, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out',
            });

            // Check if cursor is over a dark section
            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (el) {
                const section = el.closest('.section-dark');
                if (section) {
                    dot.classList.add('cursor--inverted');
                    ring.classList.add('cursor--inverted');
                } else {
                    dot.classList.remove('cursor--inverted');
                    ring.classList.remove('cursor--inverted');
                }
            }
        };

        const onMouseEnterLink = () => setIsHover(true);
        const onMouseLeaveLink = () => setIsHover(false);

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // Enlarge cursor on interactive elements
        const interactives = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
        interactives.forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnterLink);
            el.addEventListener('mouseleave', onMouseLeaveLink);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.body.classList.remove('custom-cursor-active');
            interactives.forEach((el) => {
                el.removeEventListener('mouseenter', onMouseEnterLink);
                el.removeEventListener('mouseleave', onMouseLeaveLink);
            });
        };
    }, []);

    // Re-apply hover scale
    useEffect(() => {
        const ring = ringRef.current;
        if (!ring) return;
        if (isHover) {
            gsap.to(ring, { scale: 1.8, duration: 0.3, ease: 'power2.out' });
        } else {
            gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out' });
        }
    }, [isHover]);

    return (
        <>
            <div className="cursor-dot" ref={dotRef} />
            <div className="cursor-ring" ref={ringRef} />
        </>
    );
}
