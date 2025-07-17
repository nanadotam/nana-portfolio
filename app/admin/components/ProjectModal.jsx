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
  ExternalLink
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

export default function ProjectModal({ 
  isOpen, 
  onClose, 
  project = null, 
  projectType = "developer", 
  onSuccess 
}) {
  const isEditing = !!project
  
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "", // for designer projects
    project_type: projectType,
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
  const [newColor, setNewColor] = useState("#000000")
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

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3">
            {formData.project_type === "developer" ? (
              <Code className="h-6 w-6 text-green-400" />
            ) : (
              <Paintbrush className="h-6 w-6 text-purple-400" />
            )}
            {isEditing ? `Edit ${formData.project_type} Project` : `Add New ${formData.project_type} Project`}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                <TabsTrigger value="basic" className="text-white">Basic Info</TabsTrigger>
                <TabsTrigger value="details" className="text-white">Details</TabsTrigger>
                <TabsTrigger value="media" className="text-white">Media & Links</TabsTrigger>
                <TabsTrigger value="settings" className="text-white">Settings</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Project Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter project name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="tagline" className="text-white">Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => handleInputChange("tagline", e.target.value)}
                      placeholder="Brief project tagline"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed project description"
                    rows={4}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year" className="text-white">Year *</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => handleInputChange("year", e.target.value)}
                      placeholder="2024"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
                  </div>

                  <div>
                    <Label htmlFor="role" className="text-white">Your Role *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      placeholder="Full-Stack Developer"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role}</p>}
                  </div>

                  {formData.project_type === "designer" && (
                    <div>
                      <Label htmlFor="category" className="text-white">Category *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        placeholder="UI/UX Design"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client" className="text-white">Client</Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) => handleInputChange("client", e.target.value)}
                      placeholder="Client name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="team" className="text-white">Team</Label>
                    <Input
                      id="team"
                      value={formData.team}
                      onChange={(e) => handleInputChange("team", e.target.value)}
                      placeholder="Team members"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4">
                {formData.project_type === "developer" ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="problem" className="text-white">Problem Statement</Label>
                      <Textarea
                        id="problem"
                        value={formData.problem}
                        onChange={(e) => handleInputChange("problem", e.target.value)}
                        placeholder="What problem does this project solve?"
                        rows={3}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="solution" className="text-white">Solution</Label>
                      <Textarea
                        id="solution"
                        value={formData.solution}
                        onChange={(e) => handleInputChange("solution", e.target.value)}
                        placeholder="How does your solution address the problem?"
                        rows={3}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    {/* Features */}
                    <div>
                      <Label className="text-white">Features</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Add a feature"
                          className="bg-gray-700 border-gray-600 text-white"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        />
                        <Button type="button" onClick={addFeature} size="sm" className="bg-green-500 hover:bg-green-600">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                            {feature}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-4 w-4 p-0 text-gray-400 hover:text-red-400"
                              onClick={() => removeFromArray("features", index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="concept" className="text-white">Design Concept</Label>
                      <Textarea
                        id="concept"
                        value={formData.concept}
                        onChange={(e) => handleInputChange("concept", e.target.value)}
                        placeholder="What's the design concept and inspiration?"
                        rows={3}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="philosophy" className="text-white">Design Philosophy</Label>
                      <Textarea
                        id="philosophy"
                        value={formData.philosophy}
                        onChange={(e) => handleInputChange("philosophy", e.target.value)}
                        placeholder="What design principles guided this project?"
                        rows={3}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="heading_font" className="text-white">Heading Font</Label>
                        <Input
                          id="heading_font"
                          value={formData.heading_font}
                          onChange={(e) => handleInputChange("heading_font", e.target.value)}
                          placeholder="Roboto, Helvetica"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="body_font" className="text-white">Body Font</Label>
                        <Input
                          id="body_font"
                          value={formData.body_font}
                          onChange={(e) => handleInputChange("body_font", e.target.value)}
                          placeholder="Open Sans, Arial"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div>
                      <Label className="text-white">Color Palette</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          type="color"
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          className="w-20 h-10 bg-gray-700 border-gray-600"
                        />
                        <Input
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          placeholder="#000000"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                        <Button type="button" onClick={addColor} size="sm" className="bg-purple-500 hover:bg-purple-600">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.colors.map((color, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-700 p-2 rounded">
                            <div 
                              className="w-6 h-6 rounded border border-gray-600" 
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-white text-sm">{color}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 text-gray-400 hover:text-red-400"
                              onClick={() => removeFromArray("colors", index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tools (for both types) */}
                <div>
                  <Label className="text-white">Tools & Technologies</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      placeholder="Add a tool or technology"
                      className="bg-gray-700 border-gray-600 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                    />
                    <Button type="button" onClick={addTool} size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tools.map((tool, index) => (
                      <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                        {tool}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0 text-gray-400 hover:text-red-400"
                          onClick={() => removeFromArray("tools", index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Media & Links Tab */}
              <TabsContent value="media" className="space-y-4">
                {/* Project Images */}
                <div>
                  <Label className="text-white">Project Images</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Image URL"
                      className="bg-gray-700 border-gray-600 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    />
                    <Button type="button" onClick={addImage} size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-32 object-cover rounded border border-gray-600"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg'
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFromArray("images", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-600" />

                {/* Project Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="live_url" className="text-white">Live URL</Label>
                    <Input
                      id="live_url"
                      value={formData.live_url}
                      onChange={(e) => handleInputChange("live_url", e.target.value)}
                      placeholder="https://example.com"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  {formData.project_type === "developer" && (
                    <div>
                      <Label htmlFor="github_url" className="text-white">GitHub URL</Label>
                      <Input
                        id="github_url"
                        value={formData.github_url}
                        onChange={(e) => handleInputChange("github_url", e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  )}

                  {formData.project_type === "designer" && (
                    <div>
                      <Label htmlFor="behance_url" className="text-white">Behance URL</Label>
                      <Input
                        id="behance_url"
                        value={formData.behance_url}
                        onChange={(e) => handleInputChange("behance_url", e.target.value)}
                        placeholder="https://behance.net/project"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="case_study_url" className="text-white">Case Study URL</Label>
                    <Input
                      id="case_study_url"
                      value={formData.case_study_url}
                      onChange={(e) => handleInputChange("case_study_url", e.target.value)}
                      placeholder="https://case-study-url.com"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status" className="text-white">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sort_order" className="text-white">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => handleInputChange("sort_order", parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                  />
                  <Label htmlFor="is_featured" className="text-white">Featured Project</Label>
                </div>

                {formData.is_featured && (
                  <Alert className="border-orange-500 bg-orange-500/10">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <AlertDescription className="text-orange-100">
                      This project will be highlighted on your portfolio homepage.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-600">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className={`${
                  formData.project_type === "developer" 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
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
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 