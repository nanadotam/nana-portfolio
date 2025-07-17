"use client"

import { useState, useEffect } from "react"
import "../admin.css"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FolderOpen, 
  Plus, 
  Settings, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Home,
  BarChart3,
  Code,
  Paintbrush,
  Database,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminLayout({ children, activeView, setActiveView, theme, setTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

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
    document.body.className = 'admin-dashboard'
  }, [theme])

  // Navigation items
  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Overview & analytics"
    },
    {
      id: "all-projects", 
      label: "All Projects",
      icon: Database,
      description: "Manage all projects"
    },
    {
      id: "developer-projects",
      label: "Dev Projects", 
      icon: Code,
      description: "Development projects"
    },
    {
      id: "designer-projects",
      label: "Design Projects",
      icon: Paintbrush, 
      description: "Design projects"
    },
    {
      id: "add-developer",
      label: "Add Dev Project",
      icon: Plus,
      description: "Create developer project"
    },
    {
      id: "add-designer", 
      label: "Add Design Project",
      icon: Plus,
      description: "Create design project"
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
    <div className="admin-dashboard flex min-h-screen">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-white"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Modern Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.aside
            initial={{ x: -80 }}
            animate={{ x: 0 }}
            exit={{ x: -80 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`
              ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
              admin-sidebar flex flex-col items-center py-6 space-y-4
            `}
          >
            {/* Logo */}
            <div className="admin-nav-item mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                NA
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex flex-col space-y-3">
              {/* Back to Portfolio */}
              <Link href="/">
                <div className="admin-nav-item" title="Back to Portfolio">
                  <Home className="h-5 w-5" />
                </div>
              </Link>

              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.id
                
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id)
                      if (isMobile) setSidebarOpen(false)
                    }}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                )
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex-1"></div>
            <div className="flex flex-col space-y-3 mt-auto">
              <div 
                className="admin-nav-item" 
                onClick={toggleTheme}
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </div>
              
              {/* User Profile */}
              <div className="admin-nav-item" title="Profile">
                <User className="h-5 w-5" />
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
      <div className="admin-main-content flex-1">
        {children}
      </div>
    </div>
  )
} 