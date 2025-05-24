// api.ts

// Ensure that the BASE_URL points to your Django backend.
// For example, if you run Django on localhost:8000, then use:
const BASE_URL = "http://localhost:8000"

interface FetchOptions {
  timeout?: number;
}

// Helper function to get headers with authentication
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Get the auth token from localStorage (adjust the key based on your implementation)
  const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to get headers for FormData (without Content-Type)
const getAuthHeadersForFormData = (): HeadersInit => {
  const headers: HeadersInit = {};
  
  const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to handle API errors consistently
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorData.detail || `API error: ${response.status}`;
      } catch (e) {
        errorMessage = `API error: ${response.status} ${response.statusText}`;
      }
    } else {
      // Handle non-JSON responses (like HTML error pages)
      try {
        const text = await response.text();
        console.error('Non-JSON error response:', text);
        if (response.status === 401) {
          errorMessage = 'Authentication required. Please log in.';
        } else if (response.status === 404) {
          errorMessage = 'API endpoint not found. Please check the server configuration.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please check the server logs.';
        } else {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
      } catch (e) {
        errorMessage = `API error: ${response.status} ${response.statusText}`;
      }
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
      const response = await fetchWithTimeout(`${BASE_URL}/api/get_model_data/?${queryParams.toString()}`, {
        headers: getAuthHeaders(),
      });
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
        body: JSON.stringify({ model, fields }),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error: any) {
      console.error(`Error adding new ${model} row:`, error);
      throw error;
    }
  },

  async searchModel(model: string, query: string, limit: number = 50) {
    try {
      if (!query.trim()) {
        return { results: [], count: 0, query: '', model };
      }

      const payload = {
        model,
        query: query.trim(),
        limit
      };

      console.log(`🔍 Search Request:`);
      console.log(`  - Model: ${model}`);
      console.log(`  - Query: "${query.trim()}"`);
      console.log(`  - Limit: ${limit}`);
      console.log(`  - Full payload:`, JSON.stringify(payload, null, 2));

      const response = await fetchWithTimeout(`${BASE_URL}/api/search_model/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      await handleApiError(response);
      const data = await response.json();
      
      console.log(`✅ Search Response:`, data);
      console.log(`  - Results count: ${data.results ? data.results.length : 0}`);
      console.log(`  - First result:`, data.results?.[0]);
      
      return data;
    } catch (error: any) {
      console.error(`❌ Search Error:`, error);
      throw error;
    }
  },

  async uploadExcel(model: string, file: File) {
    try {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        '.xlsx',
        '.xls',
        '.csv'
      ];
      
      if (!validTypes.some(type => file.type.includes(type) || file.name.endsWith(type))) {
        throw new Error('Please upload a valid Excel file (.xlsx, .xls) or CSV file (.csv)');
      }

      // Create FormData and append the file
      const formData = new FormData();
      formData.append('excel_file', file);

      // Determine the endpoint based on the model
      let endpoint = '';
      switch (model.toLowerCase()) {
        case 'chargesenseignement':
        case 'charges':
          endpoint = '/api/upload_charges_xlsx/';
          break;
        case 'enseignants':
        case 'teachers':
          endpoint = '/api/upload_enseignants_xlsx/';
          break;
        case 'formations':
        case 'courses':
          endpoint = '/api/upload_formations_xlsx/';
          break;
        case 'creneau':
        case 'creneaux':
        case 'timeslots':
          endpoint = '/api/upload_creneau_xlsx/';
          break;
        default:
          throw new Error(`Excel upload not supported for model: ${model}`);
      }

      const fullUrl = `${BASE_URL}${endpoint}`;
      console.log(`Uploading Excel file for ${model} to: ${fullUrl}`);

      // Send the request with extended timeout for file uploads
      const response = await fetchWithTimeout(fullUrl, {
        method: 'POST',
        headers: getAuthHeadersForFormData(),
        body: formData,
        // Note: Don't set Content-Type header - let browser set it with boundary for multipart/form-data
        timeout: 60000, // 60 seconds for file uploads
      });

      // Log response details for debugging
      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', response.headers);

      await handleApiError(response);
      const result = await response.json();
      
      console.log(`Excel upload result for ${model}:`, result);
      return result;
    } catch (error: any) {
      console.error(`Error uploading Excel file for ${model}:`, error);
      
      // Add more context to the error
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
      }
      
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