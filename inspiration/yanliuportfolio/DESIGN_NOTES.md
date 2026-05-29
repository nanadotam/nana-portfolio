# yanliuportfolio.vercel.app — Design Inspiration Notes
**Source:** https://yanliuportfolio.vercel.app/  
**Captured:** 2026-05-27  
**Tagline:** "I think, then I build"  
**Designer:** Yan Liu — Senior Product Designer, 7+ years

---

## Screenshots
| File | What it shows |
|------|--------------|
| `01-hero-landing.png` | Desktop hero — moodboard collage layout |
| `02-fullpage.png` | Full page capture |
| `03-scroll-down.png` | First scroll section |
| `04-work-section.png` | Work/projects section |
| `05-folder-section.png` | Mac folder / AI section |
| `06-bulletin-board.png` | Photo bulletin board / photography section |
| `07-footer-contact.png` | Footer / contact |

---

## THE KEY IDEA (for Nana's design section)
**Moodboard / digital desk aesthetic** — the hero is a scattered, layered canvas of objects that look physically placed on a surface. No traditional hero layout. Each "widget" is an object (badge, vinyl record, terminal, ticket, ripped paper, folder) positioned with slight rotations and shadows to feel tangible.

---

## Color System
```
Background (body):  rgb(250, 248, 245)  → warm off-white / cream / paper
Text primary:       rgb(28, 25, 23)     → very dark warm brown (not pure black)
Muted text:         rgba(28,25,23,0.5)  → same, at 50% opacity
Editor border:      rgba(68, 64, 60, 0.3) → warm gray, 30% opacity
Accent/dark cards:  rgb(28, 25, 23) / stone-800/900
```

**Tailwind palette used:** `stone-*` (50–900) — warm gray/brown family  
**NOT** cold gray — everything has a warm undertone.

### Grid background
```css
background-image:
  linear-gradient(rgba(200, 181, 151, 0.25) 1px, transparent 0px),
  linear-gradient(90deg, rgba(200, 181, 151, 0.25) 1px, transparent 0px);
background-size: 56px 56px;
background-color: rgb(250, 248, 245);
```
→ Subtle warm-beige grid squares, 56×56px. Very light, almost invisible.

---

## Typography
```
Noto Sans        — body font, system fallback
Source Code Pro  — monospace (terminal widget, code elements)
Courier Prime    — typewriter serif (labels, metadata)
```
All loaded via Next.js font optimization (`next/font/google`), self-hosted woff2.  
No giant custom display fonts — very clean and readable.

---

## Hero Layout — "Digital Desk / Moodboard"
**Canvas size:** `1400px × 900px`, `overflow: visible`, slight `-25px` X translate  
All elements are `position: absolute` with pixel-precise coordinates.

### Objects and their positions
| Widget | Position | Notes |
|--------|----------|-------|
| **ID Badge** (dark card) | `left: 65px, top: -80px` | Drops in with bounce physics via Framer Motion |
| **Vinyl record card** | left ~100px, below badge | white card with record image, "Vibe Coding" playlist |
| **Ripped paper / plant** | top-center | torn paper texture PNG overlaid on real plant photo |
| **Iced coffee + pencil** | top-center-right | lifestyle photo objects |
| **Ticket stub** ("Design X Technology") | top-right | black/white ticket design |
| **Image collage** (polaroid stack) | right | kraft paper bg with overlapping Polaroid photos |
| **LED pixel board** | center-right | `B+` pixel art on dark board |
| **Name SVG** ("Yan Liu" script) | dead center | handwritten SVG signature |
| **Tagline** ("I THINK, THEN I BUILD") | below name | uppercase spaced monospace |
| **Mac terminal** | center-bottom | `whoami` and `ls interests/` output |
| **Mac folder** (3D open/close) | bottom-left-center | `hover:rotateX(-22deg)` opens folder revealing items |
| **Arch photo frame** | left-center | arch-shaped frame with pink flower |

### Badge physics (Framer Motion bounce)
```js
// Badge drops in from -450px above
initial: { y: -450, opacity: 0 }
animate: { 
  y: [-450, 0, -48, 0, -18, 0, -6, 0],  // bounces 3x
  opacity: 1 
}
transition: {
  y: { duration: 1.4, times: [0,.43,.52,.62,.71,.79,.87,1] },
  delay: 6.5  // starts after the staggered entrance sequence
}
```

---

## Animation System
**Stack: Framer Motion + CSS `@keyframes`**

### Entrance animations (staggered, CSS keyframes)
Elements use `animation: hero-slide-up 0.7s cubic-bezier(0.4,0,0.2,1) Xs both`  
Each element has a different delay creating a sequential reveal:

```css
@keyframes hero-slide-up   { from { opacity:0; translate:0 30px } to { opacity:1; translate:0 0 } }
@keyframes hero-slide-left { from { opacity:0; translate:-40px 0 } to { opacity:1; translate:0 0 } }
@keyframes hero-slide-right{ from { opacity:0; translate:40px 0 } to { opacity:1; translate:0 0 } }
@keyframes hero-pop        { from { opacity:0; scale:.85 } to { opacity:1; scale:1 } }
@keyframes hero-blur-in    { from { opacity:0; filter:blur(12px); scale:.95 } to { opacity:1; filter:blur(0); scale:1 } }
@keyframes hero-fade-in    { from { opacity:0; translate:0 12px } to { opacity:1; translate:0 0 } }
```

### Ambient/idle animations
```css
@keyframes plant-bounce    { 0%,to{translate:0 0} 50%{translate:0 -10px} }
@keyframes cursor-blink    { 0%,to{opacity:1} 50%{opacity:0} }
@keyframes pencil-draw     { to{stroke-dashoffset:0} }
@keyframes pencil-write    { 0%{transform:translateX(0) rotate(0deg)} 10%{transform:translateX(7px) rotate(1deg)} }
@keyframes bloom-sway      { 0%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-4px) rotate(1.5deg)} }
@keyframes garland-sway    { 0%{transform:rotate(-.7deg) translateX(-2px)} 50%{transform:rotate(.7deg) translateX(2px)} }
@keyframes flower-grow     { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
@keyframes twinkle         { 50%{opacity:0} }
@keyframes fade-in-up      { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
```

### 3D Mac Folder hover
```css
/* Folder front lid rotates open on hover */
.folder-front { 
  origin-bottom;
  transition: transform 0.5s ease-out;
}
.group:hover .folder-front { transform: rotateX(-22deg); }

/* Items inside pop out with staggered delays */
.item-1 { opacity:0; group-hover:opacity-100; group-hover:-translate-y-[75px]; transition: delay-0 }
.item-2 { opacity:0; group-hover:opacity-100; group-hover:-translate-y-[95px]; transition: delay-75 }
.item-3 { opacity:0; group-hover:opacity-100; group-hover:-translate-y-[65px]; transition: delay-150 }
```

### Twinkle particles (stars)
60 random floating dots (`2–3px`, `bg-text-muted/20`), `position: fixed`, animated with `twinkle` keyframe using random delays and durations (2–5s).

---

## ID Badge Component (the dark hanging card)
```
Strap: dark band (stone-800), 26px wide × 240px tall
  - Repeating horizontal lines for texture
  - Rotated "yanliu.design" text along strap

Card body:
  gradient: linear-gradient(170deg, #57534e 0%, #44403c 15%, #292524 60%, #1c1917 100%)
  borders: top 1.5px rgba(255,255,255,0.15), bottom 2px rgba(0,0,0,0.4)
  border-radius: rounded-xl
  Subtle glass highlight overlay (12% → 3%)

Content:
  - Chinese name: 刘彦 (large, white)
  - Bio text: small, white/60 opacity
  - Circular avatar photo (border-radius: 50%)
```

---

## Terminal Widget (Mac-style)
```
Header: traffic lights (red/yellow/green), title "yan-liu — zsh"
Body: dark bg, Source Code Pro monospace
Content:
  ~ $ whoami
  Senior Product Designer with 7+ years experience
  
  ~ $ ls interests/
  AI/designs/doodles/photography

Cursor blink animation: cursor-blink keyframe
```

---

## Vinyl Record Card (Music Widget)
```
White card, rounded-2xl, shadow-sm
Top: "PLAYLIST" label (uppercase, tiny, muted)
Center: Vinyl record SVG/PNG with green Spotify-ish dot
Bottom: 
  "Vibe Coding" — bold title
  "21 projects and counting" — subtitle
  "Learning by building" — tagline
```

---

## Ticket Stub Widget
```
Black/white ticket design
Left: barcode stripe
Center: "DESIGN X TECHNOLOGY", "EST. 2018 → PRESENT"
Right: perforated edge, barcode
Details: Time: Anytime, Price: Free, Address: Seattle + Online
```

---

## Polaroid / Photo Collage
```
Kraft paper brown backing (#C8956C range)
Multiple Polaroid-style photos overlapping at random angles
Photos: flowers, cat, sunflower, landscape, cherry blossom
"capture moments" script text overlay in top-right
Leaf SVG decorations scattered around
```

---

## Sections (scrolling content below hero)
Each section uses a **sticky sidebar** pattern:
- Left: sticky section title + description + CTA
- Right: scrolling content (project cards, image grids, folder icons)

Section IDs: `projects-at-work`, `designing-with-ai`, `community-impact`, `through-my-lens`, `from-sketch-to-merch`

---

## Tech Stack
```
Next.js (App Router)     — React framework
Framer Motion            — Drag, bounce physics, animated entrance
Tailwind CSS             — Utility styling (stone-* palette)
Google Fonts via next/font — Noto Sans, Source Code Pro, Courier Prime
```

---

## Replication Notes for Nana's Design Section

### The Core Idea to Steal
Create a **"design desk" page** for the design section of the portfolio:
- Warm cream background (`#faf8f5`) + subtle grid (56px, warm beige lines)
- Objects scattered on screen as absolute-positioned "cards" with slight rotations
- Each object represents something: a playlist card for music/vibe, a terminal for dev work, a ticket for an event, a polaroid collage for creative work, a badge for identity

### Specific Elements for Nana
1. **ID Badge** — with Twi/Akan name, avatar, tagline
2. **Award card** — custom widget for content creator awards
3. **Moodboard collage** — images from content creator work, polaroid style
4. **Terminal widget** — `whoami: designer + developer + content creator`
5. **Ticket stub** — for events, conferences, collaborations
6. **Folder** — opens to reveal design tools logos (Figma, Adobe, etc.)

### Key CSS to copy directly
```css
/* Grid background */
background-image:
  linear-gradient(rgba(200, 181, 151, 0.25) 1px, transparent 0),
  linear-gradient(90deg, rgba(200, 181, 151, 0.25) 1px, transparent 0);
background-size: 56px 56px;
background-color: #faf8f5;

/* Staggered entrance */
.widget { animation: hero-slide-up 0.7s cubic-bezier(0.4,0,0.2,1) var(--delay) both; }

/* Object rotation + hover lift */
.widget { transform: rotate(var(--rot)); }
.widget:hover { transform: rotate(0deg) translateY(-4px) scale(1.03); }
```
