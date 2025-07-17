"use client"

import { useState } from "react"
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
  Tag
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

export default function AddProjectForm() {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    year: new Date().getFullYear(),
    role: "",
    type: "developer",
    team: "",
    problem: "",
    solution: "",
    concept: "",
    philosophy: "",
    tools: [],
    features: [],
    colors: [],
    headingFont: "",
    bodyFont: "",
    images: [],
    liveUrl: "",
    githubUrl: "",
    behanceUrl: "",
    caseStudyUrl: "",
    status: "draft",
    metadata: ""
  })

  const [newTool, setNewTool] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newColor, setNewColor] = useState("#516AC8")

  const colors = {
    primary: "#516AC8",
    secondary: "#E3AF64",
    background: "#F8F7F5"
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Project data:", formData)
    // Here you would send the data to your API
    alert("Project saved successfully!")
  }

  const handleSaveDraft = () => {
    const draftData = { ...formData, status: "draft" }
    console.log("Draft saved:", draftData)
    alert("Draft saved!")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add New Project</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a new {formData.type} project for your portfolio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#516AC8] to-[#E3AF64] hover:from-[#4553A8] hover:to-[#D19944] text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Publish Project
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Project Type *</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            Developer
                          </div>
                        </SelectItem>
                        <SelectItem value="designer">
                          <div className="flex items-center gap-2">
                            <Paintbrush className="h-4 w-4" />
                            Designer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline *</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    placeholder="Brief description of the project"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
                      min="2000"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      placeholder="e.g., Lead Developer, Designer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team">Team or Client</Label>
                  <Input
                    id="team"
                    value={formData.team}
                    onChange={(e) => handleInputChange("team", e.target.value)}
                    placeholder="e.g., Solo project, Company name, Team size"
                  />
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
                {formData.type === "developer" ? (
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
                    <Label htmlFor="headingFont">Heading Font</Label>
                    <Input
                      id="headingFont"
                      value={formData.headingFont}
                      onChange={(e) => handleInputChange("headingFont", e.target.value)}
                      placeholder="e.g., Poppins, Inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyFont">Body Font</Label>
                    <Input
                      id="bodyFont"
                      value={formData.bodyFont}
                      onChange={(e) => handleInputChange("bodyFont", e.target.value)}
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
                    <Label htmlFor="liveUrl">Live URL</Label>
                    <Input
                      id="liveUrl"
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => handleInputChange("liveUrl", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  {formData.type === "developer" && (
                    <div className="space-y-2">
                      <Label htmlFor="githubUrl">GitHub URL</Label>
                      <Input
                        id="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  )}
                  {formData.type === "designer" && (
                    <div className="space-y-2">
                      <Label htmlFor="behanceUrl">Behance URL</Label>
                      <Input
                        id="behanceUrl"
                        type="url"
                        value={formData.behanceUrl}
                        onChange={(e) => handleInputChange("behanceUrl", e.target.value)}
                        placeholder="https://behance.net/project"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="caseStudyUrl">Case Study URL</Label>
                    <Input
                      id="caseStudyUrl"
                      type="url"
                      value={formData.caseStudyUrl}
                      onChange={(e) => handleInputChange("caseStudyUrl", e.target.value)}
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

                {/* Metadata */}
                <div className="space-y-2">
                  <Label htmlFor="metadata">Additional Metadata (JSON)</Label>
                  <Textarea
                    id="metadata"
                    value={formData.metadata}
                    onChange={(e) => handleInputChange("metadata", e.target.value)}
                    placeholder='{"custom_field": "value", "tags": ["tag1", "tag2"]}'
                    rows={3}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Optional: Add custom fields as JSON for advanced functionality
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
} 