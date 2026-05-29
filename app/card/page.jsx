'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import {
  Mail, Phone, Globe, Github, Linkedin, Twitter, Instagram,
  Copy, Check, Share2, Download, ChevronRight,
} from 'lucide-react'
import Image from 'next/image'

// ─── Themes ─────────────────────────────────────────────────────────────────
const THEMES = {
  forest: {
    bg: '#0b1a0d',
    surface: '#132016',
    surfaceRow: '#1a2e1d',
    border: '#233827',
    textPrimary: '#e8f5ea',
    textMuted: '#5a8a60',
    accent: '#4ade80',
    nameLine2: '#4ade80',
    pillBg: '#4ade80',
    pillText: '#0b1a0d',
    qrFg: '#0b1a0d',
    swatch: '#4ade80',
    rowHover: 'rgba(74,222,128,0.08)',
    rowActive: 'rgba(74,222,128,0.14)',
  },
  obsidian: {
    bg: '#0a0a0a',
    surface: '#141414',
    surfaceRow: '#1c1c1c',
    border: '#2a2a2a',
    textPrimary: '#f0f0f0',
    textMuted: '#888888',
    accent: '#c0c0c0',
    nameLine2: '#c0c0c0',
    pillBg: '#c0c0c0',
    pillText: '#0a0a0a',
    qrFg: '#0a0a0a',
    swatch: '#c0c0c0',
    rowHover: 'rgba(192,192,192,0.07)',
    rowActive: 'rgba(192,192,192,0.13)',
  },
  abyss: {
    bg: '#040d1a',
    surface: '#091628',
    surfaceRow: '#0d1e35',
    border: '#0f2a47',
    textPrimary: '#e8f0fe',
    textMuted: '#6b8fc4',
    accent: '#3b82f6',
    nameLine2: '#3b82f6',
    pillBg: '#3b82f6',
    pillText: '#ffffff',
    qrFg: '#040d1a',
    swatch: '#3b82f6',
    rowHover: 'rgba(59,130,246,0.08)',
    rowActive: 'rgba(59,130,246,0.14)',
  },
}

const CONTACTS = [
  { icon: Mail,      label: 'unclesettings@gmail.com',      href: 'mailto:unclesettings@gmail.com', copy: true  },
  { icon: Phone,     label: '+233 247 153 173',              href: 'tel:+233247153173',              copy: true  },
  { icon: Globe,     label: 'portfolio.nanaamoako.com',      href: 'https://portfolio.nanaamoako.com', copy: false },
  { icon: Github,    label: 'github.com/nanadotam',          href: 'https://github.com/nanadotam',    copy: false },
  { icon: Linkedin,  label: 'linkedin.com/in/nanaamoako',   href: 'https://linkedin.com/in/nanaamoako', copy: false },
  { icon: Twitter,   label: 'x.com/unclesettings',          href: 'https://x.com/unclesettings',     copy: false },
  { icon: Instagram, label: 'instagram.com/unclesettings',  href: 'https://instagram.com/unclesettings', copy: false },
]

const CARD_URL = 'https://portfolio.nanaamoako.com/card'

// ─── Animation ───────────────────────────────────────────────────────────────
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }
const fadeUp  = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } } }

// ─── ContactRow — feels like a native iOS/Android row ───────────────────────
function ContactRow({ icon: Icon, label, href, copy, theme }) {
  const t = THEMES[theme]
  const [copied, setCopied] = useState(false)
  const [pressed, setPressed] = useState(false)

  const handleCopy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(label)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <motion.a
      variants={fadeUp}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 14px',
        borderRadius: 12,
        border: `1px solid ${t.border}`,
        background: pressed ? t.rowActive : t.surfaceRow,
        textDecoration: 'none',
        transition: 'background 0.12s ease, transform 0.1s ease',
        transform: pressed ? 'scale(0.975)' : 'scale(1)',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `${t.accent}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={15} style={{ color: t.accent }} />
      </div>

      {/* Label */}
      <span style={{
        color: t.textPrimary,
        fontSize: '0.8rem',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
      }}>
        {label}
      </span>

      {/* Copy button or chevron */}
      {copy ? (
        <button
          onClick={handleCopy}
          aria-label="Copy"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            color: copied ? t.accent : t.textMuted,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      ) : (
        <ChevronRight size={14} style={{ color: t.textMuted, flexShrink: 0 }} />
      )}
    </motion.a>
  )
}

// ─── Theme Swatch Toggle ─────────────────────────────────────────────────────
function ThemeToggle({ active, onChange }) {
  return (
    <div className="flex items-center gap-2.5" role="group" aria-label="Choose theme">
      {Object.entries(THEMES).map(([name, t]) => (
        <button
          key={name}
          onClick={() => onChange(name)}
          aria-label={`${name} theme`}
          aria-pressed={active === name}
          style={{
            width: active === name ? 26 : 18,
            height: active === name ? 26 : 18,
            borderRadius: '50%',
            background: t.swatch,
            border: active === name ? '2.5px solid rgba(255,255,255,0.85)' : '2px solid transparent',
            boxShadow: active === name ? `0 0 0 2px ${t.swatch}55` : 'none',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            outline: 'none',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}

// ─── QR logo watermark ───────────────────────────────────────────────────────
function QRLogo() {
  return (
    <div style={{
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: '#0b1a0d',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1.5px solid #4ade80',
      gap: 1,
    }}>
      <Globe size={16} color="#4ade80" />
      <span style={{ color: '#4ade80', fontSize: 5.5, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1 }}>
        NANA AMOAKO
      </span>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CardPage() {
  const [theme, setTheme] = useState('forest')
  const [toast, setToast] = useState('')
  const t = THEMES[theme]

  useEffect(() => {
    const saved = localStorage.getItem('card-theme')
    if (saved && THEMES[saved]) setTheme(saved)
  }, [])

  const handleTheme = (name) => {
    setTheme(name)
    localStorage.setItem('card-theme', name)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Nana Amoako — Digital Card', text: 'I make things look good and work even better.', url: CARD_URL })
      } catch {}
    } else {
      navigator.clipboard.writeText(CARD_URL)
      showToast('Link copied!')
    }
  }

  const handleSave = () => {
    const link = document.createElement('a')
    link.href = '/images/FINAL_BUSINESS_CARD.png'
    link.download = 'nana-amoako-business-card.png'
    link.click()
  }

  return (
    <div
      style={{ background: t.bg, minHeight: '100dvh', transition: 'background 0.4s ease' }}
      className="flex items-center justify-center p-4 sm:p-8"
    >
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: t.accent, color: t.pillText,
          borderRadius: 999, padding: '7px 20px',
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
          zIndex: 50, whiteSpace: 'nowrap',
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          {toast}
        </div>
      )}

      {/* ── Card shell ── */}
      <style>{`
        @media (min-width: 640px) {
          .card-grid { grid-template-columns: 1fr 280px !important; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 900,
          background: t.surface,
          border: `1.5px solid ${t.border}`,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
        }}
      >
        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: '1fr' }}>

            {/* ── LEFT PANEL ── */}
            <div style={{ padding: 'clamp(1.25rem, 3.5vw, 2.25rem)', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Header: photo + name */}
              <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {/* Avatar */}
                <motion.div variants={fadeUp} style={{ flexShrink: 0 }}>
                  <div style={{
                    width: 'clamp(72px, 12vw, 88px)',
                    height: 'clamp(72px, 12vw, 88px)',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `2.5px solid ${t.accent}`,
                    flexShrink: 0,
                  }}>
                    <Image
                      src="/images/nana-profile.png"
                      alt="Nana Amoako"
                      width={88}
                      height={88}
                      style={{ objectFit: 'cover', objectPosition: 'center top', width: '100%', height: '100%' }}
                      priority
                    />
                  </div>
                </motion.div>

                {/* Name + title */}
                <div style={{ paddingTop: 4 }}>
                  <motion.div variants={fadeUp}>
                    <p style={{
                      fontFamily: '"Bricolage Grotesque", sans-serif',
                      fontWeight: 900,
                      fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                      lineHeight: 0.92,
                      color: t.textPrimary,
                      letterSpacing: '-0.025em',
                    }}>NANA</p>
                    <p style={{
                      fontFamily: '"Bricolage Grotesque", sans-serif',
                      fontWeight: 900,
                      fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                      lineHeight: 0.92,
                      color: t.nameLine2,
                      letterSpacing: '-0.025em',
                    }}>AMOAKO</p>
                  </motion.div>
                  <motion.p variants={fadeUp} style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: t.textMuted,
                    marginTop: 8,
                  }}>
                    Software Developer
                  </motion.p>
                </div>
              </motion.div>

              {/* Divider */}
              <div style={{ height: 1, background: t.border }} />

              {/* Contact rows */}
              <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {CONTACTS.map((c) => (
                  <ContactRow key={c.href} {...c} theme={theme} />
                ))}
              </motion.div>

              {/* Bottom bar: theme + actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                <ThemeToggle active={theme} onChange={handleTheme} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <ActionBtn icon={Share2} label="SHARE" onClick={handleShare} theme={theme} />
                  <ActionBtn icon={Download} label="SAVE" onClick={handleSave} theme={theme} />
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL — desktop QR only, hidden on mobile ── */}
            <div
              className="hidden sm:flex"
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.75rem 1.25rem',
                gap: '1rem',
                borderLeft: `1.5px solid ${t.border}`,
                background: t.bg,
              }}
            >
              <div style={{
                background: '#ffffff',
                borderRadius: 18,
                padding: '1rem',
                boxShadow: `0 0 0 1.5px ${t.border}, 0 12px 36px rgba(0,0,0,0.3)`,
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <QRCodeSVG value={CARD_URL} size={180} bgColor="transparent" fgColor={t.qrFg} level="H" />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                  <QRLogo />
                </div>
              </div>

              <button onClick={handleShare} style={{
                background: t.pillBg, color: t.pillText,
                borderRadius: 999, padding: '8px 22px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                border: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                LET&rsquo;S CONNECT
              </button>

              <p style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.55rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: t.textMuted,
                textAlign: 'center',
              }}>
                Scan to visit portfolio
              </p>
            </div>

        </div>{/* .card-grid */}
      </motion.div>
    </div>
  )
}

// ─── Small action button ──────────────────────────────────────────────────────
function ActionBtn({ icon: Icon, label, onClick, theme }) {
  const t = THEMES[theme]
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        background: pressed ? t.surfaceRow : 'transparent',
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: '7px 13px',
        color: t.textMuted,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.7rem',
        cursor: 'pointer',
        letterSpacing: '0.07em',
        fontFamily: '"JetBrains Mono", monospace',
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
        transition: 'all 0.1s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <Icon size={13} />
      {label}
    </button>
  )
}
