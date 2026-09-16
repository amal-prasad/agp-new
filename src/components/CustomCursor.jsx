import { useRef, useEffect } from 'react';
import '../styles/components/cursor.css';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const labelRef = useRef(null);

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
        const label = labelRef.current;
        if (!dot || !ring || !label) return;

        // Show custom cursor
        document.body.classList.add('custom-cursor-active');

        // --- Lerp-based cursor position tracking ---
        let mouseX = 0;
        let mouseY = 0;
        let dotX = 0;
        let dotY = 0;
        let ringX = 0;
        let ringY = 0;
        let currentLabel = '';
        let isHovering = false;
        let isInverted = false;
        let rafId = null;

        const DOT_LERP = 0.35;   // Dot follows closely
        const RING_LERP = 0.1;   // Ring lags behind (elastic feel)

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const tick = () => {
            // Lerp positions
            dotX += (mouseX - dotX) * DOT_LERP;
            dotY += (mouseY - dotY) * DOT_LERP;
            ringX += (mouseX - ringX) * RING_LERP;
            ringY += (mouseY - ringY) * RING_LERP;

            dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;
            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${isHovering ? 2.2 : 1})`;

            // Section-aware color inversion (throttled — check every ~10 frames)
            if (Math.random() < 0.1) {
                const el = document.elementFromPoint(mouseX, mouseY);
                if (el) {
                    const onDark = !!el.closest('.section-dark');
                    if (onDark !== isInverted) {
                        isInverted = onDark;
                        dot.classList.toggle('cursor--inverted', onDark);
                        ring.classList.toggle('cursor--inverted', onDark);
                    }
                }
            }

            rafId = requestAnimationFrame(tick);
        };

        // --- Hover label detection ---
        const showLabel = (text) => {
            currentLabel = text;
            label.textContent = text;
            isHovering = true;
            ring.classList.add('cursor-ring--active');
            label.classList.add('cursor-label--visible');
        };

        const hideLabel = () => {
            currentLabel = '';
            isHovering = false;
            ring.classList.remove('cursor-ring--active');
            label.classList.remove('cursor-label--visible');
        };

        const onMouseOver = (e) => {
            const target = e.target;
            if (!target) return;

            // Check for data-cursor attribute first
            const cursorEl = target.closest('[data-cursor]');
            if (cursorEl) {
                showLabel(cursorEl.dataset.cursor);
                return;
            }

            // Interactive elements get a generic scale-up
            const interactive = target.closest('a, button, [role="button"]');
            if (interactive) {
                showLabel('');
                return;
            }
        };

        const onMouseOut = (e) => {
            const target = e.target;
            if (!target) return;

            const cursorEl = target.closest('[data-cursor]');
            const interactive = target.closest('a, button, [role="button"]');
            if (cursorEl || interactive) {
                hideLabel();
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseover', onMouseOver, { passive: true });
        document.addEventListener('mouseout', onMouseOut, { passive: true });

        rafId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
            document.body.classList.remove('custom-cursor-active');
        };
    }, []);

    return (
        <>
            <div className="cursor-dot" ref={dotRef} />
            <div className="cursor-ring" ref={ringRef}>
                <span className="cursor-label" ref={labelRef} />
            </div>
        </>
    );
}
