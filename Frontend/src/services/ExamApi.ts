// ExamApi.ts

// Ensure that the BASE_URL points to your Django backend.
const BASE_URL = "http://localhost:8000"

interface FetchOptions {
  timeout?: number;
}

// Helper function to handle API errors consistently
const handleApiError = async (response: Response) => {
  console.log("API response status:", response.status);
  console.log("API response headers:", response.headers);
  
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || `API error: ${response.status}`;
    } catch (e) {
      errorMessage = `API error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response;
};

// Helper function to handle API timeouts
const fetchWithTimeout = async (url: string, options: RequestInit & FetchOptions = {}) => {
  const { timeout = 8000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - the server took too long to respond');
    }
    throw error;
  }
};

// Types for the API responses and requests
export interface Creneau {
  id_creneau: number;
  date_creneau: string;
  heure_creneau: string;
  salle: string;
}
export interface MonitoringPlanningItem {
  teacher_name: string;
  teacher_code: string;
  module: string;
  room: string;
  date: string;
  time: string;
  level: string;
  specialty: string;
  role: 'Main' | 'Assistant';
}

export interface Formation {
  id: number;
  domaine: string;
  filière: string;
  niveau_cycle: string;
  specialités: string;
  nbr_sections: number;
  nbr_groupes: number;
  semestre: string;
  modules: string;
}

export interface PlanningWithDetails {
  id_planning: number;
  section: string;
  session: string;
  nombre_surveillant: number;
  creneau: Creneau;
  formation: Formation;
}

export interface Enseignant {
  Code_Enseignant: string;
  nom: string;
  prenom: string;
  nom_jeune_fille?: string;
  genre?: string;
  etat?: string;
  faculté?: string;
  département?: string;
  grade?: string;
  diplôme?: string;
  type?: string;
  email1?: string;
  email2?: string;
  tel1?: string;
  tel2?: string;
}

export interface Surveillant {
  code_enseignant: string;
  est_charge_cours?: 0 | 1;
}

export interface SurveillantWithDetails {
  id_surveillance: number;
  est_charge_cours: 0 | 1;
  code_enseignant: string;
  enseignant: Enseignant;
}

export interface CreatePlanningRequest {
  formation_id: number;
  section: string;
  nombre_surveillant: number;
  session?: string;
  id_creneau: number;
  surveillants: Surveillant[];
}

export interface UpdatePlanningRequest {
  id_planning: number;
  formation_id?: number;
  section?: string;
  nombre_surveillant?: number;
  session?: string;
  id_creneau?: number;
  surveillants: Surveillant[];
}

export const examApi = {
  /**
   * Get all plannings with their creneau and formation details
   * GET /api/get_planning_with_creneau_and_formation/
   */
  async getPlanningsWithDetails() {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/api/get_planning_with_creneau_and_formation/`);
      await handleApiError(response);
      return await response.json();
    } catch (error: any) {
      console.error('Failed to fetch plannings with details:', error);
      throw error;
    }
  },

  /**
   * Get all surveillants for a specific planning ID
   * GET /api/surveillants/?id_planning={planningId}
   */
  async getSurveillantsByPlanning(planningId: number) {
    try {
      if (!planningId) {
        throw new Error("Invalid planning ID provided");
      }

      const response = await fetchWithTimeout(`${BASE_URL}/api/get_surveillants_by_planning/?id_planning=${planningId}`);
      await handleApiError(response);
      return await response.json() as SurveillantWithDetails[];
    } catch (error: any) {
      console.error(`Failed to fetch surveillants for planning ${planningId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a planning by ID
   * DELETE /api/delete_planning_only/
   */
  async deletePlanning(planningId: number) {
    try {
      if (!planningId) {
        throw new Error("Invalid planning ID provided");
      }

      const payload = { id_planning: planningId };
      console.log("Sending delete planning request body:", payload);

      const response = await fetchWithTimeout(`${BASE_URL}/api/delete_planning_only/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error: any) {
      console.error(`Error deleting planning ${planningId}:`, error);
      throw error;
    }
  },
  async getMonitoringPlanning() {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/api/get_monitoring_planning`);
      await handleApiError(response);
      return await response.json() as MonitoringPlanningItem[];
    } catch (error: any) {
      console.error('Failed to fetch monitoring planning:', error);
      throw error;
    }
  },

  /**
   * Create a new planning with surveillants
   * POST /api/create_planning_with_surveillants/
   */
  async createPlanningWithSurveillants(planningData: CreatePlanningRequest) {
    try {
      // Validate required fields
      if (!planningData.formation_id || !planningData.section || !planningData.id_creneau || !planningData.surveillants?.length) {
        throw new Error("Missing required fields for creating planning");
      }

      // Ensure session has a default value
      const requestBody = {
        formation_id: planningData.formation_id,
        section: planningData.section,
        nombre_surveillant: planningData.nombre_surveillant,
        session: planningData.session || '', // Default to empty string if not provided
        id_creneau: planningData.id_creneau,
        surveillants: planningData.surveillants.map((s, index) => ({
          code_enseignant: s.code_enseignant,
          est_charge_cours: s.est_charge_cours !== undefined ? s.est_charge_cours : (index === 0 ? 1 : 0)
        }))
      };

      console.log("✉️ createPlanningWithSurveillants - Request Details:");
      console.log("URL:", `${BASE_URL}/api/create_planning_with_surveillants/`);
      console.log("Method: POST");
      console.log("Headers:", { "Content-Type": "application/json" });
      console.log("Body:", JSON.stringify(requestBody, null, 2));

      const response = await fetchWithTimeout(`${BASE_URL}/api/create_planning_with_surveillants`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add any other headers if needed, like authorization
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log("Response received, status:", response.status);
      
      await handleApiError(response);
      const result = await response.json();
      
      console.log("Response data:", result);
      return result;
    } catch (error: any) {
      console.error('Error creating planning with surveillants:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  /**
   * Update an existing planning with surveillants
   * PUT /api/update_planning_with_surveillants/
   */
  async updatePlanningWithSurveillants(planningData: UpdatePlanningRequest) {
  try {
    if (!planningData.id_planning || !planningData.surveillants?.length) {
      throw new Error("Missing required fields for updating planning");
    }

    // Build the request body, only including fields that are provided
    const requestBody: any = {
      id_planning: planningData.id_planning,
      surveillants: planningData.surveillants.map((s, index) => ({
        code_enseignant: s.code_enseignant,
        est_charge_cours: s.est_charge_cours !== undefined ? s.est_charge_cours : (index === 0 ? 1 : 0)
      }))
    };

    // Only add optional fields if they are provided
    // Extract the formation_id correctly - if we receive an object with 'id', use that id
    if (planningData.formation_id !== undefined) {
      requestBody.formation_id = planningData.formation_id;
    }
    
    if (planningData.section !== undefined) requestBody.section = planningData.section;
    if (planningData.nombre_surveillant !== undefined) requestBody.nombre_surveillant = planningData.nombre_surveillant;
    if (planningData.session !== undefined) requestBody.session = planningData.session;
    
    // Handle creneau_id extraction similar to formation_id
    if (planningData.id_creneau !== undefined) {
      requestBody.id_creneau = planningData.id_creneau;
    }

    console.log("✉️ updatePlanningWithSurveillants - Request Details:");
    console.log("URL:", `${BASE_URL}/api/update_planning_with_surveillants`);
    console.log("Method: PUT");
    console.log("Headers:", { "Content-Type": "application/json" });
    console.log("Body:", JSON.stringify(requestBody, null, 2));

    const response = await fetchWithTimeout(`${BASE_URL}/api/update_planning_with_surveillants`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    
    await handleApiError(response);
    return await response.json();
  } catch (error: any) {
    console.error(`Error updating planning ${planningData.id_planning}:`, error);
    throw error;
  }
},

  /**
   * Check exam date conflicts
   * POST /api/check_exam_date/
   */
  async checkExamDate(data: Record<string, any>) {
    try {
      console.log("✉️ checkExamDate payload:", JSON.stringify(data, null, 2));

      const response = await fetchWithTimeout(`${BASE_URL}/api/check_exam_date/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error: any) {
      console.error('Error checking exam date:', error);
      throw error;
    }
  },

  /**
   * Check enseignant schedule conflicts
   * POST /api/check_enseignant_schedule_conflict/
   */
  async checkEnseignantScheduleConflict(data: Record<string, any>) {
    try {
      console.log("✉️ checkEnseignantScheduleConflict payload:", JSON.stringify(data, null, 2));

      const response = await fetchWithTimeout(`${BASE_URL}/api/check_enseignant_schedule_conflict/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error: any) {
      console.error('Error checking enseignant schedule conflict:', error);
      throw error;
    }
  },

  /**
   * Send email
   * POST /api/send_email/
   */
  async sendEmail(data: Record<string, any>) {
    try {
      console.log("✉️ sendEmail payload:", JSON.stringify(data, null, 2));

      const response = await fetchWithTimeout(`${BASE_URL}/api/send_email/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error: any) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

 
};

// Helper function from original api.ts
function getPrimaryKey(record: any): { field: string; value: any } {
  if (!record) {
    throw new Error("Record is undefined or null");
  }

  // For Teacher model - first check for Django model primary key
  if (record.Code_Enseignant !== undefined && record.Code_Enseignant !== null) {
    return { field: "Code_Enseignant", value: record.Code_Enseignant };
  }

  // Check for the frontend-friendly property name
  if (record.code_Enseignants !== undefined && record.code_Enseignants !== null) {
    return { field: "Code_Enseignant", value: record.code_Enseignants };
  }

  // Standard id fields
  if (record.id !== undefined && record.id !== null) {
    return { field: "id", value: record.id };
  }
  if (record._id !== undefined && record._id !== null) {
    return { field: "_id", value: record._id };
  }

  // Last resort: try to find any string or number field
  for (const key in record) {
    if ((typeof record[key] === "string" || typeof record[key] === "number") && record[key]) {
      return { field: key, value: record[key] };
    }
  }
  throw new Error("No valid primary key found in record");
}

// Export individual functions for convenience (similar to how api.ts could be used)
export const {
  getPlanningsWithDetails,
  getSurveillantsByPlanning,
  deletePlanning,
  createPlanningWithSurveillants,
  updatePlanningWithSurveillants,
  checkExamDate,
  checkEnseignantScheduleConflict,
  sendEmail,
  getMonitoringPlanning, // Add this line
} = examApi;

// Default export
export default examApi;