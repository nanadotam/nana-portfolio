# Digital Business Card — Portfolio Page Spec

> AI agent build spec. Drop this into your codebase as a new route `/card` or `/me`.
> Replace all `[PLACEHOLDER]` values with real data before running.

---

## Overview

A shareable, interactive digital business card that lives as a standalone page on the portfolio site. It replaces a physical card at networking events — the owner opens it on their phone, hands it over, or shares the URL. It has three interchangeable color themes the user can toggle on the spot.

**Route:** `/card`
**Framework:** React (Next.js or Vite, matches existing portfolio stack)
**Style:** Tailwind CSS + CSS variables for theming

---

## Core Requirements

### Content — what goes on the card

```
NAME:       [Your Full Name]
ALIAS:      MASTERMIND.DUA.
TAGLINE:    I make things look good and work even better.
ROLE:       Developer & Designer

PHONE:      [+233 XX XXX XXXX]
EMAIL:      [your@email.com]
PORTFOLIO:  [https://yourportfolio.com]

SOCIAL:
  - Instagram:  [instagram.com/yourhandle]
  - Twitter/X:  [twitter.com/yourhandle]
  - Behance:    [behance.net/yourhandle]
```

### QR Code

- Encodes the portfolio URL
- Rendered client-side using `qrcode.react` library
- `npm install qrcode.react`
- Sits top-right of the card on landscape / bottom of card on portrait

```jsx
import { QRCodeSVG } from 'qrcode.react'

<QRCodeSVG
  value="[https://yourportfolio.com/card]"
  size={120}
  bgColor="transparent"
  fgColor="currentColor"
  level="H"
/>
```

---

## Layout

### Mobile Portrait (default)

```
┌─────────────────────────────┐
│  [Avatar / Initials Circle] │
│  [Full Name]                │
│  MASTERMIND.DUA.            │
│  Developer & Designer       │
│                             │
│  ✉  email                   │
│  📞  phone                  │
│  🌐  portfolio              │
│  𝕏  twitter                │
│  IG  instagram              │
│  Be  behance                │
│                             │
│  ┌──────────┐               │
│  │  QR CODE │               │
│  └──────────┘               │
│  Scan to visit portfolio    │
│                             │
│  [theme toggle buttons]     │
└─────────────────────────────┘
```

### Landscape / Desktop (rotated or wide screen)

```
┌──────────────────┬──────────────┐
│ [Avatar]         │  [QR Code]   │
│ [Full Name]      │              │
│ MASTERMIND.DUA.  │  Scan me     │
│                  │              │
│ ✉  email         │              │
│ 📞  phone        │              │
│ 🌐  portfolio    │              │
│ 𝕏   twitter      │              │
│ IG  instagram    │              │
│ Be  behance      │              │
└──────────────────┴──────────────┘
```

---

## Color Themes

Three themes. User toggles between them with a row of 3 circle buttons at the bottom of the card. Selection persists in `localStorage`.

### Theme 1 — Obsidian (Black / Silver)

```css
--bg:           #0a0a0a;
--bg-surface:   #141414;
--border:       #2a2a2a;
--text-primary: #f0f0f0;
--text-muted:   #888888;
--accent:       #c0c0c0;  /* silver */
--accent-hover: #ffffff;
--qr-color:     #f0f0f0;
```

### Theme 2 — Forest (Deep Green)

```css
--bg:           #0d1a0f;
--bg-surface:   #132016;
--border:       #1e3a22;
--text-primary: #e8f5ea;
--text-muted:   #6b9970;
--accent:       #4ade80;  /* bright green */
--accent-hover: #86efac;
--qr-color:     #4ade80;
```

### Theme 3 — Abyss (Deep Blue / Spotify-ish)

```css
--bg:           #040d1a;
--bg-surface:   #091628;
--border:       #0f2a47;
--text-primary: #e8f0fe;
--text-muted:   #6b8fc4;
--accent:       #3b82f6;  /* electric blue */
--accent-hover: #93c5fd;
--qr-color:     #3b82f6;
```

---

## Component Structure

```
/pages/card.jsx         (or /app/card/page.jsx for Next.js App Router)
/components/card/
  ├── CardRoot.jsx       — theme provider, layout wrapper
  ├── Avatar.jsx         — initials circle or image
  ├── Identity.jsx       — name, alias, tagline, role
  ├── ContactRow.jsx     — single row: icon + label + link
  ├── ContactList.jsx    — maps all contact/social rows
  ├── QRBlock.jsx        — QR code + "scan to visit" label
  └── ThemeToggle.jsx    — 3 circle swatches at bottom
```

---

## CardRoot.jsx — Theme Logic

```jsx
import { useState, useEffect } from 'react'

const themes = ['obsidian', 'forest', 'abyss']

export default function CardRoot({ children }) {
  const [theme, setTheme] = useState('obsidian')

  useEffect(() => {
    const saved = localStorage.getItem('card-theme')
    if (saved && themes.includes(saved)) setTheme(saved)
  }, [])

  const handleTheme = (t) => {
    setTheme(t)
    localStorage.setItem('card-theme', t)
  }

  return (
    <div className={`card-root theme-${theme}`} data-theme={theme}>
      {children}
      <ThemeToggle active={theme} onChange={handleTheme} />
    </div>
  )
}
```

---

## ContactRow.jsx

```jsx
// icon: Tabler icon name string e.g. "mail", "phone", "brand-instagram"
// label: display text e.g. "@yourhandle"
// href: full URL or "tel:+233..." or "mailto:..."
// copyable: bool — shows copy-to-clipboard on tap

export default function ContactRow({ icon, label, href, copyable = false }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(label)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="contact-row">
      <i className={`ti ti-${icon}`} aria-hidden="true" />
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
      {copyable && (
        <button onClick={handleCopy} aria-label="Copy">
          <i className={`ti ti-${copied ? 'check' : 'copy'}`} />
        </button>
      )}
    </div>
  )
}
```

---

## Avatar.jsx

```jsx
// If photo URL exists, render <img>
// Otherwise render initials in a styled circle

export default function Avatar({ name, photoUrl }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (photoUrl) {
    return <img src={photoUrl} alt={name} className="avatar-img" />
  }

  return (
    <div className="avatar-initials" aria-label={name}>
      {initials}
    </div>
  )
}
```

---

## ThemeToggle.jsx

```jsx
const swatches = {
  obsidian: '#c0c0c0',
  forest:   '#4ade80',
  abyss:    '#3b82f6',
}

export default function ThemeToggle({ active, onChange }) {
  return (
    <div className="theme-toggle" role="group" aria-label="Choose theme">
      {Object.entries(swatches).map(([name, color]) => (
        <button
          key={name}
          onClick={() => onChange(name)}
          aria-pressed={active === name}
          aria-label={`${name} theme`}
          style={{ background: color }}
          className={`swatch ${active === name ? 'active' : ''}`}
        />
      ))}
    </div>
  )
}
```

---

## Animations

Use Framer Motion (`npm install framer-motion`) for load-in sequence:

```jsx
import { motion } from 'framer-motion'

// Stagger children on mount
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
}

// Wrap ContactList in <motion.div variants={container} initial="hidden" animate="show">
// Wrap each ContactRow in <motion.div variants={item}>
```

---

## Share / Save Functionality

### Share button (Web Share API)

```jsx
const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: '[Your Name] — Digital Card',
      text:  'I make things look good and work even better.',
      url:   window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    // show "Link copied!" toast
  }
}
```

### Save as image (for gallery)

Use `html2canvas` to let the user screenshot and save:

```jsx
import html2canvas from 'html2canvas'
// npm install html2canvas

const handleSave = async () => {
  const el = document.getElementById('card-capture')
  const canvas = await html2canvas(el, {
    backgroundColor: null,
    scale: 3,           // high-res for phone gallery
    useCORS: true,
  })
  const link = document.createElement('a')
  link.download = 'mastermind-dua-card.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
```

Wrap the card in `<div id="card-capture">` — everything inside gets captured.

---

## Apple Wallet Note

Apple Wallet `.pkpass` files cannot be generated purely client-side. Options:

**Option A — Hosted service (easiest)**
Use [wallet.io](https://wallet.io) or [PassKit](https://passkit.com). They give you a hosted pass with a QR code link. Free tiers available. No backend needed on your end.

**Option B — Self-hosted (full control)**
Requires a Node.js server + Apple Developer account ($99/yr):
- Library: `passkit-generator` (`npm install passkit-generator`)
- You need: Pass Type ID certificate from Apple, team identifier, signed `.pkpass` served via HTTPS
- The pass shows name, tagline, QR code, and contact info
- User taps link on iPhone → Safari → "Add to Wallet"

**Recommended for tomorrow:** Skip Wallet for now. The `/card` page on your portfolio loaded on your phone *is* the card. It's more impressive anyway.

---

## AI Agent Prompt

Use this prompt to build the page end-to-end:

```
Build a digital business card as a new page at /card in my existing [Next.js / Vite React] portfolio.

Stack: React, Tailwind CSS, Framer Motion, qrcode.react, html2canvas

Requirements:
- Three dark color themes: Obsidian (black/silver), Forest (deep green), Abyss (deep blue)
- Theme toggle persisted to localStorage
- Card shows: name, alias (MASTERMIND.DUA.), tagline, role, email, phone, portfolio link, Instagram, Twitter/X, Behance
- QR code (qrcode.react) encodes portfolio URL, styled per active theme
- Avatar: initials circle for now, swap to <img> when photo URL is added
- Contact rows: icon (Tabler icons) + label + clickable link + copy-to-clipboard on phone number and email
- Staggered load animation on mount (Framer Motion)
- Share button using Web Share API with clipboard fallback
- Save as image button using html2canvas (scale: 3 for high-res)
- Fully responsive: portrait mobile is primary, landscape and desktop show two-column layout (info left, QR right)
- No external API calls, no auth, no database — pure client-side
- Page should work as a standalone shareable URL

Follow the component structure in the spec doc. Use CSS variables for theming, not Tailwind's dark: prefix. Replace all [PLACEHOLDER] values with the constants I will provide. Do not install any other dependencies beyond the four listed.
```

---

## File Checklist

- [ ] `qrcode.react` installed
- [ ] `framer-motion` installed
- [ ] `html2canvas` installed
- [ ] Tabler icons CSS loaded (CDN or npm)
- [ ] All `[PLACEHOLDER]` values replaced
- [ ] Route added to portfolio router / nav
- [ ] `og:image` meta tag set (card screenshot) for link previews
- [ ] Deployed and URL tested on actual phone before the event
