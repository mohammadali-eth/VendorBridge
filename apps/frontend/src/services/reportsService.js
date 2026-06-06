import api from '@/services/axios';

export const reportsService = {
  getSummary: async () => {
    const response = await api.get('/reports/summary');
    return response.data.data;
  },

  getSpendAnalysis: async () => {
    const response = await api.get('/reports/spend-analysis');
    return response.data.data;
  },

  getVendorPerformance: async () => {
    const response = await api.get('/reports/vendor-performance');
    return response.data.data;
  },

  getProcurementTrends: async () => {
    const response = await api.get('/reports/procurement-trends');
    return response.data.data;
  },

  getPoAnalytics: async () => {
    const response = await api.get('/reports/po-analytics');
    return response.data.data;
  },

  getInvoiceAnalytics: async () => {
    const response = await api.get('/reports/invoice-analytics');
    return response.data.data;
  },

  generateReport: async (data) => {
    const response = await api.post('/reports/generate', data);
    return response.data.data;
  },

  getReports: async () => {
    const response = await api.get('/reports');
    return response.data.data;
  },

  getReport: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data.data;
  },

  downloadReport: async (id) => {
    const response = await api.get(`/reports/download/${id}`);
    return response.data.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
};

export default reportsService;
