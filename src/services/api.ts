import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-dev-syncchurch.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive'
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.url?.includes('/authentication/log-in')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 