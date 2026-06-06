import api from '@/services/axios';

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
