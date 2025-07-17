"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Palette, 
  Monitor, 
  Sun, 
  Moon, 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function SettingsPanel({ theme, setTheme }) {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    showDrafts: true,
    enableAnalytics: false,
    backupFrequency: "weekly"
  })

  const colors = {
    primary: "#516AC8",
    secondary: "#E3AF64", 
    background: "#F8F7F5"
  }

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const exportData = () => {
    // Mock export functionality
    const data = {
      projects: [],
      settings: settings,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearCache = () => {
    if (confirm('Are you sure you want to clear all cached data? This action cannot be undone.')) {
      localStorage.clear()
      alert('Cache cleared successfully!')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your dashboard preferences and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Theme</Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Color Palette</Label>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border-2 border-white shadow-sm"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <span className="text-sm font-mono">{colors.primary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border-2 border-white shadow-sm"
                    style={{ backgroundColor: colors.secondary }}
                  />
                  <span className="text-sm font-mono">{colors.secondary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border-2 border-gray-300"
                    style={{ backgroundColor: colors.background }}
                  />
                  <span className="text-sm font-mono">{colors.background}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Dashboard Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save drafts</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically save project drafts as you type
                </p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show draft projects</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Display draft projects in the main view
                </p>
              </div>
              <Switch
                checked={settings.showDrafts}
                onCheckedChange={(checked) => handleSettingChange("showDrafts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications for important updates
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable usage analytics and insights
                </p>
              </div>
              <Switch
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => handleSettingChange("enableAnalytics", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                defaultValue="Nana Amoako"
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="hello@nanaamoako.com"
                placeholder="Your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Brief description about yourself"
                defaultValue="Full-stack developer and designer creating meaningful digital experiences."
                rows={3}
              />
            </div>

            <Button size="sm" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Backup & Export</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Download your portfolio data as JSON
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportData}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium">Import Data</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Import portfolio data from backup file
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-red-600 dark:text-red-400">
                  Clear Cache
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Clear all cached data and reset preferences
                </p>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={clearCache}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cache
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Drafts</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1.2k</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>Nana Amoako Portfolio Admin Dashboard</div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">v1.0.0</Badge>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 