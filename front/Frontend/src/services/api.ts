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

  async deleteModel(model: string, id: number) {
    // Ensure the endpoint URL includes the trailing slash if necessary.
    const response = await fetch(`${BASE_URL}/api/delete_model/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // The payload now sends { model, id } which the Django endpoint expects.
      body: JSON.stringify({ model, id }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Delete failed');
    }
    return await response.json();
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
