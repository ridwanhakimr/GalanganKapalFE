import apiClient from './apiClient';

export const getItems = async () => {
    const response = await apiClient.get('/items');
    return response.data;
};

export const getWarehouses = async () => {
    const response = await apiClient.get('/warehouses');
    return response.data;
};

export const getCategories = async () => {
    const response = await apiClient.get('/categories');
    return response.data;
};

export const createCategory = async (data) => {
    const response = await apiClient.post('/categories', data);
    return response.data;
};

export const updateCategory = async (id, data) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
};

export const createWarehouse = async (data) => {
    const response = await apiClient.post('/warehouses', data);
    return response.data;
};

export const updateWarehouse = async (id, data) => {
    const response = await apiClient.put(`/warehouses/${id}`, data);
    return response.data;
};

export const deleteWarehouse = async (id) => {
    const response = await apiClient.delete(`/warehouses/${id}`);
    return response.data;
};

export const getStockMovements = async () => {
    const response = await apiClient.get('/stock-movements');
    return response.data;
};

// Menggunakan FormData karena kita mengupload file gambar (Multipart)
export const createItem = async (formData) => {
    const response = await apiClient.post('/items', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
