"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit, 
  Trash2, 
  Eye, 
  ExternalLink,
  Github,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  RefreshCw,
  Plus,
  Globe,
  Palette
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const statusColors = {
  live: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
}

const typeColors = {
  developer: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  designer: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
}

export default function ProjectsTable({ 
  projects = [], 
  loading = false, 
  onRefresh, 
  onDelete, 
  onTogglePublish,
  projectType = null 
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterYear, setFilterYear] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [viewMode, setViewMode] = useState("table") // "table" or "cards"
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const [deleteProjectId, setDeleteProjectId] = useState(null)

  // Get unique years for filter dropdown
  const years = useMemo(() => {
    const uniqueYears = [...new Set(projects.map(p => p.year))].sort((a, b) => b - a)
    return uniqueYears
  }, [projects])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.tools?.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesYear = filterYear === "all" || project.year?.toString() === filterYear
      const matchesStatus = filterStatus === "all" || project.status === filterStatus
      const matchesType = filterType === "all" || project.project_type === filterType

      return matchesSearch && matchesYear && matchesStatus && matchesType
    })

    // Sort projects
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "created_at" || sortBy === "updated_at") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [projects, searchTerm, filterYear, filterStatus, filterType, sortBy, sortOrder])

  const handleDeleteProject = (id) => {
    if (onDelete) {
      onDelete(id)
      setDeleteProjectId(null)
    }
  }

  const ProjectCard = ({ project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {project.tagline}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={statusColors[project.status]}>
                  {project.status}
                </Badge>
                <Badge className={typeColors[project.project_type]}>
                  {project.project_type}
                </Badge>
                {project.is_featured && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onTogglePublish && onTogglePublish(project.id, project.status)}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  {project.status === 'live' ? 'Unpublish' : 'Publish'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600"
                  onClick={() => setDeleteProjectId(project.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {project.year}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {project.role}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {project.tools?.slice(0, 3).map((tool, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tool}
                </Badge>
              ))}
              {project.tools?.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.tools.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {project.colors && project.colors.length > 0 && (
                <div className="flex gap-1">
                  {project.colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-1 ml-auto">
                {project.live_url && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
                {project.github_url && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Github className="h-3 w-3" />
                  </Button>
                )}
                {project.behance_url && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Palette className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const pageTitle = projectType 
    ? `${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Projects`
    : "All Projects"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {projectType 
              ? `Manage your ${projectType} projects (${filteredProjects.length} total)`
              : `Manage all portfolio projects (${filteredProjects.length} total)`
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="px-3"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="px-3"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          
          {!projectType && (
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <div className="text-gray-500 dark:text-gray-400">Loading projects...</div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    {!projectType && <TableHead>Type</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Tools</TableHead>
                    <TableHead>Links</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map(project => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {project.tagline}
                          </div>
                        </div>
                      </TableCell>
                      {!projectType && (
                        <TableCell>
                          <Badge className={typeColors[project.project_type]}>
                            {project.project_type}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge className={statusColors[project.status]}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.year}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.tools?.slice(0, 2).map((tool, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                          {project.tools?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tools.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {project.live_url && (
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                          {project.github_url && (
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Github className="h-3 w-3" />
                            </Button>
                          )}
                          {project.behance_url && (
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Palette className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onTogglePublish && onTogglePublish(project.id, project.status)}
                            >
                              <Globe className="mr-2 h-4 w-4" />
                              {project.status === 'live' ? 'Unpublish' : 'Publish'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => setDeleteProjectId(project.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                No projects found matching your criteria.
              </div>
              {projectType && (
                <Button onClick={() => window.history.back()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add {projectType} Project
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteProject(deleteProjectId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 