import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
});

let accessToken = localStorage.getItem('todo_token') || null;

export const setToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('todo_token', token);
  } else {
    localStorage.removeItem('todo_token');
  }
};

export const getToken = () => accessToken;

api.interceptors.request.use(async (config) => {
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        try {
          const res = await axios.post(
            'http://localhost:8000/api/auth/refresh',
            {},
            { withCredentials: true }
          );
          if (res.data?.accessToken) {
            accessToken = res.data.accessToken;
            setToken(accessToken);
          }
        } catch (refreshErr) {
          // Token refresh failed
          setToken(null);
        }
      }
    } catch (e) {
      // Decode error
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized, clear token if session expired
      if (
        error.config?.url !== '/auth/login' &&
        error.config?.url !== '/auth/registration'
      ) {
        setToken(null);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
