"use client"

import { motion } from "framer-motion"
import { useMode } from "./PortfolioWrapper"

export default function ModeToggle() {
  const { mode, handleSwitch } = useMode()

  return (
    <motion.button
      onClick={handleSwitch}
      className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm transition-all duration-300 backdrop-blur-md ${
        mode === "developer"
          ? "bg-black/80 text-green-400 border border-green-400/30 hover:bg-green-400/10"
          : "bg-white/80 text-rose-600 border border-rose-200 hover:bg-rose-50/50"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.span
        key={mode}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.3 }}
      >
        {mode === "developer" ? "Switch to Designer 🎨" : "Enter Dev Mode 💻"}
      </motion.span>
    </motion.button>
  )
}
