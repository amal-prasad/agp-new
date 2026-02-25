# Antigravity Website — Animation & Visual Variety Upgrade Prompt

> **Reference:** [Big Picture Company](https://big-picture.com/) — as featured on [Godly](https://godly.website/website/bigpicture-company-1005)
> **Stack used by reference:** GSAP · ScrollTrigger · Three.js · React · Next.js
> **Tags from reference:** Animation · Large Type · 3D · Long Scrolling · Transitions · Horizontal Scrolling · Light

---

## Context

The current Antigravity website is built entirely on a **solid white background** with less animations, no visual rhythm, and hardly any motion. It feels static and lacks depth. The goal of this upgrade is to:

1. **Inject scroll-driven animations** — specifically a 3D rotating/morphing geometric object (a box/cube) that responds to scroll position, inspired directly by the Big Picture Company site.
2. **Break the all-black monotony** — introduce alternating **black and white section blocks** so the page breathes with contrast, exactly like Big Picture alternates between light and dark panels as you scroll.
3. **Add motion everywhere** — text reveals, fade-ins, slide-ins, and scroll-triggered transitions throughout.

Do **not** change the brand identity, copy, or layout structure — only layer animation and color variety on top of what already exists.

---

## 1. 3D Rotating Box / Geometric Object Animation

### What the reference does
The Big Picture Company site features a **3D geometric shape (a cube/box)** that:
- Rotates continuously on the Y and X axis as a background/hero element
- Its rotation speed and angle are **scrubbed to the scroll position** using GSAP ScrollTrigger
- The box is rendered using **Three.js** on a `<canvas>` element
- It has a **wireframe or solid black/white material** — never colorful
- As the user scrolls down, the box rotates, scales, and sometimes morphs or transforms

### What to implement for Antigravity

**Hero Section:**
```js
// Three.js cube — wireframe on black background
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);
```

- Place a `<canvas>` absolutely positioned in the **hero/above-the-fold section**
- The cube should **auto-rotate** slowly on load (Y-axis, ~0.003 rad/frame)
- On scroll, use **GSAP ScrollTrigger with `scrub: 1.5`** to bind `cube.rotation.x` and `cube.rotation.y` to scroll progress
- The cube should complete approximately **2 full rotations** as the user scrolls through the hero section
- On white background sections, invert to a **black wireframe cube**

**GSAP ScrollTrigger binding:**
```js
gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1.5,
  },
})
.to(cube.rotation, { x: Math.PI * 2, duration: 1 }, 0)
.to(cube.rotation, { y: Math.PI * 1.5, duration: 1 }, 0);
```

**Additional geometry elements (optional but recommended):**
- A second, smaller rotating **torus or icosahedron** near the "About" or "Services" section
- A **grid of dots or lines** (Three.js Points or LineSegments) that shifts on scroll

---

## 2. Alternating Black & White Sections

### What the reference does
The Big Picture Company site does **not** stay on one background color. It alternates:
- `Hero` → **Black** background, white text
- `What We Do` → **White** background, black text
- `Stats / Numbers` → **Black** background, white text
- `Portfolio/Work` → **White** background, black text
- `Contact` → **Black** background, white text

This creates a **visual rhythm** — reading the site feels like turning pages in a high-contrast editorial magazine.

### What to implement for Antigravity

Apply the following section color scheme (adapt section names to match Antigravity's actual content):

| Section | Background | Text | Accent |
|---------|-----------|------|--------|
| Hero / Above the Fold | `#000000` | `#FFFFFF` | `#FFFFFF` |
| About / Mission | `#FFFFFF` | `#000000` | `#000000` |
| Services / What We Do | `#000000` | `#FFFFFF` | `#FFFFFF` |
| Work / Portfolio | `#F5F5F5` (near-white) | `#000000` | `#000000` |
| Numbers / Stats | `#000000` | `#FFFFFF` | `#FFFFFF` |
| Team / People | `#FFFFFF` | `#000000` | `#000000` |
| Contact / Footer | `#000000` | `#FFFFFF` | `#FFFFFF` |

**CSS approach:**
```css
section.dark {
  background: #000;
  color: #fff;
}

section.light {
  background: #fff;
  color: #000;
}

/* Smooth background transition as sections enter viewport */
section {
  transition: background 0.4s ease;
}
```

**Add a global scroll color-switch** using GSAP:
```js
ScrollTrigger.create({
  trigger: ".section-light",
  start: "top 60%",
  onEnter: () => gsap.to("body", { backgroundColor: "#fff", duration: 0.6 }),
  onLeaveBack: () => gsap.to("body", { backgroundColor: "#000", duration: 0.6 }),
});
```

---

## 3. Scroll-Triggered Text Animations

### What the reference does
Every line of text on Big Picture's site **enters the viewport with motion** — either:
- Letters/words sliding up from below (`translateY: 60px → 0`)
- Opacity fading in (`opacity: 0 → 1`)
- Staggered reveals on multi-line headings

### What to implement for Antigravity

**Large headings — character split + stagger:**
```js
// Use GSAP SplitText or manual char splitting
gsap.from(".section-heading .char", {
  scrollTrigger: {
    trigger: ".section-heading",
    start: "top 80%",
  },
  y: 80,
  opacity: 0,
  duration: 0.8,
  stagger: 0.03,
  ease: "power3.out",
});
```

**Body paragraphs — line by line:**
```js
gsap.from(".section-body p", {
  scrollTrigger: {
    trigger: ".section-body",
    start: "top 85%",
  },
  y: 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.15,
  ease: "power2.out",
});
```

**Cards / service blocks — stagger from bottom:**
```js
gsap.from(".card", {
  scrollTrigger: {
    trigger: ".cards-grid",
    start: "top 75%",
  },
  y: 60,
  opacity: 0,
  duration: 0.7,
  stagger: 0.1,
  ease: "back.out(1.3)",
});
```

---

## 4. Section Transition Overlays

### What the reference does
Big Picture uses **full-bleed horizontal wipes and curtain transitions** between sections — a black or white overlay slides in/out as you scroll into a new section, giving a magazine-page-flip feeling.

### What to implement for Antigravity

Add a `<div class="section-wipe">` overlay inside each section:

```css
.section-wipe {
  position: absolute;
  inset: 0;
  transform-origin: left center;
  transform: scaleX(1);
  z-index: 10;
  pointer-events: none;
}

section.dark .section-wipe  { background: #000; }
section.light .section-wipe { background: #fff; }
```

```js
gsap.to(".section-wipe", {
  scrollTrigger: {
    trigger: section,
    start: "top 70%",
    toggleActions: "play none none reverse",
  },
  scaleX: 0,
  duration: 0.9,
  ease: "expo.inOut",
});
```

---

## 5. Horizontal Scrolling Strip (Optional — Reference Feature)

The Big Picture site includes a **horizontal auto-scrolling ticker/marquee** of keywords, logos, or service names. Add this for Antigravity:

```js
// Infinite horizontal marquee using GSAP
gsap.to(".marquee-track", {
  x: "-50%",
  duration: 20,
  ease: "linear",
  repeat: -1,
});
```

Style it as a **full-width band** between two sections — black text on white OR white text on black depending on surrounding sections.

---

## 6. Numbers / Stats Counter Animation

When stats or numbers enter the viewport, they should **count up from 0** to their final value:

```js
gsap.from(counter, {
  scrollTrigger: { trigger: counter, start: "top 80%" },
  innerText: 0,
  duration: 2,
  snap: { innerText: 1 },
  ease: "power2.out",
});
```

---

## Implementation Notes

- **GSAP version:** `3.12+` with `ScrollTrigger` plugin
- **Three.js version:** `r128` or later
- **Performance:** Use `will-change: transform` on animated elements; kill ScrollTrigger instances on unmount if using React
- **Accessibility:** Wrap all animations in `prefers-reduced-motion` media query check:
  ```js
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) { /* init all GSAP animations */ }
  ```
- **Mobile:** Disable Three.js canvas on screens < 768px for performance; keep CSS scroll animations

---

## Visual Mood Board Summary

| Element | Big Picture Reference | Antigravity Target |
|---------|----------------------|--------------------|
| Background rhythm | Black ↔ White alternating sections | Same — implement now |
| 3D object | Rotating cube/box, wireframe | Three.js wireframe cube, scroll-scrubbed |
| Typography motion | Chars split, stagger up | GSAP SplitText or manual split |
| Section transitions | Black/white curtain wipes | scaleX overlay wipe |
| Horizontal element | Scrolling marquee band | Keyword/service ticker |
| Cursor | Custom follow cursor | Inverted dot cursor |
| Numbers | Scroll-triggered count-up | gsap innerText counter |

---

## Deliverable Checklist

- [ ] Three.js rotating cube in hero section, scroll-scrubbed with GSAP
- [ ] Alternating black/white section backgrounds applied throughout
- [ ] Scroll-triggered text reveal animations on all headings and body text
- [ ] Section wipe/curtain transitions between color blocks
- [ ] Horizontal marquee strip (at least one instance)
- [ ] Counter animation on any numerical stats
- [ ] Custom cursor with section-aware color inversion
- [ ] `prefers-reduced-motion` fallback implemented
- [ ] Mobile-optimized (canvas disabled below 768px)