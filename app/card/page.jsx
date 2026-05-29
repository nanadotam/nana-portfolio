'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import {
  Mail, Phone, Globe, Github, Linkedin, Twitter, Instagram,
  Copy, Check, Share2, Download, Camera
} from 'lucide-react'
import Image from 'next/image'

// ─── Theme definitions ──────────────────────────────────────────────────────
const THEMES = {
  forest: {
    bg: '#0b1a0d',
    surface: '#132016',
    border: '#1e3a22',
    textPrimary: '#e8f5ea',
    textMuted: '#5a8a60',
    accent: '#4ade80',
    accentHover: '#86efac',
    qrBg: '#ffffff',
    qrFg: '#0b1a0d',
    pillBg: '#4ade80',
    pillText: '#0b1a0d',
    nameLine2: '#4ade80',
    swatch: '#4ade80',
  },
  obsidian: {
    bg: '#0a0a0a',
    surface: '#141414',
    border: '#2a2a2a',
    textPrimary: '#f0f0f0',
    textMuted: '#888888',
    accent: '#c0c0c0',
    accentHover: '#ffffff',
    qrBg: '#ffffff',
    qrFg: '#0a0a0a',
    pillBg: '#c0c0c0',
    pillText: '#0a0a0a',
    nameLine2: '#c0c0c0',
    swatch: '#c0c0c0',
  },
  abyss: {
    bg: '#040d1a',
    surface: '#091628',
    border: '#0f2a47',
    textPrimary: '#e8f0fe',
    textMuted: '#6b8fc4',
    accent: '#3b82f6',
    accentHover: '#93c5fd',
    qrBg: '#ffffff',
    qrFg: '#040d1a',
    pillBg: '#3b82f6',
    pillText: '#ffffff',
    nameLine2: '#3b82f6',
    swatch: '#3b82f6',
  },
}

const CONTACT = [
  {
    icon: Mail,
    label: 'unclesettings@gmail.com',
    href: 'mailto:unclesettings@gmail.com',
    copyable: true,
  },
  {
    icon: Phone,
    label: '+233 247 153 173',
    href: 'tel:+233247153173',
    copyable: true,
  },
  {
    icon: Globe,
    label: 'portfolio.nanaamoako.com',
    href: 'https://portfolio.nanaamoako.com',
    copyable: false,
  },
  {
    icon: Github,
    label: 'github.com/nanadotam',
    href: 'https://github.com/nanadotam',
    copyable: false,
  },
  {
    icon: Linkedin,
    label: 'linkedin.com/in/nanaamoako',
    href: 'https://linkedin.com/in/nanaamoako',
    copyable: false,
  },
  {
    icon: Twitter,
    label: 'x.com/unclesettings',
    href: 'https://x.com/unclesettings',
    copyable: false,
  },
  {
    icon: Instagram,
    label: 'instagram.com/unclesettings',
    href: 'https://instagram.com/unclesettings',
    copyable: false,
  },
]

const PORTFOLIO_URL = 'https://portfolio.nanaamoako.com'
const CARD_URL = 'https://portfolio.nanaamoako.com/card'

// ─── Animation variants ──────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

// ─── ContactRow ──────────────────────────────────────────────────────────────
function ContactRow({ icon: Icon, label, href, copyable, theme }) {
  const [copied, setCopied] = useState(false)
  const t = THEMES[theme]

  const handleCopy = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(label)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center gap-3 group"
    >
      <Icon size={16} style={{ color: t.accent, flexShrink: 0 }} />
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        style={{ color: t.textPrimary, fontSize: '0.82rem', letterSpacing: '0.01em' }}
        className="underline underline-offset-2 decoration-transparent group-hover:decoration-current transition-all duration-200 truncate"
      >
        {label}
      </a>
      {copyable && (
        <button
          onClick={handleCopy}
          aria-label="Copy"
          style={{ color: t.textMuted, flexShrink: 0 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-0.5"
        >
          {copied
            ? <Check size={13} style={{ color: t.accent }} />
            : <Copy size={13} />
          }
        </button>
      )}
    </motion.div>
  )
}

// ─── ThemeToggle ─────────────────────────────────────────────────────────────
function ThemeToggle({ active, onChange }) {
  return (
    <div className="flex items-center gap-3" role="group" aria-label="Choose theme">
      {Object.entries(THEMES).map(([name, t]) => (
        <button
          key={name}
          onClick={() => onChange(name)}
          aria-pressed={active === name}
          aria-label={`${name} theme`}
          style={{
            background: t.swatch,
            width: active === name ? 28 : 20,
            height: active === name ? 28 : 20,
            borderRadius: '50%',
            border: active === name ? `2px solid white` : '2px solid transparent',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: active === name ? `0 0 0 2px ${t.swatch}44` : 'none',
          }}
        />
      ))}
    </div>
  )
}

// ─── QR Logo ─────────────────────────────────────────────────────────────────
function QRLogo() {
  return (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: '#0b1a0d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1.5px solid #4ade80',
    }}>
      <span style={{ color: '#4ade80', fontSize: 7, fontWeight: 700, letterSpacing: 1, textAlign: 'center', lineHeight: 1.1 }}>
        NANA<br />AMOAKO
      </span>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CardPage() {
  const [theme, setTheme] = useState('forest')
  const [toast, setToast] = useState('')
  const cardRef = useRef(null)
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
      await navigator.share({
        title: 'Nana Amoako — Digital Card',
        text: 'I make things look good and work even better.',
        url: CARD_URL,
      })
    } else {
      navigator.clipboard.writeText(CARD_URL)
      showToast('Link copied!')
    }
  }

  const handleSave = async () => {
    const { default: html2canvas } = await import('html2canvas')
    const el = cardRef.current
    if (!el) return
    const canvas = await html2canvas(el, {
      backgroundColor: null,
      scale: 3,
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = 'nana-amoako-card.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast('Saved!')
  }

  return (
    <div
      style={{ background: t.bg, minHeight: '100dvh' }}
      className="flex items-center justify-center p-4 sm:p-6 transition-colors duration-500"
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            background: t.accent,
            color: t.pillText,
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: 999,
            padding: '6px 18px',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            zIndex: 50,
          }}
        >
          {toast}
        </div>
      )}

      {/* Card capture root */}
      <div ref={cardRef} style={{ width: '100%', maxWidth: 900 }}>

        {/* ── LANDSCAPE / DESKTOP ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            background: t.surface,
            border: `1.5px solid ${t.border}`,
            borderRadius: 20,
            overflow: 'hidden',
          }}
          className="hidden sm:grid"
          id="card-capture"
        >
          <div className="grid" style={{ gridTemplateColumns: '1fr 380px' }}>

            {/* LEFT — Identity + Contacts */}
            <div className="flex flex-col justify-between p-8 lg:p-10">

              {/* Header: photo + name */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex items-start gap-5 mb-7"
              >
                {/* Avatar */}
                <motion.div variants={itemVariants} style={{ flexShrink: 0 }}>
                  <div style={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `2px solid ${t.border}`,
                  }}>
                    <Image
                      src="/images/dev-profile.jpeg"
                      alt="Nana Amoako"
                      width={88}
                      height={88}
                      style={{ objectFit: 'cover', width: '100%', height: '100%', filter: 'grayscale(30%)' }}
                    />
                  </div>
                </motion.div>

                {/* Name block */}
                <div>
                  <motion.div variants={itemVariants}>
                    <p style={{
                      fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
                      fontWeight: 900,
                      lineHeight: 0.95,
                      color: t.textPrimary,
                      letterSpacing: '-0.02em',
                      fontFamily: '"Bricolage Grotesque", sans-serif',
                    }}>NANA</p>
                    <p style={{
                      fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
                      fontWeight: 900,
                      lineHeight: 0.95,
                      color: t.nameLine2,
                      letterSpacing: '-0.02em',
                      fontFamily: '"Bricolage Grotesque", sans-serif',
                    }}>AMOAKO</p>
                  </motion.div>
                  <motion.p
                    variants={itemVariants}
                    style={{
                      color: t.textMuted,
                      fontSize: '0.68rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      marginTop: 6,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    Software Developer
                  </motion.p>
                </div>
              </motion.div>

              {/* Contact rows */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3.5 flex-1"
              >
                {CONTACT.map((c) => (
                  <ContactRow key={c.href} {...c} theme={theme} />
                ))}
              </motion.div>

              {/* Bottom: theme toggle + action buttons */}
              <div className="flex items-center justify-between mt-8">
                <ThemeToggle active={theme} onChange={handleTheme} />
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${t.border}`,
                      borderRadius: 8,
                      padding: '6px 12px',
                      color: t.textMuted,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      letterSpacing: '0.06em',
                    }}
                    aria-label="Share card"
                  >
                    <Share2 size={13} /> SHARE
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${t.border}`,
                      borderRadius: 8,
                      padding: '6px 12px',
                      color: t.textMuted,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      letterSpacing: '0.06em',
                    }}
                    aria-label="Save as image"
                  >
                    <Camera size={13} /> SAVE
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — QR Code */}
            <div
              style={{
                background: t.bg,
                borderLeft: `1.5px solid ${t.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                gap: '1.25rem',
              }}
            >
              {/* QR container */}
              <div style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: '1.25rem',
                boxShadow: `0 0 0 1.5px ${t.border}, 0 8px 32px rgba(0,0,0,0.3)`,
                position: 'relative',
              }}>
                <QRCodeSVG
                  value={CARD_URL}
                  size={220}
                  bgColor="transparent"
                  fgColor={t.qrFg}
                  level="H"
                  imageSettings={{
                    src: '',
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
                {/* Center logo overlay */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}>
                  <QRLogo />
                </div>
              </div>

              {/* "LET'S CONNECT" pill */}
              <button
                onClick={handleShare}
                style={{
                  background: t.pillBg,
                  color: t.pillText,
                  borderRadius: 999,
                  padding: '8px 24px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                LET&rsquo;S CONNECT
              </button>

              <p style={{
                color: t.textMuted,
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: '"JetBrains Mono", monospace',
              }}>
                Scan to visit portfolio
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── MOBILE PORTRAIT ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            background: t.surface,
            border: `1.5px solid ${t.border}`,
            borderRadius: 20,
            overflow: 'hidden',
          }}
          className="flex flex-col sm:hidden"
          id="card-capture-mobile"
        >
          <div className="flex flex-col p-6 gap-6">

            {/* Avatar + name */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex items-center gap-4"
            >
              <motion.div variants={itemVariants} style={{ flexShrink: 0 }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${t.border}`,
                }}>
                  <Image
                    src="/images/dev-profile.jpeg"
                    alt="Nana Amoako"
                    width={72}
                    height={72}
                    style={{ objectFit: 'cover', width: '100%', height: '100%', filter: 'grayscale(30%)' }}
                  />
                </div>
              </motion.div>
              <div>
                <motion.div variants={itemVariants}>
                  <p style={{
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    lineHeight: 0.95,
                    color: t.textPrimary,
                    letterSpacing: '-0.02em',
                    fontFamily: '"Bricolage Grotesque", sans-serif',
                  }}>NANA</p>
                  <p style={{
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    lineHeight: 0.95,
                    color: t.nameLine2,
                    letterSpacing: '-0.02em',
                    fontFamily: '"Bricolage Grotesque", sans-serif',
                  }}>AMOAKO</p>
                </motion.div>
                <motion.p
                  variants={itemVariants}
                  style={{
                    color: t.textMuted,
                    fontSize: '0.6rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    marginTop: 4,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  Software Developer
                </motion.p>
              </div>
            </motion.div>

            {/* Divider */}
            <div style={{ height: 1, background: t.border }} />

            {/* Contact rows */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-4"
            >
              {CONTACT.map((c) => (
                <ContactRow key={c.href} {...c} theme={theme} />
              ))}
            </motion.div>

            {/* Divider */}
            <div style={{ height: 1, background: t.border }} />

            {/* QR block */}
            <div className="flex flex-col items-center gap-3">
              <div style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: '1rem',
                boxShadow: `0 0 0 1.5px ${t.border}`,
                position: 'relative',
              }}>
                <QRCodeSVG
                  value={CARD_URL}
                  size={180}
                  bgColor="transparent"
                  fgColor={t.qrFg}
                  level="H"
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}>
                  <QRLogo />
                </div>
              </div>

              <button
                onClick={handleShare}
                style={{
                  background: t.pillBg,
                  color: t.pillText,
                  borderRadius: 999,
                  padding: '7px 22px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                LET&rsquo;S CONNECT
              </button>

              <p style={{
                color: t.textMuted,
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: '"JetBrains Mono", monospace',
              }}>
                Scan to visit portfolio
              </p>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between">
              <ThemeToggle active={theme} onChange={handleTheme} />
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${t.border}`,
                    borderRadius: 8,
                    padding: '5px 10px',
                    color: t.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: '0.65rem',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                  }}
                >
                  <Share2 size={12} /> SHARE
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${t.border}`,
                    borderRadius: 8,
                    padding: '5px 10px',
                    color: t.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: '0.65rem',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                  }}
                >
                  <Camera size={12} /> SAVE
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
