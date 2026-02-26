import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../styles/components/marquee.css';

const KEYWORDS = [
    'VISITING CARDS',
    'BILL BOOKS',
    'FLEX PRINTING',
    'BROCHURES',
    'PACKAGING',
    'LETTERHEADS',
    'STICKERS',
    'MARKETING',
];

const DOUBLED = [...KEYWORDS, ...KEYWORDS];

export default function Marquee() {
    const trackRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        const track = trackRef.current;
        if (!track) return;

        const totalWidth = track.scrollWidth / 2;

        const tween = gsap.to(track, {
            x: -totalWidth,
            ease: 'none',
            duration: 25,
            repeat: -1,
            force3D: true,
        });

        return () => tween.kill();
    }, []);

    return (
        <div className="marquee section-dark">
            <div className="marquee__track-wrapper">
                <div className="marquee__track" ref={trackRef}>
                    {DOUBLED.map((keyword, i) => (
                        <span key={`${keyword}-${i}`}>
                            <span className="marquee__item">{keyword}</span>
                            <span className="marquee__dot">•</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
