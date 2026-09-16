import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionWipe } from '../hooks/useSectionWipe';
import '../styles/components/work.css';

const CATEGORIES = [
  {
    number: '01',
    category: 'Packaging',
    tag: 'Product Design',
    desc: 'Custom packaging boxes, labels, and corrugated solutions for product presentation.',
    color: '#E8E4DF',
    img: '/work/STATIONERY.jpg',
  },
  {
    number: '02',
    category: 'Corporate',
    tag: 'Brand Identity',
    desc: 'Business cards, letterheads, and envelopes — consistent identity across all touchpoints.',
    color: '#D5D8DC',
    img: '/work/CORPORATE.jpg',
  },
  {
    number: '03',
    category: 'Marketing',
    tag: 'Campaigns',
    desc: 'Brochures, catalogs, posters, and everything your campaign needs — end to end.',
    color: '#E0DDD5',
    img: '/work/MARKETING.jpg',
  },
  {
    number: '04',
    category: 'Outdoor',
    tag: 'Signage & Flex',
    desc: 'Large-format flex banners, hoardings, and signage with vivid, weather-resistant output.',
    color: '#D8DBE0',
    img: '/work/OUTDOOR.jpg',
  },
];

export default function Work() {
  const sectionRef = useRef(null);
  const cubeRef = useRef(null);

  // Section wipe transition
  useSectionWipe(sectionRef);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const cube = cubeRef.current;
    if (!section || !cube) return;

    // Skip 3D cube on mobile — the CSS fallback handles it
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      // Scroll-driven rotation: each 25% of scroll = 90deg
      gsap.to(cube, {
        rotateY: -270,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="work section-light" id="work" ref={sectionRef}>
      <div className="work__inner">
        <div className="work__header">
          <div>
            <span className="work__label">Portfolio</span>
            <h2 className="work__title">Selected Work</h2>
          </div>
        </div>

        {/* 3D Cube Carousel — desktop */}
        <div className="work__cube-scene">
          <div className="work__cube" ref={cubeRef}>
            {CATEGORIES.map((item, i) => {
              const faceClass = ['front', 'right', 'back', 'left'][i];
              return (
                <div
                  className={`work__cube-face work__cube-face--${faceClass}`}
                  key={item.category}
                  style={{ backgroundColor: item.color }}
                >
                  <img src={item.img} alt={item.category} className="work__cube-image" />
                  <div className="work__cube-face-gradient" />
                  <span className="work__cube-face-number">({item.number})</span>
                  <div className="work__cube-face-content">
                    <span className="work__cube-face-tag">{item.tag}</span>
                    <h3 className="work__cube-face-title">{item.category}</h3>
                    <p className="work__cube-face-desc">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flat fallback grid — mobile */}
        <div className="work__grid-fallback">
          {CATEGORIES.map((item) => (
            <div className="work__fallback-card" key={item.category}>
              <div
                className="work__fallback-bg"
                style={{ backgroundColor: item.color }}
              >
                <img src={item.img} alt={item.category} className="work__fallback-image" />
              </div>
              <div className="work__fallback-content">
                <span className="work__fallback-number">({item.number})</span>
                <h3 className="work__fallback-title">{item.category}</h3>
                <span className="work__fallback-tag">{item.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
