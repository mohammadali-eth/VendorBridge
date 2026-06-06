import api from '../../../services/axios';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post(`/auth/reset-password/${token}`, { password });
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post('/auth/refresh-token');
  return response.data.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};
