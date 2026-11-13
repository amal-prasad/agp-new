import { useRef, useEffect } from 'react';
import '../styles/components/cursor.css';

// Single orange/black dot cursor, follows mouse with light lerp; grows over links/buttons.
export default function CustomCursor() {
    const dotRef = useRef(null);

    useEffect(() => {
        if (!window.matchMedia('(hover: hover)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const dot = dotRef.current;
        if (!dot) return;

        document.body.classList.add('custom-cursor-active');

        let mouseX = -100, mouseY = -100, x = -100, y = -100, scale = 1, rafId;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        const onMouseOver = (e) => {
            scale = e.target?.closest?.('a, button, [role="button"], [data-cursor]') ? 2 : 1;
        };
        const tick = () => {
            x += (mouseX - x) * 0.3;
            y += (mouseY - y) * 0.3;
            dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
            rafId = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseover', onMouseOver, { passive: true });
        rafId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            document.body.classList.remove('custom-cursor-active');
        };
    }, []);

    return <div className="cursor-dot" ref={dotRef} />;
}
