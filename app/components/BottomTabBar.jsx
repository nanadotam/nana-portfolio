"use client"

import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"

const TABS = [
  {
    id: "developer",
    label: "DEVELOPER",
    shortLabel: "DEV",
    route: "/developer",
    font: "font-developer",
    activeColor: "text-green-400",
    activeBg: "rgba(34, 197, 94, 0.12)",
    activeBorder: "rgba(34, 197, 94, 0.35)",
    activeGlow: "0 0 24px rgba(34, 197, 94, 0.30)",
    dotColor: "#22c55e",
    dotGlow: "0 0 8px rgba(34, 197, 94, 0.7)",
  },
  {
    id: "cv",
    label: "CV",
    shortLabel: "CV",
    route: "/master-cv",
    font: "font-sans",
    activeColor: "text-amber-300",
    activeBg: "rgba(251, 191, 36, 0.10)",
    activeBorder: "rgba(251, 191, 36, 0.30)",
    activeGlow: "0 0 24px rgba(251, 191, 36, 0.25)",
    dotColor: "#fbbf24",
    dotGlow: "0 0 8px rgba(251, 191, 36, 0.7)",
  },
  {
    id: "designer",
    label: "Designer",
    shortLabel: "Design",
    route: "/designer",
    font: "font-designer italic",
    activeColor: "text-rose-400",
    activeBg: "rgba(244, 63, 94, 0.10)",
    activeBorder: "rgba(244, 63, 94, 0.30)",
    activeGlow: "0 0 24px rgba(244, 63, 94, 0.28)",
    dotColor: "#f43f5e",
    dotGlow: "0 0 8px rgba(244, 63, 94, 0.7)",
  },
]

// How far from page bottom triggers the dramatic scale-up
const BOTTOM_TRIGGER_PX = 80

export default function BottomTabBar({ hidden = false }) {
  const router = useRouter()
  const pathname = usePathname()
  const [hovered, setHovered] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionTarget, setTransitionTarget] = useState(null)
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = document.documentElement
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - BOTTOM_TRIGGER_PX)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const activeId = (() => {
    if (pathname?.startsWith("/designer")) return "designer"
    if (pathname?.startsWith("/master-cv")) return "cv"
    return "developer"
  })()

  const handleTab = (tab) => {
    if (tab.id === activeId || isTransitioning) return
    setIsTransitioning(true)
    setTransitionTarget(tab.id)
    setTimeout(() => {
      router.push(tab.route)
      setIsTransitioning(false)
      setTransitionTarget(null)
    }, 220)
  }

  const isAdminRoute = pathname?.startsWith("/admin")
  if (isAdminRoute || hidden) return null

  const activeTab = TABS.find((t) => t.id === activeId)

  // Scale and y-offset when at page bottom — dramatic float-up effect
  const scaleAtBottom = isMobile ? 1.55 : 2.6
  const yAtBottom = isMobile ? -72 : -118

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingBottom: isMobile ? "12px" : "20px" }}
      initial={{ y: 80, opacity: 0 }}
      animate={{
        y: isAtBottom ? yAtBottom : 0,
        opacity: 1,
        scale: isAtBottom ? scaleAtBottom : 1,
      }}
      transition={
        isAtBottom
          ? { type: "spring", damping: 22, stiffness: 280, mass: 0.9 }
          : { type: "spring", damping: 28, stiffness: 380 }
      }
    >
      <motion.div
        className="pointer-events-auto relative"
        animate={{
          boxShadow: isAtBottom
            ? activeTab
              ? activeTab.activeGlow.replace("24px", "48px")
              : "0 12px 48px rgba(0,0,0,0.4)"
            : activeTab
            ? activeTab.activeGlow
            : "0 8px 32px rgba(0,0,0,0.25)",
        }}
        transition={{ duration: 0.5 }}
        style={{ borderRadius: "9999px" }}
      >
        {/* Pill container */}
        <div
          className="relative flex items-stretch rounded-full border backdrop-blur-2xl overflow-hidden"
          style={{
            background: isAtBottom
              ? "rgba(0, 0, 0, 0.72)"
              : "rgba(0, 0, 0, 0.55)",
            borderColor: isAtBottom
              ? activeTab?.activeBorder ?? "rgba(255,255,255,0.14)"
              : "rgba(255,255,255,0.08)",
            minHeight: isMobile ? "48px" : "56px",
            transition: "background 0.4s ease, border-color 0.4s ease",
          }}
        >
          {/* Active tab highlight track */}
          <motion.div
            className="absolute inset-y-0 rounded-full"
            style={{ width: `${100 / TABS.length}%` }}
            animate={{
              left: `${(TABS.findIndex((t) => t.id === activeId) / TABS.length) * 100}%`,
              background: activeTab?.activeBg ?? "transparent",
              borderColor: activeTab?.activeBorder ?? "transparent",
            }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
          />

          {TABS.map((tab, idx) => {
            const isActive = tab.id === activeId
            const isHovered = hovered === tab.id
            const isLoading = transitionTarget === tab.id

            return (
              <div key={tab.id} className="relative flex items-center">
                {/* Divider between tabs */}
                {idx > 0 && (
                  <div
                    className="h-4 w-px"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                )}

                <motion.button
                  onClick={() => handleTab(tab)}
                  onMouseEnter={() => !isMobile && setHovered(tab.id)}
                  onMouseLeave={() => !isMobile && setHovered(null)}
                  className="relative flex items-center gap-2 rounded-full transition-none"
                  animate={{
                    paddingLeft: isHovered && !isMobile
                      ? "36px"
                      : isMobile ? "18px" : "28px",
                    paddingRight: isHovered && !isMobile
                      ? "36px"
                      : isMobile ? "18px" : "28px",
                    paddingTop: isMobile ? "10px" : "14px",
                    paddingBottom: isMobile ? "10px" : "14px",
                  }}
                  transition={{ type: "spring", damping: 26, stiffness: 340 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isTransitioning}
                >
                  {/* Status dot */}
                  <motion.span
                    className="rounded-full flex-shrink-0"
                    animate={{
                      width: isActive ? (isMobile ? "7px" : "8px") : isHovered ? "6px" : "5px",
                      height: isActive ? (isMobile ? "7px" : "8px") : isHovered ? "6px" : "5px",
                      backgroundColor: isActive
                        ? tab.dotColor
                        : isHovered
                        ? "rgba(200,200,200,0.6)"
                        : "rgba(120,120,120,0.4)",
                      boxShadow: isActive ? tab.dotGlow : "none",
                    }}
                    transition={{ duration: 0.22 }}
                  />

                  {/* Label */}
                  <motion.span
                    className={`${tab.font} tracking-wide select-none`}
                    animate={{
                      scale: isActive ? 1.04 : isHovered ? 1.02 : 1,
                    }}
                    style={{
                      fontSize: isHovered && !isMobile
                        ? "16px"
                        : isMobile
                        ? "12px"
                        : "14px",
                      color: isActive
                        ? tab.dotColor
                        : isHovered
                        ? "rgba(255,255,255,0.88)"
                        : "rgba(150,150,150,0.7)",
                      transition: "font-size 0.22s ease, color 0.18s ease",
                    }}
                    transition={{ duration: 0.18 }}
                  >
                    {isMobile ? tab.shortLabel : tab.label}
                  </motion.span>

                  {/* Hover glow behind hovered tab */}
                  <AnimatePresence>
                    {isHovered && !isMobile && (
                      <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          background: tab.activeBg,
                          boxShadow: `inset 0 0 0 1px ${tab.activeBorder}`,
                        }}
                        transition={{ duration: 0.18 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Loading spinner */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="absolute right-2"
                      >
                        <motion.div
                          className="w-3 h-3 rounded-full border border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
