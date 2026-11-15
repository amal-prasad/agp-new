import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable GSAP animation factories
 */

/**
 * Reveal text lines — animates child spans from translateY(110%) to 0
 */
export function revealTextLines(elements, options = {}) {
  const {
    duration = 1.2,
    stagger = 0.1,
    delay = 0,
    ease = 'power4.out',
  } = options;

  return gsap.to(elements, {
    y: 0,
    duration,
    stagger,
    delay,
    ease,
  });
}

/**
 * Fade in and slide up
 */
export function fadeInUp(elements, options = {}) {
  const {
    duration = 1,
    stagger = 0.15,
    delay = 0,
    y = 60,
    ease = 'power3.out',
  } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, stagger, delay, ease }
  );
}

/**
 * Scale in
 */
export function scaleIn(elements, options = {}) {
  const {
    duration = 1,
    stagger = 0.1,
    delay = 0,
    scale = 0.9,
    ease = 'power3.out',
  } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, scale },
    { opacity: 1, scale: 1, duration, stagger, delay, ease }
  );
}

/**
 * Character reveal — splits text into individual characters and returns animation controller
 */
export function characterReveal(container, options = {}) {
  const {
    duration = 0.6,
    stagger = 0.02,
    delay = 0,
    ease = 'power2.out',
  } = options;

  const text = container.textContent;
  container.innerHTML = '';

  const chars = text.split('').map((char) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    container.appendChild(span);
    return span;
  });

  return {
    chars,
    play: (scrollTriggerConfig) => {
      return gsap.to(chars, {
        opacity: 1,
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: scrollTriggerConfig,
      });
    },
  };
}

/**
 * Create a horizontal scroll setup
 */
export function createHorizontalScroll(trigger, track, options = {}) {
  const { scrub = true, end } = options;
  const totalWidth = track.scrollWidth - window.innerWidth;

  return gsap.to(track, {
    x: -totalWidth,
    ease: 'none',
    scrollTrigger: {
      trigger,
      pin: true,
      scrub,
      end: end || `+=${totalWidth}`,
      invalidateOnRefresh: true,
    },
  });
}
