import api from '@/services/axios';

export const invoiceService = {
  getInvoices: async () => {
    const response = await api.get('/invoices');
    return response.data.data;
  },

  getInvoice: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/invoices/${id}/status`, { status });
    return response.data.data;
  },

  emailInvoice: async (id) => {
    const response = await api.post(`/invoices/${id}/email`);
    return response.data;
  },
};
export default invoiceService;
