import apiClient from './apiClient';

export const getRequests = async () => {
    const response = await apiClient.get('/requests');
    return response.data;
};

export const createRequest = async (itemId, quantity, notes) => {
    const response = await apiClient.post('/requests', {
        item_id: itemId,
        quantity: quantity,
        notes: notes
    });
    return response.data;
};

export const approveRequest = async (requestId) => {
    const response = await apiClient.patch(`/requests/${requestId}/approve`);
    return response.data;
};

export const rejectRequest = async (requestId) => {
    const response = await apiClient.patch(`/requests/${requestId}/reject`);
    return response.data;
};
