"use client"

import { useEffect } from "react"

export default function ProjectModal({ isOpen, onClose, project}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
        } else {
            document.body.style.overflow = ""; // Restore scrolling when modal is closed
        }
    }, [isOpen]);
    if (!isOpen || !project) return null;   // If modal is not open or project data is not available, return null
    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-white dark:bg-zinc-900 text-black dark:text-white p-6 overflow-y-auto rounded-lg shadow-lg">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={onClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-xl font-semibold mb-4">{project.name}</h2>
                <p className="mb-4 text-sm text-zinc-400">{project.tagline}</p>
                <p className="mb-4">{project.description}</p>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Project
                </a>
            </div>
        </div>
        )
    }