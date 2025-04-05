import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  id: string;
  email: string;
  access_token: string;
  token_type: string;
}

export const loginAdmin = async (email: string, password: string): Promise<AdminLoginResponse> => {
  const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
    email,
    password,
  });

  const data = response.data;
  localStorage.setItem('adminToken', data.access_token);
  return data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
};

export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const isAdminAuthenticated = () => {
  return !!getAdminToken();
};

// Create axios instance with auth interceptor
export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutAdmin();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
); 