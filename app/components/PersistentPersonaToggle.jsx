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
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Detect current mode from pathname
  useEffect(() => {
    if (pathname.includes("/designer")) {
      setCurrentMode("designer")
    } else if (pathname.includes("/developer")) {
      setCurrentMode("developer")
    }
  }, [pathname])

  // Scroll detection for bottom of page
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      const clientHeight = document.documentElement.clientHeight
      
      // Check if we're within 100px of the bottom
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100
      setIsAtBottom(isNearBottom)
      
      // Expand the toggle when at bottom or when hovered
      setIsExpanded(isNearBottom || hoveredSide !== null)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hoveredSide])

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

  // Stick the pill to the bottom center of the screen
  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", damping: 30, stiffness: 400 }}
        className="relative pointer-events-auto"
      >
        <motion.div
          className="relative backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full min-w-[340px] min-h-[64px] flex items-center"
          animate={{
            scale: isAtBottom ? 2.8 : (hoveredSide ? 1.4 : 1),
            y: isAtBottom ? -125 : 0,
            background: isExpanded 
              ? "rgba(0, 0, 0, 0.15)" 
              : "rgba(0, 0, 0, 0.05)",
            borderColor: isExpanded 
              ? currentMode === "developer" 
                ? "rgba(34, 197, 94, 0.3)" 
                : "rgba(72, 24, 136, 0.3)"
              : "rgba(255, 255, 255, 0.1)",
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 400,
            duration: 0.3 
          }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(isAtBottom)}
          style={{
            // Make the pill look more like a bill: wide, not too tall, very rounded
            padding: isExpanded ? "12px 24px" : "8px 16px",
            boxShadow: isExpanded
              ? currentMode === "developer"
                ? "0 0 30px rgba(34, 197, 94, 0.2)"
                : "0 0 30px rgba(244, 63, 94, 0.2)"
              : "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Enhanced background transition effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
                             background: isTransitioning
                 ? "linear-gradient(90deg, rgba(34, 197, 94, 0.15), rgba(72, 24, 136, 0.15))"
                 : currentMode === "developer"
                 ? isExpanded 
                   ? "rgba(34, 197, 94, 0.1)" 
                   : "rgba(34, 197, 94, 0.05)"
                 : isExpanded 
                   ? "rgba(72, 24, 136, 0.1)" 
                   : "rgba(72, 24, 136, 0.05)",
            }}
            transition={{ duration: 0.3 }}
                         style={{
               boxShadow: isExpanded
                 ? currentMode === "developer"
                   ? "0 0 30px rgba(34, 197, 94, 0.2)"
                   : "0 0 30px rgba(72, 24, 136, 0.2)"
                 : "0 10px 30px rgba(0, 0, 0, 0.1)",
             }}
          />

          {/* Enhanced matrix effect for developer mode */}
          {(currentMode === "developer" || hoveredSide === "developer") && (
            <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden rounded-l-full pointer-events-none">
              <motion.div 
                className="matrix-dots w-full h-full"
                animate={{
                  opacity: isExpanded ? 0.4 : 0.2,
                }}
              />
            </div>
          )}

          {/* Enhanced designer effect */}
          {(currentMode === "designer" || hoveredSide === "designer") && (
            <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden rounded-r-full pointer-events-none">
              <motion.div 
                className="designer-glow w-full h-full"
                animate={{
                  opacity: isExpanded ? 0.3 : 0.15,
                }}
              />
            </div>
          )}

          <motion.div 
            className="flex relative z-10"
            animate={{
              padding: isExpanded ? "8px" : "4px",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Developer Side */}
            <motion.button
              onClick={() => handleSwitch("developer")}
              onMouseEnter={() => setHoveredSide("developer")}
              onMouseLeave={() => setHoveredSide(null)}
              className="relative rounded-l-full transition-motion-blur-fast overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isTransitioning}
              animate={{
                paddingLeft: isExpanded ? "32px" : "24px",
                paddingRight: isExpanded ? "32px" : "24px",
                paddingTop: isExpanded ? "16px" : "12px",
                paddingBottom: isExpanded ? "16px" : "12px",
              }}
              transition={{ duration: 0.3 }}
              style={{
                borderTopLeftRadius: "9999px",
                borderBottomLeftRadius: "9999px",
              }}
            >
              {/* Active indicator */}
              <motion.div
                className="absolute inset-0 bg-green-400/10 rounded-l-full"
                animate={{
                  opacity: currentMode === "developer" ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 bg-green-400/5 rounded-l-full"
                animate={{
                  opacity: hoveredSide === "developer" ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              />

              <div className="relative z-10 flex items-center space-x-3">
                <motion.span 
                  className={`font-developer transition-motion-blur-fast ${
                    currentMode === "developer" 
                      ? "text-green-400" 
                      : hoveredSide === "developer"
                      ? "text-green-300"
                      : "text-gray-500"
                  }`}
                  animate={{
                    fontSize: isExpanded ? "20px" : "18px",
                    textShadow: currentMode === "developer" 
                      ? isExpanded 
                        ? "0 0 15px rgba(34, 197, 94, 0.2)" 
                        : "0 0 10px rgba(34, 197, 94, 0.1)"
                      : "none",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  DEVELOPER
                </motion.span>
                
                {/* Enhanced status indicator */}
                <motion.div
                  className={`rounded-full transition-motion-blur-fast ${
                    currentMode === "developer" ? "bg-green-400" : "bg-gray-400/30"
                  }`}
                  animate={{
                    width: isExpanded ? "10px" : "8px",
                    height: isExpanded ? "10px" : "8px",
                    scale: currentMode === "developer" ? 1 : 0.7,
                    boxShadow: currentMode === "developer" 
                      ? isExpanded 
                        ? "0 0 12px rgba(34, 197, 94, 0.6)" 
                        : "0 0 8px rgba(34, 197, 94, 0.5)"
                      : "none",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.button>

            {/* Enhanced divider */}
            <motion.div
              className="my-2"
              animate={{
                width: "1px",
                background: hoveredSide === "developer" 
                  ? "linear-gradient(to bottom, transparent, #22c55e, transparent)"
                  : hoveredSide === "designer"
                  ? "linear-gradient(to bottom, transparent, #481888, transparent)"
                  : "linear-gradient(to bottom, transparent, #404040, transparent)",
                opacity: isExpanded ? 1 : 0.7,
              }}
              transition={{ duration: 0.2 }}
              style={{
                borderRadius: "9999px",
                marginLeft: "-2px",
                marginRight: "-2px",
              }}
            />

            {/* Designer Side */}
            <motion.button
              onClick={() => handleSwitch("designer")}
              onMouseEnter={() => setHoveredSide("designer")}
              onMouseLeave={() => setHoveredSide(null)}
              className="relative rounded-r-full transition-motion-blur-fast overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isTransitioning}
              animate={{
                paddingLeft: isExpanded ? "32px" : "24px",
                paddingRight: isExpanded ? "32px" : "24px",
                paddingTop: isExpanded ? "16px" : "12px",
                paddingBottom: isExpanded ? "16px" : "12px",
              }}
              transition={{ duration: 0.3 }}
              style={{
                borderTopRightRadius: "9999px",
                borderBottomRightRadius: "9999px",
              }}
            >
              {/* Active indicator */}
              <motion.div
                className="absolute inset-0 rounded-r-full"
                style={{
                  backgroundColor: currentMode === "designer" ? "rgba(72, 24, 136, 0.1)" : "transparent",
                }}
                animate={{
                  opacity: currentMode === "designer" ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 rounded-r-full"
                style={{
                  backgroundColor: "rgba(138, 43, 226, 0.2)",
                }}
                animate={{
                  opacity: hoveredSide === "designer" ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              />

              <div className="relative z-10 flex items-center space-x-3">
                {/* Enhanced status indicator */}
                <motion.div
                  className="rounded-full transition-motion-blur-fast"
                  style={{
                    backgroundColor: currentMode === "designer" ? "#481888" : "rgba(156, 163, 175, 0.3)",
                  }}
                  animate={{
                    width: isExpanded ? "10px" : "8px",
                    height: isExpanded ? "10px" : "8px",
                    scale: currentMode === "designer" ? 1 : 0.7,
                    boxShadow: currentMode === "designer" 
                      ? isExpanded 
                        ? "0 0 12px rgba(72, 24, 136, 0.6)" 
                        : "0 0 8px rgba(72, 24, 136, 0.5)"
                      : "none",
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.span 
                  className="font-designer transition-motion-blur-fast"
                  style={{
                    color: currentMode === "designer" 
                      ? "#481888" 
                      : hoveredSide === "designer"
                      ? "#6B21A8"
                      : "#6B7280"
                  }}
                  animate={{
                    fontSize: isExpanded ? "20px" : "18px",
                    textShadow: currentMode === "designer" 
                      ? isExpanded 
                        ? "0 0 15px rgba(72, 24, 136, 0.4)" 
                        : "0 0 10px rgba(72, 24, 136, 0.3)"
                      : "none",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Designer
                </motion.span>
              </div>
            </motion.button>
          </motion.div>

          {/* Enhanced transition loading indicator */}
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-full"
              >
                <motion.div
                  className="border-2 border-white/30 border-t-white rounded-full"
                  animate={{ 
                    rotate: 360,
                    width: isExpanded ? "20px" : "16px",
                    height: isExpanded ? "20px" : "16px",
                  }}
                  transition={{ 
                    rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                    width: { duration: 0.3 },
                    height: { duration: 0.3 }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      
        {/* Bottom of page indicator */}
        <AnimatePresence>
          {isAtBottom && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{ bottom: "calc(100% + 60px)" }}
            >
              <motion.div
                className="text-center"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
} 