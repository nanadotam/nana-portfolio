"use client"

import { motion } from "framer-motion"

export default function TerminalHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/80 border-b border-green-400/30 p-4 font-mono backdrop-blur-sm"
    >
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-green-400 text-sm">
          <span className="text-green-500">nana@portfolio</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~/dev-portfolio</span>
          <span className="text-white">$ </span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            className="bg-green-400 text-black px-1"
          >
            _
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}
