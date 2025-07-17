import { createClient } from "./supabase/client"

// Create a Supabase client instance
const supabase = createClient()

/**
 * PROJECT CRUD OPERATIONS
 * Complete set of database operations for the projects table
 */

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new project
 * @param {Object} projectData - Project data to insert
 * @returns {Promise<{data, error}>}
 */
export const createProject = async (projectData) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error creating project:', error)
    return { data: null, error }
  }
}

/**
 * Create multiple projects (bulk insert)
 * @param {Array} projectsArray - Array of project data objects
 * @returns {Promise<{data, error}>}
 */
export const createMultipleProjects = async (projectsArray) => {
  try {
    const projectsWithTimestamps = projectsArray.map(project => ({
      ...project,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('projects')
      .insert(projectsWithTimestamps)
      .select()

    return { data, error }
  } catch (error) {
    console.error('Error creating multiple projects:', error)
    return { data: null, error }
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get all projects
 * @param {Object} options - Query options
 * @param {string} options.orderBy - Column to order by (default: 'created_at')
 * @param {boolean} options.ascending - Sort order (default: false)
 * @param {number} options.limit - Number of records to return
 * @returns {Promise<{data, error}>}
 */
export const getAllProjects = async (options = {}) => {
  try {
    const { orderBy = 'created_at', ascending = false, limit } = options
    
    let query = supabase
      .from('projects')
      .select('*')
      .order(orderBy, { ascending })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    return { data, error }
  } catch (error) {
    console.error('Error fetching all projects:', error)
    return { data: null, error }
  }
}

/**
 * Get projects by type (developer or designer)
 * @param {string} projectType - 'developer' or 'designer'
 * @param {Object} options - Query options
 * @returns {Promise<{data, error}>}
 */
export const getProjectsByType = async (projectType, options = {}) => {
  try {
    const { orderBy = 'created_at', ascending = false, limit } = options
    
    let query = supabase
      .from('projects')
      .select('*')
      .eq('project_type', projectType)
      .order(orderBy, { ascending })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    return { data, error }
  } catch (error) {
    console.error(`Error fetching ${projectType} projects:`, error)
    return { data: null, error }
  }
}

/**
 * Get a single project by ID
 * @param {string} projectId - Project UUID
 * @returns {Promise<{data, error}>}
 */
export const getProjectById = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error fetching project by ID:', error)
    return { data: null, error }
  }
}

/**
 * Get featured projects
 * @param {string} projectType - Optional: filter by project type
 * @returns {Promise<{data, error}>}
 */
export const getFeaturedProjects = async (projectType = null) => {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .eq('is_featured', true)
      .order('sort_order', { ascending: true })

    if (projectType) {
      query = query.eq('project_type', projectType)
    }

    const { data, error } = await query

    return { data, error }
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return { data: null, error }
  }
}

/**
 * Get projects by status
 * @param {string} status - Project status ('live', 'draft', 'in-progress', etc.)
 * @param {string} projectType - Optional: filter by project type
 * @returns {Promise<{data, error}>}
 */
export const getProjectsByStatus = async (status, projectType = null) => {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (projectType) {
      query = query.eq('project_type', projectType)
    }

    const { data, error } = await query

    return { data, error }
  } catch (error) {
    console.error(`Error fetching projects with status ${status}:`, error)
    return { data: null, error }
  }
}

/**
 * Search projects by text
 * @param {string} searchTerm - Text to search for
 * @param {string} projectType - Optional: filter by project type
 * @returns {Promise<{data, error}>}
 */
export const searchProjects = async (searchTerm, projectType = null) => {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (projectType) {
      query = query.eq('project_type', projectType)
    }

    const { data, error } = await query

    return { data, error }
  } catch (error) {
    console.error('Error searching projects:', error)
    return { data: null, error }
  }
}

/**
 * Get projects by category (for designer projects)
 * @param {string} category - Project category
 * @returns {Promise<{data, error}>}
 */
export const getProjectsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .eq('project_type', 'designer')
      .order('created_at', { ascending: false })

    return { data, error }
  } catch (error) {
    console.error(`Error fetching projects by category ${category}:`, error)
    return { data: null, error }
  }
}

/**
 * Get project statistics
 * @returns {Promise<{data, error}>}
 */
export const getProjectStats = async () => {
  try {
    const { data: allProjects, error } = await supabase
      .from('projects')
      .select('project_type, status, is_featured')

    if (error) throw error

    const stats = {
      total: allProjects.length,
      developer: allProjects.filter(p => p.project_type === 'developer').length,
      designer: allProjects.filter(p => p.project_type === 'designer').length,
      live: allProjects.filter(p => p.status === 'live').length,
      draft: allProjects.filter(p => p.status === 'draft').length,
      featured: allProjects.filter(p => p.is_featured === true).length,
      inProgress: allProjects.filter(p => p.status === 'in-progress').length
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error('Error fetching project stats:', error)
    return { data: null, error }
  }
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update a project
 * @param {string} projectId - Project UUID
 * @param {Object} updateData - Data to update
 * @returns {Promise<{data, error}>}
 */
export const updateProject = async (projectId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error updating project:', error)
    return { data: null, error }
  }
}

/**
 * Update project status
 * @param {string} projectId - Project UUID
 * @param {string} status - New status
 * @returns {Promise<{data, error}>}
 */
export const updateProjectStatus = async (projectId, status) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error updating project status:', error)
    return { data: null, error }
  }
}

/**
 * Toggle project featured status
 * @param {string} projectId - Project UUID
 * @param {boolean} isFeatured - Featured status
 * @returns {Promise<{data, error}>}
 */
export const toggleProjectFeatured = async (projectId, isFeatured) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        is_featured: isFeatured,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error toggling project featured status:', error)
    return { data: null, error }
  }
}

/**
 * Update project sort order
 * @param {string} projectId - Project UUID
 * @param {number} sortOrder - New sort order
 * @returns {Promise<{data, error}>}
 */
export const updateProjectSortOrder = async (projectId, sortOrder) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        sort_order: sortOrder,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error updating project sort order:', error)
    return { data: null, error }
  }
}

/**
 * Add images to project
 * @param {string} projectId - Project UUID
 * @param {Array} newImages - Array of image URLs to add
 * @returns {Promise<{data, error}>}
 */
export const addProjectImages = async (projectId, newImages) => {
  try {
    // First get current images
    const { data: currentProject, error: fetchError } = await getProjectById(projectId)
    if (fetchError) throw fetchError

    const currentImages = currentProject.images || []
    const updatedImages = [...currentImages, ...newImages]

    const { data, error } = await updateProject(projectId, { images: updatedImages })
    return { data, error }
  } catch (error) {
    console.error('Error adding project images:', error)
    return { data: null, error }
  }
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a project
 * @param {string} projectId - Project UUID
 * @returns {Promise<{data, error}>}
 */
export const deleteProject = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error deleting project:', error)
    return { data: null, error }
  }
}

/**
 * Delete multiple projects
 * @param {Array} projectIds - Array of project UUIDs
 * @returns {Promise<{data, error}>}
 */
export const deleteMultipleProjects = async (projectIds) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .in('id', projectIds)
      .select()

    return { data, error }
  } catch (error) {
    console.error('Error deleting multiple projects:', error)
    return { data: null, error }
  }
}

/**
 * Delete projects by status
 * @param {string} status - Status to delete
 * @param {string} projectType - Optional: filter by project type
 * @returns {Promise<{data, error}>}
 */
export const deleteProjectsByStatus = async (status, projectType = null) => {
  try {
    let query = supabase
      .from('projects')
      .delete()
      .eq('status', status)

    if (projectType) {
      query = query.eq('project_type', projectType)
    }

    const { data, error } = await query.select()

    return { data, error }
  } catch (error) {
    console.error(`Error deleting projects with status ${status}:`, error)
    return { data: null, error }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all unique categories from designer projects
 * @returns {Promise<{data, error}>}
 */
export const getProjectCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('category')
      .eq('project_type', 'designer')
      .not('category', 'is', null)

    if (error) throw error

    const categories = [...new Set(data.map(p => p.category).filter(Boolean))]
    return { data: categories, error: null }
  } catch (error) {
    console.error('Error fetching project categories:', error)
    return { data: null, error }
  }
}

/**
 * Get all unique tools used across projects
 * @param {string} projectType - Optional: filter by project type
 * @returns {Promise<{data, error}>}
 */
export const getProjectTools = async (projectType = null) => {
  try {
    let query = supabase
      .from('projects')
      .select('tools')
      .not('tools', 'is', null)

    if (projectType) {
      query = query.eq('project_type', projectType)
    }

    const { data, error } = await query

    if (error) throw error

    const allTools = data.flatMap(p => p.tools || [])
    const uniqueTools = [...new Set(allTools)]
    return { data: uniqueTools, error: null }
  } catch (error) {
    console.error('Error fetching project tools:', error)
    return { data: null, error }
  }
}

/**
 * Duplicate a project
 * @param {string} projectId - Project UUID to duplicate
 * @param {Object} overrides - Optional data to override in the duplicate
 * @returns {Promise<{data, error}>}
 */
export const duplicateProject = async (projectId, overrides = {}) => {
  try {
    const { data: originalProject, error: fetchError } = await getProjectById(projectId)
    if (fetchError) throw fetchError

    // Remove ID and timestamps, add overrides
    const { id, created_at, updated_at, ...projectData } = originalProject
    const duplicateData = {
      ...projectData,
      ...overrides,
      name: `${originalProject.name} (Copy)`
    }

    return await createProject(duplicateData)
  } catch (error) {
    console.error('Error duplicating project:', error)
    return { data: null, error }
  }
}

// Export default object with all functions for convenience
export default {
  // Create
  createProject,
  createMultipleProjects,
  
  // Read
  getAllProjects,
  getProjectsByType,
  getProjectById,
  getFeaturedProjects,
  getProjectsByStatus,
  searchProjects,
  getProjectsByCategory,
  getProjectStats,
  
  // Update
  updateProject,
  updateProjectStatus,
  toggleProjectFeatured,
  updateProjectSortOrder,
  addProjectImages,
  
  // Delete
  deleteProject,
  deleteMultipleProjects,
  deleteProjectsByStatus,
  
  // Utilities
  getProjectCategories,
  getProjectTools,
  duplicateProject
} 