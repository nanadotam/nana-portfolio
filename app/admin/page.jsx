"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Database, 
  Settings, 
  Code, 
  Paintbrush, 
  Upload, 
  FileUp,
  BarChart3,
  Folder,
  Eye,
  RefreshCw,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AdminLayout from "./components/AdminLayout"
import ProjectsTable from "./components/ProjectsTable"
import AddProjectForm from "./components/AddProjectForm"
import SettingsPanel from "./components/SettingsPanel"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

export default function AdminPage() {
  const [activeView, setActiveView] = useState("dashboard")
  const [theme, setTheme] = useState("light")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    developer: 0,
    designer: 0,
    published: 0,
    drafts: 0
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

      setStats({ total, developer, designer, published, drafts })
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  // Publish/unpublish project
  const togglePublishStatus = async (projectId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'live' ? 'completed' : 'live'
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', projectId)

      if (error) throw error

      toast.success(`Project ${newStatus === 'live' ? 'published' : 'unpublished'} successfully`)
      fetchProjects() // Refresh data
    } catch (error) {
      console.error('Error updating project status:', error)
      toast.error('Failed to update project status')
    }
  }

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      toast.success('Project deleted successfully')
      fetchProjects() // Refresh data
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const StatCard = ({ title, value, icon: Icon, description, color = "blue" }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  )

  const QuickActions = ({ projectType }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {projectType === 'developer' ? (
            <Code className="h-5 w-5 text-purple-600" />
          ) : (
            <Paintbrush className="h-5 w-5 text-pink-600" />
          )}
          {projectType === 'developer' ? 'Developer' : 'Designer'} Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className={`text-2xl font-bold ${projectType === 'developer' ? 'text-purple-600' : 'text-pink-600'}`}>
              {projectType === 'developer' ? stats.developer : stats.designer}
            </div>
            <div className="text-sm text-gray-500">Total Projects</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.project_type === projectType && p.status === 'live').length}
            </div>
            <div className="text-sm text-gray-500">Published</div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Button 
            className="w-full justify-start gap-2"
            onClick={() => setActiveView(`add-${projectType}`)}
          >
            <Plus className="h-4 w-4" />
            Add New {projectType === 'developer' ? 'Dev' : 'Design'} Project
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={() => setActiveView(`${projectType}-projects`)}
          >
            <Folder className="h-4 w-4" />
            Manage {projectType === 'developer' ? 'Dev' : 'Design'} Projects
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your developer and designer projects
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchProjects} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setActiveView("bulk-upload")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <StatCard
                title="Total Projects"
                value={stats.total}
                icon={Database}
                description="All projects in portfolio"
                color="blue"
              />
              <StatCard
                title="Published"
                value={stats.published}
                icon={CheckCircle}
                description="Live projects"
                color="green"
              />
              <StatCard
                title="Drafts"
                value={stats.drafts}
                icon={FileUp}
                description="Unpublished projects"
                color="yellow"
              />
              <StatCard
                title="Developer"
                value={stats.developer}
                icon={Code}
                description="Development projects"
                color="purple"
              />
              <StatCard
                title="Designer"
                value={stats.designer}
                icon={Paintbrush}
                description="Design projects"
                color="pink"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuickActions projectType="developer" />
              <QuickActions projectType="designer" />
            </div>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Projects
                  <Button variant="outline" size="sm" onClick={() => setActiveView("all-projects")}>
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
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded ${
                            project.project_type === 'developer' 
                              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                              : 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
                          }`}>
                            {project.project_type === 'developer' ? (
                              <Code className="h-4 w-4" />
                            ) : (
                              <Paintbrush className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-gray-500">{project.tagline}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={project.status === 'live' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant={project.status === 'live' ? 'outline' : 'default'}
                            onClick={() => togglePublishStatus(project.id, project.status)}
                          >
                            {project.status === 'live' ? 'Unpublish' : 'Publish'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      
      case "all-projects":
        return (
          <ProjectsTable 
            projects={projects}
            loading={loading}
            onRefresh={fetchProjects}
            onDelete={deleteProject}
            onTogglePublish={togglePublishStatus}
          />
        )
      
      case "developer-projects":
        return (
          <ProjectsTable 
            projects={projects.filter(p => p.project_type === 'developer')}
            loading={loading}
            onRefresh={fetchProjects}
            onDelete={deleteProject}
            onTogglePublish={togglePublishStatus}
            projectType="developer"
          />
        )
      
      case "designer-projects":
        return (
          <ProjectsTable 
            projects={projects.filter(p => p.project_type === 'designer')}
            loading={loading}
            onRefresh={fetchProjects}
            onDelete={deleteProject}
            onTogglePublish={togglePublishStatus}
            projectType="designer"
          />
        )
      
      case "add-developer":
        return (
          <AddProjectForm 
            projectType="developer" 
            onSuccess={fetchProjects}
            onCancel={() => setActiveView("dashboard")}
          />
        )
      
      case "add-designer":
        return (
          <AddProjectForm 
            projectType="designer" 
            onSuccess={fetchProjects}
            onCancel={() => setActiveView("dashboard")}
          />
        )
      
      case "settings":
        return <SettingsPanel theme={theme} setTheme={setTheme} />
      
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Feature Coming Soon</h2>
            <p className="text-gray-600 dark:text-gray-400">
              This feature is under development.
            </p>
          </div>
        )
    }
  }

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

  return (
    <AdminLayout 
      activeView={activeView}
      setActiveView={setActiveView}
      theme={theme}
      setTheme={setTheme}
      navigation={navigation}
    >
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {renderActiveView()}
      </motion.div>
    </AdminLayout>
  )
} 