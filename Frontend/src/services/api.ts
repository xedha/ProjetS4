// api.ts

// Ensure that the BASE_URL points to your Django backend.
// For example, if you run Django on localhost:8000, then use:
const BASE_URL ='http://localhost:8000';

export const api = {
  async getModelData(
    model: string,
    params: { page: number; itemsPerPage: number; search: string }
  ) {
    // Build the query string; note the trailing slash at the end
    const queryParams = new URLSearchParams({
      model,
      page: String(params.page),
      itemsPerPage: String(params.itemsPerPage),
      search: params.search,
    });
    
    // Make sure the URL matches your Django URL configuration exactly.
    const response = await fetch(
      `${BASE_URL}/api/get_model_data/?${queryParams.toString()}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Fetch failed');
    }
    return await response.json();
  },
  async  deleteModel(model: string, record: any) {
    const { field, value } = getPrimaryKey(record);
  
    if (value === undefined || value === null) {
      console.error("deleteModel: Primary key value is null or undefined", value);
      throw new Error("Invalid primary key value provided to deleteModel");
    }
  
    const payload = {
      model,   // e.g., "Teachers"
      field,   // e.g., "code_enseignants", "id", or "_id"
      value,   // the actual primary key value
    };
  
    console.log("Sending delete request body:", payload);
  
    try {
      const response = await fetch(`${BASE_URL}/api/delete_model/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete failed");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in deleteModel:", error);
      throw error;
    }
  },
  
  async editModel(
    model: string,
    id: number,
    updates: Record<string, any>
  ) {
    const response = await fetch(`${BASE_URL}/api/edit_model/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Payload with { model, id, updates }
      body: JSON.stringify({ model, id, updates }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Update failed');
    }
    return await response.json();
  },

  async addModelRow(model: string, fields: Record<string, any>) {
    const response = await fetch(`${BASE_URL}/api/add_model_row/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, fields }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Creation failed');
    }
    return await response.json();
  },
};
function getPrimaryKey(record: any): { field: string; value: any } {
  if (!record) {
    throw new Error("Record is undefined or null");
  }
  // Check for common conventions
  if (record.id !== undefined && record.id !== null) {
    return { field: "id", value: record.id };
  }
  if (record._id !== undefined && record._id !== null) {
    return { field: "_id", value: record._id };
  }
  // In your case, the teacher object might have 'code_enseignants'
  if (record.code_enseignants !== undefined && record.code_enseignants !== null) {
    return { field: "code_enseignants", value: record.code_enseignants };
  }
  // Fallback: iterate over keys to pick the first primitive value (this is a heuristic)
  for (const key in record) {
    if (
      typeof record[key] === "string" ||
      typeof record[key] === "number"
    ) {
      return { field: key, value: record[key] };
    }
  }
  throw new Error("No valid primary key found in record");
}