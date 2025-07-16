"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function ProjectModal({ isOpen, onClose, project}) {
    const pathname = usePathname()
    const isDeveloper = pathname.includes("/developer")
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
            document.documentElement.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
            document.documentElement.style.overflow = ""
        }
    }, [isOpen])
    
    if (!isOpen || !project) return null
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/60"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ 
                        type: "spring", 
                        damping: 30, 
                        stiffness: 400,
                        duration: 0.5 
                    }}
                    className="bg-[#0d0d0d] text-white rounded-2xl w-full max-w-4xl max-h-[90vh] border border-white/10 relative shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        backdropFilter: "blur(20px)",
                        background: isDeveloper 
                            ? "linear-gradient(135deg, #0d0d0d 0%, rgba(34, 197, 94, 0.08) 25%, rgba(99, 102, 241, 0.04) 75%, #0d0d0d 100%)"
                            : "linear-gradient(135deg, #0d0d0d 0%, rgba(138, 43, 226, 0.08) 25%, rgba(244, 63, 94, 0.04) 75%, #0d0d0d 100%)",
                        boxShadow: isDeveloper 
                            ? "0 32px 64px -12px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                            : "0 32px 64px -12px rgba(138, 43, 226, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                    }}
                >
                    {/* Enhanced gradient overlay */}
                    <div 
                        className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
                        style={{
                            background: isDeveloper 
                                ? "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%)"
                                : "linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(244, 63, 94, 0.05) 50%, transparent 100%)",
                            mixBlendMode: "lighten"
                        }}
                    />
                    
                    {/* Status indicator */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", damping: 20 }}
                        className="absolute top-6 left-6 flex items-center gap-2 z-10"
                    >
                        <div 
                            className={`w-2 h-2 rounded-full ${isDeveloper ? 'bg-green-400' : 'bg-purple-400'}`}
                            style={{
                                boxShadow: isDeveloper 
                                    ? "0 0 8px rgba(34, 197, 94, 0.6)"
                                    : "0 0 8px rgba(138, 43, 226, 0.6)"
                            }}
                        />
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                            {isDeveloper ? 'Developer' : 'Designer'}
                        </span>
                    </motion.div>

                    {/* Enhanced close button */}
                    <motion.button
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", damping: 20 }}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300 z-20 border border-white/10 hover:border-red-500/30 backdrop-blur-sm group"
                        onClick={onClose}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </motion.button>

                    {/* GitHub button next to close button */}
                    {project.github && (
                        <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            transition={{ delay: 0.4, type: "spring", damping: 20 }}
                            className="absolute top-4 right-16 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-gray-600/30 text-gray-400 hover:text-white transition-all duration-300 z-20 border border-white/10 hover:border-gray-500/50 backdrop-blur-sm group"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="View on GitHub"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </motion.a>
                    )}

                    {/* Scrollable content container */}
                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Content */}
                        <div className="p-6 md:p-8 relative z-10">
                            {/* Header Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="mb-8 pt-8"
                            >
                                <h1 className="text-3xl md:text-4xl font-bold font-mono text-white mb-3" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                                    {project.name}
                                </h1>
                                <p className={`text-lg italic font-light ${isDeveloper ? 'text-green-300' : 'text-purple-300'}`}>
                                    {project.tagline}
                                </p>
                            </motion.div>

                            {/* Metadata Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                            >
                                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                    <div className="text-sm font-mono text-gray-400 mb-1" style={{fontFamily: 'JetBrains Mono, monospace'}}>YEAR</div>
                                    <div className="text-white font-semibold">{project.year}</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                    <div className="text-sm font-mono text-gray-400 mb-1" style={{fontFamily: 'JetBrains Mono, monospace'}}>ROLE</div>
                                    <div className="text-white font-semibold">{project.role}</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 md:col-span-2">
                                    <div className="text-sm font-mono text-gray-400 mb-2" style={{fontFamily: 'JetBrains Mono, monospace'}}>TECH STACK</div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tools?.map((tool, i) => (
                                            <span 
                                                key={i} 
                                                className={`px-3 py-1 rounded-full text-sm font-mono border ${
                                                    isDeveloper 
                                                        ? 'bg-green-600/20 text-green-300 border-green-500/30'
                                                        : 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                                                }`}
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {project.team && (
                                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 md:col-span-2">
                                        <div className="text-sm font-mono text-gray-400 mb-1" style={{fontFamily: 'JetBrains Mono, monospace'}}>TEAM</div>
                                        <div className="text-white font-semibold">{project.team}</div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Problem & Solution */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                            >
                                <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 rounded-xl border border-red-800/30 backdrop-blur-sm">
                                    <h3 className="text-xl font-bold font-mono text-red-300 mb-3" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                                        → THE CHALLENGE
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">{project.problem}</p>
                                </div>
                                
                                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-xl border border-green-800/30 backdrop-blur-sm">
                                    <h3 className="text-xl font-bold font-mono text-green-300 mb-3" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                                        → THE SOLUTION
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">{project.solution}</p>
                                </div>
                            </motion.div>

                            {/* Key Features */}
                            {project.features?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 rounded-xl border border-purple-800/30 backdrop-blur-sm mb-8"
                                >
                                    <h3 className="text-xl font-bold font-mono text-purple-300 mb-4" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                                        → KEY FEATURES
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {project.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Image Gallery */}
                            {project.images?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 mb-8"
                                >
                                    <h3 className="text-xl font-bold font-mono text-gray-300 mb-4" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                                        → PROJECT GALLERY
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <div className="flex gap-4 pb-4">
                                            {project.images.map((src, i) => (
                                                <div key={i} className="relative flex-shrink-0 group">
                                                    <img 
                                                        src={src} 
                                                        alt={`${project.name} screenshot ${i + 1}`}
                                                        className="h-48 w-72 object-cover rounded-xl border-2 border-white/10 shadow-lg group-hover:border-blue-500/50 transition-all duration-300 group-hover:scale-105" 
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="absolute bottom-3 left-3 text-white font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        Screenshot {i + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Action Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="flex flex-col sm:flex-row gap-4 pb-4 justify-center"
                            >
                                <motion.a 
                                    href={project.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-mono font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 border ${
                                        isDeveloper
                                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-green-500/50 text-white'
                                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-purple-500/50 text-white'
                                    }`}
                                    style={{fontFamily: 'JetBrains Mono, monospace'}}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    VIEW LIVE PROJECT
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </motion.a>

                                {/* GitHub Button */}
                                {project.github && (
                                    <motion.a 
                                        href={project.github} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-mono font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 border bg-gray-800 hover:bg-gray-700 border-gray-600/50 text-white hover:border-gray-500/70"
                                        style={{fontFamily: 'JetBrains Mono, monospace'}}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                        VIEW PROJECT ON GITHUB
                                    </motion.a>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}