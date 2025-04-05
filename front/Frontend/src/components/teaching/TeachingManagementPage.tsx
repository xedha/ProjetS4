"use client"

import React, { useState, useEffect } from "react"
import { Header } from "../common/Header"
import { Sidebar } from "../common/Sidebar"
import { teachingApi } from "../../services/api"
import type { Teaching } from "../../types/teaching"
import "./TeachingManagementPage.css"

export const TeachingManagementPage: React.FC = () => {
  const [teachings, setTeachings] = useState<Teaching[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalTeachings, setTotalTeachings] = useState<number>(0)
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

  // Fetch teachings when page, items per page, or search term changes
  useEffect(() => {
    const fetchTeachings = async () => {
      try {
        setLoading(true)
        const response = await teachingApi.getTeachings(currentPage, itemsPerPage, debouncedSearchTerm)
        setTeachings(response.teachings)
        setTotalTeachings(response.total)
        setError(null)
      } catch (err) {
        console.error("Error fetching teachings:", err)
        setError("Failed to fetch teaching assignments. Please try again later.")
        setTeachings([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeachings()
  }, [currentPage, itemsPerPage, debouncedSearchTerm])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle teaching deletion
  const handleDeleteTeaching = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this teaching assignment?")) {
      try {
        await teachingApi.deleteTeaching(id)
        // Refresh the teaching list
        const response = await teachingApi.getTeachings(currentPage, itemsPerPage, debouncedSearchTerm)
        setTeachings(response.teachings)
        setTotalTeachings(response.total)
      } catch (err) {
        console.error("Error deleting teaching assignment:", err)
        alert("Failed to delete teaching assignment. Please try again later.")
      }
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalTeachings / itemsPerPage)

  return (
    <div className="teaching-management-layout">
      <Sidebar />
      <div className="teaching-management-main">
        <Header title="Teaching Management" />
        <main className="teaching-management-content">
          <div className="teaching-management-actions">
            <div className="search-and-actions">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search teaching assignments..."
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
              <p>Loading teaching assignments...</p>
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
              <div className="teaching-table-container">
                <table className="teaching-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Specialty</th>
                      <th>Semester</th>
                      <th>Section</th>
                      <th>Group</th>
                      <th>Type</th>
                      <th>Module Name</th>
                      <th>Module Abbreviation</th>
                      <th>Teacher</th>
                      <th>Hours</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachings.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="no-data">
                          No teaching assignments found
                        </td>
                      </tr>
                    ) : (
                      teachings.map((teaching) => (
                        <tr key={teaching.id}>
                          <td>{teaching.level}</td>
                          <td>{teaching.specialty}</td>
                          <td>{teaching.semester}</td>
                          <td>{teaching.section}</td>
                          <td>{teaching.group}</td>
                          <td>{teaching.type}</td>
                          <td>{teaching.moduleName}</td>
                          <td>{teaching.moduleAbbreviation}</td>
                          <td>{teaching.teacher}</td>
                          <td>{teaching.hours}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="edit-button"
                                onClick={() => (window.location.href = `/teachings/edit/${teaching.id}`)}
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
                              <button className="delete-button" onClick={() => handleDeleteTeaching(teaching.id)}>
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

