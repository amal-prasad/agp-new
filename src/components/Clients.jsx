import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../styles/components/clients.css';

const CLIENTS = [
  'IIT INDORE',
  'IIM INDORE',
  'PANASONIC',
  'RRCAT',
  'IISER BHOPAL',
  'DAVV',
  'MEDICAPS',
  'PRESTIGE',
];

// Render the list twice in JSX for seamless looping (no DOM mutation)
const DOUBLED_CLIENTS = [...CLIENTS, ...CLIENTS];

export default function Clients() {
  const trackRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const track = trackRef.current;
    if (!track) return;

    // Half the scrollWidth = one full set of clients
    const totalWidth = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      duration: 30,
      repeat: -1,
      force3D: true,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section className="clients" id="clients">
      <div className="clients__label">Trusted By</div>
      <div className="clients__track-wrapper">
        <div className="clients__track" ref={trackRef}>
          {DOUBLED_CLIENTS.map((client, i) => (
            <span key={`${client}-${i}`}>
              <span className="clients__item">{client}</span>
              <span className="clients__separator">///</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
