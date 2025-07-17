"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Save, 
  X, 
  Plus, 
  Upload, 
  Link as LinkIcon, 
  Palette,
  Code,
  Paintbrush,
  FileText,
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Globe,
  AlertCircle,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Star,
  Eye,
  Clock,
  CheckCircle,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createProject, updateProject } from "@/utils/projectOperations"
import { toast } from "sonner"

export default function UniversalProjectModal({ 
  isOpen, 
  onClose, 
  project = null, 
  projectType = "developer", 
  onSuccess 
}) {
  const isEditing = !!project
  
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    tagline: "",
    description: "",
    category: "", // for designer projects
    project_type: projectType,
    
    // Metadata
    year: new Date().getFullYear().toString(),
    role: "",
    client: "",
    team: "",
    is_featured: false,
    status: "draft",
    sort_order: 0,
    
    // Developer/Designer specific
    problem: "",
    solution: "",
    concept: "",
    philosophy: "",
    heading_font: "",
    body_font: "",
    colors: [],
    tools: [],
    features: [],
    images: [],
    
    // Links
    live_url: "",
    github_url: "",
    case_study_url: "",
    behance_url: "",
    
    // Flexible catch-all
    json_data: {}
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [newColor, setNewColor] = useState("#3b82f6")
  const [newTool, setNewTool] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        tagline: project.tagline || "",
        description: project.description || "",
        category: project.category || "",
        project_type: project.project_type || projectType,
        year: project.year || new Date().getFullYear().toString(),
        role: project.role || "",
        client: project.client || "",
        team: project.team || "",
        is_featured: project.is_featured || false,
        status: project.status || "draft",
        sort_order: project.sort_order || 0,
        
        problem: project.problem || "",
        solution: project.solution || "",
        concept: project.concept || "",
        philosophy: project.philosophy || "",
        heading_font: project.heading_font || "",
        body_font: project.body_font || "",
        colors: project.colors || [],
        tools: project.tools || [],
        features: project.features || [],
        images: project.images || [],
        
        live_url: project.live_url || "",
        github_url: project.github_url || "",
        case_study_url: project.case_study_url || "",
        behance_url: project.behance_url || "",
        
        json_data: project.json_data || {}
      })
    } else {
      // Reset form for new project
      setFormData({
        name: "",
        tagline: "",
        description: "",
        category: "",
        project_type: projectType,
        year: new Date().getFullYear().toString(),
        role: "",
        client: "",
        team: "",
        is_featured: false,
        status: "draft",
        sort_order: 0,
        
        problem: "",
        solution: "",
        concept: "",
        philosophy: "",
        heading_font: "",
        body_font: "",
        colors: [],
        tools: [],
        features: [],
        images: [],
        
        live_url: "",
        github_url: "",
        case_study_url: "",
        behance_url: "",
        
        json_data: {}
      })
    }
    setErrors({})
  }, [project, projectType])

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = "Project name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.year.trim()) newErrors.year = "Year is required"
    if (!formData.role.trim()) newErrors.role = "Role is required"
    
    // Designer specific validation
    if (formData.project_type === "designer" && !formData.category.trim()) {
      newErrors.category = "Category is required for designer projects"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors")
      return
    }

    setLoading(true)
    try {
      let result
      if (isEditing) {
        result = await updateProject(project.id, formData)
      } else {
        result = await createProject(formData)
      }

      if (result.error) {
        throw result.error
      }

      toast.success(`Project ${isEditing ? 'updated' : 'created'} successfully!`)
      onSuccess(result.data)
      onClose()
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} project`)
    } finally {
      setLoading(false)
    }
  }

  // Array field helpers
  const addToArray = (field, value, resetField) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }))
      resetField("")
    }
  }

  const removeFromArray = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const addColor = () => addToArray("colors", newColor, setNewColor)
  const addTool = () => addToArray("tools", newTool, setNewTool)
  const addFeature = () => addToArray("features", newFeature, setNewFeature)
  const addImage = () => addToArray("images", newImageUrl, setNewImageUrl)

  // Get project theme colors
  const themeColors = formData.project_type === "developer" 
    ? { primary: "green", accent: "emerald", icon: Code }
    : { primary: "purple", accent: "violet", icon: Paintbrush }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-white flex items-center gap-3 text-2xl">
            <div className={`p-3 rounded-xl bg-${themeColors.primary}-500/20 backdrop-blur-sm`}>
              <themeColors.icon className={`h-7 w-7 text-${themeColors.primary}-400`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditing ? "Edit" : "Create New"} {formData.project_type} Project
                {formData.is_featured && (
                  <Badge className="bg-orange-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-gray-400 text-sm font-normal mt-1">
                {isEditing ? "Update your project details" : `Add a new ${formData.project_type} project to your portfolio`}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <Tabs defaultValue="basic" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-1 mb-6">
                <TabsTrigger 
                  value="basic" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-300 transition-all duration-200"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-300 transition-all duration-200"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Project Details
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-300 transition-all duration-200"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Media & Links
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-300 transition-all duration-200"
                >
                  <User className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto px-1">
                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-6 mt-0">
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Project Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-white flex items-center gap-2">
                            Project Name *
                            <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Enter your amazing project name"
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          />
                          {errors.name && <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.name}
                          </p>}
                        </div>

                        <div>
                          <Label htmlFor="year" className="text-white flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Year *
                          </Label>
                          <Input
                            id="year"
                            value={formData.year}
                            onChange={(e) => handleInputChange("year", e.target.value)}
                            placeholder="2024"
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          />
                          {errors.year && <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.year}
                          </p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="tagline" className="text-white">Project Tagline</Label>
                        <Input
                          id="tagline"
                          value={formData.tagline}
                          onChange={(e) => handleInputChange("tagline", e.target.value)}
                          placeholder="A brief, catchy description of your project"
                          className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-white flex items-center gap-2">
                          Project Description *
                          <span className="text-red-400">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Provide a detailed description of your project, its purpose, and what makes it special..."
                          rows={4}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors resize-none"
                        />
                        {errors.description && <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.description}
                        </p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="role" className="text-white flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Your Role *
                          </Label>
                          <Input
                            id="role"
                            value={formData.role}
                            onChange={(e) => handleInputChange("role", e.target.value)}
                            placeholder="e.g., Full-Stack Developer, UI Designer"
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          />
                          {errors.role && <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.role}
                          </p>}
                        </div>

                        <div>
                          <Label htmlFor="client" className="text-white">Client/Company</Label>
                          <Input
                            id="client"
                            value={formData.client}
                            onChange={(e) => handleInputChange("client", e.target.value)}
                            placeholder="Client or company name"
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          />
                        </div>

                        <div>
                          <Label htmlFor="team" className="text-white">Team Size</Label>
                          <Input
                            id="team"
                            value={formData.team}
                            onChange={(e) => handleInputChange("team", e.target.value)}
                            placeholder="e.g., Solo project, Team of 3"
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      {formData.project_type === "designer" && (
                        <div>
                          <Label htmlFor="category" className="text-white flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Design Category *
                          </Label>
                          <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => handleInputChange("category", e.target.value)}
                            placeholder="e.g., UI/UX Design, Brand Identity, Web Design"
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          />
                          {errors.category && <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.category}
                          </p>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Project Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-0">
                  {formData.project_type === "developer" ? (
                    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Code className="h-5 w-5 text-green-400" />
                          Development Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="problem" className="text-white">Problem Statement</Label>
                          <Textarea
                            id="problem"
                            value={formData.problem}
                            onChange={(e) => handleInputChange("problem", e.target.value)}
                            placeholder="What problem does this project solve? What challenges did you face?"
                            rows={3}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 transition-colors resize-none"
                          />
                        </div>

                        <div>
                          <Label htmlFor="solution" className="text-white">Solution Approach</Label>
                          <Textarea
                            id="solution"
                            value={formData.solution}
                            onChange={(e) => handleInputChange("solution", e.target.value)}
                            placeholder="How did you solve the problem? What approach did you take?"
                            rows={3}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 transition-colors resize-none"
                          />
                        </div>

                        {/* Features */}
                        <div>
                          <Label className="text-white flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4" />
                            Key Features
                          </Label>
                          <div className="flex gap-2 mb-3">
                            <Input
                              value={newFeature}
                              onChange={(e) => setNewFeature(e.target.value)}
                              placeholder="Add a key feature..."
                              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 transition-colors"
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            />
                            <Button 
                              type="button" 
                              onClick={addFeature} 
                              size="sm" 
                              className="bg-green-500 hover:bg-green-600 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-green-400 border-green-400/50 bg-green-500/10">
                                {feature}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 h-4 w-4 p-0 text-green-400 hover:text-red-400 transition-colors"
                                  onClick={() => removeFromArray("features", index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Paintbrush className="h-5 w-5 text-purple-400" />
                          Design Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="concept" className="text-white">Design Concept</Label>
                          <Textarea
                            id="concept"
                            value={formData.concept}
                            onChange={(e) => handleInputChange("concept", e.target.value)}
                            placeholder="What's the core concept behind your design? What inspired this project?"
                            rows={3}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors resize-none"
                          />
                        </div>

                        <div>
                          <Label htmlFor="philosophy" className="text-white">Design Philosophy</Label>
                          <Textarea
                            id="philosophy"
                            value={formData.philosophy}
                            onChange={(e) => handleInputChange("philosophy", e.target.value)}
                            placeholder="What design principles guided this project? What was your approach?"
                            rows={3}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="heading_font" className="text-white">Heading Font</Label>
                            <Input
                              id="heading_font"
                              value={formData.heading_font}
                              onChange={(e) => handleInputChange("heading_font", e.target.value)}
                              placeholder="e.g., Helvetica, Inter, Roboto"
                              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors"
                            />
                          </div>

                          <div>
                            <Label htmlFor="body_font" className="text-white">Body Font</Label>
                            <Input
                              id="body_font"
                              value={formData.body_font}
                              onChange={(e) => handleInputChange("body_font", e.target.value)}
                              placeholder="e.g., Open Sans, Arial, system-ui"
                              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Color Palette */}
                        <div>
                          <Label className="text-white flex items-center gap-2 mb-2">
                            <Palette className="h-4 w-4" />
                            Color Palette
                          </Label>
                          <div className="flex gap-2 mb-3">
                            <Input
                              type="color"
                              value={newColor}
                              onChange={(e) => setNewColor(e.target.value)}
                              className="w-16 h-10 bg-gray-700/50 border-gray-600 rounded cursor-pointer"
                            />
                            <Input
                              value={newColor}
                              onChange={(e) => setNewColor(e.target.value)}
                              placeholder="#3b82f6"
                              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors"
                            />
                            <Button 
                              type="button" 
                              onClick={addColor} 
                              size="sm" 
                              className="bg-purple-500 hover:bg-purple-600 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                            {formData.colors.map((color, index) => (
                              <div key={index} className="group relative">
                                <div 
                                  className="w-full h-12 rounded-lg border-2 border-gray-600 cursor-pointer shadow-lg transition-transform hover:scale-105" 
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                  onClick={() => removeFromArray("colors", index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <span className="text-xs text-gray-400 mt-1 block text-center">{color}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tools Section (for both types) */}
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Tools & Technologies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 mb-3">
                        <Input
                          value={newTool}
                          onChange={(e) => setNewTool(e.target.value)}
                          placeholder={formData.project_type === "developer" ? "Add a tool/framework..." : "Add a design tool..."}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                        />
                        <Button 
                          type="button" 
                          onClick={addTool} 
                          size="sm" 
                          className={`${formData.project_type === "developer" ? "bg-green-500 hover:bg-green-600" : "bg-purple-500 hover:bg-purple-600"} transition-colors`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tools.map((tool, index) => (
                          <Badge key={index} variant="outline" className="text-blue-400 border-blue-400/50 bg-blue-500/10">
                            {tool}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-4 w-4 p-0 text-blue-400 hover:text-red-400 transition-colors"
                              onClick={() => removeFromArray("tools", index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Media & Links Tab */}
                <TabsContent value="media" className="space-y-6 mt-0">
                  {/* Project Images */}
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Project Images
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 mb-4">
                        <Input
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="Enter image URL..."
                          className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                        />
                        <Button 
                          type="button" 
                          onClick={addImage} 
                          size="sm" 
                          className="bg-blue-500 hover:bg-blue-600 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Project image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-600 shadow-lg transition-transform hover:scale-105"
                              onError={(e) => {
                                e.target.src = '/placeholder.jpg'
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                              onClick={() => removeFromArray("images", index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Project Links */}
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        Project Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="live_url" className="text-white flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Live Project URL
                          </Label>
                          <Input
                            id="live_url"
                            value={formData.live_url}
                            onChange={(e) => handleInputChange("live_url", e.target.value)}
                            placeholder="https://your-project.com"
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          />
                        </div>

                        <div>
                          <Label htmlFor="case_study_url" className="text-white flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Case Study URL
                          </Label>
                          <Input
                            id="case_study_url"
                            value={formData.case_study_url}
                            onChange={(e) => handleInputChange("case_study_url", e.target.value)}
                            placeholder="https://case-study-url.com"
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          />
                        </div>

                        {formData.project_type === "developer" && (
                          <div>
                            <Label htmlFor="github_url" className="text-white flex items-center gap-2">
                              <Code className="h-4 w-4" />
                              GitHub Repository
                            </Label>
                            <Input
                              id="github_url"
                              value={formData.github_url}
                              onChange={(e) => handleInputChange("github_url", e.target.value)}
                              placeholder="https://github.com/username/repo"
                              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 transition-colors"
                            />
                          </div>
                        )}

                        {formData.project_type === "designer" && (
                          <div>
                            <Label htmlFor="behance_url" className="text-white flex items-center gap-2">
                              <Paintbrush className="h-4 w-4" />
                              Behance URL
                            </Label>
                            <Input
                              id="behance_url"
                              value={formData.behance_url}
                              onChange={(e) => handleInputChange("behance_url", e.target.value)}
                              placeholder="https://behance.net/gallery/project"
                              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6 mt-0">
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Project Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status" className="text-white flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Project Status
                          </Label>
                          <Select 
                            value={formData.status} 
                            onValueChange={(value) => handleInputChange("status", value)}
                          >
                            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="draft">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-yellow-500" />
                                  Draft
                                </div>
                              </SelectItem>
                              <SelectItem value="in-progress">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-blue-500" />
                                  In Progress
                                </div>
                              </SelectItem>
                              <SelectItem value="completed">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  Completed
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="sort_order" className="text-white">Display Order</Label>
                          <Input
                            id="sort_order"
                            type="number"
                            value={formData.sort_order}
                            onChange={(e) => handleInputChange("sort_order", parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                        <Switch
                          id="is_featured"
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                          className="data-[state=checked]:bg-orange-500"
                        />
                        <div>
                          <Label htmlFor="is_featured" className="text-white flex items-center gap-2 cursor-pointer">
                            <Star className="h-4 w-4 text-orange-500" />
                            Featured Project
                          </Label>
                          <p className="text-gray-400 text-sm">Highlight this project on your portfolio homepage</p>
                        </div>
                      </div>

                      {formData.is_featured && (
                        <Alert className="border-orange-500/50 bg-orange-500/10">
                          <Sparkles className="h-4 w-4 text-orange-500" />
                          <AlertDescription className="text-orange-100">
                            This project will be prominently displayed as a featured work on your portfolio.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-700 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              <div className="flex gap-3">
                {!isEditing && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => handleInputChange("status", "draft")}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className={`${
                    formData.project_type === "developer" 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                      : "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                  } text-white transition-all duration-200 shadow-lg hover:shadow-xl`}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? "Update Project" : "Create Project"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 