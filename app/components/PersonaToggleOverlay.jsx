"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { AnimatedPersonaSection } from "./AnimatedPersonaSection"

export default function PersonaToggleOverlay({ onSelect }) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [hoveredSide, setHoveredSide] = useState(null)
  const [selectedSide, setSelectedSide] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedSide) return // Prevent multiple selections

      switch (e.key.toLowerCase()) {
        case 'd':
          e.preventDefault()
          handleSelection("developer")
          break
        case 'g':
          e.preventDefault()
          handleSelection("designer")
          break
        case 'enter':
          e.preventDefault()
          handleSelection("developer") // Default to developer
          break
        case 'escape':
          e.preventDefault()
          handleSelection("developer") // Escape defaults to developer
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedSide])

  const handleSelection = (persona) => {
    setSelectedSide(persona)
    
    // Save preference
    localStorage.setItem("preferredView", persona)
    localStorage.setItem("hasSeenPersonaToggle", "true")
    
    // Fast transition with motion blur
    setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        router.push(`/${persona}`)
        onSelect && onSelect(persona)
      }, 300) // Faster transition
    }, 200) // Faster response
  }

  const overlayVariants = {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { 
      opacity: 0,
      filter: "blur(20px)",
      scale: selectedSide === "developer" ? 0.8 : 1.2,
      x: selectedSide === "developer" ? "-100vw" : "100vw",
      transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] }
    }
  }

  const pillVariants = {
    initial: { y: 50, opacity: 0, scale: 0.9, filter: "blur(5px)" },
    animate: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        damping: 30, 
        stiffness: 400,
        delay: 0.1 
      }
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-[9999] transition-motion-blur-fast"
      >
        <AnimatedPersonaSection 
          hoveredPersona={hoveredSide}
          selectedPersona={selectedSide}
        >
          {/* Main Content */}
          <div className="relative text-center w-full max-w-6xl mx-auto">
            {/* Enhanced Mobile Responsive Container */}
            <div className="px-4 sm:px-6 md:px-8 lg:px-12">
              
              {/* Welcome Text */}
              <motion.div
                initial={{ opacity: 0, y: -30, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-8 sm:mb-12 md:mb-16"
              >
                <motion.h1 
                  className={`font-bold mb-2 sm:mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent italic tracking-tight leading-tight ${
                    isMobile 
                      ? "text-3xl sm:text-4xl" 
                      : "text-5xl md:text-7xl lg:text-9xl"
                  }`}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    lineHeight: isMobile ? "1.1" : "1.2"
                  }}
                >
                  I build cool stuff for a living.
                </motion.h1>
                
                <motion.h2
                  className={`font-semibold text-gray-200 ${
                    isMobile 
                      ? "text-lg sm:text-xl" 
                      : "text-2xl md:text-3xl"
                  }`}
                  initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  Take a look around
                </motion.h2>
              </motion.div>

              {/* Enhanced Mobile-Responsive Persona Toggle Pill */}
              <motion.div
                variants={pillVariants}
                initial="initial"
                animate="animate"
                className="relative mx-auto"
                style={{
                  maxWidth: isMobile ? "100%" : "64rem"
                }}
              >
                <div className={`relative bg-black/10 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-2xl ${
                  isMobile ? "p-1" : "p-2"
                }`}>
                  {/* Dynamic Divider */}
                  <motion.div
                    className={`absolute top-2 bottom-2 w-px transform -translate-x-1/2 z-10 ${
                      isMobile ? "left-1/2" : "left-1/2"
                    }`}
                    animate={{
                      background: hoveredSide === "developer" 
                        ? "linear-gradient(to bottom, transparent, #22c55e, transparent)"
                        : hoveredSide === "designer"
                        ? "linear-gradient(to bottom, transparent, #f43f5e, transparent)"
                        : "linear-gradient(to bottom, transparent, #404040, transparent)",
                      opacity: hoveredSide ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.2 }}
                  />

                  <div className={`flex ${isMobile ? "flex-col" : "flex-row"}`}>
                    {/* Developer Side */}
                    <motion.button
                      onClick={() => handleSelection("developer")}
                      onMouseEnter={() => setHoveredSide("developer")}
                      onMouseLeave={() => setHoveredSide(null)}
                      className={`flex-1 relative group overflow-hidden transition-motion-blur-fast ${
                        isMobile 
                          ? "p-6 sm:p-8 rounded-t-2xl" 
                          : "p-12 md:p-16 rounded-l-2xl"
                      }`}
                      whileHover={{ scale: isMobile ? 1.02 : 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      animate={selectedSide === "developer" ? { scale: 1.02 } : { scale: 1 }}
                    >
                      {/* Background Effect */}
                      <motion.div
                        className={`absolute inset-0 ${
                          isMobile 
                            ? "bg-gradient-to-b from-green-900/10 to-transparent" 
                            : "bg-gradient-to-r from-green-900/10 to-transparent"
                        }`}
                        animate={{
                          opacity: hoveredSide === "developer" ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      />

                      <div className="relative z-10">
                        <motion.h2 
                          className={`font-developer text-green-400 mb-2 sm:mb-4 ${
                            isMobile 
                              ? "text-2xl sm:text-3xl" 
                              : "text-4xl md:text-6xl"
                          }`}
                          animate={{
                            textShadow: hoveredSide === "developer" 
                              ? "0 0 20px rgba(34, 197, 94, 0.5)" 
                              : "none",
                            scale: hoveredSide === "developer" ? (isMobile ? 1.03 : 1.05) : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          DEVELOPER
                        </motion.h2>
                        <motion.p 
                          className={`text-green-300/70 font-developer tracking-wider ${
                            isMobile 
                              ? "text-xs sm:text-sm" 
                              : "text-sm md:text-lg"
                          }`}
                          animate={{ 
                            opacity: hoveredSide === "developer" ? 1 : 0.7,
                          }}
                        >
                          Programs that solve problems
                        </motion.p>
                      </div>

                      {/* Hover Effect */}
                      <motion.div
                        className={`absolute inset-0 bg-green-400/5 ${
                          isMobile ? "rounded-t-2xl" : "rounded-l-2xl"
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: hoveredSide === "developer" ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      />

                      {/* Mobile Enhancement: Pulse Effect */}
                      {isMobile && hoveredSide === "developer" && (
                        <motion.div
                          className="absolute inset-0 border-2 border-green-400/30 rounded-t-2xl"
                          animate={{
                            scale: [1, 1.02, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </motion.button>

                    {/* Mobile Divider */}
                    {isMobile && (
                      <motion.div
                        className="mx-2 h-px"
                        animate={{
                          background: hoveredSide === "developer" 
                            ? "linear-gradient(to right, transparent, #22c55e, transparent)"
                            : hoveredSide === "designer"
                            ? "linear-gradient(to right, transparent, #f43f5e, transparent)"
                            : "linear-gradient(to right, transparent, #404040, transparent)",
                          opacity: hoveredSide ? 1 : 0.3,
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    {/* Designer Side */}
                    <motion.button
                      onClick={() => handleSelection("designer")}
                      onMouseEnter={() => setHoveredSide("designer")}
                      onMouseLeave={() => setHoveredSide(null)}
                      className={`flex-1 relative group overflow-hidden transition-motion-blur-fast ${
                        isMobile 
                          ? "p-6 sm:p-8 rounded-b-2xl" 
                          : "p-12 md:p-16 rounded-r-2xl"
                      }`}
                      whileHover={{ scale: isMobile ? 1.02 : 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      animate={selectedSide === "designer" ? { scale: 1.02 } : { scale: 1 }}
                    >
                      {/* Background Effect */}
                      <motion.div
                        className={`absolute inset-0 ${
                          isMobile 
                            ? "bg-gradient-to-t from-rose-900/10 to-transparent" 
                            : "bg-gradient-to-l from-rose-900/10 to-transparent"
                        }`}
                        animate={{
                          opacity: hoveredSide === "designer" ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      />

                      <div className="relative z-10">
                        <motion.h2 
                          className={`font-designer text-rose-400 mb-2 sm:mb-4 ${
                            isMobile 
                              ? "text-2xl sm:text-3xl" 
                              : "text-4xl md:text-6xl"
                          }`}
                          animate={{
                            textShadow: hoveredSide === "designer" 
                              ? "0 0 20px rgba(244, 63, 94, 0.5)" 
                              : "none",
                            scale: hoveredSide === "designer" ? (isMobile ? 1.03 : 1.05) : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          Designer
                        </motion.h2>
                        <motion.p 
                          className={`text-rose-300/70 font-designer-alt tracking-wider ${
                            isMobile 
                              ? "text-xs sm:text-sm" 
                              : "text-sm md:text-lg"
                          }`}
                          animate={{ 
                            opacity: hoveredSide === "designer" ? 1 : 0.7,
                          }}
                        >
                          Creativity that speaks
                        </motion.p>
                      </div>

                      {/* Hover Effect */}
                      <motion.div
                        className={`absolute inset-0 bg-rose-400/5 ${
                          isMobile ? "rounded-b-2xl" : "rounded-r-2xl"
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: hoveredSide === "designer" ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      />

                      {/* Mobile Enhancement: Pulse Effect */}
                      {isMobile && hoveredSide === "designer" && (
                        <motion.div
                          className="absolute inset-0 border-2 border-rose-400/30 rounded-b-2xl"
                          animate={{
                            scale: [1, 1.02, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Selection Feedback */}
              <AnimatePresence>
                {selectedSide && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    className="mt-6 sm:mt-8"
                    transition={{ duration: 0.2 }}
                  >
                    <motion.p 
                      className={`font-bold transition-motion-blur-fast ${
                        isMobile ? "text-lg sm:text-xl" : "text-xl"
                      } ${
                        selectedSide === "developer" ? "text-green-400 font-developer" : "text-rose-400 font-designer"
                      }`}
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    >
                      {selectedSide === "developer" 
                        ? "ENTERING DEVELOPER MODE..." 
                        : "Entering Designer Mode..."
                      }
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Responsive Keyboard Shortcuts */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`${isMobile ? "mt-8" : "mt-12"}`}
              >
                <div className={`text-center text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`}>
                  <p>
                    Press <kbd className="px-2 py-1 bg-gray-800/50 rounded text-xs">D</kbd> for Developer or{" "}
                    <kbd className="px-2 py-1 bg-gray-800/50 rounded text-xs">G</kbd> for Designer
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedPersonaSection>
      </motion.div>
    </AnimatePresence>
  )
} 