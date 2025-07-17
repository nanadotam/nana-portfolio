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
  const [isMobile, setIsMobile] = useState(false)

  // Designer color constants (dark blue theme)
  const DESIGNER_MAIN = "#0E0C90"
  const DESIGNER_MAIN_RGB = "14, 12, 144"
  const DESIGNER_GRADIENT = `linear-gradient(90deg, rgba(34, 197, 94, 0.15), rgba(${DESIGNER_MAIN_RGB}, 0.15))`
  const DESIGNER_BG = (alpha) => `rgba(${DESIGNER_MAIN_RGB}, ${alpha})`
  const DESIGNER_GLOW = (alpha) => `0 0 30px rgba(${DESIGNER_MAIN_RGB}, ${alpha})`
  const DESIGNER_SHADOW = (alpha) => `0 0 12px rgba(${DESIGNER_MAIN_RGB}, ${alpha})`
  const DESIGNER_DIVIDER = `linear-gradient(to bottom, transparent, ${DESIGNER_MAIN}, transparent)`
  const DESIGNER_HOVER_BG = `rgba(${DESIGNER_MAIN_RGB}, 0.2)`
  const DESIGNER_STATUS_BG = DESIGNER_MAIN
  const DESIGNER_STATUS_BG_INACTIVE = "rgba(156, 163, 175, 0.3)"
  const DESIGNER_TEXT = DESIGNER_MAIN
  const DESIGNER_TEXT_HOVER = "#0D0952"
  const DESIGNER_TEXT_INACTIVE = "#6B7280"
  const DESIGNER_TEXT_SHADOW = (alpha) => `0 0 15px rgba(${DESIGNER_MAIN_RGB}, ${alpha})`
  const DESIGNER_TEXT_SHADOW_SMALL = (alpha) => `0 0 10px rgba(${DESIGNER_MAIN_RGB}, ${alpha})`
  const DESIGNER_ALT = "#0A087D"

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      
      // Expand the toggle when at bottom or when hovered (but not on mobile for hover)
      setIsExpanded(isNearBottom || (!isMobile && hoveredSide !== null))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hoveredSide, isMobile])

  // Mobile-specific sizing and scaling configuration
  const getMobileConfig = () => {
    if (isMobile) {
      return {
        // Mobile: much smaller scale factors to fit viewport
        scaleAtBottom: 1.6, // Instead of 2.8
        scaleOnHover: 1.1,  // Instead of 1.4
        scaleDefault: 1,
        // Mobile: smaller base width with proper margins
        minWidth: "280px",  // Instead of 340px
        minHeight: "56px",  // Instead of 64px
        // Mobile: adjusted positioning
        bottomOffset: "16px", // Instead of 24px (6 * 4px = 24px)
        yOffsetAtBottom: -80, // Instead of -125
        // Mobile: smaller padding
        paddingExpanded: "8px 16px", // Instead of 12px 24px
        paddingDefault: "6px 12px",  // Instead of 8px 16px
        // Mobile: smaller font sizes
        fontSizeExpanded: "16px", // Instead of 20px
        fontSizeDefault: "14px",  // Instead of 18px
        // Mobile: smaller status indicators
        statusSizeExpanded: "8px", // Instead of 10px
        statusSizeDefault: "6px",  // Instead of 8px
        // Mobile: smaller inner padding
        innerPaddingExpanded: "20px", // Instead of 32px
        innerPaddingDefault: "16px",  // Instead of 24px
        innerPaddingVerticalExpanded: "12px", // Instead of 16px
        innerPaddingVerticalDefault: "8px",   // Instead of 12px
      }
    } else {
      return {
        // Desktop: original values
        scaleAtBottom: 2.8,
        scaleOnHover: 1.4,
        scaleDefault: 1,
        minWidth: "340px",
        minHeight: "64px",
        bottomOffset: "24px",
        yOffsetAtBottom: -125,
        paddingExpanded: "12px 24px",
        paddingDefault: "8px 16px",
        fontSizeExpanded: "20px",
        fontSizeDefault: "18px",
        statusSizeExpanded: "10px",
        statusSizeDefault: "8px",
        innerPaddingExpanded: "32px",
        innerPaddingDefault: "24px",
        innerPaddingVerticalExpanded: "16px",
        innerPaddingVerticalDefault: "12px",
      }
    }
  }

  const config = getMobileConfig()

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

  // Stick the pill to the bottom center of the screen with responsive margins
  return (
    <div 
      className="fixed left-0 right-0 z-40 flex justify-center pointer-events-none"
      style={{ 
        bottom: config.bottomOffset,
        // Add horizontal margins on mobile to prevent overflow
        paddingLeft: isMobile ? "16px" : "0",
        paddingRight: isMobile ? "16px" : "0",
      }}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", damping: 30, stiffness: 400 }}
        className="relative pointer-events-auto"
      >
        <motion.div
          className="relative backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full flex items-center"
          animate={{
            scale: isAtBottom ? config.scaleAtBottom : (hoveredSide ? config.scaleOnHover : config.scaleDefault),
            y: isAtBottom ? config.yOffsetAtBottom : 0,
            background: isExpanded 
              ? "rgba(0, 0, 0, 0.15)" 
              : "rgba(0, 0, 0, 0.05)",
            borderColor: isExpanded 
              ? currentMode === "developer" 
                ? "rgba(34, 197, 94, 0.3)" 
                : `rgba(${DESIGNER_MAIN_RGB}, 0.3)`
              : "rgba(255, 255, 255, 0.1)",
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 400,
            duration: 0.3 
          }}
          onMouseEnter={() => !isMobile && setIsExpanded(true)}
          onMouseLeave={() => !isMobile && setIsExpanded(isAtBottom)}
          style={{
            // Make the pill look more like a bill: wide, not too tall, very rounded
            minWidth: config.minWidth,
            minHeight: config.minHeight,
            padding: isExpanded ? config.paddingExpanded : config.paddingDefault,
            boxShadow: isExpanded
              ? currentMode === "developer"
                ? "0 0 30px rgba(34, 197, 94, 0.2)"
                : DESIGNER_GLOW(0.2)
              : "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Enhanced background transition effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: isTransitioning
                ? DESIGNER_GRADIENT
                : currentMode === "developer"
                ? isExpanded 
                  ? "rgba(34, 197, 94, 0.1)" 
                  : "rgba(34, 197, 94, 0.05)"
                : isExpanded 
                  ? DESIGNER_BG(0.1)
                  : DESIGNER_BG(0.05),
            }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: isExpanded
                ? currentMode === "developer"
                  ? "0 0 30px rgba(34, 197, 94, 0.2)"
                  : DESIGNER_GLOW(0.2)
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
                style={{
                  background: DESIGNER_BG(isExpanded ? 0.3 : 0.15),
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
              onMouseEnter={() => !isMobile && setHoveredSide("developer")}
              onMouseLeave={() => !isMobile && setHoveredSide(null)}
              className="relative rounded-l-full transition-motion-blur-fast overflow-hidden"
              whileHover={{ scale: isMobile ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isTransitioning}
              animate={{
                paddingLeft: isExpanded ? config.innerPaddingExpanded : config.innerPaddingDefault,
                paddingRight: isExpanded ? config.innerPaddingExpanded : config.innerPaddingDefault,
                paddingTop: isExpanded ? config.innerPaddingVerticalExpanded : config.innerPaddingVerticalDefault,
                paddingBottom: isExpanded ? config.innerPaddingVerticalExpanded : config.innerPaddingVerticalDefault,
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
                    fontSize: isExpanded ? config.fontSizeExpanded : config.fontSizeDefault,
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
                    width: isExpanded ? config.statusSizeExpanded : config.statusSizeDefault,
                    height: isExpanded ? config.statusSizeExpanded : config.statusSizeDefault,
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
                  ? DESIGNER_DIVIDER
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
              onMouseEnter={() => !isMobile && setHoveredSide("designer")}
              onMouseLeave={() => !isMobile && setHoveredSide(null)}
              className="relative rounded-r-full transition-motion-blur-fast overflow-hidden"
              whileHover={{ scale: isMobile ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isTransitioning}
              animate={{
                paddingLeft: isExpanded ? config.innerPaddingExpanded : config.innerPaddingDefault,
                paddingRight: isExpanded ? config.innerPaddingExpanded : config.innerPaddingDefault,
                paddingTop: isExpanded ? config.innerPaddingVerticalExpanded : config.innerPaddingVerticalDefault,
                paddingBottom: isExpanded ? config.innerPaddingVerticalExpanded : config.innerPaddingVerticalDefault,
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
                  backgroundColor: currentMode === "designer" ? DESIGNER_BG(0.1) : "transparent",
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
                  backgroundColor: DESIGNER_HOVER_BG,
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
                    backgroundColor: currentMode === "designer" ? DESIGNER_STATUS_BG : DESIGNER_STATUS_BG_INACTIVE,
                  }}
                  animate={{
                    width: isExpanded ? config.statusSizeExpanded : config.statusSizeDefault,
                    height: isExpanded ? config.statusSizeExpanded : config.statusSizeDefault,
                    scale: currentMode === "designer" ? 1 : 0.7,
                    boxShadow: currentMode === "designer" 
                      ? isExpanded 
                        ? DESIGNER_SHADOW(0.6)
                        : DESIGNER_SHADOW(0.5)
                      : "none",
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.span 
                  className="font-designer transition-motion-blur-fast"
                  style={{
                    color: currentMode === "designer" 
                      ? DESIGNER_TEXT
                      : hoveredSide === "designer"
                      ? DESIGNER_TEXT_HOVER
                      : DESIGNER_TEXT_INACTIVE
                  }}
                  animate={{
                    fontSize: isExpanded ? config.fontSizeExpanded : config.fontSizeDefault,
                    textShadow: currentMode === "designer" 
                      ? isExpanded 
                        ? DESIGNER_TEXT_SHADOW(0.4)
                        : DESIGNER_TEXT_SHADOW_SMALL(0.3)
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
                    width: isExpanded ? (isMobile ? "16px" : "20px") : (isMobile ? "12px" : "16px"),
                    height: isExpanded ? (isMobile ? "16px" : "20px") : (isMobile ? "12px" : "16px"),
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
              style={{ bottom: isMobile ? "calc(100% + 40px)" : "calc(100% + 60px)" }}
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