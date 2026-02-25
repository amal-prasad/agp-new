import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../styles/components/work.css';

const CATEGORIES = [
  {
    category: 'Packaging',
    tag: 'Product Design',
    color: '#E8E4DF',
  },
  {
    category: 'Corporate',
    tag: 'Brand Identity',
    color: '#D5D8DC',
  },
  {
    category: 'Marketing',
    tag: 'Campaigns',
    color: '#E0DDD5',
  },
  {
    category: 'Outdoor',
    tag: 'Signage & Flex',
    color: '#D8DBE0',
  },
];

export default function Work() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll('.work__item');

      gsap.fromTo(
        items,
        { opacity: 0, scale: 0.9, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 25%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="work" id="work" ref={sectionRef}>
      <div className="work__inner">
        <div className="work__header">
          <div>
            <span className="work__label">Portfolio</span>
            <h2 className="work__title">Selected Work</h2>
          </div>
        </div>

        <div className="work__grid">
          {CATEGORIES.map((item) => (
            <div className="work__item" key={item.category}>
              {/* Placeholder colored bg since no portfolio images exist yet */}
              <div
                className="work__item-image"
                style={{ backgroundColor: item.color, width: '100%', height: '100%' }}
              />
              <div className="work__item-overlay">
                <span className="work__item-category">{item.category}</span>
                <span className="work__item-tag">{item.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
