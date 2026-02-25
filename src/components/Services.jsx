import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../styles/components/services.css';

const SERVICES = [
  {
    number: '01',
    name: 'Visiting Cards',
    desc: 'Premium business cards with offset and digital printing — matte, glossy, textured finishes.',
  },
  {
    number: '02',
    name: 'Bill Books',
    desc: 'Custom invoice books, receipt pads, and carbonless multi-part forms for businesses.',
  },
  {
    number: '03',
    name: 'Flex Printing',
    desc: 'Large-format flex banners, hoardings, and signage with vivid, weather-resistant output.',
  },
  {
    number: '04',
    name: 'Brochures',
    desc: 'Tri-fold, bi-fold, and custom brochure designs — premium paper stocks and finishing.',
  },
  {
    number: '05',
    name: 'Packaging',
    desc: 'Custom packaging boxes, labels, and corrugated solutions for product presentation.',
  },
  {
    number: '06',
    name: 'Letterheads',
    desc: 'Corporate letterheads and envelopes — consistent brand identity across all correspondence.',
  },
  {
    number: '07',
    name: 'Stickers & Labels',
    desc: 'Die-cut stickers, product labels, and vinyl decals in any shape and finish.',
  },
  {
    number: '08',
    name: 'Marketing Collateral',
    desc: 'Posters, standees, catalogs, and everything your campaign needs — end to end.',
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Calculate how far the track needs to scroll
      const getScrollAmount = () => {
        return -(track.scrollWidth - window.innerWidth);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="services__inner" ref={trackRef}>
        <div className="services__header">
          <span className="services__label">What we do</span>
          <h2 className="services__title">Services</h2>
          <span className="services__count">({String(SERVICES.length).padStart(2, '0')})</span>
        </div>
        {SERVICES.map((service) => (
          <div className="services__card" key={service.number}>
            <span className="services__card-number">({service.number})</span>
            <div>
              <h3 className="services__card-name">{service.name}</h3>
              <p className="services__card-desc">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
