"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "../../front/Frontend/src/components/common/Sidebar";
import { Header } from "../../front/Frontend/src/components/common/Header";
import CourseTable from "./CourseTable";
import AddButton from "../../front/Frontend/src/components/common/AddButton";
import Search from "./Search";
import type { Course } from "../../front/Frontend/src/types/course";
import ModuleForm from "./ModuleForm";
import SpecialtyForm from "./SpecialtyForm";

/**
 * CoursePage Component
 *
 * This component is responsible for displaying and managing the list of courses.
 * It includes functionality for:
 * - Fetching courses from the API
 * - Searching courses
 * - Adding new modules and specialties
 * - Deleting courses
 * - Displaying course details in a table
 */
function CoursePage() {
  // State variables for managing courses data and UI
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [itemsPerPage] = useState<number>(10);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [showModuleForm, setShowModuleForm] = useState<boolean>(false);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState<boolean>(false);

  // Sample data for development
  const sampleData: Course[] = [
    {
      id: 1,
      level: "L3",
      specialty: "Computer Science",
      semester: "S1",
      moduleTitle: "Database Systems",
      moduleAbbreviation: "DB",
      coefficient: 3,
      credits: 6,
      unit: "UEF",
      lectureHours: 21,
      tutorialHours: 10.5,
      practicalHours: 10.5,
    },
    {
      id: 2,
      level: "L3",
      specialty: "Computer Science",
      semester: "S1",
      moduleTitle: "Web Development",
      moduleAbbreviation: "WEB",
      coefficient: 2,
      credits: 4,
      unit: "UEM",
      lectureHours: 21,
      tutorialHours: 0,
      practicalHours: 21,
    },
    {
      id: 3,
      level: "L3",
      specialty: "Computer Science",
      semester: "S1",
      moduleTitle: "Algorithms",
      moduleAbbreviation: "ALGO",
      coefficient: 3,
      credits: 6,
      unit: "UEF",
      lectureHours: 31.5,
      tutorialHours: 21,
      practicalHours: 0,
    },
    {
      id: 4,
      level: "L3",
      specialty: "Computer Science",
      semester: "S2",
      moduleTitle: "Operating Systems",
      moduleAbbreviation: "OS",
      coefficient: 3,
      credits: 5,
      unit: "UEF",
      lectureHours: 21,
      tutorialHours: 10.5,
      practicalHours: 10.5,
    },
    {
      id: 5,
      level: "L3",
      specialty: "Computer Science",
      semester: "S2",
      moduleTitle: "Software Engineering",
      moduleAbbreviation: "SE",
      coefficient: 2,
      credits: 4,
      unit: "UEM",
      lectureHours: 21,
      tutorialHours: 10.5,
      practicalHours: 0,
    },
  ];

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Fetch courses when page, items per page, or search term changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await courseApi.getCourses(currentPage, itemsPerPage, debouncedSearchTerm)
        // setCourses(response.courses)
        // setTotalCourses(response.total)

        // For now, use sample data
        setCourses(sampleData);
        setTotalCourses(sampleData.length);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses. Please try again later.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, itemsPerPage, debouncedSearchTerm]);

  // Handle course deletion
  const handleDeleteCourse = (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        // In a real app, this would be an API call
        // await courseApi.deleteCourse(id)

        // For now, just filter the courses
        setCourses(courses.filter((course) => course.id !== id));
      } catch (err) {
        console.error("Error deleting course:", err);
        alert("Failed to delete course. Please try again later.");
      }
    }
  };

  // Handle editing a course
  const handleEditCourse = (id: number) => {
    // In a real app, this would open a form or navigate to an edit page
    setShowModuleForm(true);
  };

  return (
    <>
      <div className="teacher-management-layout">
        <Sidebar />
        <div className="teacher-management-main">
          <Header title="Course Management" />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => {
              setCurrentPage(1);
              setDebouncedSearchTerm(searchTerm);
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <CourseTable
          courses={courses}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
        />
      )}

      <AddButton text="Add Module" onClick={() => setShowModuleForm(true)} />
      <Search />

      {/* Module Form Modal */}
      {showModuleForm && <ModuleForm setShowPopup={setShowModuleForm} />}

      {/* Specialty Form Modal */}
      {showSpecialtyForm && (
        <SpecialtyForm setShowPopup={setShowSpecialtyForm} />
      )}
    </>
  );
}

export default CoursePage;
