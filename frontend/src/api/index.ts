import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('comet_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('comet_token');
      localStorage.removeItem('comet_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { email: string; name: string; phone?: string; password: string }) =>
    api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// Products
export const productsApi = {
  getAll: (params?: Record<string, any>) => api.get('/products', { params }),
  getAllAdmin: () => api.get('/products/admin/all'),
  getOne: (id: number) => api.get(`/products/${id}`),
  create: (formData: FormData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: number, formData: FormData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: number) => api.delete(`/products/${id}`),
  getStock: (id: number) => api.get(`/products/${id}/stock`),
};

// Categories
export const categoriesApi = {
  getAll: () => api.get('/products/categories'),
  create: (data: { name: string; slug: string; description?: string }) =>
    api.post('/products/categories', data),
};

// Stock
export const stockApi = {
  getAll: () => api.get('/stocks'),
  createOrUpdate: (data: { product_id: number; size: string; color: string; quantity: number }) =>
    api.post('/stocks', data),
  update: (id: number, quantity: number) => api.put(`/stocks/${id}`, { quantity }),
  delete: (id: number) => api.delete(`/stocks/${id}`),
};

// Orders
export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getOne: (id: number) => api.get(`/orders/${id}`),
  updateStatus: (id: number, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/orders/${id}`),
};

// Users
export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats/overview'),
};

export default api;
