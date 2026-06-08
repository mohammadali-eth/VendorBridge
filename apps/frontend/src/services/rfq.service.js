import api from '@/services/axios';

export const rfqService = {
  getVendors: async (params = {}) => {
    // Fetch active/approved vendors to populate selection list
    const response = await api.get('/vendors', { params: { limit: 100, ...params } });
    return response.data.data;
  },

  createRfq: async (data) => {
    const response = await api.post('/rfqs', data);
    return response.data.data;
  },

  uploadAttachments: async (files) => {
    // Send array of files for upload mock processing
    const response = await api.post('/rfqs/upload', { files });
    return response.data.data;
  },
};
