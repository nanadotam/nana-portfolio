"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useMode } from "../page"

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const audioRef = useRef(null)
  const { mode } = useMode()

  useEffect(() => {
    // In a real implementation, you would have different audio files for each mode
    // For now, we'll just simulate the functionality
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume, mode])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className={`fixed bottom-6 left-6 z-50 p-4 rounded-2xl backdrop-blur-md ${
        mode === "developer" ? "bg-black/80 border border-green-400/30" : "bg-white/80 border border-rose-200"
      }`}
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            mode === "developer"
              ? "bg-green-400/20 text-green-400 hover:bg-green-400/30"
              : "bg-rose-100 text-rose-600 hover:bg-rose-200"
          }`}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        <div className="flex flex-col">
          <div className={`text-xs font-medium ${mode === "developer" ? "text-green-400" : "text-rose-600"}`}>
            {mode === "developer" ? "Cyberpunk Ambient" : "Lo-Fi Chill"}
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
            className={`w-20 h-1 rounded-full appearance-none ${
              mode === "developer" ? "bg-green-400/30" : "bg-rose-200"
            }`}
          />
        </div>
      </div>

      {/* Hidden audio element - in production, you'd have actual audio files */}
      <audio ref={audioRef} loop preload="none">
        <source src="/placeholder-audio.mp3" type="audio/mpeg" />
      </audio>
    </motion.div>
  )
}
