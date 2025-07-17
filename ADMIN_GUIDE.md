# Admin Dashboard Guide

## Overview

This admin dashboard provides comprehensive management capabilities for your portfolio projects. You can manage both developer and designer projects through dedicated interfaces with full CRUD (Create, Read, Update, Delete) functionality.

## New Pages Created

### 1. Developer Projects Page (`/admin/developer`)
- **Route**: `http://localhost:3000/admin/developer`
- **Purpose**: Manage all development projects
- **Features**:
  - View all developer projects in a card grid layout
  - Search projects by name, tagline, or description
  - Filter by project status (live, draft, in-progress)
  - Add new developer projects
  - Edit existing projects
  - Delete projects with confirmation
  - Quick access to live URLs and GitHub repositories

### 2. Designer Projects Page (`/admin/designer`)
- **Route**: `http://localhost:3000/admin/designer`
- **Purpose**: Manage all design projects
- **Features**:
  - View all designer projects with visual previews
  - Search and filter functionality
  - Category-based filtering
  - Color palette previews
  - Image count indicators
  - Links to Behance and case studies

## Components Created

### 1. ProjectModal Component
- **File**: `app/admin/components/ProjectModal.jsx`
- **Purpose**: Universal modal for creating and editing projects
- **Features**:
  - Tabbed interface for organized data entry
  - Support for both developer and designer project types
  - Image upload functionality
  - Color palette management
  - Tools and features management
  - Form validation
  - Status management

### 2. Database Operations Utility
- **File**: `utils/projectOperations.js`
- **Purpose**: Centralized database operations for projects
- **Functions**:
  - `createProject()` - Create new projects
  - `getAllProjects()` - Fetch all projects with options
  - `getProjectsByType()` - Get projects by type (developer/designer)
  - `updateProject()` - Update existing projects
  - `deleteProject()` - Delete projects
  - `searchProjects()` - Search functionality
  - `getProjectStats()` - Get dashboard statistics
  - And many more utility functions

## How to Use

### Adding a New Project

1. **Navigate to the appropriate page**:
   - For developer projects: `/admin/developer`
   - For designer projects: `/admin/designer`

2. **Click "Add Project" button**
   - Green button for developer projects
   - Purple button for designer projects

3. **Fill out the form in the modal**:
   - **Basic Info Tab**: Name, description, year, role, etc.
   - **Details Tab**: Project-specific details (problem/solution for dev, concept/philosophy for design)
   - **Media & Links Tab**: Images, project URLs, GitHub/Behance links
   - **Settings Tab**: Status, featured flag, sort order

4. **Click "Create Project"** to save

### Editing an Existing Project

1. **Find the project** you want to edit
2. **Click the edit icon** (pencil icon) on the project card
3. **Modify the fields** in the modal
4. **Click "Update Project"** to save changes

### Deleting a Project

1. **Click the delete icon** (trash icon) on the project card
2. **Confirm deletion** in the alert dialog
3. **Project will be permanently removed**

### Using Search and Filters

- **Search**: Type in the search box to find projects by name, tagline, or description
- **Status Filter**: Filter by project status (All, Live, Draft, In Progress)
- **Category Filter**: (Designer projects only) Filter by design category

## Database Schema

The projects table includes these key fields:

```sql
-- Basic Information
name, tagline, description, category, project_type, year, role, client, team

-- Status & Organization
is_featured, status, sort_order

-- Developer-Specific
problem, solution, features[]

-- Designer-Specific  
concept, philosophy, heading_font, body_font, colors[]

-- Media & Links
images[], live_url, github_url, case_study_url, behance_url

-- Common
tools[], created_at, updated_at
```

## Example SQL Operations

See `utils/example-queries.sql` for comprehensive examples of:
- Creating projects
- Querying by different criteria
- Updating project details
- Advanced analytics queries
- Maintenance operations

## API Functions Available

### Create Operations
```javascript
import { createProject } from '@/utils/projectOperations'

const newProject = await createProject({
  name: "My New Project",
  description: "Project description",
  project_type: "developer",
  // ... other fields
})
```

### Read Operations
```javascript
import { getProjectsByType, searchProjects } from '@/utils/projectOperations'

// Get all developer projects
const devProjects = await getProjectsByType('developer')

// Search projects
const results = await searchProjects('dashboard', 'developer')
```

### Update Operations
```javascript
import { updateProject, toggleProjectFeatured } from '@/utils/projectOperations'

// Update project
await updateProject(projectId, { status: 'live' })

// Toggle featured status
await toggleProjectFeatured(projectId, true)
```

### Delete Operations
```javascript
import { deleteProject } from '@/utils/projectOperations'

await deleteProject(projectId)
```

## Project Types

### Developer Projects
- **Focus**: Technical implementation details
- **Key Fields**: problem, solution, features, github_url
- **Color Theme**: Green accents
- **Tools**: Programming languages, frameworks, databases

### Designer Projects  
- **Focus**: Design process and visual elements
- **Key Fields**: concept, philosophy, colors, category, behance_url
- **Color Theme**: Purple accents
- **Tools**: Design software, prototyping tools

## Status Types

- **Draft**: Work in progress, not visible publicly
- **In Progress**: Currently being developed/designed
- **Live**: Published and visible on the portfolio
- **Archived**: Completed but no longer actively displayed

## Navigation

The admin layout includes navigation for:
- Dashboard (overview)
- All Projects (combined view)
- Developer Projects (dev-specific)
- Designer Projects (design-specific)
- Add Project forms
- Settings

## Features

### Search & Filter
- Real-time search across multiple fields
- Status-based filtering
- Category filtering for design projects
- Clear visual indicators for project status

### Project Management
- Drag-and-drop reordering (via sort_order)
- Bulk operations support
- Featured project toggling
- Status management workflow

### Media Management
- Multiple image upload support
- Image preview in project cards
- Color palette management for design projects
- External link management

### Analytics
- Project count by type
- Status distribution
- Featured project tracking
- Tools usage analytics

## Security Notes

- All database operations use Supabase RLS (Row Level Security)
- Admin access should be protected by authentication
- Image uploads should be validated and sanitized
- SQL injection protection via parameterized queries

## Performance Considerations

- Projects are paginated for large datasets
- Images are lazy-loaded
- Search is debounced to prevent excessive queries
- Efficient indexing on commonly queried fields

## Troubleshooting

### Common Issues

1. **Projects not loading**: Check Supabase connection and environment variables
2. **Images not displaying**: Verify image URLs and CORS settings
3. **Search not working**: Check database indexes and search syntax
4. **Modal not opening**: Check for JavaScript errors in console

### Debug Tips

- Use browser dev tools to inspect network requests
- Check Supabase logs for database errors
- Verify project data structure matches schema
- Test CRUD operations with the example SQL queries

## Future Enhancements

Potential improvements to consider:
- Bulk import/export functionality
- Advanced analytics dashboard
- Image optimization and CDN integration
- Version control for project changes
- Collaboration features for team management
- Automated backups and data migration tools

---

## Getting Started

1. Ensure your Supabase database has the projects table created (use `DB.sql`)
2. Configure environment variables for Supabase connection
3. Navigate to `/admin` to access the dashboard
4. Start by creating your first project using the appropriate page
5. Use the example SQL queries to test database operations

For technical support, refer to the project's main documentation or contact the development team. 