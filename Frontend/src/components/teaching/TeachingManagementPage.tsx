"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "../common/Header"
import { Sidebar } from "../common/Sidebar"
import { api } from "../../services/api"
import type { Teaching } from "../../types/teaching"
import Search from "../common/Search"
import AddButton from "./Addbutton"
import TeachingTable from "./TeachingTable"
import "./TeachingManagementPage.css"

/**
 * TeachingManagementPage Component
 *
 * This component is responsible for displaying and managing teaching assignments.
 * It includes functionality for:
 * - Fetching teaching assignments from the API
 * - Searching teaching assignments
 * - Pagination
 * - Deleting teaching assignments
 * - Displaying teaching assignment details in a table
 */

export const TeachingManagementPage: React.FC = () => {
  // State variables for managing teaching assignments data and UI
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
   // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      console.log("Debounced search term updated:", searchTerm)
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
        console.log("Fetching teachings with parameters:", {
          currentPage,
          itemsPerPage,
          search: debouncedSearchTerm,
        })

        const response = await api.getModelData("ChargesEnseignement", {
          page: currentPage,
          itemsPerPage: itemsPerPage,
          search: debouncedSearchTerm,
        })

        console.log("Raw teaching data from API:", response)

        // Adjust for a raw array response from the API.
        setTeachings(response)
        setTotalTeachings(response.length)
        setError(null)
        console.log("Teachings state updated. Total teachings:", response.length)
      } catch (err) {
        console.error("Error fetching teachings:", err)
        setError("Failed to fetch teaching assignments. Please try again later.")
        setTeachings([])
      } finally {
        setLoading(false)
        console.log("Fetch teachings loading state set to false")
      }
    }

    fetchTeachings()
  }, [currentPage, itemsPerPage, debouncedSearchTerm])

  // Handle page change
  const handlePageChange = (page: number) => {
    console.log("Changing page to:", page)
    setCurrentPage(page)
  }

  // Handle teaching deletion using the API
  const handleDeleteTeaching = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this teaching assignment?")) {
      try {
        console.log("Deleting teaching assignment with id:", id)
        await api.deleteModel("ChargesEnseignement", id)
        console.log("Teaching assignment deleted successfully. Refreshing list...")

        const response = await api.getModelData("ChargesEnseignement", {
          page: currentPage,
          itemsPerPage: itemsPerPage,
          search: debouncedSearchTerm,
        })
        console.log("New teaching data after deletion:", response)

        setTeachings(response)
        setTotalTeachings(response.length)
      } catch (err) {
        console.error("Error deleting teaching assignment:", err)
        alert("Failed to delete teaching assignment. Please try again later.")
      }
    }
  }

  // Handle editing a teaching assignment (navigates to the edit page)
  const handleEditTeaching = (id: number) => {
    console.log("Editing teaching assignment with id:", id)
    window.location.href = `/teachings/edit/${id}`
  }

  // Handle adding a new teaching assignment
  const handleAddTeaching = () => {
    console.log("Add teaching action triggered")
    alert("Add teaching functionality would open a form here")
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalTeachings / itemsPerPage)
  console.log("Calculated total pages:", totalPages)

  return (
    <div className="teaching-management-layout">
      <Sidebar />
      <div className="teaching-management-main">
        <Header title="Teaching Management" />
        <main className="teaching-management-content">
          <div className="teaching-management-actions">
            <div className="search-and-actions">
              <Search
                placeholder="Search teaching assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <AddButton  />
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
            <TeachingTable
              teachings={teachings}
              onEdit={handleEditTeaching}
              onDelete={handleDeleteTeaching}
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
