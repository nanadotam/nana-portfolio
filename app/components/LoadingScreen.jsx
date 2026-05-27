"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const FULL_NAME = "Nana Amoako"
const PERSONAS = [
  { label: "Developer.", className: "font-developer text-green-400" },
  { label: "Designer.",  className: "font-designer italic text-rose-400" },
  { label: "Creator.",   className: "font-sans text-white" },
]

export default function LoadingScreen({ onComplete }) {
  const [typedChars, setTypedChars]     = useState(0)
  const [personasOn, setPersonasOn]     = useState(false)
  const [wiping, setWiping]             = useState(false)
  const [done, setDone]                 = useState(false)

  useEffect(() => {
    // Phase 1 — type name at 45 ms / char, starting after 250 ms
    const timers = []

    FULL_NAME.split("").forEach((_, i) => {
      timers.push(setTimeout(() => setTypedChars(i + 1), 250 + i * 45))
    })

    const nameEndMs = 250 + FULL_NAME.length * 45

    // Phase 2 — show personas 200 ms after name finishes
    timers.push(setTimeout(() => setPersonasOn(true), nameEndMs + 200))

    // Phase 3 — start wipe 700 ms after personas appear
    timers.push(setTimeout(() => setWiping(true), nameEndMs + 900))

    // Phase 4 — signal done 600 ms into wipe (black panel is covering everything)
    timers.push(setTimeout(() => {
      setDone(true)
      onComplete?.()
    }, nameEndMs + 1500))

    return () => timers.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (done) return null

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden">

      {/* Logo slides in from left */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/nana-amoako-logo-white.png"
          alt="Nana Amoako logo"
          width={56}
          height={56}
          className="object-contain drop-shadow-lg"
          style={{ width: 56, height: 56 }}
        />
      </motion.div>

      {/* Typed name + blinking cursor */}
      <div className="mb-8 h-10 flex items-center justify-center">
        <p className="text-2xl md:text-3xl font-bold text-white tracking-tight font-sans">
          {FULL_NAME.slice(0, typedChars)}
          <motion.span
            className="inline-block w-[2px] h-6 bg-white ml-0.5 align-middle"
            animate={{ opacity: typedChars >= FULL_NAME.length ? 0 : [1, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
          />
        </p>
      </div>

      {/* Personas — staggered reveal */}
      <div className="flex gap-3 md:gap-4 flex-wrap justify-center min-h-[32px]">
        {personasOn && PERSONAS.map(({ label, className }, i) => (
          <motion.span
            key={label}
            className={`text-lg md:text-xl ${className}`}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: i * 0.13, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {label}
          </motion.span>
        ))}
      </div>

      {/* Two-panel wipe out */}
      <AnimatePresence>
        {wiping && (
          <>
            {/* Green accent panel rises → sweeps up and off */}
            <motion.div
              key="accent"
              className="absolute inset-0 bg-green-950"
              initial={{ y: "100%" }}
              animate={{ y: ["100%", "0%", "-100%"] }}
              transition={{ duration: 0.62, times: [0, 0.42, 1], ease: [0.76, 0, 0.24, 1] }}
            />
            {/* Dark cover panel rises and stays — masks the route */}
            <motion.div
              key="cover"
              className="absolute inset-0 bg-black"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.22, duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
