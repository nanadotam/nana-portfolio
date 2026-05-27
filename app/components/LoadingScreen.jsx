"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const FULL_NAME = "Nana Amoako"
const PERSONAS = [
  { label: "Developer.", className: "font-developer text-green-400" },
  { label: "Designer.",  className: "font-designer italic text-rose-400" },
  { label: "Creator.",   className: "font-sans text-white" },
]

// Total runtime: ~4.2 s
// 0 ms        — logo slides in
// 300 ms      — name starts typing (70 ms/char → ~1150 ms total)
// 1450 ms     — name done, pause 350 ms
// 1800 ms     — personas fade in (staggered 200 ms apart)
// 2700 ms     — personas settled, pause
// 3000 ms     — wipe panels start rising
// 3700 ms     — black panel covers screen → signal done

export default function LoadingScreen({ onComplete }) {
  const [typedChars, setTypedChars] = useState(0)
  const [personasOn, setPersonasOn]   = useState(false)
  const [wiping, setWiping]           = useState(false)
  const [done, setDone]               = useState(false)

  useEffect(() => {
    const t = []
    const CHAR_DELAY   = 300   // ms before first char
    const CHAR_SPEED   = 68    // ms per character
    const nameEndMs    = CHAR_DELAY + FULL_NAME.length * CHAR_SPEED  // ≈1116 ms

    // Phase 1 — type name
    FULL_NAME.split("").forEach((_, i) => {
      t.push(setTimeout(() => setTypedChars(i + 1), CHAR_DELAY + i * CHAR_SPEED))
    })

    // Phase 2 — personas appear 380 ms after name finishes
    t.push(setTimeout(() => setPersonasOn(true), nameEndMs + 380))

    // Phase 3 — wipe starts ~1200 ms after personas
    t.push(setTimeout(() => setWiping(true), nameEndMs + 1580))

    // Phase 4 — done 750 ms into wipe (black panel covering)
    t.push(setTimeout(() => {
      setDone(true)
      onComplete?.()
    }, nameEndMs + 2300))

    return () => t.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (done) return null

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden">

      {/* Logo — slides in from left, lingers */}
      <motion.div
        initial={{ x: -48, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/nana-amoako-logo-white.png"
          alt="Nana Amoako logo"
          width={60}
          height={60}
          className="object-contain drop-shadow-lg"
          style={{ width: 60, height: 60 }}
        />
      </motion.div>

      {/* Typed name */}
      <div className="mb-10 h-12 flex items-center justify-center">
        <p className="text-3xl md:text-4xl font-bold text-white tracking-tight font-sans">
          {FULL_NAME.slice(0, typedChars)}
          <motion.span
            className="inline-block w-[2px] h-8 bg-white/80 ml-1 align-middle"
            animate={{ opacity: typedChars >= FULL_NAME.length ? 0 : [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          />
        </p>
      </div>

      {/* Persona words — each blurs in with generous stagger */}
      <div className="flex gap-4 md:gap-6 flex-wrap justify-center min-h-[36px]">
        {personasOn && PERSONAS.map(({ label, className }, i) => (
          <motion.span
            key={label}
            className={`text-xl md:text-2xl ${className}`}
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: i * 0.22,
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {label}
          </motion.span>
        ))}
      </div>

      {/* ── Two-panel wipe out ── */}
      <AnimatePresence>
        {wiping && (
          <>
            {/* Green accent — rises from bottom, sweeps off the top */}
            <motion.div
              key="accent"
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, #052e16 0%, #14532d 100%)" }}
              initial={{ y: "100%" }}
              animate={{ y: ["100%", "0%", "-100%"] }}
              transition={{
                duration: 1.05,
                times: [0, 0.42, 1],
                ease: [0.76, 0, 0.24, 1],
              }}
            />
            {/* Black cover — rises and stays, masking the route change */}
            <motion.div
              key="cover"
              className="absolute inset-0 bg-black"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{
                delay: 0.38,
                duration: 0.55,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
