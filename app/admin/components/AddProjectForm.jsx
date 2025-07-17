"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
  AlertCircle
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
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

export default function AddProjectForm({ projectType = "developer", onSuccess, onCancel }) {
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

    // Flexible data
    json_data: {}
  })

  const [newTool, setNewTool] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newColor, setNewColor] = useState("#516AC8")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const supabase = createClient()

  const colors = {
    primary: "#516AC8",
    secondary: "#E3AF64",
    background: "#F8F7F5"
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.name.trim()) newErrors.name = "Project name is required"
    if (!formData.tagline.trim()) newErrors.tagline = "Tagline is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.role.trim()) newErrors.role = "Role is required"
    if (!formData.year) newErrors.year = "Year is required"

    // Project type specific validations
    if (projectType === "designer" && !formData.category.trim()) {
      newErrors.category = "Category is required for design projects"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const addTool = () => {
    if (newTool.trim() && !formData.tools.includes(newTool.trim())) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, newTool.trim()]
      }))
      setNewTool("")
    }
  }

  const removeTool = (toolToRemove) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(tool => tool !== toolToRemove)
    }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }))
  }

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }))
    }
  }

  const removeColor = (colorToRemove) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // In a real app, you'd upload these to a storage service
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }))
  }

  const removeImage = (imageToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToRemove)
    }))
  }

  const handleSubmit = async (e, statusOverride = null) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors below")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for database
      const submitData = {
        ...formData,
        status: statusOverride || formData.status,
        year: parseInt(formData.year),
        sort_order: parseInt(formData.sort_order),
        project_type: projectType, // Ensure project type is set correctly
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([submitData])
        .select()

      if (error) throw error

      toast.success(`Project ${statusOverride === 'live' ? 'published' : 'saved'} successfully!`)
      
      if (onSuccess) {
        onSuccess()
      }
      
      // Reset form
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

    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = (e) => {
    handleSubmit(e, 'draft')
  }

  const handlePublish = (e) => {
    handleSubmit(e, 'live')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              {projectType === 'developer' ? (
                <Code className="h-6 w-6 text-purple-600" />
              ) : (
                <Paintbrush className="h-6 w-6 text-pink-600" />
              )}
              Add New {projectType === 'developer' ? 'Developer' : 'Designer'} Project
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create a new {projectType} project for your portfolio
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#516AC8] to-[#E3AF64] hover:from-[#4553A8] hover:to-[#D19944] text-white"
          >
            <Globe className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Publishing...' : 'Publish Project'}
          </Button>
        </div>
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors: {Object.values(errors).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handlePublish} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="links">Links & Media</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter project name"
                      className={errors.name ? "border-red-500" : ""}
                      required
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Select 
                      value={formData.year} 
                      onValueChange={(value) => handleInputChange("year", value)}
                    >
                      <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline *</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    placeholder="Brief description of the project"
                    className={errors.tagline ? "border-red-500" : ""}
                    required
                  />
                  {errors.tagline && <p className="text-sm text-red-500">{errors.tagline}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed description of the project"
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                    required
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      placeholder="e.g., Lead Developer, Brand Designer"
                      className={errors.role ? "border-red-500" : ""}
                      required
                    />
                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                  </div>
                  {projectType === "designer" && (
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleInputChange("category", value)}
                      >
                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="branding">Branding</SelectItem>
                          <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                          <SelectItem value="web-design">Web Design</SelectItem>
                          <SelectItem value="print">Print Design</SelectItem>
                          <SelectItem value="illustration">Illustration</SelectItem>
                          <SelectItem value="packaging">Packaging</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client/Company</Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) => handleInputChange("client", e.target.value)}
                      placeholder="e.g., Company name, Personal project"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Input
                      id="team"
                      value={formData.team}
                      onChange={(e) => handleInputChange("team", e.target.value)}
                      placeholder="e.g., Solo project, 4 developers"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                  />
                  <Label htmlFor="is_featured">Featured project</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {projectType === "developer" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="problem">Problem Statement</Label>
                      <Textarea
                        id="problem"
                        value={formData.problem}
                        onChange={(e) => handleInputChange("problem", e.target.value)}
                        placeholder="What problem does this project solve?"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="solution">Solution</Label>
                      <Textarea
                        id="solution"
                        value={formData.solution}
                        onChange={(e) => handleInputChange("solution", e.target.value)}
                        placeholder="How does your solution address the problem?"
                        rows={3}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="concept">Design Concept</Label>
                      <Textarea
                        id="concept"
                        value={formData.concept}
                        onChange={(e) => handleInputChange("concept", e.target.value)}
                        placeholder="What's the core concept behind this design?"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="philosophy">Design Philosophy</Label>
                      <Textarea
                        id="philosophy"
                        value={formData.philosophy}
                        onChange={(e) => handleInputChange("philosophy", e.target.value)}
                        placeholder="What design principles guided this project?"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {/* Tools */}
                <div className="space-y-3">
                  <Label>Tools & Technologies</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      placeholder="Add a tool"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                    />
                    <Button type="button" onClick={addTool} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tools.map((tool, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {tool}
                        <X 
                          className="ml-1 h-3 w-3" 
                          onClick={() => removeTool(tool)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <Label>Key Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer">
                        {feature}
                        <X 
                          className="ml-1 h-3 w-3" 
                          onClick={() => removeFeature(feature)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Visual Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Color Palette */}
                <div className="space-y-3">
                  <Label>Color Palette</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="#516AC8"
                      className="font-mono"
                    />
                    <Button type="button" onClick={addColor} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-1 p-2 border rounded">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-mono">{color}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0"
                          onClick={() => removeColor(color)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heading_font">Heading Font</Label>
                    <Input
                      id="heading_font"
                      value={formData.heading_font}
                      onChange={(e) => handleInputChange("heading_font", e.target.value)}
                      placeholder="e.g., Poppins, Inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body_font">Body Font</Label>
                    <Input
                      id="body_font"
                      value={formData.body_font}
                      onChange={(e) => handleInputChange("body_font", e.target.value)}
                      placeholder="e.g., Open Sans, Roboto"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Links & Media Tab */}
          <TabsContent value="links" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Links & Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="live_url">Live URL</Label>
                    <Input
                      id="live_url"
                      type="url"
                      value={formData.live_url}
                      onChange={(e) => handleInputChange("live_url", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  {projectType === "developer" && (
                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub URL</Label>
                      <Input
                        id="github_url"
                        type="url"
                        value={formData.github_url}
                        onChange={(e) => handleInputChange("github_url", e.target.value)}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  )}
                  {projectType === "designer" && (
                    <div className="space-y-2">
                      <Label htmlFor="behance_url">Behance URL</Label>
                      <Input
                        id="behance_url"
                        type="url"
                        value={formData.behance_url}
                        onChange={(e) => handleInputChange("behance_url", e.target.value)}
                        placeholder="https://behance.net/project"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="case_study_url">Case Study URL</Label>
                    <Input
                      id="case_study_url"
                      type="url"
                      value={formData.case_study_url}
                      onChange={(e) => handleInputChange("case_study_url", e.target.value)}
                      placeholder="https://case-study.com"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <Label>Project Images</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Label 
                          htmlFor="image-upload"
                          className="cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500"
                        >
                          Click to upload images
                        </Label>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                          PNG, JPG, GIF up to 10MB each
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Project image ${index + 1}`}
                            className="w-full h-32 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(image)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
} 