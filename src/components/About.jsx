import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionWipe } from '../hooks/useSectionWipe';
import '../styles/components/about.css';

gsap.registerPlugin(ScrollTrigger);

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

// Words for the headline stamp animation
const HEADLINE_WORDS = ['ENGINEERING', 'YOUR', "BRAND'S", 'IDENTITY'];

export default function About() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const wordRefs = useRef([]);
  const glowRefs = useRef([]);
  const memberRefs = useRef([]);

  // Section wipe transition
  useSectionWipe(sectionRef);

  // ----- 3D tilt handler for team cards -----
  const handleMouseMove = useCallback((e, cardEl) => {
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 8;   // ±8deg
    const rotateX = ((centerY - y) / centerY) * 6;    // ±6deg

    gsap.to(cardEl, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 600,
    });
  }, []);

  const handleMouseLeave = useCallback((cardEl) => {
    gsap.to(cardEl, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Make everything visible immediately
      wordRefs.current.forEach((w) => {
        if (w) w.style.opacity = '1';
      });
      return;
    }

    const section = sectionRef.current;
    const ctx = gsap.context(() => {

      /* ================================================
         1) HEADLINE — Press Plate Stamp Timeline
         ================================================ */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headlineRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      wordRefs.current.forEach((wordEl, i) => {
        if (!wordEl) return;
        const glowEl = glowRefs.current[i];

        // --- Slam down: starts tiny/tilted, overshoots, then settles ---
        tl.fromTo(
          wordEl,
          {
            scale: 0.3,
            opacity: 0,
            rotateX: -75,
            transformOrigin: 'center bottom',
          },
          {
            scale: 1.08,
            opacity: 1,
            rotateX: 0,
            duration: 0.18,
            ease: 'power4.out',
          },
          i === 0 ? '+=0' : '+=0.06'     // small gap between each word
        );

        // --- Snap-back settle ---
        tl.to(
          wordEl,
          {
            scale: 1,
            duration: 0.1,
            ease: 'power2.inOut',
          },
          '>'                             // right after the overshoot
        );

        // --- Screen shake (at same time as snap-back) ---
        tl.add(() => {
          section.classList.add('about--shake');
          gsap.delayedCall(0.12, () => section.classList.remove('about--shake'));
        }, '<');

        // --- Teal ink glow ---
        if (glowEl) {
          tl.fromTo(
            glowEl,
            { opacity: 1, boxShadow: '0 0 18px 6px rgba(45, 212, 191, 0.55)' },
            {
              opacity: 0,
              boxShadow: '0 0 0px 0px rgba(45, 212, 191, 0)',
              duration: 0.35,
              ease: 'power2.out',
            },
            '<'                           // simultaneous with snap-back
          );
        }
      });

      // --- Horizontal scanner line ---
      const scannerLine = headlineRef.current?.querySelector('.about__scanner');
      if (scannerLine) {
        tl.fromTo(
          scannerLine,
          { scaleX: 0, opacity: 1 },
          {
            scaleX: 1,
            duration: 0.45,
            ease: 'power2.inOut',
            transformOrigin: 'left center',
          },
          '+=0.15'                        // slight pause after last word
        );
        tl.to(
          scannerLine,
          { opacity: 0, duration: 0.25 },
          '>'
        );
      }

      /* ================================================
         2) FEATURE CARDS — Rise from below with stagger
         ================================================ */
      const values = section.querySelectorAll('.about__value');
      gsap.fromTo(
        values,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: '.about__values',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Counter animation on value numbers
      const numberEls = section.querySelectorAll('.about__value-number');
      numberEls.forEach((el) => {
        const targetText = el.textContent;
        const match = targetText.match(/(\d+)/);
        if (match) {
          const targetNum = parseInt(match[1], 10);
          const prefix = targetText.substring(0, targetText.indexOf(match[1]));
          const suffix = targetText.substring(
            targetText.indexOf(match[1]) + match[1].length
          );

          gsap.from(
            { val: 0 },
            {
              val: targetNum,
              duration: 1.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
              onUpdate: function () {
                el.textContent = `${prefix}${String(
                  Math.round(this.targets()[0].val)
                ).padStart(2, '0')}${suffix}`;
              },
            }
          );
        }
      });

      /* ================================================
         3) TEAM CARDS — Slide from left + signature line
         ================================================ */
      const members = section.querySelectorAll('.about__member');
      gsap.fromTo(
        members,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.25,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: '.about__team',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onComplete() {
            // Grow teal signature line on each card's ::after
            members.forEach((card, idx) => {
              gsap.to(card, {
                '--sig-scaleX': 1,
                duration: 0.4,
                delay: idx * 0.15,
                ease: 'power2.out',
              });
              // Also directly target the pseudo via the element's after
              const afterPseudo = card.querySelector('.about__member-sig');
              if (afterPseudo) {
                gsap.to(afterPseudo, {
                  scaleX: 1,
                  duration: 0.4,
                  delay: idx * 0.15,
                  ease: 'power2.out',
                  transformOrigin: 'left center',
                });
              }
            });
          },
        }
      );
    }, sectionRef);

    // --- Attach 3D tilt listeners for team cards ---
    const cards = memberRefs.current;
    const moveHandlers = [];
    const leaveHandlers = [];

    cards.forEach((card) => {
      if (!card) return;
      const onMove = (e) => handleMouseMove(e, card);
      const onLeave = () => handleMouseLeave(card);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      moveHandlers.push({ card, onMove });
      leaveHandlers.push({ card, onLeave });
    });

    return () => {
      ctx.revert();
      moveHandlers.forEach(({ card, onMove }) =>
        card.removeEventListener('mousemove', onMove)
      );
      leaveHandlers.forEach(({ card, onLeave }) =>
        card.removeEventListener('mouseleave', onLeave)
      );
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <section className="about section section-dark" id="about" ref={sectionRef}>

      <div className="about__inner">
        {/* ---------- HEADLINE ---------- */}
        <h2 className="about__statement" ref={headlineRef}>
          {HEADLINE_WORDS.map((word, i) => (
            <span
              className="about__stamp-word"
              key={word}
              ref={(el) => (wordRefs.current[i] = el)}
            >
              {word}
              <span
                className="about__stamp-glow"
                ref={(el) => (glowRefs.current[i] = el)}
              />
            </span>
          ))}
          {/* Scanner line element (real DOM so GSAP can target it) */}
          <span className="about__scanner" />
        </h2>

        {/* ---------- FEATURE CARDS ---------- */}
        <div className="about__values">
          {VALUES.map((value) => (
            <div className="about__value" key={value.number}>
              <span className="about__value-number">({value.number})</span>
              <h3 className="about__value-title">{value.title}</h3>
              <p className="about__value-desc">{value.desc}</p>
            </div>
          ))}
        </div>

        {/* ---------- TEAM ---------- */}
        <span className="about__team-label">Our Team</span>
        <div className="about__team">
          {TEAM.map((member, i) => (
            <div
              className="about__member"
              key={member.name}
              ref={(el) => (memberRefs.current[i] = el)}
            >
              <div className="about__member-avatar-wrap">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="about__member-photo"
                  loading="lazy"
                />
                <span className="about__member-orbit" />
              </div>
              <div className="about__member-info">
                <span className="about__member-name">{member.name}</span>
                <span className="about__member-role">{member.role}</span>
              </div>
              {/* Teal signature line */}
              <span className="about__member-sig" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
