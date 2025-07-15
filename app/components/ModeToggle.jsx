"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useMode } from "./PortfolioWrapper"

export default function ModeToggle() {
  const { mode, handleSwitch } = useMode()
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    handleSwitch()
    setTimeout(() => setIsClicked(false), 600)
  }

  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", damping: 20 }}
    >
      {/* Floating Orb Container */}
      <motion.div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Outer Ring */}
        <motion.div
          className={`absolute inset-0 rounded-full border-2 ${
            mode === "developer"
              ? "border-green-400/30"
              : "border-rose-400/30"
          }`}
          animate={{
            scale: isHovered ? 1.3 : 1.1,
            opacity: isHovered ? 0.8 : 0.4,
            rotate: mode === "developer" ? 360 : -360,
          }}
          transition={{
            scale: { duration: 0.3 },
            opacity: { duration: 0.3 },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
          style={{ width: "80px", height: "80px" }}
        />

        {/* Middle Ring */}
        <motion.div
          className={`absolute inset-0 rounded-full border ${
            mode === "developer"
              ? "border-green-400/50"
              : "border-rose-400/50"
          }`}
          animate={{
            scale: isHovered ? 1.2 : 1.05,
            opacity: isHovered ? 0.6 : 0.3,
            rotate: mode === "developer" ? -360 : 360,
          }}
          transition={{
            scale: { duration: 0.3 },
            opacity: { duration: 0.3 },
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          }}
          style={{ width: "80px", height: "80px" }}
        />

        {/* Main Button */}
        <motion.button
          onClick={handleClick}
          className={`relative w-20 h-20 rounded-full backdrop-blur-md shadow-2xl transition-all duration-300 overflow-hidden ${
            mode === "developer"
              ? "bg-black/80 border border-green-400/30"
              : "bg-white/80 border border-rose-400/30"
          }`}
          animate={{
            boxShadow: isHovered
              ? mode === "developer"
                ? "0 0 30px rgba(34, 197, 94, 0.3)"
                : "0 0 30px rgba(244, 63, 94, 0.3)"
              : "0 10px 30px rgba(0, 0, 0, 0.3)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Background Pattern */}
          <motion.div
            className={`absolute inset-0 opacity-10 ${
              mode === "developer"
                ? "bg-green-400"
                : "bg-gradient-to-br from-rose-400 to-pink-400"
            }`}
            animate={{
              scale: isClicked ? [1, 1.5, 1] : 1,
              opacity: isClicked ? [0.1, 0.3, 0.1] : 0.1,
            }}
            transition={{ duration: 0.6 }}
          />

          {/* Icon Container */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 15, 
                  stiffness: 300,
                  duration: 0.4 
                }}
                className="text-2xl mb-1"
              >
                {mode === "developer" ? "💻" : "🎨"}
              </motion.div>
            </AnimatePresence>

            {/* Mode Label */}
            <motion.div
              className={`text-xs font-bold tracking-wider ${
                mode === "developer" ? "text-green-400" : "text-rose-600"
              }`}
              animate={{
                opacity: isHovered ? 1 : 0.7,
                y: isHovered ? 0 : 2,
              }}
              transition={{ duration: 0.2 }}
            >
              {mode === "developer" ? "DEV" : "ART"}
            </motion.div>
          </div>

          {/* Pulse Effect on Click */}
          <AnimatePresence>
            {isClicked && (
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  mode === "developer"
                    ? "bg-green-400"
                    : "bg-rose-400"
                }`}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Floating Particles */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full ${
                    mode === "developer" ? "bg-green-400" : "bg-rose-400"
                  }`}
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 6) * 50,
                    y: Math.sin((i * Math.PI * 2) / 6) * 50,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: -10, y: 10 }}
            exit={{ opacity: 0, x: 20, y: 10 }}
            className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3"
          >
            <div
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap backdrop-blur-md shadow-lg ${
                mode === "developer"
                  ? "bg-black/80 text-green-400 border border-green-400/30"
                  : "bg-white/80 text-rose-600 border border-rose-400/30"
              }`}
            >
              Switch to {mode === "developer" ? "Designer" : "Developer"}
              <div className="text-xs opacity-60 mt-1">⌘+D</div>
            </div>
            {/* Arrow */}
            <div
              className={`absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 w-0 h-0 border-l-8 border-y-4 border-y-transparent ${
                mode === "developer"
                  ? "border-l-green-400/30"
                  : "border-l-rose-400/30"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
