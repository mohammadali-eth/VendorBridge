import api from '@/services/axios';
import { KpiCardData, PurchaseOrder, Invoice, Activity, AnalyticsData } from '../types/dashboard.types';

export const dashboardApi = {
  getStats: async (): Promise<KpiCardData> => {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },

  getRecentPOs: async (): Promise<PurchaseOrder[]> => {
    const response = await api.get('/dashboard/recent-pos');
    return response.data.data;
  },

  getRecentInvoices: async (): Promise<Invoice[]> => {
    const response = await api.get('/dashboard/recent-invoices');
    return response.data.data;
  },

  getActivities: async (): Promise<Activity[]> => {
    const response = await api.get('/dashboard/activities');
    return response.data.data;
  },

  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await api.get('/dashboard/analytics');
    return response.data.data;
  },
};
