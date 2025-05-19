// Define the Teaching interface based on your SQL database schema
export interface Teaching {
    id: number
    level: string
    specialty: string
    semester: string
    section: string
    group: string
    type: string
    moduleName: string
    moduleAbbreviation: string
    teacher: string
    hours: string
  }
  
  // Response from the API
  export interface TeachingResponse {
    teachings: Teaching[]
    total: number
  }
  