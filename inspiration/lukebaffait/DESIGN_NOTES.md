# lukebaffait.fr — Design Inspiration Notes
**Source:** https://lukebaffait.fr/  
**Captured:** 2026-05-27  
**Tagline:** "Quiet creator, bringing ideas to life through motion, detail and softness."

---

## Screenshots
| File | What it shows |
|------|--------------|
| `01-initial-load.png` | Landing state after load animation completes |
| `02-fullpage.png` | Full-page scroll capture |
| `03-hero-scroll.png` | Hero with scroll progress |
| `04-about-section.png` | About / bio section |
| `05-projects-section.png` | Projects list with hover-preview |
| `06-gallery-section.png` | Circle gallery section |
| `07-skills-section.png` | Skills accordion section |
| `08-contact-section.png` | Contact section start |
| `09-contact-blob-reveal.png` | Contact blob expansion |

---

## Color System
```
Background:  #0a0a0a  (near-black, not pure)
Text:        #f0f0f0  (off-white)
Accent:      #ff1e00  (sharp red — used for fluid line, arrow, transition panel)
Muted text:  rgba(255,255,255,0.45)
Borders:     rgba(255,255,255,0.08)
```
- Theme color in meta: `#0a0a0a`
- Scrollbar: completely hidden (`scrollbar-width: none`)
- `mix-blend-mode: difference` used on hero nav/tagline text so it inverts over the canvas

---

## Typography
Three custom fonts layered together — this is a signature design choice:

| Font | Family Name | Use |
|------|-------------|-----|
| **Breton** (woff2) | `'Breton'` | Primary display — headers, body, taglines |
| **Machine** (otf) | `'other'` | Accent / decorative, some nav letters, dot |
| **Zirena** (woff2, 800w) | `'Zirena'` | Heavy uppercase — Skills heading, Contact title |
| **Inter** (Google) | `'Inter'` | UI labels, meta info, tags |

- All preloaded with `<link rel="preload">` for zero-FOUT
- Sizes use `clamp()` everywhere — e.g. `clamp(2.2rem, 9vw, 9rem)`
- Letter-spacing `-0.02em` to `-0.08em` for large headings (tight tracking)
- `font-display: block` on all custom fonts

---

## Preloader / Intro Animation
**Stack: GSAP timeline (`gsap.timeline({ delay: 0.2 })`)**

### Phase 1 — Name reveal (chars stagger up)
- `pLuke` + `pBaffait` + `pLogo` split into `<span class="char">` elements
- All start at `yPercent: 110` (below clip overflow)
- Animate to `yPercent: 0` with `power3.out`, stagger `0.025s` from center
- Duration: `0.4s` per char

### Phase 2 — Dot blink
- `pDot` fades in with `opacity: 1`, `0.25s`, `power2.out`

### Phase 3 — Name scales down to bottom bar
- While centered at full size, name scales down + translates to bottom-left position
- Scale calculated as: `targetWidth / totalNameWidth` (fits viewport with 48px padding)
- Uses `power3.inOut`, `0.75s`
- `mix-blend-mode: difference` applied on name layer after settling

### Phase 4 — Wipe transition (two panels)
- **Dark panel** slides up from bottom: `translateY(100%) → 0`, `0.45s power3.inOut`
- **Red panel** (`#ff1e00`) slides up 0.3s later, same motion
- Hero sets to `opacity: 1`, intro bg removed from DOM

### Phase 5 — Panels exit (wipe reveal)
- Red panel exits: `translateY(0) → -100%`, `0.55s power3.inOut`
- Dark panel exits 0.4s behind red

### Phase 6 — Hero UI reveals
- `#hero-tagline`: `clipPath: inset(0 0 100% 0) → inset(0 0 0% 0)`, opacity 0→1, `1.1s power3.inOut`
- `#hero-bar`: same clip-path wipe, `1.0s`
- `#hero-line`: `scaleX: 0 → 1` from left, `1.0s power3.inOut`

### Skip logic
- `sessionStorage.getItem('index-return-fade')` — skips intro on return navigation
- `prefers-reduced-motion` — also skips
- Scroll locked during entire intro (mobile: `touchmove` prevented, desktop: `overflow: hidden`)

---

## Hero Section
**Stack: WebGL canvas (custom CoreRenderer) + GSAP ScrollTrigger + Lenis**

### Canvas renderer layers (WebGL)
1. **Gradient layer** — solid `#000000` background, custom GLSL fragment shader
2. **Image layer** — `assets/images/shader background/background.png` rendered via WebGL
   - Mouse parallax: `rotateX/rotateY` in vertex shader based on `uMousePos`
   - 3D perspective tilt effect on the image
3. **Flow field effect** — Perlin noise distortion layer animating over time
   - `uTime` driven, `mouseSpring` momentum
   - 8 iterations of Perlin noise distort UVs, mix 51%

### Image sequence (scroll-driven video)
- **341 JPEG frames** in `assets/images/hero sequence/0001.jpg` to `0341.jpg`
- Drawn to a `<canvas>` element using `requestAnimationFrame`
- GSAP ScrollTrigger maps scroll progress → frame index
- Smart loading: first frame loads immediately, rest batch-loaded with speed probe
- DPR capped at 1.5 for performance, 1.0 on slow hardware

### Scroll behavior
- **Lenis** smooth scroll with `lerp: 0.06` (very smooth/slow)
- Hero pinned with `position: sticky; height: 400vh` scroll wrap
- `ScrollTrigger.refresh()` on resize

---

## Hover Effects

### Character-split hover (`.chr-hover`)
- Navigation links split into individual `.ch-wrap > .ch-top + .ch-bot` spans
- On hover: both `.ch-top` and `.ch-bot` translate `-100%` (y)
- Timing: `0.6s cubic-bezier(0.87, 0, 0.13, 1)`, stagger: `calc(var(--i) * 28ms)`
- Reveal animation into view uses `clipPath: inset(100% 0 0 0) → inset(0 0 0 0)`

### Project list hover
- Projects list left-pinned (sticky), preview card appears on right (fixed)
- Active project text: `rgba(255,255,255,0.2) → #f0f0f0`
- Transition: `color 0.5s ease`
- Project card: 3D tilt on mouse move using `perspective: 800px`
- Custom pill cursor: white bg, dark text, `opacity: 0 → 1`, `border-radius: 50px`

---

## Page Sections

### About
- Text split into `.word` spans, each starts `opacity:0; filter:blur(8px)`
- Blur-in reveal driven by ScrollTrigger (scroll-linked)
- Photo: `border-radius: 280px 0 0 280px` (half-pill, right-anchored)
- Photo starts `opacity:0; filter:blur(20px)`, reveals on scroll
- **Fluid red line**: SVG `<path>` with `stroke: #ff1e00; stroke-width: 72` — animates `stroke-dashoffset` on scroll

### Projects (Sticky + Scroll-driven)
- `position: sticky` left column with project names
- Right 50%: fixed preview card with 3D mouse tracking
- Projects: `clamp(2rem, 4vw, 4rem)` Breton font
- Thin borders: `1px solid rgba(255,255,255,0.08)`

### Circle Gallery
- `height: 600vh` section — 6x viewport scroll distance
- Images pinned to center, arranged in a 3D arc/circle
- Images split into slices (`.cg-slice`) for 3D reveal effect
- `perspective: 1200px`, `transform-style: preserve-3d`

### Skills
- Left 60%: sticky panel with huge Zirena uppercase text + red arrow `→`
- Right 40%: accordion list
- Accordion icon: `+` → `-` via CSS `::after` `rotate(90deg)`
- Arrow: `font-size: clamp(8rem, 14vw, 12rem); color: #ff1e00`

### Contact
- White blob (`#f0f0f0`) circle at bottom, `scale(0) → scale(1)` on scroll
- Circle is `300vmax × 300vmax` — expands to cover entire screen
- All contact text switches to `color: #0a0a0a` as white blob covers screen
- `Zirena` font at `clamp(5rem, 13vw, 12rem)` for "CONTACT" heading
- Socials use `clipPath: inset(0 0 100% 0)` reveal

### Scroll Timeline (progress indicator)
- Fixed right side, `height: 80vh`, segmented vertical bar
- Segments (`st-seg`) scale horizontally on hover: `scaleX(3)`
- Fill indicator animates height `0% → 100%` per section

---

## Transition Between Pages
- **Flying title**: `position: fixed`, flies from project list position to detail view
- Red + dark wipe panels (same as intro) used for page transitions
- `sessionStorage.setItem('index-return-fade')` set on exit, checked on return

---

## Key Libraries
```
GSAP 3            Animation engine (timeline, ScrollTrigger)
ScrollTrigger     Scroll-linked animations (plugin)
Lenis             Smooth scroll (lerp: 0.06)
CoreRenderer      Custom WebGL layer renderer
```

---

## Replication Notes for Nana's Portfolio

### Easy wins
- `#0a0a0a` background with `#f0f0f0` text → direct copy
- Hide scrollbar globally
- Custom font combo (find equivalents or license similar)
- `clamp()` for all font sizes
- `mix-blend-mode: difference` on fixed name in corner

### Medium effort
- GSAP character-split hover on nav links
- Scroll-driven word reveal with blur: `filter:blur(8px) → blur(0)` per `.word` span
- Sticky projects list with preview card + 3D mouse tilt
- Two-panel wipe transition (red + dark, `translateY`)
- Contact section white blob expand (`scale(0) → scale(1)`)

### Hard (custom engine required)
- 341-frame canvas sequence (need actual JPEGs, GSAP scroll scrub)
- WebGL CoreRenderer with flow field distortion
- Circle gallery with slice-based 3D images

### Simplification strategy
- Replace WebGL canvas + image sequence with a single looping video (`<video autoplay muted loop>`)
- Keep Lenis + GSAP for all other scroll animations
- Use `@splidejs/splide` or simple JS for gallery instead of custom 3D slice renderer

---

## Fonts to Source
- **Breton** — not publicly available, find a close match (Canela, Cormorant, Freight Display)
- **Machine/other** — monospaced/mechanical feel (Space Mono, JetBrains Mono)
- **Zirena** — heavy slab or black weight (Oswald 800, Bebas Neue, Archivo Black)
