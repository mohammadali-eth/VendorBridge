import { create } from 'zustand';
import axios from 'axios';

// We import the api instance using a dynamic import or construct a minimal call inside the store to avoid circular imports.
// Since axios.js imports useAuthStore, we can just use basic axios for authentication calls inside the store actions,
// or we can import the api instance. Since the auth endpoints (/login, /register, /refresh-token, /logout) do not require
// the Authorization header (except /me and other resource routes), we can use the default axios or the api client.
// To avoid circular import warnings, we will use a separate clean axios instance for authentication-specific calls,
// which is extremely robust and standard.
const authAxios = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true, // starts true to check session on mount
  accessToken: null,
  permissions: [],

  setUser: (user, accessToken) => {
    let permissions = [];
    if (user?.role === 'ADMIN') {
      permissions = ['admin:all', 'rfq:write', 'rfq:read', 'po:write', 'po:read'];
    } else if (user?.role === 'PROCUREMENT_MANAGER') {
      permissions = ['rfq:write', 'rfq:read', 'po:write', 'po:read', 'vendor:verify'];
    } else if (user?.role === 'BUYER') {
      permissions = ['rfq:write', 'rfq:read', 'po:write', 'po:read'];
    } else if (user?.role === 'SUPPLIER') {
      permissions = ['quotation:write', 'rfq:read', 'po:read'];
    }

    set({
      user,
      role: user?.role || null,
      isAuthenticated: !!user,
      accessToken,
      permissions,
      isLoading: false,
    });
  },

  logoutStore: () => {
    set({
      user: null,
      role: null,
      isAuthenticated: false,
      accessToken: null,
      permissions: [],
      isLoading: false,
    });
  },

  setTestingRole: (targetRole) => {
    // TEMPORARY ROLE SWITCHER FOR DEVELOPMENT TESTING
    // REMOVE BEFORE PRODUCTION RELEASE
    set((state) => {
      if (!state.user) return {};
      const updatedUser = { ...state.user, role: targetRole };
      return {
        role: targetRole,
        user: updatedUser,
      };
    });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await authAxios.post('/auth/login', { email, password });
      const { accessToken, user } = response.data.data;
      useAuthStore.getState().setUser(user, accessToken);
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || 'Login failed';
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await authAxios.post('/auth/register', userData);
      const { accessToken, user } = response.data.data;
      useAuthStore.getState().setUser(user, accessToken);
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authAxios.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed', error);
    } finally {
      useAuthStore.getState().logoutStore();
    }
  },

  refreshSession: async () => {
    set({ isLoading: true });
    try {
      const response = await authAxios.post('/auth/refresh-token');
      const { accessToken, user } = response.data.data;
      useAuthStore.getState().setUser(user, accessToken);
      return user;
    } catch (error) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        useAuthStore.getState().logoutStore();
      } else {
        set({ isLoading: false });
      }
      throw error;
    }
  },
}));
