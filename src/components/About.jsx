import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../styles/components/about.css';

const VALUES = [
  {
    number: '01',
    title: 'Precision Tech',
    desc: 'State-of-the-art offset and digital printing machinery delivering pixel-perfect output every time.',
  },
  {
    number: '02',
    title: 'Strict Deadlines',
    desc: 'We commit to timelines and deliver on schedule — your campaigns never wait for print.',
  },
  {
    number: '03',
    title: 'End-to-End',
    desc: 'From design consultation to finishing and delivery — a complete printing partner under one roof.',
  },
];

const TEAM = [
  {
    name: 'M. Sivaprasad',
    role: 'Director',
    photo: '/person-blue.png',
  },
  {
    name: 'Ajay Pandey',
    role: 'Operations Head',
    photo: '/person-grey.png',
  },
];

export default function About() {
  const sectionRef = useRef(null);
  const statementRef = useRef(null);
  const originalTextRef = useRef('');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Make all chars visible
      const chars = statementRef.current?.querySelectorAll('.char');
      chars?.forEach((c) => (c.style.opacity = '1'));
      return;
    }

    const statementEl = statementRef.current;
    // Store the original text for cleanup/restore
    if (statementEl && !originalTextRef.current) {
      originalTextRef.current = statementEl.textContent;
    }

    const ctx = gsap.context(() => {
      // Split statement text into characters — use DocumentFragment to batch DOM mutations
      if (statementEl) {
        const text = originalTextRef.current;
        statementEl.innerHTML = '';
        const fragment = document.createDocumentFragment();
        text.split('').forEach((char) => {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = char === ' ' ? '\u00A0' : char;
          fragment.appendChild(span);
        });
        statementEl.appendChild(fragment);

        const chars = statementEl.querySelectorAll('.char');
        gsap.to(chars, {
          opacity: 1,
          duration: 0.3,
          stagger: 0.015,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: statementEl,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        });
      }

      // Values fade in
      const values = sectionRef.current.querySelectorAll('.about__value');
      gsap.fromTo(
        values,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: '.about__values',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Team cards fade in
      const members = sectionRef.current.querySelectorAll('.about__member');
      gsap.fromTo(
        members,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: '.about__team',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      // Restore original text so StrictMode re-mount works correctly
      if (statementRef.current && originalTextRef.current) {
        statementRef.current.innerHTML = originalTextRef.current;
      }
    };
  }, []);

  return (
    <section className="about section" id="about" ref={sectionRef}>
      <div className="about__inner">
        <h2 className="about__statement" ref={statementRef}>
          ENGINEERING YOUR BRAND'S PHYSICAL IDENTITY
        </h2>

        <div className="about__values">
          {VALUES.map((value) => (
            <div className="about__value" key={value.number}>
              <span className="about__value-number">({value.number})</span>
              <h3 className="about__value-title">{value.title}</h3>
              <p className="about__value-desc">{value.desc}</p>
            </div>
          ))}
        </div>

        <span className="about__team-label">Our Team</span>
        <div className="about__team">
          {TEAM.map((member) => (
            <div className="about__member" key={member.name}>
              <img
                src={member.photo}
                alt={member.name}
                className="about__member-photo"
                loading="lazy"
              />
              <div className="about__member-info">
                <span className="about__member-name">{member.name}</span>
                <span className="about__member-role">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
