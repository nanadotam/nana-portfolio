"use client"

import { useState, useEffect } from "react"
import "../admin.css"
import { motion, AnimatePresence } from "framer-motion"
import { FolderOpen, Plus, Settings, Menu, X, Sun, Moon, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminLayout({ children, activeView, setActiveView, theme, setTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Color palette
  const colors = {
    primary: "#516AC8",      // Sapphire blue
    secondary: "#E3AF64",    // Warm gold
    background: "#F8F7F5",   // Light cream
    dark: "#1a1a1a",
    darkSecondary: "#2a2a2a",
    text: "#2c3e50",
    textMuted: "#64748b"
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Apply theme classes to body
  useEffect(() => {
    document.body.className = theme
  }, [theme])

  const navigation = [
    {
      id: "projects",
      label: "Projects",
      icon: FolderOpen,
      description: "Manage your portfolio projects"
    },
    {
      id: "add-project",
      label: "Add Project",
      icon: Plus,
      description: "Create a new project"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Dashboard settings"
    }
  ]

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-gray-900 text-white" 
        : "bg-gray-50 text-gray-900"
    }`}>
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || !isMobile) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`
                ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
                w-64 border-r transition-colors duration-300
                ${theme === "dark" 
                  ? "bg-gray-800 border-gray-700" 
                  : "bg-white border-gray-200"
                }
              `}
            >
              {/* Sidebar header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Admin</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Manager</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTheme}
                      className="p-2"
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-2">
                {/* Back to Portfolio */}
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 mb-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Home className="h-4 w-4" />
                    Back to Portfolio
                  </Button>
                </Link>

                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = activeView === item.id
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => {
                        setActiveView(item.id)
                        if (isMobile) setSidebarOpen(false)
                      }}
                      className={`
                        w-full justify-start gap-3 h-12 transition-all duration-200
                        ${isActive 
                          ? `text-white shadow-lg` 
                          : `hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300`
                        }
                      `}
                      style={isActive ? {
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        boxShadow: `0 4px 12px ${colors.primary}20`
                      } : {}}
                    >
                      <Icon className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </nav>

              {/* Sidebar footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Nana Amoako Portfolio
                  <br />
                  Admin Dashboard v1.0
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile backdrop */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 min-h-screen">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 