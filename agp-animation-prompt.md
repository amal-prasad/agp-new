# AGP Website — Full Animation Prompt
### Stack: Vanilla HTML/CSS + GSAP 3 (CDN) · No frameworks required

---

## 🎨 Design Tokens

```css
:root {
  --bg:        #111412;
  --bg2:       #141714;
  --teal:      #3de8c8;
  --teal-glow: rgba(61, 232, 200, 0.35);
  --text:      #e8e4dc;
  --text-dim:  #8a8880;
  --border:    rgba(255, 255, 255, 0.07);
}
```

Add a **fixed noise texture overlay** across the entire page:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* fractalNoise SVG */
  opacity: 0.6;
  pointer-events: none;
  z-index: 999;
}
```

---

## 📐 Section 1 — Hero: "ENGINEERING YOUR BRAND'S IDENTITY"

### HTML Structure

```html
<section class="hero" id="hero">
  <div class="scan-line" id="scanLine"></div>

  <div class="headline-wrap">
    <!-- Each word is a separate span, injected via JS or hardcoded -->
    <div class="headline" id="headline">
      <span class="word" data-text="ENGINEERING">ENGINEERING</span>
      <span class="word" data-text="YOUR">YOUR</span>
      <span class="word" data-text="BRAND'S">BRAND'S</span>
      <span class="word" data-text="IDENTITY">IDENTITY</span>
    </div>
  </div>

  <div class="divider" id="divider"></div>
</section>
```

### CSS — Word Initial State

```css
.headline-wrap {
  perspective: 900px;
  perspective-origin: 50% 60%;
  overflow: hidden;
}

.headline {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: clamp(56px, 9vw, 130px);
  line-height: 0.92;
  text-transform: uppercase;
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.22em;
}

/* Every word starts hidden and tilted back */
.word {
  display: inline-block;
  transform-origin: 50% 0%;
  opacity: 0;
  transform: perspective(900px) rotateX(38deg) scale(0.82) translateY(-18px);
}

/* Scan line */
.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--teal) 40%, var(--teal) 60%, transparent);
  box-shadow: 0 0 20px 4px var(--teal-glow);
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

/* Divider starts collapsed */
.divider {
  height: 1px;
  background: var(--border);
  margin-top: 60px;
  transform: scaleX(0);
  transform-origin: left;
}
```

### Screen Shake Keyframe

```css
@keyframes shake {
  0%   { transform: translate(0, 0) rotate(0deg); }
  15%  { transform: translate(-3px, 2px) rotate(-0.3deg); }
  30%  { transform: translate(3px, -2px) rotate(0.3deg); }
  45%  { transform: translate(-2px, 1px) rotate(-0.15deg); }
  60%  { transform: translate(2px, -1px) rotate(0.15deg); }
  75%  { transform: translate(-1px, 1px) rotate(0deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
.shake { animation: shake 0.22s ease-out; }
```

### GSAP Timeline — Hero

```js
const tl = gsap.timeline({ delay: 0.3 });

// 1. Nav fade in
tl.to('#nav', { opacity: 1, duration: 0.5, ease: 'power2.out' });

// 2. Each word stamps in (0.28s stagger)
document.querySelectorAll('.word').forEach((word, i) => {
  const t = 0.55 + i * 0.28;

  // Plate slams down
  tl.to(word, {
    opacity: 1, rotateX: 0, scale: 1.06, y: 0,
    duration: 0.12, ease: 'power4.out',
  }, t);

  // Bounce settle
  tl.to(word, {
    scale: 1.0,
    duration: 0.18, ease: 'back.out(2)',
  }, t + 0.12);

  // Teal ink-glow flare → fade
  tl.add(() => {
    gsap.fromTo(word,
      { textShadow: '0 0 30px #3de8c8, 0 0 60px rgba(61,232,200,0.3)' },
      { textShadow: '0 0 0px transparent', duration: 0.55, ease: 'power2.out' }
    );
    // Screen shake
    document.getElementById('hero').classList.remove('shake');
    void document.getElementById('hero').offsetWidth; // force reflow
    document.getElementById('hero').classList.add('shake');
  }, t);
});

// 3. Scan line sweep (after all words land)
tl.fromTo('#scanLine',
  { xPercent: -110, opacity: 1 },
  { xPercent: 110, opacity: 1, duration: 0.55, ease: 'power2.inOut' },
  1.85 // after last word
);
tl.to('#scanLine', { opacity: 0, duration: 0.2 }, 2.35);

// 4. Divider draws left → right
tl.to('#divider', {
  scaleX: 1, duration: 0.6, ease: 'power3.out',
}, 2.2);
```

---

## 📐 Section 2 — Feature Cards (Precision Tech · Strict Deadlines · End-to-End)

### HTML Structure

```html
<section class="features">
  <div class="feature" id="f1">
    <div class="feature-num">(00)</div>
    <div class="feature-title">Precision Tech</div>
    <div class="feature-desc">
      State-of-the-art offset and digital printing machinery
      delivering pixel-perfect output every time.
    </div>
  </div>

  <div class="feature" id="f2">
    <div class="feature-num">(00)</div>
    <div class="feature-title">Strict Deadlines</div>
    <div class="feature-desc">
      We commit to timelines and deliver on schedule —
      your campaigns never wait for print.
    </div>
  </div>

  <div class="feature" id="f3">
    <div class="feature-num">(00)</div>
    <div class="feature-title">End-to-End</div>
    <div class="feature-desc">
      From design consultation to finishing and delivery —
      a complete printing partner under one roof.
    </div>
  </div>
</section>
```

### CSS — Feature Cards Initial State

```css
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 50px 60px 80px;
  background: var(--bg2);
}

.feature {
  opacity: 0;
  transform: translateY(36px);
  /* Add a subtle left border that animates in */
  border-left: 2px solid transparent;
  padding-left: 20px;
  transition: border-color 0.4s ease;
}

/* Hover state — teal left border glow */
.feature:hover {
  border-left-color: var(--teal);
}

.feature-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--text-dim);
  margin-bottom: 12px;
}

.feature-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 26px;
  text-transform: uppercase;
  color: var(--text);
  margin-bottom: 12px;
  /* Title underline draws on hover */
  background: linear-gradient(var(--teal), var(--teal)) no-repeat left bottom;
  background-size: 0% 1.5px;
  transition: background-size 0.35s ease;
}

.feature:hover .feature-title {
  background-size: 100% 1.5px;
}
```

### GSAP — Feature Cards (ScrollTrigger)

```js
// Triggered when features section enters viewport
gsap.to(['.feature'], {
  scrollTrigger: {
    trigger: '.features',
    start: 'top 78%',
    toggleActions: 'play none none none',
  },
  opacity: 1,
  y: 0,
  stagger: {
    each: 0.14,
    ease: 'power2.out',
  },
  duration: 0.6,
  ease: 'power3.out',
});

// feature-num counter tick animation (00 → 01 for each card)
document.querySelectorAll('.feature-num').forEach((el, i) => {
  ScrollTrigger.create({
    trigger: el.closest('.feature'),
    start: 'top 80%',
    onEnter: () => {
      let count = 0;
      const interval = setInterval(() => {
        el.textContent = `(0${count})`;
        count++;
        if (count > i + 1) clearInterval(interval);
      }, 60);
    }
  });
});
```

---

## 📐 Section 3 — Our Team Cards

### HTML Structure

```html
<section class="team-section">
  <div class="team-label">OUR TEAM</div>

  <div class="team-grid">

    <div class="team-card" id="tc1">
      <div class="card-inner">
        <!-- Front -->
        <div class="card-front">
          <div class="avatar-wrap">
            <img src="sivaprasad.jpg" alt="M. Sivaprasad" class="avatar" />
            <div class="avatar-ring"></div>
          </div>
          <div class="card-info">
            <div class="card-name">M. SIVAPRASAD</div>
            <div class="card-role">DIRECTOR</div>
          </div>
        </div>
        <!-- Teal corner accent -->
        <div class="card-accent"></div>
      </div>
    </div>

    <div class="team-card" id="tc2">
      <div class="card-inner">
        <div class="card-front">
          <div class="avatar-wrap">
            <img src="ajay.jpg" alt="Ajay Pandey" class="avatar" />
            <div class="avatar-ring"></div>
          </div>
          <div class="card-info">
            <div class="card-name">AJAY PANDEY</div>
            <div class="card-role">OPERATIONS HEAD</div>
          </div>
        </div>
        <div class="card-accent"></div>
      </div>
    </div>

  </div>
</section>
```

### CSS — Team Cards

```css
.team-section {
  padding: 60px 60px 100px;
  background: var(--bg);
}

.team-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  margin-bottom: 28px;
  text-transform: uppercase;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 420px));
  gap: 20px;
}

/* Card starts invisible, shifted left */
.team-card {
  opacity: 0;
  transform: translateX(-28px);
}

.card-inner {
  position: relative;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 28px 28px;
  display: flex;
  align-items: center;
  gap: 24px;
  overflow: hidden;
  /* 3D tilt on hover via JS */
  transform-style: preserve-3d;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.card-inner:hover {
  box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(61,232,200,0.15);
  border-color: rgba(61,232,200,0.2);
}

/* Avatar */
.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  filter: grayscale(20%);
  transition: filter 0.3s ease;
}

.card-inner:hover .avatar {
  filter: grayscale(0%);
}

/* Spinning teal ring on hover */
.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  border-top-color: var(--teal);
  border-right-color: var(--teal);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-inner:hover .avatar-ring {
  opacity: 1;
  animation: spin 1.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Name & Role */
.card-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 18px;
  letter-spacing: 0.06em;
  color: var(--text);
  margin-bottom: 6px;
}

.card-role {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--text-dim);
}

/* Teal corner accent line — animates in on scroll */
.card-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, var(--teal), transparent);
  transition: width 0.5s ease;
}

.team-card.in-view .card-accent {
  width: 60%;
}
```

### GSAP — Team Cards (ScrollTrigger + 3D Tilt)

```js
// 1. Slide in from left on scroll
gsap.to('.team-card', {
  scrollTrigger: {
    trigger: '.team-section',
    start: 'top 75%',
    toggleActions: 'play none none none',
  },
  opacity: 1,
  x: 0,
  stagger: 0.18,
  duration: 0.65,
  ease: 'power3.out',
  onComplete: () => {
    // Trigger bottom accent line
    document.querySelectorAll('.team-card').forEach(c => c.classList.add('in-view'));
  }
});

// 2. 3D magnetic tilt on mouse move (per card)
document.querySelectorAll('.card-inner').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
    const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1

    gsap.to(card, {
      rotateY:  dx * 6,   // max ±6deg
      rotateX: -dy * 4,   // max ±4deg
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateY: 0, rotateX: 0,
      duration: 0.6, ease: 'elastic.out(1, 0.5)',
    });
  });
});
```

---

## ⚡ Full Load Order Summary

| Step | Element | Animation | Trigger |
|------|---------|-----------|---------|
| 1 | Nav | Fade in | Page load |
| 2 | Headline words × 4 | Stamp (rotateX + scale + shake) | Page load, staggered |
| 3 | Scan line | Sweep left → right | After word 4 lands |
| 4 | Divider rule | Draw left → right (scaleX) | 0.1s after scan |
| 5 | Feature cards × 3 | Rise up (translateY + opacity) | ScrollTrigger 78% |
| 6 | Feature numbers | Counter tick (00 → 01, 02, 03) | ScrollTrigger per card |
| 7 | Feature titles | Underline draw on hover | CSS hover |
| 8 | Team cards × 2 | Slide in from left | ScrollTrigger 75% |
| 9 | Team card accent line | Width 0 → 60% | After card enters view |
| 10 | Team card tilt | 3D rotateX/Y magnetic | Mouse move per card |
| 11 | Avatar ring | Spin (teal arc) | CSS hover |

---

## 📦 GSAP CDN Imports Required

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

<script>
  gsap.registerPlugin(ScrollTrigger);
</script>
```
