// Fixed api.ts - Proper JWT authentication for Django backend

const BASE_URL = "http://localhost:8000"

interface FetchOptions {
  timeout?: number;
}

// Store token with consistent key
export const setAuthToken = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem('access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

// Clear auth tokens
export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Get auth token with consistent key
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Enhanced function to get headers with better debugging
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  
  console.log('🔐 Auth Debug:');
  console.log('  - Token found:', token ? `${token.substring(0, 20)}...` : 'None');
  console.log('  - Token length:', token?.length || 0);
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('  - Authorization header set');
  } else {
    console.warn('  - ⚠️ No authentication token found!');
  }
  
  return headers;
};

// Enhanced function for FormData with better debugging
const getAuthHeadersForFormData = (): HeadersInit => {
  const headers: HeadersInit = {};
  // Don't set Content-Type for FormData - let browser set it with boundary
  
  const token = getAuthToken();
  
  console.log('🔐 FormData Auth Debug:');
  console.log('  - Token found:', token ? `${token.substring(0, 20)}...` : 'None');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('  - Authorization header set for FormData');
  } else {
    console.warn('  - ⚠️ No authentication token found for FormData!');
  }
  
  return headers;
};

// Enhanced error handling with more detailed debugging
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    console.error('❌ API Error Details:');
    console.error('  - Status:', response.status);
    console.error('  - Status Text:', response.statusText);
    console.error('  - URL:', response.url);
    console.error('  - Headers:', Object.fromEntries(response.headers.entries()));
    
    let errorMessage;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      try {
        const errorData = await response.json();
        console.error('  - Error Data:', errorData);
        errorMessage = errorData.error || errorData.message || errorData.detail || `API error: ${response.status}`;
      } catch (e) {
        errorMessage = `API error: ${response.status} ${response.statusText}`;
      }
    } else {
      try {
        const text = await response.text();
        console.error('  - Error Text:', text);
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
          // Clear invalid tokens
          clearAuthTokens();
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

// Enhanced timeout handler
const fetchWithTimeout = async (url: string, options: RequestInit & FetchOptions = {}) => {
  const { timeout = 30000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    console.log('🌐 Request Details:');
    console.log('  - URL:', url);
    console.log('  - Method:', fetchOptions.method || 'GET');
    console.log('  - Headers:', fetchOptions.headers);
    
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
  // Login method to get tokens
  async login(username: string, password: string) {
    try {
      console.log('🔐 Attempting login...');
      const response = await fetchWithTimeout(`${BASE_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.access, data.refresh);
        console.log('✅ Login successful');
        return data;
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  // Logout method
  async logout() {
    clearAuthTokens();
    console.log('✅ Logged out successfully');
  },

  // Test authentication using debug endpoint
  async testAuth() {
    try {
      console.log('🔍 Testing authentication...');
      const response = await fetchWithTimeout(`${BASE_URL}/api/auth_debug/`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Authentication test successful:', data);
        return true;
      } else {
        console.warn('❌ Authentication test failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Auth test failed:', error);
      return false;
    }
  },

  // Method to refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.warn('No refresh token available');
        return false;
      }

      console.log('🔄 Attempting to refresh token...');
      const response = await fetchWithTimeout(`${BASE_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.access);
        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        console.warn('❌ Token refresh failed');
        clearAuthTokens();
        return false;
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      clearAuthTokens();
      return false;
    }
  },

  // Your existing working getModelData method
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
  
  // Your existing working deleteModel method
  async deleteModel(model: string, record: any) {
    try {
      const { field, value } = getPrimaryKey(record);

      if (value === undefined || value === null) {
        throw new Error("Invalid primary key value provided to deleteModel");
      }

      const payload = {
        model,
        field,
        value,
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

  // Your existing working editModel method
  async editModel(
    model: string,
    field: string,
    value: string | number | null,
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

  // Your existing working addModelRow method
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

  // Your existing working searchModel method
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

      console.log(`🔍 Search Request:`, payload);

      const response = await fetchWithTimeout(`${BASE_URL}/api/search_model/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      await handleApiError(response);
      const data = await response.json();
      
      console.log(`✅ Search Response:`, data);
      
      return data;
    } catch (error: any) {
      console.error(`❌ Search Error:`, error);
      throw error;
    }
  },

  // Enhanced uploadExcel method
  async uploadExcel(model: string, file: File) {
    try {
      console.log('📤 Starting Excel upload for model:', model);
      
      // Check if we have a token
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in first.');
      }

      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      const isValidType = validTypes.some(type => file.type === type) ||
                         file.name.endsWith('.xlsx') ||
                         file.name.endsWith('.xls') ||
                         file.name.endsWith('.csv');

      if (!isValidType) {
        throw new Error('Please upload a valid Excel file (.xlsx, .xls) or CSV file (.csv)');
      }

      // Create FormData and append the file
      const formData = new FormData();
      formData.append('excel_file', file);

      console.log('📁 File details:');
      console.log('  - Name:', file.name);
      console.log('  - Size:', file.size);
      console.log('  - Type:', file.type);

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
      console.log('🎯 Upload endpoint:', fullUrl);

      const headers = getAuthHeadersForFormData();
      console.log('📋 Request headers:', headers);

      // Send the request with extended timeout for file uploads
      const response = await fetchWithTimeout(fullUrl, {
        method: 'POST',
        headers: headers,
        body: formData,
        timeout: 60000, // 60 seconds for file uploads
      });

      console.log('📡 Response received:');
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);

      // Handle 401 specifically
      if (response.status === 401) {
        console.log('🔄 Authentication failed, attempting to refresh token...');
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the request with new token
          const retryHeaders = getAuthHeadersForFormData();
          const retryResponse = await fetchWithTimeout(fullUrl, {
            method: 'POST',
            headers: retryHeaders,
            body: formData,
            timeout: 60000,
          });
          
          await handleApiError(retryResponse);
          const result = await retryResponse.json();
          console.log('✅ Upload successful after token refresh:', result);
          return result;
        } else {
          throw new Error('Authentication failed. Please log in again.');
        }
      }

      await handleApiError(response);
      const result = await response.json();
      
      console.log('✅ Upload successful:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      
      // Enhanced error handling
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error('Authentication failed. Please log out and log back in.');
      } else if (error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Upload timeout. The file might be too large or the server is slow to respond.');
      }
      
      throw error;
    }
  },

  // Debug endpoint for testing file upload auth
  async testFileUploadAuth(file?: File) {
    try {
      console.log('🔍 Testing file upload authentication...');
      
      const formData = new FormData();
      if (file) {
        formData.append('excel_file', file);
      } else {
        // Create a dummy file for testing
        const blob = new Blob(['test'], { type: 'text/plain' });
        formData.append('test_file', blob, 'test.txt');
      }

      const headers = getAuthHeadersForFormData();
      
      const response = await fetchWithTimeout(`${BASE_URL}/api/auth_debug/`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ File upload auth test successful:', data);
        return data;
      } else {
        console.warn('❌ File upload auth test failed');
        return null;
      }
    } catch (error) {
      console.error('❌ File upload auth test error:', error);
      throw error;
    }
  },
};

// Your existing working getPrimaryKey function
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