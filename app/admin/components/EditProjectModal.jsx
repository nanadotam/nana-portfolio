"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Save, 
  Code, 
  Paintbrush, 
  Globe, 
  Github,
  ExternalLink,
  Star,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EditProjectModal({ isOpen, onClose, project, onUpdate }) {
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        tagline: project.tagline || '',
        description: project.description || '',
        year: project.year || new Date().getFullYear(),
        role: project.role || '',
        client: project.client || '',
        team: project.team || '',
        project_type: project.project_type || 'developer',
        status: project.status || 'draft',
        featured: project.featured || false,
        url: project.url || '',
        github: project.github || '',
        tools: project.tools || [],
        images: project.images || [],
        problem: project.problem || '',
        solution: project.solution || '',
        features: project.features || []
      })
    }
  }, [project])

  if (!isOpen || !project) return null

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({
      ...prev,
      [field]: array
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onUpdate({
        ...formData,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] border border-gray-700 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                formData.project_type === 'developer' 
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-purple-500/20 text-purple-400'
              }`}>
                {formData.project_type === 'developer' ? (
                  <Code className="h-5 w-5" />
                ) : (
                  <Paintbrush className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Edit Project</h2>
                <p className="text-sm text-gray-400">Update project details and settings</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={formData.status === 'live' ? 'default' : 'secondary'}>
                {formData.status}
              </Badge>
              {formData.featured && <Badge className="bg-orange-500">Featured</Badge>}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <form onSubmit={handleSubmit} className="p-6">
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                  <TabsTrigger value="general" className="text-gray-300">General</TabsTrigger>
                  <TabsTrigger value="content" className="text-gray-300">Content</TabsTrigger>
                  {formData.project_type === 'designer' && (
                    <TabsTrigger value="design" className="text-gray-300">Design</TabsTrigger>
                  )}
                  <TabsTrigger value="settings" className="text-gray-300">Settings</TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Project Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project_type" className="text-gray-300">Project Type</Label>
                      <Select value={formData.project_type} onValueChange={(value) => handleInputChange('project_type', value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-gray-300">Year *</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-gray-300">Role *</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        placeholder="e.g., Full Stack Developer, UI/UX Designer"
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client" className="text-gray-300">Client *</Label>
                      <Input
                        id="client"
                        value={formData.client}
                        onChange={(e) => handleInputChange('client', e.target.value)}
                        placeholder="e.g., Acme Corp, Personal Project"
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team" className="text-gray-300">Team *</Label>
                      <Input
                        id="team"
                        value={formData.team}
                        onChange={(e) => handleInputChange('team', e.target.value)}
                        placeholder="e.g., Solo, 3 developers, 5-person team"
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="text-gray-300">Tagline *</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                      placeholder="Brief one-liner about the project"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Detailed description of the project"
                      className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="url" className="text-gray-300">Live URL</Label>
                      <Input
                        id="url"
                        type="url"
                        value={formData.url}
                        onChange={(e) => handleInputChange('url', e.target.value)}
                        placeholder="https://example.com"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github" className="text-gray-300">GitHub URL</Label>
                      <Input
                        id="github"
                        type="url"
                        value={formData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tools" className="text-gray-300">Tools & Technologies</Label>
                    <Input
                      id="tools"
                      value={formData.tools?.join(', ') || ''}
                      onChange={(e) => handleArrayChange('tools', e.target.value)}
                      placeholder="React, Node.js, PostgreSQL (comma-separated)"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="problem" className="text-gray-300">Problem/Challenge</Label>
                    <Textarea
                      id="problem"
                      value={formData.problem}
                      onChange={(e) => handleInputChange('problem', e.target.value)}
                      placeholder="What problem does this project solve?"
                      className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="solution" className="text-gray-300">Solution</Label>
                    <Textarea
                      id="solution"
                      value={formData.solution}
                      onChange={(e) => handleInputChange('solution', e.target.value)}
                      placeholder="How does your project solve the problem?"
                      className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features" className="text-gray-300">Key Features</Label>
                    <Textarea
                      id="features"
                      value={formData.features?.join('\n') || ''}
                      onChange={(e) => handleArrayChange('features', e.target.value)}
                      placeholder="Enter each feature on a new line"
                      className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images" className="text-gray-300">Image URLs</Label>
                    <Textarea
                      id="images"
                      value={formData.images?.join('\n') || ''}
                      onChange={(e) => handleArrayChange('images', e.target.value)}
                      placeholder="Enter each image URL on a new line"
                      className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                    />
                  </div>
                </TabsContent>

                {/* Design Tab (only for designer projects) */}
                {formData.project_type === 'designer' && (
                  <TabsContent value="design" className="space-y-6">
                    <div className="text-center py-8 text-gray-400">
                      <Paintbrush className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                      <h3 className="text-lg font-semibold mb-2">Design-Specific Fields</h3>
                      <p>Additional design fields like color palettes, typography, and design philosophy will be added here.</p>
                    </div>
                  </TabsContent>
                )}

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-gray-300">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-orange-400" />
                        <div>
                          <Label className="text-gray-300 font-medium">Featured Project</Label>
                          <p className="text-sm text-gray-400">Show this project prominently on the homepage</p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange('featured', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {formData.status === 'live' ? (
                          <Eye className="h-5 w-5 text-green-400" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <Label className="text-gray-300 font-medium">Public Visibility</Label>
                          <p className="text-sm text-gray-400">
                            {formData.status === 'live' 
                              ? 'This project is visible on your public portfolio'
                              : 'This project is only visible in the admin dashboard'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.url && (
                        <Button variant="outline" type="button" asChild className="border-gray-600">
                          <a href={formData.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Live Project
                          </a>
                        </Button>
                      )}
                      {formData.github && (
                        <Button variant="outline" type="button" asChild className="border-gray-600">
                          <a href={formData.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            View on GitHub
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-700 mt-8">
                <Button type="button" variant="outline" onClick={onClose} className="border-gray-600">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 