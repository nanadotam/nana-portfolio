"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { AnimatePresence, motion } from "framer-motion"
import DeveloperView from "./components/DeveloperView"
import DesignerView from "./components/DesignerView"
import ModeToggle from "./components/ModeToggle"

import Terminal from "./components/Terminal"

// Context for mode management
const ModeContext = createContext()

export const useMode = () => {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider")
  }
  return context
}

export default function DualityPortfolio() {
  const [mode, setMode] = useState("developer")
  const [showTerminal, setShowTerminal] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(true)

  const handleSwitch = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setMode(mode === "developer" ? "designer" : "developer")
      setIsTransitioning(false)
    }, 300)
  }

  // Initialize theme based on mode
  useEffect(() => {
    if (mode === "developer") {
      document.body.classList.add("dark")
      document.body.classList.remove("light")
      localStorage.setItem("theme", "dark")
    }
    // Designer mode will handle its own theme
  }, [mode])

  // Keyboard shortcut (⌘+D or Ctrl+D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault()
        handleSwitch()
      }
      // Easter egg: typing "matrix" opens terminal
      if (e.key === "Enter" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        const selection = window.getSelection().toString().toLowerCase()
        if (selection === "matrix" || selection === "terminal") {
          setShowTerminal(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mode])

  // Spotlight timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSpotlight(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const modeValue = {
    mode,
    setMode,
    handleSwitch,
    isTransitioning,
  }

  return (
    <ModeContext.Provider value={modeValue}>
      <div className="min-h-screen w-full overflow-hidden relative">

        {/* Spotlight Overlay */}
        <AnimatePresence>
          {showSpotlight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="fixed inset-0 z-50 pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    circle 120px at calc(100vw - 120px) 60px,
                    transparent 0%,
                    transparent 40%,
                    rgba(0, 0, 0, 0.3) 50%,
                    rgba(0, 0, 0, 0.8) 70%,
                    rgba(0, 0, 0, 0.95) 100%
                  )
                `,
              }}
            >
              {/* Pulsing ring around the spotlight */}
              <motion.div
                className="absolute"
                style={{
                  top: "-50px",
                  right: "2px",
                  transform: "translate(50%, -50%)",
                }}
                animate={{
                  scale: [1, 0.5, 1],
                  opacity: [0.6, 0.2, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div
                  className={`w-60 h-60 rounded-full border-4 ${
                    mode === "developer" ? "border-green-400/50" : "border-rose-400/50"
                  }`}
                />
              </motion.div>

              {/* Instruction text */}
              <motion.div
                initial={{ opacity: 0, y: -200 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="absolute top-1/4 right-7 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="text-right">
                  <motion.h2
                    className={`text-4xl md:text-5xl font-bold mb-1 ${
                      mode === "developer" ? "font-mono text-green-400" : "font-serif text-rose-400"
                    }`}
                    animate={{
                      textShadow: ["0 0 10px currentColor", "0 0 20px currentColor", "0 0 10px currentColor"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    {mode === "developer" ? "Two Modes" : "Two Sides"}
                  </motion.h2>
                  <motion.p
                    className="text-xl text-white/80 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                  >
                    Click the button in the spotlight to see my other persona
                  </motion.p>

                  {/* Animated arrow pointing to the toggle */}
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3, duration: 0.8 }}
                  >
                    <motion.div
                      className="flex items-center space-x-4"
                      animate={{ x: [0, 20, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >

                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating particles around the spotlight */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${mode === "developer" ? "bg-green-400" : "bg-rose-400"}`}
                  style={{
                    top: `${40 + Math.sin((i * Math.PI * 2) / 8) * 15}px`,
                    right: `${100 + Math.cos((i * Math.PI * 2) / 8) * 25}px`,
                  }}
                  animate={{
                    scale: [0.5, 1.5, 0.5],
                    opacity: [0.3, 1, 0.3],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Toggle */}
        <ModeToggle />

        {/* Terminal Easter Egg */}
        <Terminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} onSwitch={handleSwitch} />

        {/* Main Content with Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="w-full h-full"
          >
            {mode === "developer" ? <DeveloperView /> : <DesignerView />}
          </motion.div>
        </AnimatePresence>

        {/* Glitch Overlay during transition */}
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 0, 0.1) 2px,
                rgba(0, 255, 0, 0.1) 4px
              )`,
              animation: "glitch 0.3s infinite",
            }}
          />
        )}
      </div>
    </ModeContext.Provider>
  )
}
