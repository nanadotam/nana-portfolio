import { createClient } from './supabase/server'

// Fetch all projects
export async function getProjects() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  
  return projects || []
}

// Fetch projects by type (developer or designer)
export async function getProjectsByType(projectType) {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('project_type', projectType)
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching projects by type:', error)
    return []
  }
  
  return projects || []
}

// Fetch featured projects
export async function getFeaturedProjects() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
  
  return projects || []
}

// Fetch single project by ID
export async function getProject(id) {
  const supabase = await createClient()
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching project:', error)
    return null
  }
  
  return project
}

// Add new project (for admin)
export async function addProject(projectData) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
  
  if (error) {
    console.error('Error adding project:', error)
    return { success: false, error }
  }
  
  return { success: true, data }
}

// Update project (for admin)
export async function updateProject(id, projectData) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .update({ ...projectData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating project:', error)
    return { success: false, error }
  }
  
  return { success: true, data }
}

// Delete project (for admin)
export async function deleteProject(id) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting project:', error)
    return { success: false, error }
  }
  
  return { success: true }
} 