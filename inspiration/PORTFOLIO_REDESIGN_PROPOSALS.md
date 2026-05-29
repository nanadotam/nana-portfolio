# Nana Amoako Portfolio — Redesign Proposals
**Date:** 2026-05-27  
**Current site:** https://portfolio.nanaamoako.com/  
**Codebase:** /Users/nanaamoako/Desktop/nana-portfolio  
**Current stack:** Next.js (App Router), Framer Motion, Tailwind, Supabase

---

## The Core Problem

The current portfolio is a technically competent site with a split persona system (Developer vs Designer), but it suffers from several UX gaps:

1. **No loading screen** — cold flash-in is jarring, no brand moment
2. **The landing choice feels like a gate, not an invitation** — "choose a side" before knowing what you're choosing
3. **No OG images** (`og-hero-card.png` referenced but needs to exist properly)
4. **You are more than two personas** — content creator, filmmaker, photographer, award-winner — none of this shows in the split
5. **Master CV is buried** — incredibly rich data, no great way to experience it
6. **Design section feels generic** — the `FloatingElements` approach has the right idea but needs the Yan Liu "moodboard desk" treatment
7. **No images tied to awards, content creator side, life outside tech**

---

## What We're Working With (Assets Inventory)
```
/public/images/
  me-working/         (photos of you working — great for moodboard)
  gallery/            (photography work)
  brands-hero/        (logo work for clients)
  CREATIVE-PROCESS.jpeg, CREATIVE-PROCESS-2.jpeg
  dev-profile.jpeg
  og-hero-card.png    (exists but needs design)

/public/logo/         (your logo in white)
/public/cv.pdf        (CV exists)

/app/master-cv/data.js   (rich structured career data — barely surfaced)

Key fonts already loaded:
  Inter (body)
  JetBrains Mono (developer)
  Playfair Display (designer/serif)
  Bricolage Grotesque (alt sans)
```

---

# APPROACH A — "Cinematic Preloader → Smart Landing"
**Philosophy:** Slow down. Let the first impression breathe. Make the loading screen the brand moment, then present a landing that communicates who you are BEFORE asking them to choose.

## Loading Screen
```
Duration: ~2.5s (feels intentional, not slow)

Phase 1 (0–0.8s):
  Black screen, your logo mark slides in from left
  Name "Nana Amoako" types in character-by-character (JetBrains Mono feel)

Phase 2 (0.8–1.5s):
  A subtitle slides up: "Developer. Designer. Creator."
  Each word in a different font:
    "Developer" → JetBrains Mono (green tint)
    "Designer" → Playfair Display italic (rose tint)
    "Creator" → Bricolage Grotesque (white)

Phase 3 (1.5–2.3s):
  Two-panel wipe (inspired by lukebaffait.fr):
    Dark panel rises from bottom
    A second panel (your brand color accent) sweeps off to reveal the landing

Phase 4 (2.3s+):
  Landing page animates in — no hard cut
```

## Landing Page (after loading)
Instead of immediately forcing a choice, show a brief personal statement:

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Nana Amoako                    [↗ CV] [↗ Contact]  │
│                                                     │
│    "I build cool stuff for a living."               │
│     — Full-stack dev. Visual designer.              │
│       Content creator. Storyteller.                 │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │  💻 DEVELOPER    │  │  ✦ DESIGNER      │        │
│  │  Full-stack eng  │  │  UI/UX & Brand   │        │
│  │  ML & DevOps     │  │  Photography     │        │
│  │  [Press D]       │  │  [Press G]       │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │
│  ⬇  Or scroll to see everything →                  │
└─────────────────────────────────────────────────────┘
```

**Key change:** Add a scroll-down option that takes users to a unified view — your "full CV / moodboard" — for visitors who don't fit neatly into "hiring a developer" or "hiring a designer" buckets. This is important for content brands, agencies, collaborators.

## OG Images (3 needed)
```
/public/images/og/
  og-default.png      → 1200×630, dark background, logo + name + tagline
  og-developer.png    → 1200×630, dark green, terminal aesthetic
  og-designer.png     → 1200×630, warm/rose, design moodboard aesthetic
```

---

# APPROACH B — "The Moodboard Portfolio" (inspired by Yan Liu)
**Philosophy:** Don't make users choose. Lead with a rich visual identity. The landing IS the portfolio — everything scattered on a "digital desk."

## Landing as a Moodboard Canvas
```
Background: warm off-white (#faf8f5) with subtle grid (56px × 56px, warm beige lines)
Everything is absolute-positioned, layered, slightly rotated

OBJECTS ON THE CANVAS:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [ID Badge]           [Ripped paper /          [Award ticket]   │
│  "Nana Amoako"         photo collage]           "Best..."       │
│  Computer Sci          ←photos from                             │
│  Ashesi Univ            my content work→       [Polaroid grid]  │
│                                                 (photography)   │
│  [Vinyl record]        "Nana Amoako"                            │
│  Currently playing:    — handwritten SVG         [LED board]    │
│  "Vibe Coding"                                   "NA"           │
│                       "I build cool stuff."                     │
│  [Mac folder]          [Terminal widget]                        │
│  hover → opens         whoami: developer                        │
│  tools inside          & designer                               │
│                                                                 │
│  [Ticket stub]        [Nav: Work / Design / About / Contact]   │
│  "Design + Code"                                               │
└─────────────────────────────────────────────────────────────────┘

Below the fold → scroll-driven sections:
  - Work projects (developer)
  - Design projects (visual / brand)
  - Master CV (the "full story")
  - Awards & recognition (images + text)
  - Photography / content creation
  - Contact
```

## Moodboard Widget Ideas for Nana specifically
| Widget | Content |
|--------|---------|
| **ID Badge** | Your name in Twi/Akan, Ashesi University, CS student photo |
| **Terminal** | `whoami: nana amoako` `ls skills/` `→ fullstack / design / ML / film` |
| **Award ticket** | Your awards formatted as event tickets (brand, design, hackathon) |
| **Polaroid collage** | Photography / content creation work images |
| **Vinyl record** | Currently listening + "Vibe Coding" playlist |
| **Ripped paper** | Your tagline written in a playful torn-page style |
| **Mac folder** | Opens to show tools: Figma, VS Code, React, Python logos |
| **Bible verse card** | Exodus 31:3 — personalized, already in your code |
| **Sticky note** | "Final year CS @ Ashesi" with pencil sketch feel |

---

# APPROACH C — "Master CV as the Hero"
**Philosophy:** Everything you do is interesting. Lead with the breadth. The "choose developer or designer" choice becomes a filter, not the landing.

## Landing = Timeline of You
```
Full-screen dark background (your current aesthetic)
Loading animation plays (2s)

Then reveals a newspaper-style or timeline layout:

┌─────────────────────────────────────────────────────────────────┐
│  NANA KWAKU AMOAKO                              Est. 2002       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [Photo of you]   Developer & Designer & Creator                │
│                   Final-year CS @ Ashesi University             │
│                   Accra, Ghana ↗ Open to relocation             │
│                                                                 │
│  ══════════════════ WHAT I DO ═══════════════════════           │
│                                                                 │
│  [💻 Dev Work]    [✦ Design]    [🎬 Content]    [📷 Photo]     │
│  Full-stack,      UI/UX,        Social,          Landscape,     │
│  ML, DevOps       Brand,        Film,            Portrait,      │
│                   Graphic       YouTube          Nature          │
│                                                                 │
│  ══════════════════ RECENT WINS ════════════════════            │
│  🏆 [Award 1]    🏆 [Award 2]    🏆 [Award 3]                  │
│     + photo         + photo         + photo                     │
│                                                                 │
│  ═════════ DIVE DEEPER ═══════════════════════════              │
│  [→ Developer Portfolio]  [→ Design Portfolio]  [→ Full CV]    │
└─────────────────────────────────────────────────────────────────┘
```

This works especially well for recruiters, brand collaborators, and agency clients who aren't looking for a developer OR designer specifically — they're looking for *you*.

---

# APPROACH D — "Cinematic Split with Story" (Evolution of Current)
**Philosophy:** Keep the split you have, but add depth. Preloader + storytelling moments before the choice, and after.

## Flow
```
1. PRELOADER (2s)
   → Logo animation
   → Character-type your name
   → Brief tagline fade in

2. LANDING (current approach, improved)
   → Better background — warmer, not pure black
   → Add a "scroll down" third option: "See Everything ↓"
   → Add small image previews ON the cards (dev project screenshot, design work)
   → Better hover state — show 3 sample projects per side

3. DEVELOPER SECTION (mostly exists)
   → Add OG image metadata per page
   → Improve loading/transition

4. DESIGNER SECTION (needs moodboard treatment)
   → Yan Liu-inspired desk with your objects
   → Awards with images
   → Photography section

5. CONTENT CREATOR SECTION (new or integrated)
   → Could be a tab within designer
   → Or a separate /creator route
   → Shows: TikTok, YouTube, photography, filmmaking

6. MASTER CV PAGE (exists, needs surfacing)
   → Add to main nav
   → Create a "Full Story" landing with rich filtering
   → Images tied to each entry
```

---

# THE "FULL STORY" PAGE — A Universal Design for Your Master CV

This is separate from the developer/designer split. It's for people who want to know everything.

## Concept: "Interactive CV as Magazine"
```
Route: /story  or  /nana  or  /cv

Layout: Dual-panel magazine spread
  Left (fixed): Your photo, name, summary, filter tabs
  Right (scrolling): Entries by category

Filters:
  [All]  [Dev]  [Design]  [Creative]  [Awards]  [Education]  [Film]

Each entry:
  → Title, organization, dates
  → 2-3 bullet achievements
  → Photos/images if available  ← THIS IS THE KEY ADDITION
  → Tags: skills/tools
  → Impact rating visual

Awards section:
  → Certificate image (upload to /public/images/awards/)
  → Event name + year
  → "What I won" description
  → Link to work that won

Content Creator section:
  → Platform icon + handle
  → Follower count / views
  → Best performing content preview
  → Video embed or thumbnail grid

Photography section:
  → Masonry grid of your best shots
  → Use the /public/images/gallery/ folder
```

---

# OG IMAGE STRATEGY

## Current situation
- `og-hero-card.png` referenced but may not be designed
- No page-level OG images (developer page, designer page share the default)

## What to create
```
1. /public/images/og/og-default.png     (1200×630)
   Dark background. Your logo. "Nana Amoako — Developer & Designer"
   Tagline. Subtle gradient. Clean.

2. /public/images/og/og-developer.png   (1200×630)
   Dark with green accents. Terminal screenshot or code snippet.
   "Full-stack Developer | ML | DevOps"

3. /public/images/og/og-designer.png    (1200×630)
   Warm/light or dark rose. Design work collage.
   "UI/UX Designer | Brand | Visual"

4. /public/images/og/og-cv.png          (1200×630)
   Clean, professional. Your photo. "Full Portfolio & CV"

How to make these:
  Option A: Design in Figma, export 1200×630 PNG
  Option B: Use /app/api/og route with @vercel/og (Next.js dynamic OG)
  Option C: Use Satori + JSX to generate from code — all text, no images needed
```

## Updating metadata per page
```jsx
// /app/developer/page.jsx
export const metadata = {
  title: "Nana Amoako - Developer",
  openGraph: {
    images: [{ url: '/images/og/og-developer.png', width: 1200, height: 630 }]
  },
  twitter: { images: ['/images/og/og-developer.png'] }
}

// /app/designer/page.jsx
export const metadata = {
  title: "Nana Amoako - Designer",
  openGraph: {
    images: [{ url: '/images/og/og-designer.png', width: 1200, height: 630 }]
  }
}
```

---

# RECOMMENDED LOADING ANIMATION (code sketch)

```jsx
// /app/components/LoadingScreen.jsx
// Inspired by lukebaffait.fr two-panel wipe

"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState(0) // 0=logo, 1=tagline, 2=wipe, 3=done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600)   // show tagline
    const t2 = setTimeout(() => setPhase(2), 1400)  // start wipe
    const t3 = setTimeout(() => {
      setPhase(3)
      onComplete?.()
    }, 2200)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          exit={{ opacity: 0 }}
        >
          {/* Logo + name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <img src="/logo/nana-amoako-logo-white.png" className="w-16 h-16 mx-auto mb-4" />
            <div className="flex gap-3 text-2xl font-bold justify-center">
              <span className="text-green-400 font-mono">Developer.</span>
              <span className="text-rose-400 font-serif italic">Designer.</span>
              <span className="text-white">Creator.</span>
            </div>
          </motion.div>

          {/* Two-panel wipe out */}
          {phase >= 2 && (
            <>
              {/* Dark panel sweeps up */}
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              />
              {/* Accent panel sweeps off */}
              <motion.div
                className="absolute inset-0 bg-green-900"
                initial={{ y: "100%" }}
                animate={{ y: "-100%" }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

# DESIGN SECTION — Moodboard Approach (priority implementation)

Inspired by Yan Liu's portfolio hero. Replace the current `FloatingElements` with a proper "digital desk":

```
Background: rgb(250, 248, 245) — warm cream
Grid: 56×56px, rgba(200,181,151,0.25) lines

Objects (absolute positioned, rotated):
  1. Your ID badge (dark card, top-left)
     - Your name in Akan/Twi styling
     - Ashesi University
     - Avatar photo

  2. Award ticket stubs (top-right)
     - Each award formatted as a concert/event ticket
     - Black/white design
     - Name of award, year, organization

  3. Vinyl record card (left)
     - "Currently playing: [whatever you're listening to]"
     - Or just "Vibe Coding" playlist like Yan Liu did

  4. Ripped paper (center-top)
     - Your tagline in a torn-paper frame
     - Can use an actual ripped-paper PNG texture

  5. Photo polaroid grid (right)
     - Your photography / content work
     - Overlapping Polaroid-style at angles
     - "capture moments" text overlay

  6. Terminal (center-bottom)
     - whoami, ls interests/
     - Your skills listed

  7. Mac folder (bottom)
     - Opens on hover to reveal design tool logos

  8. Handwritten name (center)
     - Use an SVG of your name in a script font
     - Or actually use Playfair Display italic at large size

  9. Bible verse card (bottom — already in your code)
     - Keep this, it's personal and distinctive

  10. Sticky notes
      - "Final year CS @ Ashesi" 
      - "Open to collaborations"
      - Random fun facts about you
```

---

# CONTENT CREATOR / AWARDS SECTION

You mentioned wanting to show images for awards and content creator work. Here's how to structure it:

## Awards Display
```jsx
// Each award as a "ticket" or "certificate card"
const awards = [
  {
    title: "Award Name",
    organization: "Awarding Body",
    year: "2024",
    category: "Design / Tech / Creative",
    image: "/images/awards/award1.jpg",  // certificate or event photo
    description: "What you won it for",
    link: "https://..."
  }
]

// Display as: horizontal scrolling ticket stubs
// OR: magazine-style grid with image + text
// OR: timeline with photos
```

## Content Creator Stats Widget
```
"@nanaamoako across platforms"
┌─────────────────────────────────────────┐
│  TikTok    [icon]  X followers          │
│  YouTube   [icon]  X views              │
│  Instagram [icon]  X followers          │
│  Photos    [icon]  18M+ views Unsplash  │
└─────────────────────────────────────────┘

+ Grid of best performing content thumbnails
+ Video embeds (YouTube/TikTok)
```

---

# PRIORITY ORDER FOR IMPLEMENTATION

Based on impact vs effort:

## 🔴 MUST DO (quick wins, professional)
1. **OG images** — design 4 cards in Figma or use @vercel/og. Critical for sharing.
2. **Fix metadata** — `siteConfig.url` currently says `nanaamoako.dev`, live site is `portfolio.nanaamoako.com`
3. **Loading screen** — 2s preloader before the persona toggle. High impact, medium effort.

## 🟡 HIGH IMPACT
4. **Redesign designer section** as moodboard (Yan Liu style) with your photos
5. **Awards section with images** — create `/images/awards/` folder, add cert photos
6. **Content creator section** — add to designer or as separate `/creator` route
7. **"Full Story" page** — surface the master CV data with images

## 🟢 NICE TO HAVE
8. **Improve the landing** — add scroll-down "see everything" option
9. **Dynamic OG images** — use Next.js `/api/og` for page-specific social cards
10. **Add transition sound** — subtle audio cue on persona selection (you have BackgroundMusic component already)

---

# WHICH APPROACH TO PICK?

## If you're targeting recruiters & companies → **Approach D** (evolved current)
Keep the split, add loading screen, add photos and awards to each section.

## If you're targeting creative agencies, brands, collabs → **Approach B** (Moodboard)
Lead with the moodboard landing. Shows personality and range immediately.

## If you want to show your full breadth to everyone → **Approach C** (Full Story first)
Lead with the "About Me" + categories, then let them drill into each.

## My recommendation for Nana specifically:
**Hybrid of A + B:**
- Add the preloader (Approach A loading screen)
- Keep the split landing BUT redesign it to feel warmer and show preview content
- Redesign the **designer page** as a proper moodboard (Approach B treatment)
- Add a `/story` or `/everything` route that surfaces your full CV + awards + creator work (Approach C)
- Fix OG images first since that's zero-code-change impact

---

# FILES TO CREATE / MODIFY

```
MODIFY:
  /app/layout.jsx                        → fix siteConfig.url, add per-route OG
  /app/components/PersonaToggleOverlay   → add preloader, improve cards

CREATE:
  /app/components/LoadingScreen.jsx      → the 2s preloader
  /app/designer/MoodboardHero.jsx        → Yan Liu-inspired desk
  /app/story/page.jsx                    → Full Story / master CV landing
  /public/images/og/og-default.png      → design and export
  /public/images/og/og-developer.png    → design and export
  /public/images/og/og-designer.png     → design and export
  /public/images/awards/                → folder for award images

IMPROVE:
  /app/components/DesignerView.jsx       → integrate MoodboardHero
  /app/master-cv/                        → surface with images
```
