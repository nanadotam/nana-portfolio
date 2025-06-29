"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"

export default function Terminal({ isOpen, onClose, onSwitch }) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState([
    "Welcome to NanaOS Terminal v2.1.0",
    "Type 'help' for available commands",
    "",
  ])
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const commands = {
    help: () => [
      "Available commands:",
      "  help     - Show this help message",
      "  about    - About Nana Amoako",
      "  skills   - List technical skills",
      "  switch   - Toggle between developer/designer mode",
      "  matrix   - Enter the Matrix",
      "  clear    - Clear terminal",
      "  exit     - Close terminal",
      "",
    ],
    about: () => [
      "Nana Amoako - Full Stack Developer & Designer",
      "Location: Ghana",
      "Specialties: DevOps, Cloud Architecture, UI/UX Design",
      "Status: Available for new opportunities",
      "",
    ],
    skills: () => [
      "Technical Skills:",
      "├── DevOps: Kubernetes, Docker, Jenkins, Terraform",
      "├── Cloud: AWS, Azure, GCP",
      "├── Languages: Python, JavaScript, Go, Bash",
      "├── Design: Figma, Adobe Creative Suite",
      "└── Databases: PostgreSQL, MongoDB, Redis",
      "",
    ],
    switch: () => {
      onSwitch()
      return ["Switching modes...", ""]
    },
    matrix: () => ["Wake up, Neo...", "The Matrix has you...", "Follow the white rabbit.", ""],
    clear: () => {
      setHistory([])
      return []
    },
    exit: () => {
      onClose()
      return []
    },
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const command = input.trim().toLowerCase()
    const newHistory = [...history, `$ ${input}`]

    if (commands[command]) {
      const output = commands[command]()
      setHistory([...newHistory, ...output])
    } else if (command === "") {
      setHistory([...newHistory, ""])
    } else {
      setHistory([...newHistory, `Command not found: ${command}`, "Type 'help' for available commands", ""])
    }

    setInput("")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-black border border-green-400/50 rounded-lg w-full max-w-4xl h-96 font-mono text-green-400 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal Header */}
            <div className="bg-gray-900 border-b border-green-400/30 p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm">NanaOS Terminal</div>
              <button onClick={onClose} className="text-green-400 hover:text-green-300">
                ✕
              </button>
            </div>

            {/* Terminal Content */}
            <div className="p-4 h-full overflow-y-auto">
              <div className="space-y-1">
                {history.map((line, index) => (
                  <div key={index} className="text-sm">
                    {line}
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex items-center mt-2">
                <span className="text-green-500 mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-green-400"
                  autoComplete="off"
                />
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="bg-green-400 text-black px-1 ml-1"
                >
                  _
                </motion.span>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
