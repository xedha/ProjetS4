"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Header } from "../common/Header"
import { Sidebar } from "../common/Sidebar"
import { api } from "../../services/api"
import type { Teaching } from "../../types/teaching"
import Search from "../common/Search"
import AddButton from "./Addbutton"
import TeachingTable from "./TeachingTable"
import EditTeachingForm from "./EditTeachingForm"
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
 * - Uploading teaching assignments via Excel file
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
  
  // Edit form state
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [selectedTeaching, setSelectedTeaching] = useState<Teaching | null>(null)

  // Fetch teachings function
  const fetchTeachings = useCallback(async (search: string = "") => {
    try {
      setLoading(true)
      console.log("Fetching teachings with parameters:", {
        currentPage,
        itemsPerPage,
        search: search,
      })

      const response = await api.getModelData("ChargesEnseignement", {
        page: currentPage,
        itemsPerPage: itemsPerPage,
        search: search,
      })

      console.log("Raw teaching data from API:", response)
      
      // Handle different response formats
      const rawData = Array.isArray(response)
        ? response
        : response.data && Array.isArray(response.data)
          ? response.data
          : []

      setTeachings(rawData)
      
      // Set total count from response or use array length if not available
      const total = response.total_count || rawData.length
      setTotalTeachings(total)
      
      setError(null)
      console.log("Teachings state updated. Total teachings:", rawData.length)
    } catch (err: any) {
      console.error("Error fetching teachings:", err)
      setError("Failed to fetch teaching assignments. Please try again later. Error: " + (err.message || "Unknown error"))
      setTeachings([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage])

  // Initial fetch
  useEffect(() => {
    fetchTeachings(searchTerm)
  }, [currentPage]) // Only re-fetch when page changes

  // Handle search results from Search component
  const handleSearchResults = useCallback((results: any[]) => {
    console.log("Search results received:", results)
    
    setTeachings(results)
    setTotalTeachings(results.length)
    setCurrentPage(1) // Reset to first page on new search
    setLoading(false)
    setError(null)
  }, [])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // If search is cleared, fetch all teachings
    if (!value.trim()) {
      fetchTeachings("")
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    console.log("Changing page to:", page)
    setCurrentPage(page)
  }

  // Handle teaching deletion using the API
  const handleDeleteTeaching = async (teaching: Teaching) => {
    if (!teaching || !teaching.id_charge) {
      console.error("Cannot delete teaching: missing teaching id")
      return
    }

    if (window.confirm("Are you sure you want to delete this teaching assignment?")) {
      try {
        console.log("Deleting teaching assignment with id:", teaching.id_charge)
        await api.deleteModel("ChargesEnseignement", teaching)
        
        setTeachings((prev) => prev.filter((t) => t.id_charge !== teaching.id_charge))
        setTotalTeachings((prev) => prev - 1)
      } catch (err: any) {
        console.error("Error deleting teaching assignment:", err)
        alert("Failed to delete teaching assignment. Please try again later. Error: " + (err.message || "Unknown error"))
      }
    }
  }

  // Handle editing a teaching assignment
  const handleEditTeaching = (id: number) => {
    console.log("Editing teaching assignment with id:", id)
    const teachingToEdit = teachings.find(t => t.id_charge === id)
    if (teachingToEdit) {
      setSelectedTeaching(teachingToEdit)
      setShowEditForm(true)
    } else {
      console.error("Teaching assignment not found for id:", id)
    }
  }

  // Handle editing completion
  const handleTeachingEdited = () => {
    setShowEditForm(false)
    setSelectedTeaching(null)
    fetchTeachings(searchTerm) // Refresh the teaching list
  }

  // Handle successful upload
  const handleUploadSuccess = () => {
    // Reset to first page and refresh the data after successful upload
    setCurrentPage(1)
    setSearchTerm("")
    fetchTeachings("")
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalTeachings / itemsPerPage)

  return (
    <div className="teaching-management-layout">
      <Sidebar />
      <div className="teaching-management-main">
        <Header title="Teaching Management" />
        <main className="teaching-management-content">
          <div className="teaching-management-actions">
            <div className="search-and-actions">
              <Search
                modelName="ChargesEnseignement"
                placeholder="Search teaching assignments..."
                value={searchTerm}
                onChange={handleSearchChange}
                onSearchResults={handleSearchResults}
              />
              <AddButton onUploadSuccess={handleUploadSuccess} />
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
                  setSearchTerm("")
                  fetchTeachings("")
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="teaching-table-container">
              <TeachingTable
                teachings={teachings}
                onEdit={handleEditTeaching}
                onDelete={handleDeleteTeaching}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
          
          {showEditForm && selectedTeaching && (
            <EditTeachingForm 
              teaching={selectedTeaching} 
              setShowPopup={setShowEditForm} 
              onEdited={handleTeachingEdited} 
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default TeachingManagementPage