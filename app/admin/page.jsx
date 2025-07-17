"use client"

import { useState } from "react"
import AdminLayout from "./components/AdminLayout"
import ProjectsTable from "./components/ProjectsTable"
import AddProjectForm from "./components/AddProjectForm"
import SettingsPanel from "./components/SettingsPanel"

export default function AdminPage() {
  const [activeView, setActiveView] = useState("projects")
  const [theme, setTheme] = useState("light")

  const renderActiveView = () => {
    switch (activeView) {
      case "projects":
        return <ProjectsTable />
      case "add-project":
        return <AddProjectForm />
      case "settings":
        return <SettingsPanel theme={theme} setTheme={setTheme} />
      default:
        return <ProjectsTable />
    }
  }

  return (
    <AdminLayout 
      activeView={activeView} 
      setActiveView={setActiveView}
      theme={theme}
      setTheme={setTheme}
    >
      {renderActiveView()}
    </AdminLayout>
  )
} 