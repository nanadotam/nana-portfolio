"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Database, 
  Settings, 
  Code, 
  Paintbrush, 
  BarChart3,
  Eye,
  RefreshCw,
  CheckCircle,
  FileText,
  Globe,
  Users,
  Calendar,
  Bell,
  Moon,
  Sun,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "./components/AdminLayout"
import EditProjectModal from "./components/EditProjectModal"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import "./admin.css"

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [theme, setTheme] = useState("dark")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    developer: 0,
    designer: 0,
    published: 0,
    drafts: 0,
    featured: 0
  })

  const supabase = createClient()

  // Fetch projects from database
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProjects(data || [])
      
      // Calculate stats
      const total = data?.length || 0
      const developer = data?.filter(p => p.project_type === 'developer').length || 0
      const designer = data?.filter(p => p.project_type === 'designer').length || 0
      const published = data?.filter(p => p.status === 'live').length || 0
      const drafts = data?.filter(p => p.status === 'draft').length || 0
      const featured = data?.filter(p => p.featured === true).length || 0

      setStats({ total, developer, designer, published, drafts, featured })
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Handle project edit
  const handleEditProject = (project) => {
    setSelectedProject(project)
    setEditModalOpen(true)
  }

  // Handle project update
  const handleUpdateProject = async (updatedProject) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', selectedProject.id)

      if (error) throw error

      toast.success('Project updated successfully')
      fetchProjects() // Refresh data
      setEditModalOpen(false)
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    }
  }

  // Stats Card Component
  const StatCard = ({ title, value, icon: Icon, description, color = "blue", trend }) => (
    <Card className="admin-card hover:scale-105 transition-transform duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 text-${color}-400`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold text-white mb-1`}>{value}</div>
        <p className="text-xs text-gray-500">
          {description}
        </p>
        {trend && (
          <div className="flex items-center mt-2">
            <span className="text-xs text-green-400">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  // Quick Action Card Component
  const QuickActionCard = ({ title, description, icon: Icon, onClick, color = "blue" }) => (
    <Card 
      className="admin-card cursor-pointer hover:scale-105 transition-all duration-200"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
          <div className={`p-3 rounded-full bg-${color}-500/20`}>
            <Icon className={`h-6 w-6 text-${color}-400`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Recent Projects Component
  const RecentProjectsList = () => (
    <Card className="admin-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          Recent Projects
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveView("all-projects")}
            className="text-gray-400 hover:text-white border-gray-600"
          >
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No projects found. Create your first project!
          </div>
        ) : (
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div 
                key={project.id} 
                className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:border-orange-500/50 transition-colors cursor-pointer"
                onClick={() => handleEditProject(project)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded ${
                    project.project_type === 'developer' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {project.project_type === 'developer' ? (
                      <Code className="h-4 w-4" />
                    ) : (
                      <Paintbrush className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{project.name}</h3>
                    <p className="text-sm text-gray-400">{project.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={project.status === 'live' ? 'default' : 'secondary'}
                    className={project.status === 'live' ? 'bg-green-500' : 'bg-gray-600'}
                  >
                    {project.status}
                  </Badge>
                  {project.featured && (
                    <Badge className="bg-orange-500">Featured</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <AdminLayout 
      activeView={activeView}
      setActiveView={setActiveView}
      theme={theme}
      setTheme={setTheme}
    >
      <div className="admin-dashboard min-h-screen">
        {/* Top Bar */}
        <div className="admin-topbar">
          <div>
            <h1 className="text-2xl font-bold text-white">Portfolio Dashboard</h1>
            <p className="text-gray-400">Manage your developer and designer projects</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button 
              onClick={fetchProjects} 
              disabled={loading}
              variant="outline"
              className="text-gray-400 hover:text-white border-gray-600"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="admin-avatar">NA</div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={stats.total}
            icon={Database}
            description="All projects in portfolio"
            color="blue"
            trend="+12% from last month"
          />
          <StatCard
            title="Published"
            value={stats.published}
            icon={Globe}
            description="Live on website"
            color="green"
            trend="+3 this week"
          />
          <StatCard
            title="Featured"
            value={stats.featured}
            icon={CheckCircle}
            description="Highlighted projects"
            color="orange"
          />
          <StatCard
            title="Draft"
            value={stats.drafts}
            icon={FileText}
            description="Work in progress"
            color="yellow"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickActionCard
            title="Add Developer Project"
            description="Create a new development project"
            icon={Code}
            onClick={() => setActiveView("add-developer")}
            color="green"
          />
          <QuickActionCard
            title="Add Designer Project"
            description="Create a new design project"
            icon={Paintbrush}
            onClick={() => setActiveView("add-designer")}
            color="purple"
          />
          <QuickActionCard
            title="View All Projects"
            description="Manage all projects"
            icon={Database}
            onClick={() => setActiveView("all-projects")}
            color="blue"
          />
          <QuickActionCard
            title="Settings"
            description="Configure dashboard"
            icon={Settings}
            onClick={() => setActiveView("settings")}
            color="gray"
          />
        </div>

        {/* Project Type Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Code className="h-5 w-5 text-green-400" />
                Developer Projects ({stats.developer})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Published</span>
                  <span className="text-green-400">
                    {projects.filter(p => p.project_type === 'developer' && p.status === 'live').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Drafts</span>
                  <span className="text-yellow-400">
                    {projects.filter(p => p.project_type === 'developer' && p.status === 'draft').length}
                  </span>
                </div>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => setActiveView("developer-projects")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Developer Projects
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Paintbrush className="h-5 w-5 text-purple-400" />
                Designer Projects ({stats.designer})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Published</span>
                  <span className="text-green-400">
                    {projects.filter(p => p.project_type === 'designer' && p.status === 'live').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Drafts</span>
                  <span className="text-yellow-400">
                    {projects.filter(p => p.project_type === 'designer' && p.status === 'draft').length}
                  </span>
                </div>
                <Button 
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  onClick={() => setActiveView("designer-projects")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Designer Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <RecentProjectsList />

        {/* Edit Project Modal */}
        <EditProjectModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          project={selectedProject}
          onUpdate={handleUpdateProject}
        />
      </div>
    </AdminLayout>
  )
} 