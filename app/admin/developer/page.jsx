"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Code, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import AdminLayout from "../components/AdminLayout"
import AddProjectForm from "../components/AddProjectForm"
import EditProjectModal from "../components/EditProjectModal"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import "../admin.css"

export default function DeveloperProjectsPage() {
  const [activeView, setActiveView] = useState("developer-projects")
  const [theme, setTheme] = useState("dark")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const supabase = createClient()

  // Fetch developer projects
  const fetchDeveloperProjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('project_type', 'developer')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching developer projects:', error)
      toast.error('Failed to fetch developer projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeveloperProjects()
  }, [])

  // Handle project creation
  const handleProjectCreated = () => {
    fetchDeveloperProjects()
    setAddModalOpen(false)
    toast.success('Developer project created successfully!')
  }

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
      fetchDeveloperProjects()
      setEditModalOpen(false)
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    }
  }

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      toast.success('Project deleted successfully')
      fetchDeveloperProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Project status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  // Project Card Component
  const ProjectCard = ({ project }) => (
    <Card className="admin-card hover:border-green-500/50 transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-green-500/20">
              <Code className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">{project.name}</CardTitle>
              {project.tagline && (
                <p className="text-gray-400 text-sm mt-1">{project.tagline}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(project.status)}
            <Badge 
              variant={project.status === 'live' ? 'default' : 'secondary'}
              className={project.status === 'live' ? 'bg-green-500' : 'bg-gray-600'}
            >
              {project.status}
            </Badge>
            {project.is_featured && (
              <Badge className="bg-orange-500">Featured</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tools && project.tools.map((tool, index) => (
            <Badge key={index} variant="outline" className="text-gray-400 border-gray-600">
              {tool}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span>{project.year}</span> • <span>{project.role}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {project.live_url && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-green-400"
                onClick={() => window.open(project.live_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            {project.github_url && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-green-400"
                onClick={() => window.open(project.github_url, '_blank')}
              >
                <Code className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-blue-400"
              onClick={() => handleEditProject(project)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-800 border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Delete Project</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Are you sure you want to delete "{project.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
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
        {/* Header */}
        <div className="admin-topbar">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Code className="h-8 w-8 text-green-400" />
              Developer Projects
            </h1>
            <p className="text-gray-400">Manage your development portfolio projects</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={fetchDeveloperProjects} 
              disabled={loading}
              variant="outline"
              className="text-gray-400 hover:text-white border-gray-600"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => setAddModalOpen(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Developer Project
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading developer projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Code className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || statusFilter !== "all" ? "No projects found" : "No developer projects yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Create your first developer project to get started"
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button 
                onClick={() => setAddModalOpen(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Developer Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Add Project Modal */}
        {addModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Add Developer Project</h2>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <AddProjectForm
                  projectType="developer"
                  onSuccess={handleProjectCreated}
                  onCancel={() => setAddModalOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

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