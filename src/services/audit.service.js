import apiClient from './apiClient';

export const getAuditLogs = async () => {
    const response = await apiClient.get('/audit');
    return response.data;
};
