import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useSectionWipe } from '../hooks/useSectionWipe';
import '../styles/components/clients.css';

const CLIENTS = [
  { name: 'IIM Indore', img: '/clients/iim_indore.jpg' },
  { name: 'Panasonic', img: '/clients/panasonic.png' },
  { name: 'IIT Indore', img: '/clients/iit_indore.jpg' },
  { name: 'Choithram Hospital', img: '/clients/choithram_hospital.png' },
  { name: 'Choithram Schools Indore', img: '/clients/choithram_schools_indore.png' },
  { name: 'GBL Hospital Indore', img: '/clients/gbl_hospital_indore.png' },
  { name: 'V-One Hospital Indore', img: '/clients/v-one_hospital_indore.png' },
  { name: 'Natural Living Pvt. Ltd.', img: '/clients/natural_living_pvt_ltd_indore.png' },
  { name: 'Ralson Tyres Ltd.', img: '/clients/ralson_tyres_pvt_ltd.png' },
  { name: 'RRCAT Indore', img: '/clients/rrcat_indore.png' },
  { name: 'BARC Mumbai', img: '/clients/barc_mumbai.png' },
  { name: 'Heavy Water Plant Manuguru', img: '/clients/heavy_water_plant_manuguru.png' },
  { name: 'NFC Hyderabad', img: '/clients/nfc_hyderabad.jpg' }
];

// Doubled array for seamless looping
const DOUBLED_CLIENTS = [...CLIENTS, ...CLIENTS];

export default function Clients() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  // Section wipe transition
  useSectionWipe(sectionRef);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const track = trackRef.current;
    if (!track) return;

    // We recalculate the target X on load & resize
    const setupAnimation = () => {
      // Clear previous transform to accurately measure pristine width
      gsap.set(track, { clearProps: "x" });
      const totalWidth = track.scrollWidth / 2;

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        duration: 40,
        repeat: -1,
        force3D: true,
      });
    };

    // Need a tiny timeout to ensure fonts/images are largely ready 
    // for correct scrollWidth, and then we measure
    const initTimer = setTimeout(setupAnimation, 100);
    window.addEventListener('resize', setupAnimation);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('resize', setupAnimation);
      gsap.killTweensOf(track);
    };
  }, []);

  return (
    <section
      className="clients section-light"
      id="clients"
      ref={sectionRef}
      style={{
        padding: '5rem 0',
        minHeight: '20vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#f8f8f8'
      }}
    >
      <div
        className="clients__label"
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontWeight: 500,
          color: '#888'
        }}
      >
        Trusted By
      </div>

      <div
        className="clients__track-wrapper"
        style={{
          overflow: 'hidden',
          width: '100%',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <div
          className="clients__track"
          ref={trackRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: 'max-content'
          }}
        >
          {DOUBLED_CLIENTS.map((client, i) => (
            <span 
              key={`${client.name}-${i}`} 
              className="clients__group"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 3.5rem'
              }}
            >
              <img 
                className="clients__logo" 
                src={client.img} 
                alt={client.name} 
                loading="lazy" 
                style={{ 
                  height: '110px', 
                  width: '200px', 
                  objectFit: 'contain',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              <span 
                style={{ 
                  fontSize: '0.75rem', 
                  color: '#999', 
                  marginTop: '1.25rem', 
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                {client.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
