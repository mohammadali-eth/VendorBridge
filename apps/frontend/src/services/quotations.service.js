import api from '@/services/axios';

export const quotationsService = {
  getRfqs: async () => {
    const response = await api.get('/rfqs');
    return response.data.data;
  },

  getRfq: async (id) => {
    const response = await api.get(`/rfqs/${id}`);
    return response.data.data;
  },

  createQuotation: async (data) => {
    const response = await api.post('/quotations', data);
    return response.data.data;
  },

  updateQuotation: async (id, data) => {
    const response = await api.put(`/quotations/${id}`, data);
    return response.data.data;
  },

  getComparison: async (rfqId) => {
    const response = await api.get(`/rfqs/${rfqId}/comparison`);
    return response.data.data;
  },

  selectVendor: async (data) => {
    const response = await api.post('/vendor-selection', data);
    return response.data.data;
  },
};
