"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export default function PersonaToggleOverlay({ onSelect }) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [hoveredSide, setHoveredSide] = useState(null)
  const [selectedSide, setSelectedSide] = useState(null)
  const [particles, setParticles] = useState([])

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 4,
        })
      }
      setParticles(newParticles)
    }
    generateParticles()
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
    
    // Animate out and navigate
    setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        router.push(`/${persona}`)
        onSelect && onSelect(persona)
      }, 800)
    }, 600)
  }

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { 
      opacity: 0,
      scale: selectedSide === "developer" ? [1, 0.8] : [1, 1.2],
      x: selectedSide === "developer" ? "-100vw" : "100vw",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  }

  const pillVariants = {
    initial: { y: 100, opacity: 0, scale: 0.8 },
    animate: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300,
        delay: 0.3 
      }
    }
  }

  const sideVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    selected: {
      scale: 1.1,
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
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
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{
          background: selectedSide === "developer" 
            ? "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)"
            : selectedSide === "designer"
            ? "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)"
            : "linear-gradient(135deg, #000000 0%, #1a1a1a 30%, #fdf2f8 70%, #fce7f3 100%)"
        }}
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={`absolute w-1 h-1 rounded-full ${
                hoveredSide === "developer" 
                  ? "bg-green-400/30" 
                  : hoveredSide === "designer"
                  ? "bg-rose-400/30"
                  : "bg-white/20"
              }`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Matrix Rain Effect for Developer Side */}
        {hoveredSide === "developer" && (
          <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-green-400/20 font-mono text-sm"
                style={{ 
                  left: `${(i * 5) % 50}%`,
                  top: "-10%"
                }}
                animate={{
                  y: ["0vh", "110vh"],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              >
                {Math.random() > 0.5 ? "01" : "10"}
              </motion.div>
            ))}
          </div>
        )}

        {/* Flowing Shapes for Designer Side */}
        {hoveredSide === "designer" && (
          <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  right: `${(i * 15) % 50}%`,
                  top: `${(i * 20) % 80}%`,
                  width: `${20 + Math.random() * 30}px`,
                  height: `${20 + Math.random() * 30}px`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.5, 1],
                  x: [0, 50, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-sm" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 text-center px-8">
          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-12"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Choose Your Path
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Explore two sides of creativity and innovation
            </motion.p>
          </motion.div>

          {/* Persona Toggle Pill */}
          <motion.div
            variants={pillVariants}
            initial="initial"
            animate="animate"
            className="relative mx-auto"
            style={{ maxWidth: "min(90vw, 800px)" }}
          >
            <div className="relative bg-black/20 backdrop-blur-xl rounded-full p-3 border border-white/10 shadow-2xl">
              {/* Glowing Divider */}
              <motion.div
                className="absolute left-1/2 top-3 bottom-3 w-px transform -translate-x-1/2"
                animate={{
                  background: hoveredSide === "developer" 
                    ? "linear-gradient(to bottom, transparent, #22c55e, transparent)"
                    : hoveredSide === "designer"
                    ? "linear-gradient(to bottom, transparent, #f43f5e, transparent)"
                    : "linear-gradient(to bottom, transparent, #ffffff, transparent)",
                  boxShadow: hoveredSide 
                    ? `0 0 20px ${hoveredSide === "developer" ? "#22c55e" : "#f43f5e"}`
                    : "0 0 10px #ffffff",
                }}
                transition={{ duration: 0.3 }}
              />

              <div className="flex">
                {/* Developer Side */}
                <motion.button
                  variants={sideVariants}
                  initial="initial"
                  whileHover="hover"
                  animate={selectedSide === "developer" ? "selected" : "initial"}
                  onClick={() => handleSelection("developer")}
                  onMouseEnter={() => setHoveredSide("developer")}
                  onMouseLeave={() => setHoveredSide(null)}
                  className="flex-1 relative group p-8 md:p-12 rounded-l-full overflow-hidden"
                >
                  {/* Developer Background Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-black/20"
                    animate={{
                      opacity: hoveredSide === "developer" ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Grid Pattern */}
                  <motion.div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: "20px 20px",
                    }}
                    animate={{
                      opacity: hoveredSide === "developer" ? 0.3 : 0,
                    }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      className="text-6xl md:text-8xl mb-4"
                      animate={{
                        scale: hoveredSide === "developer" ? 1.1 : 1,
                        rotate: hoveredSide === "developer" ? [0, -5, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      💻
                    </motion.div>
                    <motion.h2 
                      className="text-2xl md:text-4xl font-mono font-bold text-green-400 mb-2"
                      animate={{
                        textShadow: hoveredSide === "developer" 
                          ? "0 0 20px #22c55e" 
                          : "none",
                      }}
                    >
                      DEVELOPER
                    </motion.h2>
                    <motion.p 
                      className="text-sm md:text-lg text-green-300/80"
                      initial={{ opacity: 0.6 }}
                      animate={{ 
                        opacity: hoveredSide === "developer" ? 1 : 0.6,
                      }}
                    >
                      Code • Build • Deploy
                    </motion.p>
                  </div>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-green-400/5 rounded-l-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: hoveredSide === "developer" ? 1 : 0,
                      scale: hoveredSide === "developer" ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                {/* Designer Side */}
                <motion.button
                  variants={sideVariants}
                  initial="initial"
                  whileHover="hover"
                  animate={selectedSide === "designer" ? "selected" : "initial"}
                  onClick={() => handleSelection("designer")}
                  onMouseEnter={() => setHoveredSide("designer")}
                  onMouseLeave={() => setHoveredSide(null)}
                  className="flex-1 relative group p-8 md:p-12 rounded-r-full overflow-hidden"
                >
                  {/* Designer Background Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-l from-rose-900/20 to-pink-900/20"
                    animate={{
                      opacity: hoveredSide === "designer" ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      className="text-6xl md:text-8xl mb-4"
                      animate={{
                        scale: hoveredSide === "designer" ? 1.1 : 1,
                        rotate: hoveredSide === "designer" ? [0, 5, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      🎨
                    </motion.div>
                    <motion.h2 
                      className="text-2xl md:text-4xl font-serif font-bold text-rose-400 mb-2"
                      animate={{
                        textShadow: hoveredSide === "designer" 
                          ? "0 0 20px #f43f5e" 
                          : "none",
                      }}
                    >
                      DESIGNER
                    </motion.h2>
                    <motion.p 
                      className="text-sm md:text-lg text-rose-300/80"
                      initial={{ opacity: 0.6 }}
                      animate={{ 
                        opacity: hoveredSide === "designer" ? 1 : 0.6,
                      }}
                    >
                      Create • Design • Inspire
                    </motion.p>
                  </div>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-rose-400/5 rounded-r-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: hoveredSide === "designer" ? 1 : 0,
                      scale: hoveredSide === "designer" ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Selection Feedback */}
          <AnimatePresence>
            {selectedSide && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                <motion.p 
                  className={`text-2xl font-bold ${
                    selectedSide === "developer" ? "text-green-400" : "text-rose-400"
                  }`}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  {selectedSide === "developer" 
                    ? "Entering Developer Mode..." 
                    : "Entering Designer Mode..."
                  }
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip Option */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-8"
          >
            <button
              onClick={() => handleSelection("developer")}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              or press Enter to continue as Developer
            </button>
          </motion.div>
        </div>

        {/* Keyboard Shortcut Listener */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-center text-gray-500 text-sm">
            <p>Press <kbd className="px-2 py-1 bg-gray-800 rounded">D</kbd> for Developer or <kbd className="px-2 py-1 bg-gray-800 rounded">G</kbd> for Designer</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 