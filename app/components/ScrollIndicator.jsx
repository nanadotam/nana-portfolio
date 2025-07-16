"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false)
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    // Show indicator after a delay on initial load
    const showTimer = setTimeout(() => {
      if (isAtTop && !hasInitiallyScrolled) {
        setIsVisible(true)
      }
    }, 2000)

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const isCurrentlyAtTop = scrollTop < 50
      
      setIsAtTop(isCurrentlyAtTop)
      
      // Mark as having scrolled if user scrolls down significantly
      if (scrollTop > 150 && !hasInitiallyScrolled) {
        setHasInitiallyScrolled(true)
        setIsVisible(false)
      }
      
      // Show again if user scrolls back to top after having scrolled
      if (isCurrentlyAtTop && hasInitiallyScrolled) {
        // Give a moment delay before showing again
        setTimeout(() => {
          if (window.pageYOffset < 50) { // Double check they're still at top
            setIsVisible(true)
          }
        }, 500)
      }
      
      // Hide when scrolling down from top
      if (!isCurrentlyAtTop) {
        setIsVisible(false)
      }
    }

    // Auto-hide after 6 seconds if user hasn't scrolled
    const autoHideTimer = setTimeout(() => {
      if (!hasInitiallyScrolled && isAtTop) {
        setIsVisible(false)
      }
    }, 6000)

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(showTimer)
      clearTimeout(autoHideTimer)
    }
  }, [hasInitiallyScrolled, isAtTop])

  const handleScrollDown = () => {
    setIsVisible(false) // Hide immediately when clicked
    window.scrollTo({
      top: window.innerHeight * 0.8, // Scroll to 80% of viewport height
      behavior: 'smooth'
    })
    setHasInitiallyScrolled(true)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 400,
            duration: 0.6 
          }}
          className="fixed inset-0 z-25 flex items-end justify-center pb-32 pointer-events-none"
          style={{
            // Ensure it's positioned above persona toggle but below modals
            zIndex: 25
          }}
        >
          <motion.button
            onClick={handleScrollDown}
            className="flex flex-col items-center space-y-3 group cursor-pointer bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 pointer-events-auto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
            }}
          >
            {/* Scroll text */}
            <motion.span
              className="text-green-400/90 text-xs font-mono tracking-widest uppercase"
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              SCROLL
            </motion.span>

            {/* Bouncing arrow container */}
            <div className="relative flex flex-col items-center">
              {/* Main bouncing arrow */}
              <motion.div
                className="relative"
                animate={{
                  y: [0, 6, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown 
                  className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors drop-shadow-lg" 
                  strokeWidth={2.5}
                />
                
                {/* Enhanced glow effect */}
                <motion.div
                  className="absolute inset-0 w-5 h-5"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(34, 197, 94, 0)",
                      "0 0 12px rgba(34, 197, 94, 0.4)",
                      "0 0 0px rgba(34, 197, 94, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Secondary arrow for emphasis */}
              <motion.div
                className="absolute top-3"
                animate={{
                  y: [0, 6, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              >
                <ChevronDown 
                  className="w-4 h-4 text-green-400/60" 
                  strokeWidth={2}
                />
              </motion.div>
            </div>

            {/* Subtle hint text */}
            <motion.span
              className="text-xs text-green-400/60 font-mono mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              Explore
            </motion.span>
          </motion.button>

          {/* Subtle pulsing indicator dot */}
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-2 h-2 bg-green-400/60 rounded-full"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 