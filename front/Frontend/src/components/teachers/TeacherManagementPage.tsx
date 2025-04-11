"use client"

import React, { useState, useEffect } from "react"
import { Header } from "../common/Header"
import { Sidebar } from "../common/Sidebar"
import { teacherApi } from "../../services/api"
import type { Teacher } from "../../types/teacher"
import Search from "../common/Search"
import AddButton from "../common/AddButton"
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
   * Get CSS class for status badge based on status value
   * @param status - The status string
   * @returns The CSS class name for the status
   */
  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "ADMIN":
        return "status-admin"
      case "MED":
        return "status-med"
      case "MUTATED":
        return "status-mutated"
      case "RETIRED":
        return "status-retired"
      default:
        return ""
    }
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
              <AddButton text="Add Teacher" onClick={handleAddTeacher} />
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
            <>
              <div className="teacher-table-container">
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Teacher Code</th>
                      <th>First & last name</th>
                      <th>Birth Name</th>
                      <th>Gender</th>
                      <th>Department</th>
                      <th>Grade</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="no-data">
                          No teachers found
                        </td>
                      </tr>
                    ) : (
                      teachers.map((teacher) => (
                        <tr key={teacher.id}>
                          <td>
                            <div className="teacher-code">
                              <div className="teacher-avatar"></div>
                              {teacher.code}
                            </div>
                          </td>
                          <td>{`${teacher.firstName} ${teacher.lastName}`}</td>
                          <td>{teacher.birthName}</td>
                          <td>{teacher.gender}</td>
                          <td>{teacher.department}</td>
                          <td>{teacher.grade}</td>
                          <td>{teacher.email}</td>
                          <td>{teacher.phone}</td>
                          <td>
                            <span className={`status-badge ${getStatusClass(teacher.status)}`}>{teacher.status}</span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="edit-button"
                                onClick={() => (window.location.href = `/teachers/edit/${teacher.id}`)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                              <button className="delete-button" onClick={() => handleDeleteTeacher(teacher.id)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, and pages around current page
                      return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there are gaps
                      if (index > 0 && array[index - 1] !== page - 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <span className="pagination-ellipsis">...</span>
                            <button
                              className={`pagination-number ${currentPage === page ? "active" : ""}`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        )
                      }
                      return (
                        <button
                          key={page}
                          className={`pagination-number ${currentPage === page ? "active" : ""}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      )
                    })}
                  <button
                    className="pagination-button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}