"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function PersistentPersonaToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentMode, setCurrentMode] = useState("developer")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hoveredSide, setHoveredSide] = useState(null)

  // Detect current mode from pathname
  useEffect(() => {
    if (pathname.includes("/designer")) {
      setCurrentMode("designer")
    } else if (pathname.includes("/developer")) {
      setCurrentMode("developer")
    }
  }, [pathname])

  const handleSwitch = (targetMode) => {
    if (targetMode === currentMode || isTransitioning) return
    
    setIsTransitioning(true)
    
    // Save preference
    localStorage.setItem("preferredView", targetMode)
    
    // Fast transition with motion blur
    setTimeout(() => {
      router.push(`/${targetMode}`)
      setCurrentMode(targetMode)
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 150)
  }

  // Don't show on home page
  if (pathname === "/") return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", damping: 30, stiffness: 400 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="relative bg-black/5 backdrop-blur-2xl rounded-2xl p-1 border border-white/10 shadow-2xl">
        {/* Background transition effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            background: isTransitioning
              ? "linear-gradient(90deg, rgba(34, 197, 94, 0.1), rgba(244, 63, 94, 0.1))"
              : currentMode === "developer"
              ? "rgba(34, 197, 94, 0.05)"
              : "rgba(244, 63, 94, 0.05)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Matrix effect for developer mode */}
        {(currentMode === "developer" || hoveredSide === "developer") && (
          <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden rounded-l-2xl pointer-events-none">
            <div className="matrix-dots w-full h-full opacity-20" />
          </div>
        )}

        {/* Designer effect */}
        {(currentMode === "designer" || hoveredSide === "designer") && (
          <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden rounded-r-2xl pointer-events-none">
            <div className="designer-glow w-full h-full opacity-15" />
          </div>
        )}

        <div className="flex relative z-10">
          {/* Developer Side */}
          <motion.button
            onClick={() => handleSwitch("developer")}
            onMouseEnter={() => setHoveredSide("developer")}
            onMouseLeave={() => setHoveredSide(null)}
            className="relative px-6 py-3 rounded-l-2xl transition-motion-blur-fast overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isTransitioning}
          >
            {/* Active indicator */}
            <motion.div
              className="absolute inset-0 bg-green-400/10 rounded-l-2xl"
              animate={{
                opacity: currentMode === "developer" ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-green-400/5 rounded-l-2xl"
              animate={{
                opacity: hoveredSide === "developer" ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            />

            <div className="relative z-10 flex items-center space-x-2">
              <motion.span 
                className={`text-lg font-developer transition-motion-blur-fast ${
                  currentMode === "developer" 
                    ? "text-green-400" 
                    : hoveredSide === "developer"
                    ? "text-green-300"
                    : "text-gray-500"
                }`}
                animate={{
                  textShadow: currentMode === "developer" 
                    ? "0 0 10px rgba(34, 197, 94, 0.3)" 
                    : "none",
                }}
              >
                DEV
              </motion.span>
              
              {/* Status indicator */}
              <motion.div
                className={`w-2 h-2 rounded-full transition-motion-blur-fast ${
                  currentMode === "developer" ? "bg-green-400" : "bg-gray-400/30"
                }`}
                animate={{
                  scale: currentMode === "developer" ? 1 : 0.7,
                  boxShadow: currentMode === "developer" 
                    ? "0 0 8px rgba(34, 197, 94, 0.5)" 
                    : "none",
                }}
              />
            </div>
          </motion.button>

          {/* Divider */}
          <motion.div
            className="w-px my-2"
            animate={{
              background: hoveredSide === "developer" 
                ? "linear-gradient(to bottom, transparent, #22c55e, transparent)"
                : hoveredSide === "designer"
                ? "linear-gradient(to bottom, transparent, #f43f5e, transparent)"
                : "linear-gradient(to bottom, transparent, #404040, transparent)",
            }}
            transition={{ duration: 0.2 }}
          />

          {/* Designer Side */}
          <motion.button
            onClick={() => handleSwitch("designer")}
            onMouseEnter={() => setHoveredSide("designer")}
            onMouseLeave={() => setHoveredSide(null)}
            className="relative px-6 py-3 rounded-r-2xl transition-motion-blur-fast overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isTransitioning}
          >
            {/* Active indicator */}
            <motion.div
              className="absolute inset-0 bg-rose-400/10 rounded-r-2xl"
              animate={{
                opacity: currentMode === "designer" ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-rose-400/5 rounded-r-2xl"
              animate={{
                opacity: hoveredSide === "designer" ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            />

            <div className="relative z-10 flex items-center space-x-2">
              {/* Status indicator */}
              <motion.div
                className={`w-2 h-2 rounded-full transition-motion-blur-fast ${
                  currentMode === "designer" ? "bg-rose-400" : "bg-gray-400/30"
                }`}
                animate={{
                  scale: currentMode === "designer" ? 1 : 0.7,
                  boxShadow: currentMode === "designer" 
                    ? "0 0 8px rgba(244, 63, 94, 0.5)" 
                    : "none",
                }}
              />
              
              <motion.span 
                className={`text-lg font-designer transition-motion-blur-fast ${
                  currentMode === "designer" 
                    ? "text-rose-400" 
                    : hoveredSide === "designer"
                    ? "text-rose-300"
                    : "text-gray-500"
                }`}
                animate={{
                  textShadow: currentMode === "designer" 
                    ? "0 0 10px rgba(244, 63, 94, 0.3)" 
                    : "none",
                }}
              >
                Art
              </motion.span>
            </div>
          </motion.button>
        </div>

        {/* Transition loading indicator */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl"
            >
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard shortcut hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredSide ? 1 : 0 }}
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
      >
        <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-gray-300 border border-white/10">
          Press ⌘+D to switch
        </div>
      </motion.div>
    </motion.div>
  )
} 