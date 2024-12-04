import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL do backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona o token de autenticação, se disponível
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
