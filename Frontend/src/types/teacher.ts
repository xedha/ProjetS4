// Define the Teacher interface based on your SQL database schema
export interface Teacher {
    id: number
    code: string
    firstName: string
    lastName: string
    birthName: string
    gender: string
    department: string
    grade: string
    email: string
    phone: string
    status: string
  }
  
  // Response from the API
  export interface TeacherResponse {
    teachers: Teacher[]
    total: number
  }
  
  