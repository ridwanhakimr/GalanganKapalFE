import apiClient from './apiClient';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  // Method lain bila perlu: getProfile, dll.
};

export const requestService = {
  createRequest: async (itemId, quantity, notes) => {
    const response = await apiClient.post('/requests', {
      item_id: itemId,
      quantity,
      notes
    });
    return response.data;
  },

  approveRequest: async (requestId) => {
    const response = await apiClient.put(`/requests/${requestId}/approve`);
    return response.data;
  }
};
