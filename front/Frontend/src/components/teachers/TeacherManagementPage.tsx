"use client"

import React, { useState, useEffect } from "react"
import { Header } from "../common/Header"
import { Sidebar } from "../common/Sidebar"
import { teacherApi } from "../../services/api"
import type { Teacher } from "../../types/teacher"
import "./TeacherManagementPage.css"

export const TeacherManagementPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalTeachers, setTotalTeachers] = useState<number>(0)
  const [itemsPerPage] = useState<number>(10)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm])

  // Fetch teachers when page, items per page, or search term changes
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true)
        const response = await teacherApi.getTeachers(currentPage, itemsPerPage, debouncedSearchTerm)
        setTeachers(response.teachers)
        setTotalTeachers(response.total)
        setError(null)
      } catch (err) {
        console.error("Error fetching teachers:", err)
        setError("Failed to fetch teachers. Please try again later.")
        setTeachers([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [currentPage, itemsPerPage, debouncedSearchTerm])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle teacher deletion
  const handleDeleteTeacher = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await teacherApi.deleteTeacher(id)
        // Refresh the teacher list
        const response = await teacherApi.getTeachers(currentPage, itemsPerPage, debouncedSearchTerm)
        setTeachers(response.teachers)
        setTotalTeachers(response.total)
      } catch (err) {
        console.error("Error deleting teacher:", err)
        alert("Failed to delete teacher. Please try again later.")
      }
    }
  }

  // Get status class
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

  // Calculate total pages
  const totalPages = Math.ceil(totalTeachers / itemsPerPage)

  return (
    <div className="teacher-management-layout">
      <Sidebar />
      <div className="teacher-management-main">
        <Header title="Teacher Management" />
        <main className="teacher-management-content">
          <div className="teacher-management-actions">
            <div className="search-and-actions">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search teachers..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
                <button className="filter-button" title="Filter">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                </button>
              </div>
              <button className="add-teacher-button">
                <span>+</span> Add Teacher
              </button>
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

