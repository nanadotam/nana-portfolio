"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Paintbrush, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Palette,
  Image
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import AdminLayout from "../components/AdminLayout"
import UniversalProjectModal from "../components/UniversalProjectModal"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import "../admin.css"

export default function DesignerProjectsPage() {
  const [activeView, setActiveView] = useState("designer-projects")
  const [theme, setTheme] = useState("dark")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const supabase = createClient()

  // Fetch designer projects
  const fetchDesignerProjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('project_type', 'designer')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching designer projects:', error)
      toast.error('Failed to fetch designer projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDesignerProjects()
  }, [])

  // Handle project success (create/update)
  const handleProjectSuccess = () => {
    fetchDesignerProjects()
    setModalOpen(false)
    setSelectedProject(null)
  }

  // Handle add new project
  const handleAddProject = () => {
    setSelectedProject(null)
    setModalOpen(true)
  }

  // Handle project edit
  const handleEditProject = (project) => {
    setSelectedProject(project)
    setModalOpen(true)
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
      fetchDesignerProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  // Filter projects based on search, status, and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Get unique categories for filter
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))]

  // Project status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
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
    <Card 
      className="admin-card hover:border-purple-500/50 transition-all duration-200 cursor-pointer group"
      onClick={() => handleEditProject(project)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <Paintbrush className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">{project.name}</CardTitle>
              {project.tagline && (
                <p className="text-gray-400 text-sm mt-1">{project.tagline}</p>
              )}
              {project.category && (
                <Badge variant="outline" className="mt-1 text-purple-400 border-purple-400/50">
                  {project.category}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(project.status)}
            <Badge 
              variant={project.status === 'completed' ? 'default' : 'secondary'}
              className={project.status === 'completed' ? 'bg-green-500' : 'bg-gray-600'}
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
        
        {/* Color Palette Preview */}
        {project.colors && project.colors.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-4 w-4 text-purple-400" />
            <div className="flex gap-1">
              {project.colors.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded border border-gray-600"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {project.colors.length > 5 && (
                <div className="w-6 h-6 rounded border border-gray-600 bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                  +{project.colors.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tools */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tools && project.tools.map((tool, index) => (
            <Badge key={index} variant="outline" className="text-gray-400 border-gray-600">
              {tool}
            </Badge>
          ))}
        </div>

        {/* Image Preview */}
        {project.images && project.images.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-400">{project.images.length} image(s)</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span>{project.year}</span> • <span>{project.role}</span>
            {project.client && <span> • {project.client}</span>}
          </div>
          
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {project.behance_url && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-purple-400"
                onClick={() => window.open(project.behance_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            {project.case_study_url && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-purple-400"
                onClick={() => window.open(project.case_study_url, '_blank')}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-blue-400"
              onClick={(e) => {
                e.stopPropagation()
                handleEditProject(project)
              }}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-400"
                  onClick={(e) => e.stopPropagation()}
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
              <Paintbrush className="h-8 w-8 text-purple-400" />
              Designer Projects
            </h1>
            <p className="text-gray-400">Manage your design portfolio projects</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={fetchDesignerProjects} 
              disabled={loading}
              variant="outline"
              className="text-gray-400 hover:text-white border-gray-600"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleAddProject}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Designer Project
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading designer projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Paintbrush className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" ? "No projects found" : "No designer projects yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first designer project to get started"
              }
            </p>
            {!searchTerm && statusFilter === "all" && categoryFilter === "all" && (
              <Button 
                onClick={handleAddProject}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Designer Project
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

        {/* Universal Project Modal */}
        <UniversalProjectModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedProject(null)
          }}
          project={selectedProject}
          projectType="designer"
          onSuccess={handleProjectSuccess}
        />
      </div>
    </AdminLayout>
  )
} 