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

// Menggunakan FormData karena kita mengupload file gambar (Multipart)
export const createItem = async (formData) => {
    const response = await apiClient.post('/items', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
