// api.ts

// Ensure that the BASE_URL points to your Django backend.
// For example, if you run Django on localhost:8000, then use:
const BASE_URL = "http://localhost:8000"

interface FetchOptions {
  timeout?: number;
}

// Helper function to handle API errors consistently
const handleApiError = async (response: Response) => {
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
  const { timeout = 30000, ...fetchOptions } = options; // Increased timeout to 30 seconds
  
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
      throw new Error(`Request timeout after ${timeout}ms - the server took too long to respond. Please try again.`);
    }
    throw error;
  }
};

export const api = {
  async getModelData(model: string, params: { page: number; itemsPerPage: number; search: string }) {
    const queryParams = new URLSearchParams({
      model,
      page: String(params.page),
      itemsPerPage: String(params.itemsPerPage),
      search: params.search || "",
    });

    try {
      console.log(`Fetching ${model} data from: ${BASE_URL}/api/get_model_data/?${queryParams.toString()}`);
      const response = await fetchWithTimeout(`${BASE_URL}/api/get_model_data/?${queryParams.toString()}`);
      await handleApiError(response);
      const data = await response.json();
      console.log(`Received ${model} data:`, data);
      return data;
    } catch (error: any) {
      console.error(`Failed to fetch ${model} data:`, error);
      throw error;
    }
  },
  
  async deleteModel(model: string, record: any) {
    try {
      const { field, value } = getPrimaryKey(record);

      if (value === undefined || value === null) {
        throw new Error("Invalid primary key value provided to deleteModel");
      }

      const payload = {
        model, // e.g., "Teachers"
        field, // e.g., "code_enseignants", "id", or "_id"
        value, // the actual primary key value
      };

      console.log("Sending delete request body:", payload);

      const response = await fetchWithTimeout(`${BASE_URL}/api/delete_model/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error: any) {
      console.error(`Error deleting ${model} record:`, error);
      throw error;
    }
  },

  async editModel(
    model: string,
    field: string,
    value: string | number | null, // Allow null values
    updates: Record<string, any>,
  ) {
    try {
      if (value === null || value === undefined) {
        throw new Error(`Cannot update ${model}: missing primary key value`);
      }
      
      const payload = { model, field, value, updates };
      console.log("✉️ editModel payload:", JSON.stringify(payload, null, 2));
      
      const response = await fetchWithTimeout(`${BASE_URL}/api/edit_model/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error: any) {
      console.error(`Error updating ${model} record:`, error);
      throw error;
    }
  },

  async addModelRow(model: string, fields: Record<string, any>) {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/api/add_model_row/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, fields }),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error: any) {
      console.error(`Error adding new ${model} row:`, error);
      throw error;
    }
  },
};

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