"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// Require 320px of deliberate overscroll — scrolling to the bottom alone won't trigger this
const PULL_THRESHOLD = 320
const PULL_MAX_DISPLAY = 420

export default function PullToDesigner() {
  const router = useRouter()
  const pullProgress = useSpring(0, { stiffness: 160, damping: 36 })
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [isTriggering, setIsTriggering] = useState(false)

  // All transforms at top level (Rules of Hooks)
  const arrowY = useTransform(pullProgress, [0, PULL_MAX_DISPLAY], [0, 28])
  const indicatorOpacity = useTransform(pullProgress, [0, 50, PULL_MAX_DISPLAY], [0, 1, 1])
  const ringScale = useTransform(pullProgress, [0, PULL_THRESHOLD], [0.55, 1])
  const strokeDashoffset = useTransform(pullProgress, [0, PULL_THRESHOLD], [100, 0])
  const labelOpacity = useTransform(pullProgress, [30, 90], [0, 1])

  const accumulated = useRef(0)
  const triggered = useRef(false)
  const touchStartY = useRef(null)
  const lastTouchY = useRef(null)
  // Momentum decay: slowly release accumulated pull when user stops scrolling
  const decayTimer = useRef(null)

  const isAtBottomRef = useRef(false)
  useEffect(() => { isAtBottomRef.current = isAtBottom }, [isAtBottom])

  // Scroll-to-bottom detection with small hysteresis
  useEffect(() => {
    const onScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = document.documentElement
      const atBottom = scrollTop + clientHeight >= scrollHeight - 4
      setIsAtBottom(atBottom)
      // Reset pull accumulation when user scrolls back up
      if (!atBottom && !triggered.current) {
        accumulated.current = 0
        pullProgress.set(0)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const triggerTransition = () => {
    if (triggered.current) return
    triggered.current = true
    clearTimeout(decayTimer.current)
    setIsTriggering(true)
    pullProgress.set(PULL_THRESHOLD)
    setTimeout(() => router.push("/designer"), 680)
  }

  const releasePull = () => {
    if (triggered.current) return
    // Gradual decay rather than instant snap-back — feels more physical
    clearTimeout(decayTimer.current)
    decayTimer.current = setTimeout(() => {
      accumulated.current = 0
      pullProgress.set(0)
    }, 120)
  }

  // Desktop: wheel overscroll — requires user to intentionally keep scrolling past bottom
  useEffect(() => {
    const onWheel = (e) => {
      if (!isAtBottomRef.current || triggered.current) return
      if (e.deltaY <= 0) {
        // Scrolling up: decay faster
        accumulated.current = Math.max(0, accumulated.current - e.deltaY * 0.4)
        pullProgress.set(Math.min(accumulated.current, PULL_MAX_DISPLAY))
        if (accumulated.current <= 0) releasePull()
        return
      }
      clearTimeout(decayTimer.current)
      // Lower multiplier = takes more intentional effort
      accumulated.current += e.deltaY * 0.38
      pullProgress.set(Math.min(accumulated.current, PULL_MAX_DISPLAY))
      if (accumulated.current >= PULL_THRESHOLD) triggerTransition()
    }
    window.addEventListener("wheel", onWheel, { passive: true })
    return () => window.removeEventListener("wheel", onWheel)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Mobile: touch overscroll
  useEffect(() => {
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
      lastTouchY.current = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      if (!isAtBottomRef.current || triggered.current) return
      const currentY = e.touches[0].clientY
      const delta = lastTouchY.current - currentY
      lastTouchY.current = currentY
      if (delta <= 0) {
        accumulated.current = Math.max(0, accumulated.current - Math.abs(delta) * 0.5)
        pullProgress.set(Math.min(accumulated.current, PULL_MAX_DISPLAY))
        return
      }
      clearTimeout(decayTimer.current)
      accumulated.current += delta * 0.95
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Pull zone — pinned to bottom of dev page */}
      <div className="relative w-full flex flex-col items-center pt-10 pb-40 select-none pointer-events-none">
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="flex flex-col items-center gap-4"
        >
          {/* Progress ring */}
          <motion.div
            style={{ scale: ringScale }}
            className="relative w-16 h-16 flex items-center justify-center"
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              className="absolute inset-0"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(244,63,94,0.12)" strokeWidth="2" />
              <motion.circle
                cx="32" cy="32" r="26"
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              )}
            </motion.div>
          </motion.div>

          {/* Label — only appears after some pull accumulation */}
          <motion.p
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(244,63,94,0.85)", opacity: labelOpacity }}
          >
            {isTriggering ? "Entering Designer…" : "Keep scrolling for Designer"}
          </motion.p>
        </motion.div>
      </div>

      {/* Full-screen wipe on trigger */}
      <AnimatePresence>
        {isTriggering && (
          <>
            <motion.div
              className="fixed inset-0 z-[9998]"
              style={{ background: "#2d0613" }}
              initial={{ y: "100%" }}
              animate={{ y: ["100%", "0%", "-100%"] }}
              transition={{ duration: 0.85, times: [0, 0.42, 1], ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="fixed inset-0 z-[9999] bg-black"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.32, duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
