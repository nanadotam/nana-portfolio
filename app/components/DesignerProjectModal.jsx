"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Sparkles, 
  Palette, 
  ExternalLink, 
  FileText,
  Globe,
  Heart,
  Moon,
  Sun
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DesignerProjectModal({ isOpen, onClose, project }) {
    const [darkMode, setDarkMode] = useState(true)
    
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
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                style={{
                    backdropFilter: "blur(20px)",
                    background: darkMode 
                        ? "linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(15, 25, 57, 0.95))"
                        : "linear-gradient(135deg, rgba(81, 106, 200, 0.3), rgba(15, 25, 57, 0.7))"
                }}
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
                    className="w-full max-w-5xl max-h-[90vh] rounded-3xl relative shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: darkMode 
                            ? "linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 25%, rgba(55, 65, 81, 0.95) 75%, rgba(31, 41, 55, 0.95) 100%)"
                            : "linear-gradient(135deg, rgba(248, 247, 245, 0.95) 0%, rgba(255, 253, 250, 0.98) 25%, rgba(220, 230, 245, 0.95) 75%, rgba(248, 247, 245, 0.95) 100%)",
                        backdropFilter: "blur(20px)",
                        border: darkMode 
                            ? "1px solid rgba(55, 65, 81, 0.3)"
                            : "1px solid rgba(81, 106, 200, 0.2)",
                        boxShadow: darkMode 
                            ? "0 32px 64px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                            : "0 32px 64px -12px rgba(81, 106, 200, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)"
                    }}
                >
                    {/* Elegant gradient overlay */}
                    <div 
                        className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
                        style={{
                            background: darkMode 
                                ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(99, 102, 241, 0.05) 100%)"
                                : "linear-gradient(135deg, rgba(81, 106, 200, 0.1) 0%, rgba(227, 175, 100, 0.08) 50%, rgba(81, 106, 200, 0.05) 100%)",
                            mixBlendMode: "multiply"
                        }}
                    />
                    
                    {/* Status indicator */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", damping: 20 }}
                        className="absolute top-6 left-6 flex items-center gap-3 z-10"
                    >
                        <div 
                            className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                            style={{
                                boxShadow: "0 0 12px rgba(168, 85, 247, 0.6)"
                            }}
                        />
                        <span className={`text-sm font-light uppercase tracking-wider font-serif ${
                            darkMode ? 'text-gray-300' : 'text-slate-600'
                        }`}>
                            Creative Project
                        </span>
                    </motion.div>

                    {/* Dark mode toggle */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, type: "spring", damping: 20 }}
                        className="absolute top-6 right-20 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 z-20 group"
                        onClick={() => setDarkMode(!darkMode)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            background: darkMode 
                                ? "linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.9))"
                                : "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 247, 245, 0.9))",
                            border: darkMode 
                                ? "1px solid rgba(99, 102, 241, 0.3)"
                                : "1px solid rgba(81, 106, 200, 0.2)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        {darkMode ? (
                            <Sun className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-gray-600'} group-hover:rotate-45 transition-all duration-300`} />
                        ) : (
                            <Moon className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-gray-600'} group-hover:rotate-12 transition-all duration-300`} />
                        )}
                    </motion.button>

                    {/* Enhanced close button */}
                    <motion.button
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", damping: 20 }}
                        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 z-20 group"
                        onClick={onClose}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            background: darkMode 
                                ? "linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.9))"
                                : "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 247, 245, 0.9))",
                            border: darkMode 
                                ? "1px solid rgba(239, 68, 68, 0.3)"
                                : "1px solid rgba(81, 106, 200, 0.2)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <X className={`w-6 h-6 ${
                            darkMode ? 'text-gray-300 group-hover:text-red-400' : 'text-slate-600 group-hover:text-slate-800'
                        } group-hover:rotate-90 transition-all duration-300`} />
                    </motion.button>

                    {/* Scrollable content container */}
                    <div className="max-h-[75vh] overflow-y-auto" style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: darkMode 
                            ? "rgba(99, 102, 241, 0.3) transparent"
                            : "rgba(81, 106, 200, 0.3) transparent"
                    }}>
                        {/* Content */}
                        <div className="p-8 md:p-12 relative z-10">
                            {/* Header Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                className="mb-10 pt-8"
                            >
                                <div className="mb-4">
                                    <span 
                                        className="inline-block px-4 py-2 rounded-full text-sm font-medium tracking-wide"
                                        style={{
                                            background: darkMode 
                                                ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.15))"
                                                : "linear-gradient(135deg, rgba(81, 106, 200, 0.15), rgba(227, 175, 100, 0.15))",
                                            color: darkMode ? "#E5E7EB" : "#0F1939",
                                            border: darkMode 
                                                ? "1px solid rgba(99, 102, 241, 0.3)"
                                                : "1px solid rgba(81, 106, 200, 0.3)"
                                        }}
                                    >
                                        {project.category}
                                    </span>
                                </div>
                                <h1 className={`text-4xl md:text-5xl font-light mb-4 font-serif ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {project.title}
                                </h1>
                                <p className={`text-xl font-light italic ${
                                    darkMode ? 'text-purple-300' : 'text-orange-600'
                                }`}>
                                    {project.description || "A creative exploration in visual storytelling"}
                                </p>
                            </motion.div>

                            {/* Creative Brief & Metadata */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                            >
                                <div 
                                    className="p-6 rounded-2xl backdrop-blur-sm"
                                    style={{
                                        background: darkMode 
                                            ? "linear-gradient(135deg, rgba(55, 65, 81, 0.6), rgba(31, 41, 55, 0.8))"
                                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(248, 247, 245, 0.8))",
                                        border: darkMode 
                                            ? "1px solid rgba(99, 102, 241, 0.2)"
                                            : "1px solid rgba(81, 106, 200, 0.15)",
                                        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                                    }}
                                >
                                    <div className={`text-xs font-medium mb-2 uppercase tracking-widest font-serif ${
                                        darkMode ? 'text-gray-400' : 'text-slate-500'
                                    }`}>Client</div>
                                    <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                                        {project.client || "Creative Studio"}
                                    </div>
                                </div>
                                
                                <div 
                                    className="p-6 rounded-2xl backdrop-blur-sm"
                                    style={{
                                        background: darkMode 
                                            ? "linear-gradient(135deg, rgba(55, 65, 81, 0.6), rgba(31, 41, 55, 0.8))"
                                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(248, 247, 245, 0.8))",
                                        border: darkMode 
                                            ? "1px solid rgba(99, 102, 241, 0.2)"
                                            : "1px solid rgba(81, 106, 200, 0.15)",
                                        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                                    }}
                                >
                                    <div className={`text-xs font-medium mb-2 uppercase tracking-widest font-serif ${
                                        darkMode ? 'text-gray-400' : 'text-slate-500'
                                    }`}>Year</div>
                                    <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                                        {project.year || "2024"}
                                    </div>
                                </div>
                                
                                <div 
                                    className="p-6 rounded-2xl backdrop-blur-sm"
                                    style={{
                                        background: darkMode 
                                            ? "linear-gradient(135deg, rgba(55, 65, 81, 0.6), rgba(31, 41, 55, 0.8))"
                                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(248, 247, 245, 0.8))",
                                        border: darkMode 
                                            ? "1px solid rgba(99, 102, 241, 0.2)"
                                            : "1px solid rgba(81, 106, 200, 0.15)",
                                        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                                    }}
                                >
                                    <div className={`text-xs font-medium mb-2 uppercase tracking-widest font-serif ${
                                        darkMode ? 'text-gray-400' : 'text-slate-500'
                                    }`}>Role</div>
                                    <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                                        {project.role || "Creative Director"}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Design Tools & Skills */}
                            {project.tools && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="mb-10"
                                >
                                    <h3 className={`text-xl font-light mb-4 font-serif ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        Creative Tools
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.tools.map((tool, i) => (
                                            <span 
                                                key={i} 
                                                className="px-4 py-2 rounded-full text-sm font-medium"
                                                style={{
                                                    background: darkMode 
                                                        ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.12))"
                                                        : "linear-gradient(135deg, rgba(81, 106, 200, 0.12), rgba(227, 175, 100, 0.12))",
                                                    color: darkMode ? "#E5E7EB" : "#0F1939",
                                                    border: darkMode 
                                                        ? "1px solid rgba(99, 102, 241, 0.25)"
                                                        : "1px solid rgba(81, 106, 200, 0.25)"
                                                }}
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Creative Concept */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10"
                            >
                                <div 
                                    className="p-8 rounded-2xl backdrop-blur-sm"
                                    style={{
                                        background: darkMode 
                                            ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 70, 229, 0.08))"
                                            : "linear-gradient(135deg, rgba(81, 106, 200, 0.08), rgba(38, 66, 139, 0.05))",
                                        border: darkMode 
                                            ? "1px solid rgba(99, 102, 241, 0.3)"
                                            : "1px solid rgba(81, 106, 200, 0.3)",
                                        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                                    }}
                                >
                                    <h3 className={`text-xl font-light mb-4 font-serif flex items-center gap-2 ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        <Sparkles className="w-5 h-5" />
                                        Creative Concept
                                    </h3>
                                    <p className={`leading-relaxed ${
                                        darkMode ? 'text-gray-300' : 'text-slate-700'
                                    }`}>
                                        {project.concept || "This project explores the intersection of modern aesthetics and functional design, creating a visual language that speaks to contemporary audiences while honoring timeless design principles."}
                                    </p>
                                </div>
                                
                                <div 
                                    className="p-8 rounded-2xl backdrop-blur-sm"
                                    style={{
                                        background: darkMode 
                                            ? "linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.08))"
                                            : "linear-gradient(135deg, rgba(227, 175, 100, 0.08), rgba(244, 203, 120, 0.05))",
                                        border: darkMode 
                                            ? "1px solid rgba(168, 85, 247, 0.3)"
                                            : "1px solid rgba(227, 175, 100, 0.3)",
                                        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                                    }}
                                >
                                    <h3 className={`text-xl font-light mb-4 font-serif flex items-center gap-2 ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        <Palette className="w-5 h-5" />
                                        Design Philosophy
                                    </h3>
                                    <p className={`leading-relaxed ${
                                        darkMode ? 'text-gray-300' : 'text-slate-700'
                                    }`}>
                                        {project.philosophy || "Every design decision was made with intentionality, balancing visual impact with user experience. The approach emphasizes clarity, elegance, and meaningful interaction."}
                                    </p>
                                </div>
                            </motion.div>

                                        {/* Color Palette & Typography - Only show if they have content */}
            {(project.colors || project.headingFont || project.bodyFont) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className={`grid grid-cols-1 ${(project.colors && (project.headingFont || project.bodyFont)) ? 'md:grid-cols-2' : ''} gap-8 mb-10`}
                >
                    {/* Color Palette - Only show if colors exist */}
                    {project.colors && project.colors.length > 0 && (
                        <div 
                            className="p-8 rounded-2xl backdrop-blur-sm"
                            style={{
                                background: darkMode 
                                    ? "linear-gradient(135deg, rgba(55, 65, 81, 0.7), rgba(31, 41, 55, 0.9))"
                                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(248, 247, 245, 0.9))",
                                border: darkMode 
                                    ? "1px solid rgba(99, 102, 241, 0.2)"
                                    : "1px solid rgba(81, 106, 200, 0.15)",
                                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                            }}
                        >
                            <h3 className={`text-xl font-light mb-6 font-serif ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Color Palette
                            </h3>
                            <div className="grid grid-cols-4 gap-3">
                                {project.colors.map((color, i) => (
                                    <div key={i} className="text-center">
                                        <div 
                                            className="w-full h-16 rounded-lg mb-2 border border-white/30 shadow-sm"
                                            style={{backgroundColor: color}}
                                        />
                                        <span className={`text-xs font-mono ${
                                            darkMode ? 'text-gray-400' : 'text-slate-600'
                                        }`}>{color}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Typography - Only show if fonts exist */}
                    {(project.headingFont || project.bodyFont) && (
                        <div 
                            className="p-8 rounded-2xl backdrop-blur-sm"
                            style={{
                                background: darkMode 
                                    ? "linear-gradient(135deg, rgba(55, 65, 81, 0.7), rgba(31, 41, 55, 0.9))"
                                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(248, 247, 245, 0.9))",
                                border: darkMode 
                                    ? "1px solid rgba(99, 102, 241, 0.2)"
                                    : "1px solid rgba(81, 106, 200, 0.15)",
                                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                            }}
                        >
                            <h3 className={`text-xl font-light mb-6 font-serif ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Typography
                            </h3>
                            <div className="space-y-4">
                                {project.headingFont && (
                                    <div>
                                        <div className={`text-2xl font-serif mb-1 ${
                                            darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>Heading Font</div>
                                        <div className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-slate-600'
                                        }`}>{project.headingFont}</div>
                                    </div>
                                )}
                                {project.bodyFont && (
                                    <div>
                                        <div className={`text-lg font-light mb-1 ${
                                            darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>Body Font</div>
                                        <div className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-slate-600'
                                        }`}>{project.bodyFont}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

                            {/* Design Features */}
                            {/* {project.features && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                    className="mb-10"
                                    style={{
                                        background: darkMode 
                                            ? "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.06))"
                                            : "linear-gradient(135deg, rgba(81, 106, 200, 0.06), rgba(227, 175, 100, 0.06))",
                                        border: darkMode 
                                            ? "1px solid rgba(99, 102, 241, 0.2)"
                                            : "1px solid rgba(81, 106, 200, 0.2)",
                                        borderRadius: "20px",
                                        padding: "32px",
                                        backdropFilter: "blur(10px)"
                                    }}
                                >
                                    <h3 className={`text-2xl font-light mb-6 font-serif flex items-center gap-2 ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        <Sparkles className="w-6 h-6" />
                                        Key Design Elements
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {project.features.map((feature, i) => (
                                            <div 
                                                key={i} 
                                                className="flex items-start gap-4 p-4 rounded-xl backdrop-blur-sm"
                                                style={{
                                                    background: darkMode 
                                                        ? "linear-gradient(135deg, rgba(55, 65, 81, 0.6), rgba(31, 41, 55, 0.8))"
                                                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(248, 247, 245, 0.8))",
                                                    border: darkMode 
                                                        ? "1px solid rgba(99, 102, 241, 0.2)"
                                                        : "1px solid rgba(81, 106, 200, 0.1)"
                                                }}
                                            >
                                                <div 
                                                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                                                    style={{background: darkMode 
                                                        ? "linear-gradient(135deg, #6366F1, #A855F7)"
                                                        : "linear-gradient(135deg, #5166C8, #E3AF64)"
                                                    }}
                                                />
                                                <span className={`text-sm leading-relaxed ${
                                                    darkMode ? 'text-gray-300' : 'text-slate-700'
                                                }`}>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )} */}

                            {/* Image Gallery */}
                            {project.images && project.images.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.6 }}
                                    className="mb-10"
                                    style={{
                                        background: darkMode 
                                            ? "linear-gradient(135deg, rgba(55, 65, 81, 0.5), rgba(31, 41, 55, 0.7))"
                                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(248, 247, 245, 0.7))",
                                        border: darkMode 
                                            ? "1px solid rgba(99, 102, 241, 0.2)"
                                            : "1px solid rgba(81, 106, 200, 0.15)",
                                        borderRadius: "20px",
                                        padding: "32px",
                                        backdropFilter: "blur(10px)"
                                    }}
                                >
                                    <h3 className={`text-2xl font-light mb-6 font-serif ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        Project Gallery
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <div className="flex gap-6 pb-4">
                                            {project.images.map((src, i) => (
                                                <div key={i} className="relative flex-shrink-0 group">
                                                    <img 
                                                        src={src} 
                                                        alt={`${project.title} visual ${i + 1}`}
                                                        className="h-64 w-80 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                                                        style={{
                                                            border: darkMode 
                                                                ? "2px solid rgba(99, 102, 241, 0.3)"
                                                                : "2px solid rgba(81, 106, 200, 0.2)"
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="absolute bottom-4 left-4 text-white font-light text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        View {i + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                {project.liveUrl && (
                                    <motion.a 
                                        href={project.liveUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                                        style={{
                                            background: darkMode 
                                                ? "linear-gradient(135deg, #6366F1, #A855F7)"
                                                : "linear-gradient(135deg, #5166C8, #E3AF64)",
                                            color: "white",
                                            border: "1px solid rgba(255, 255, 255, 0.2)"
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Globe className="w-5 h-5" />
                                        VIEW LIVE PROJECT
                                    </motion.a>
                                )}

                                {project.caseStudyUrl && (
                                    <motion.a 
                                        href={project.caseStudyUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                                        style={{
                                            background: darkMode 
                                                ? "linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.9))"
                                                : "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 247, 245, 0.9))",
                                            color: darkMode ? "#E5E7EB" : "#0F1939",
                                            border: darkMode 
                                                ? "1px solid rgba(99, 102, 241, 0.3)"
                                                : "1px solid rgba(81, 106, 200, 0.3)",
                                            backdropFilter: "blur(10px)"
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FileText className="w-5 h-5" />
                                        READ CASE STUDY
                                    </motion.a>
                                )}

                                {project.behanceUrl && (
                                    <motion.a 
                                        href={project.behanceUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                                        style={{
                                            background: "linear-gradient(135deg, #1769ff, #0057ff)",
                                            color: "white",
                                            border: "1px solid rgba(255, 255, 255, 0.2)"
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Heart className="w-5 h-5" />
                                        VIEW ON BEHANCE
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