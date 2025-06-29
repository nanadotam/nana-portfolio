"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function SkillsTerminal() {
  const [currentCommand, setCurrentCommand] = useState(0)
  const commands = [
    { cmd: "docker --version", output: "Docker version 24.0.7, build afdd53b" },
    { cmd: "kubectl version --client", output: "Client Version: v1.28.4" },
    { cmd: "terraform --version", output: "Terraform v1.6.6" },
    { cmd: "aws --version", output: "aws-cli/2.15.17 Python/3.11.6" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCommand((prev) => (prev + 1) % commands.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [commands.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="mb-16"
    >
      <h3 className="text-2xl font-mono mb-8 text-green-300">{"// Skills & Tools"}</h3>
      <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-6 font-mono backdrop-blur-sm">
        <div className="mb-4">
          <span className="text-green-500">nana@devops</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$ </span>
          <motion.span
            key={currentCommand}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400"
          >
            {commands[currentCommand].cmd}
          </motion.span>
        </div>
        <motion.div
          key={`output-${currentCommand}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-300/80 mb-4"
        >
          {commands[currentCommand].output}
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {["Kubernetes", "Docker", "AWS", "Terraform", "Jenkins", "Prometheus", "Grafana", "Python"].map(
            (skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="bg-green-400/10 border border-green-400/30 rounded px-3 py-2 text-center text-sm text-green-400 hover:bg-green-400/20 transition-colors"
              >
                {skill}
              </motion.div>
            ),
          )}
        </div>
      </div>
    </motion.div>
  )
}
