import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsApi } from '../services/vendors.api';
import { Vendor, VendorFilters, VendorStatusType } from '../types/vendor.types';

export const useVendorsQuery = (
  filters: VendorFilters & { page?: number; limit?: number; sortBy?: string; sortOrder?: string }
) => {
  return useQuery({
    queryKey: ['vendors', 'list', filters],
    queryFn: () => vendorsApi.getVendors(filters),
  });
};

export const useVendorCategoriesQuery = () => {
  return useQuery({
    queryKey: ['vendors', 'categories'],
    queryFn: vendorsApi.getCategories,
    staleTime: 300000, // Cache list of categories for 5 mins
  });
};

export const useVendorStatusesQuery = () => {
  return useQuery({
    queryKey: ['vendors', 'statuses'],
    queryFn: vendorsApi.getStatuses,
    staleTime: 300000,
  });
};

export const useVendorDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['vendors', 'details', id],
    queryFn: () => vendorsApi.getVendorById(id!),
    enabled: !!id,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vendorsApi.createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors', 'list'] });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vendor> }) =>
      vendorsApi.updateVendor(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendors', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['vendors', 'details', variables.id] });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vendorsApi.deleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors', 'list'] });
    },
  });
};

export const useBulkUpdateVendors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: VendorStatusType }) =>
      vendorsApi.bulkUpdateVendors(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors', 'list'] });
    },
  });
};

export const useBulkDeleteVendors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vendorsApi.bulkDeleteVendors,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors', 'list'] });
    },
  });
};
