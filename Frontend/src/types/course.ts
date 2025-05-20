// Define the Course interface based on your SQL database schema
export interface Course {
    id: number
    level: string
    specialty: string
    semester: string
    moduleTitle: string
    moduleAbbreviation: string
    coefficient: number
    credits: number
    unit: string
    lectureHours: number
    tutorialHours: number
    practicalHours: number
  }
  
  // Response from the API
  export interface CourseResponse {
    courses: Course[]
    total: number
  }
  