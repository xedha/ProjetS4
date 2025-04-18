"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "../common/Header"
import { Sidebar } from "../common/Sidebar"
import { teacherApi } from "../../services/api"
import type { Teacher } from "../../types/teacher"
import Search from "../common/Search"
import AddButton from "../common/AddButton"
import TeacherTable from "./TeacherTable"
import "./TeacherManagementPage.css"

/**
 * TeacherManagementPage Component
 *
 * This component is responsible for displaying and managing the list of teachers.
 * It includes functionality for:
 * - Fetching teachers from the API
 * - Searching teachers
 * - Pagination
 * - Deleting teachers
 * - Displaying teacher details in a table
 */
export const TeacherManagementPage: React.FC = () => {
  // State variables for managing teachers data and UI

  // State management for teachers data
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalTeachers, setTotalTeachers] = useState<number>(0)
  const [itemsPerPage] = useState<number>(10)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

  // Debounce search term to avoid too many API calls
  // This creates a delay between user typing and API request
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    // Cleanup function to clear the timeout if component unmounts or searchTerm changes again
    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm])

  // Fetch teachers when page, items per page, or search term changes
  useEffect(() => {
    /**
     * Async function to fetch teachers from the API
     * Updates state based on API response
     */
    const fetchTeachers = async () => {
      try {
        // Set loading state to true while fetching data
        setLoading(true)

        // Call the API to get teachers with pagination and search
        const response = await teacherApi.getTeachers(currentPage, itemsPerPage, debouncedSearchTerm)

        // Update state with the fetched data
        setTeachers(response.teachers)
        setTotalTeachers(response.total)
        setError(null)
      } catch (err) {
        // Handle any errors that occur during the API call
        console.error("Error fetching teachers:", err)
        setError("Failed to fetch teachers. Please try again later.")
        setTeachers([])
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false)
      }
    }

    // Call the fetch function
    fetchTeachers()
  }, [currentPage, itemsPerPage, debouncedSearchTerm])

  /**
   * Handle page change for pagination
   * @param page - The page number to navigate to
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  /**
   * Handle teacher deletion
   * Confirms with user before deleting and refreshes the list afterward
   * @param id - The ID of the teacher to delete
   */
  const handleDeleteTeacher = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        // Call API to delete the teacher
        await teacherApi.deleteTeacher(id)

        // Refresh the teacher list after successful deletion
        const response = await teacherApi.getTeachers(currentPage, itemsPerPage, debouncedSearchTerm)
        setTeachers(response.teachers)
        setTotalTeachers(response.total)
      } catch (err) {
        // Handle any errors during deletion
        console.error("Error deleting teacher:", err)
        alert("Failed to delete teacher. Please try again later.")
      }
    }
  }

  /**
   * Handle editing a teacher
   * @param id - The ID of the teacher to edit
   */
  const handleEditTeacher = (id: number) => {
    // In a real app, this would open a form or navigate to an edit page
    window.location.href = `/teachers/edit/${id}`
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalTeachers / itemsPerPage)

  /**
   * Handle adding a new teacher
   * This would typically open a form or modal
   */
  const handleAddTeacher = () => {
    // In a real app, this would open a form or navigate to a create page
    alert("Add teacher functionality would open a form here")
  }

  return (
    <div className="teacher-management-layout">
      <Sidebar />
      <div className="teacher-management-main">
        <Header title="Teacher Management" />
        <main className="teacher-management-content">
          <div className="teacher-management-actions">
            <div className="search-and-actions">
              <Search
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <AddButton  onClick={handleAddTeacher} name="Add Teacher" />
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading teachers...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button
                className="retry-button"
                onClick={() => {
                  setCurrentPage(1)
                  setDebouncedSearchTerm(searchTerm)
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <TeacherTable
              teachers={teachers}
              onEdit={handleEditTeacher}
              onDelete={handleDeleteTeacher}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  )
}
