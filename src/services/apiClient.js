import axios from 'axios';

// Konfigurasi dasar untuk memanggil backend
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // URL backend kita
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor untuk menyisipkan token JWT otomatis ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor response (Logout user jika backend mereturn 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired atau invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;
