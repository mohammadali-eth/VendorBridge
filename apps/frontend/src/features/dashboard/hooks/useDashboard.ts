import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboard.api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 60000, // refresh stats every minute
  });
};

export const useDashboardRecentPOs = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-pos'],
    queryFn: dashboardApi.getRecentPOs,
  });
};

export const useDashboardRecentInvoices = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-invoices'],
    queryFn: dashboardApi.getRecentInvoices,
  });
};

export const useDashboardActivities = () => {
  return useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: dashboardApi.getActivities,
    refetchInterval: 30000, // refresh activities every 30s
  });
};

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['dashboard', 'analytics'],
    queryFn: dashboardApi.getAnalytics,
  });
};
