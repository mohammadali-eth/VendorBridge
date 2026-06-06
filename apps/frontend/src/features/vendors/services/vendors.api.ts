import api from '@/services/axios';
import {
  Vendor,
  VendorFilters,
  VendorListResponse,
  VendorDetailsResponse,
  VendorStatusType
} from '../types/vendor.types';

export const vendorsApi = {
  getVendors: async (
    filters: VendorFilters & { page?: number; limit?: number; sortBy?: string; sortOrder?: string }
  ): Promise<VendorListResponse> => {
    const response = await api.get('/vendors', { params: filters });
    return response.data.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/vendors/categories');
    return response.data.data;
  },

  getStatuses: async (): Promise<string[]> => {
    const response = await api.get('/vendors/statuses');
    return response.data.data;
  },

  getVendorById: async (id: string): Promise<VendorDetailsResponse> => {
    const response = await api.get(`/vendors/${id}`);
    return response.data.data;
  },

  createVendor: async (data: Partial<Vendor>): Promise<Vendor> => {
    const response = await api.post('/vendors', data);
    return response.data.data;
  },

  updateVendor: async (id: string, data: Partial<Vendor>): Promise<Vendor> => {
    const response = await api.put(`/vendors/${id}`, data);
    return response.data.data;
  },

  deleteVendor: async (id: string): Promise<void> => {
    await api.delete(`/vendors/${id}`);
  },

  bulkUpdateVendors: async (ids: string[], status: VendorStatusType): Promise<void> => {
    await api.post('/vendors/bulk-update', { ids, status });
  },

  bulkDeleteVendors: async (ids: string[]): Promise<void> => {
    await api.post('/vendors/bulk-delete', { ids });
  },
};
