"use client"

import { motion } from "framer-motion"

export default function ProjectGrid({ projects }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mb-16"
    >
      <h3 className="text-2xl font-mono mb-8 text-green-300">{"// Active Projects"}</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            className="bg-gray-900/50 border border-green-400/30 rounded-lg p-6 hover:border-green-400/60 transition-all duration-300 backdrop-blur-sm group"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-mono text-green-300 group-hover:text-green-200">{project.title}</h4>
              <span
                className={`px-2 py-1 text-xs font-mono rounded ${
                  project.status === "ACTIVE"
                    ? "bg-green-400/20 text-green-400"
                    : project.status === "DEPLOYED"
                      ? "bg-blue-400/20 text-blue-400"
                      : project.status === "MONITORING"
                        ? "bg-yellow-400/20 text-yellow-400"
                        : "bg-gray-400/20 text-gray-400"
                }`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-green-400/80 mb-4 text-sm">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-2 py-1 bg-green-400/10 text-green-400 text-xs font-mono rounded border border-green-400/20"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="text-xs text-green-500/60 font-mono">
              Lines of code: <span className="text-green-400">{project.lines}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
