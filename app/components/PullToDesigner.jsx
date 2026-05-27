"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

const PULL_THRESHOLD = 140
const PULL_MAX_DISPLAY = 200

export default function PullToDesigner() {
  const router = useRouter()
  const pullProgress = useSpring(0, { stiffness: 220, damping: 32 })
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [isTriggering, setIsTriggering] = useState(false)

  // All transforms declared at top level
  const arrowY = useTransform(pullProgress, [0, PULL_MAX_DISPLAY], [0, 24])
  const indicatorOpacity = useTransform(pullProgress, [0, 35, PULL_MAX_DISPLAY], [0, 1, 1])
  const ringScale = useTransform(pullProgress, [0, PULL_THRESHOLD], [0.65, 1])
  const strokeDashoffset = useTransform(pullProgress, [0, PULL_THRESHOLD], [100, 0])

  const accumulated = useRef(0)
  const triggered = useRef(false)
  const touchStartY = useRef(null)
  const lastTouchY = useRef(null)

  // Scroll-to-bottom detection
  useEffect(() => {
    const onScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = document.documentElement
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const triggerTransition = () => {
    if (triggered.current) return
    triggered.current = true
    setIsTriggering(true)
    pullProgress.set(PULL_THRESHOLD)
    setTimeout(() => router.push("/designer"), 580)
  }

  const releasePull = () => {
    accumulated.current = 0
    if (!triggered.current) pullProgress.set(0)
  }

  // Desktop: wheel overscroll
  useEffect(() => {
    const onWheel = (e) => {
      if (!isAtBottom || triggered.current) return
      if (e.deltaY <= 0) { releasePull(); return }
      accumulated.current += e.deltaY * 0.55
      pullProgress.set(Math.min(accumulated.current, PULL_MAX_DISPLAY))
      if (accumulated.current >= PULL_THRESHOLD) triggerTransition()
    }
    window.addEventListener("wheel", onWheel, { passive: true })
    return () => window.removeEventListener("wheel", onWheel)
  }, [isAtBottom]) // eslint-disable-line react-hooks/exhaustive-deps

  // Mobile: touch overscroll
  useEffect(() => {
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
      lastTouchY.current = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      if (!isAtBottom || triggered.current) return
      const currentY = e.touches[0].clientY
      const delta = lastTouchY.current - currentY
      lastTouchY.current = currentY
      if (delta <= 0) { releasePull(); return }
      accumulated.current += delta * 1.3
      pullProgress.set(Math.min(accumulated.current, PULL_MAX_DISPLAY))
      if (accumulated.current >= PULL_THRESHOLD) triggerTransition()
    }
    const onTouchEnd = () => { if (!triggered.current) releasePull() }

    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [isAtBottom]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Pull zone — lives at the very bottom of the dev page */}
      <div className="relative w-full flex flex-col items-center pt-8 pb-36 select-none pointer-events-none">
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="flex flex-col items-center gap-3"
        >
          {/* Progress ring */}
          <motion.div
            style={{ scale: ringScale }}
            className="relative w-14 h-14 flex items-center justify-center"
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              className="absolute inset-0"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(244,63,94,0.15)" strokeWidth="2" />
              <motion.circle
                cx="28" cy="28" r="22"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength="100"
                style={{ strokeDasharray: 100, strokeDashoffset }}
              />
            </svg>

            {/* Arrow */}
            <motion.div style={{ y: arrowY }}>
              {isTriggering ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              )}
            </motion.div>
          </motion.div>

          {/* Label */}
          <motion.p
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(244,63,94,0.85)", fontFamily: "inherit" }}
          >
            {isTriggering ? "Entering Designer…" : "Keep scrolling for Designer ↑"}
          </motion.p>
        </motion.div>
      </div>

      {/* Full-screen wipe on trigger */}
      <AnimatePresence>
        {isTriggering && (
          <>
            {/* Rose tint wipe — rises then exits upward */}
            <motion.div
              className="fixed inset-0 z-[9998]"
              style={{ background: "#2d0613" }}
              initial={{ y: "100%" }}
              animate={{ y: ["100%", "0%", "-100%"] }}
              transition={{ duration: 0.65, times: [0, 0.42, 1], ease: [0.76, 0, 0.24, 1] }}
            />
            {/* Black cover panel — stays to mask route change */}
            <motion.div
              className="fixed inset-0 z-[9999] bg-black"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.25, duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
