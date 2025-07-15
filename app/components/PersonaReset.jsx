"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function PersonaReset() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = () => {
    setIsResetting(true)
    
    // Clear localStorage
    localStorage.removeItem("hasSeenPersonaToggle")
    localStorage.removeItem("preferredView")
    
    // Navigate back to home with a slight delay for animation
    setTimeout(() => {
      router.push("/")
    }, 800)
  }

  return (
    <motion.button
      onClick={handleReset}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isResetting}
    >
      <motion.div
        className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors border border-gray-700/50 rounded-lg backdrop-blur-sm"
        animate={{
          backgroundColor: isHovered 
            ? "rgba(55, 65, 81, 0.1)" 
            : "rgba(0, 0, 0, 0.1)",
        }}
      >
        <motion.div
          className="flex items-center space-x-2"
          animate={{
            opacity: isResetting ? 0.5 : 1,
          }}
        >
          <motion.span
            animate={{
              rotate: isResetting ? 360 : 0,
            }}
            transition={{
              duration: isResetting ? 1 : 0,
              repeat: isResetting ? Infinity : 0,
              ease: "linear",
            }}
          >
            ↻
          </motion.span>
          <span>
            {isResetting ? "Resetting..." : "Reset Persona Choice"}
          </span>
        </motion.div>
      </motion.div>

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: "-100%" }}
        animate={{
          x: isHovered ? "100%" : "-100%",
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  )
} 