"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "../common/Sidebar"
import { Header } from "../common/Header"
import Tabel from "./tabel1/Tabel"
import Addbutton from "./addbutton/Addbutton"
import Search from "./search bar/seach"
import { api } from "../../services/api"
import type { Course } from "../../types/course"

// Import the EditCourseForm you just created
import EditCourseForm from "./addbutton/EditCourseForm"  

import "./course-management.css"

function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10
  const [totalCourses, setTotalCourses] = useState<number>(0)

  // New states to control edit popup
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // Fetch all courses (when search is empty)
  const fetchAllCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setIsSearching(false)
      
      console.log('Fetching all courses...')
      const response = await api.getModelData("Formations", {
        page: currentPage,
        itemsPerPage,
        search: "",
      })

      let data: Course[] = []
      let total: number = 0

      if (Array.isArray(response)) {
        data = response
        total = response.length
      } else if (response.courses && Array.isArray(response.courses)) {
        data = response.courses
        total = typeof response.total === 'number' ? response.total : response.courses.length
      } else if (response.results && Array.isArray(response.results)) {
        data = response.results
        total = typeof response.count === 'number' ? response.count : response.results.length
      } else {
        throw new Error('Unexpected response shape')
      }

      setCourses(data)
      setTotalCourses(total)
    } catch (err: any) {
      setError(`Failed to fetch courses: ${err.message}`)
      setCourses([])
      setTotalCourses(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage])

  // Handle search results from the Search component
  const handleSearchResults = useCallback((results: any[]) => {
    console.log('Received search results:', results)
    setIsSearching(true)
    setCourses(results)
    setTotalCourses(results.length)
    setCurrentPage(1)
    setLoading(false)
  }, [])

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // If search is cleared, fetch all courses
    if (!value.trim()) {
      console.log('Search cleared, fetching all courses')
      fetchAllCourses()
    }
  }, [fetchAllCourses])

  // Initial load and when page changes (only if not searching)
  useEffect(() => {
    if (!isSearching && !searchTerm.trim()) {
      fetchAllCourses()
    }
  }, [fetchAllCourses, isSearching, searchTerm])

  const handleDelete = async (course: Course) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return
    try {
      setLoading(true)
      await api.deleteModel("Formations", course)
      
      // Refresh appropriate data
      if (isSearching && searchTerm) {
        // If searching, clear search and show all
        setSearchTerm("")
        setIsSearching(false)
        fetchAllCourses()
      } else {
        // Otherwise just refresh
        fetchAllCourses()
      }
    } catch (err) {
      alert("Delete failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    const courseToEdit = courses.find(c => c.id === id)
    if (courseToEdit) {
      setSelectedCourse(courseToEdit)
      setShowEditForm(true)
    } else {
      alert("Course not found")
    }
  }

  const handleCourseEdited = () => {
    setShowEditForm(false)
    setSelectedCourse(null)
    
    // Clear search and refresh
    if (isSearching) {
      setSearchTerm("")
      setIsSearching(false)
    }
    fetchAllCourses()
  }

  const handleUploadSuccess = () => {
    setCurrentPage(1)
    setSearchTerm("")
    setIsSearching(false)
    fetchAllCourses()
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCourses = isSearching 
    ? courses.slice(startIndex, endIndex) // Client-side pagination for search
    : courses // Server already paginated

  const totalPages = Math.ceil(totalCourses / itemsPerPage)

  return (
    <div className="teacher-management-layout">
      <Sidebar />
      <div className="teacher-management-main">
        <Header title="Course Management" />
        <main className="course-management-content">
          <div className="course-actions">
            <Search 
              value={searchTerm} 
              onChange={handleSearchChange}
              onSearchResults={handleSearchResults}
              modelName="Formations"
              placeholder="Search courses..."
            />
            <Addbutton onUploadSuccess={handleUploadSuccess} />
            {/* Debug button - remove after testing */}
            <button 
              onClick={async () => {
                console.log('Testing search API directly...');
                try {
                  const result = await api.searchModel('Formations', 'test');
                  console.log('Direct API test result:', result);
                } catch (err) {
                  console.error('Direct API test error:', err);
                }
              }}
              style={{ marginLeft: '10px', padding: '5px 10px' }}
            >
              Test Search API
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading courses...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={fetchAllCourses} className="retry-button">
                Retry
              </button>
            </div>
          ) : (
            <>
              {isSearching && searchTerm && (
                <div className="search-info">
                  <p>
                    Showing {totalCourses} result{totalCourses !== 1 ? 's' : ''} for "{searchTerm}"
                    <button 
                      className="clear-search"
                      onClick={() => {
                        setSearchTerm("")
                        setIsSearching(false)
                        fetchAllCourses()
                      }}
                    >
                      Clear search
                    </button>
                  </p>
                </div>
              )}
              
              {courses.length === 0 ? (
                <div className="empty-state">
                  <p>
                    {isSearching 
                      ? `No courses found for "${searchTerm}"` 
                      : "No courses available"}
                  </p>
                </div>
              ) : (
                <Tabel
                  data={paginatedCourses}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}

          {showEditForm && selectedCourse && (
            <EditCourseForm
              course={selectedCourse}
              setShowPopup={setShowEditForm}
              onEdited={handleCourseEdited}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default CoursePage