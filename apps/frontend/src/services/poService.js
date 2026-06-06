import api from '@/services/axios';

export const poService = {
  getPurchaseOrders: async () => {
    const response = await api.get('/purchase-orders');
    return response.data.data;
  },

  getPurchaseOrder: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data.data;
  },

  updatePurchaseOrder: async (id, status) => {
    const response = await api.put(`/purchase-orders/${id}`, { status });
    return response.data.data;
  },

  createInvoice: async (id, dueDate, paymentTerms) => {
    const response = await api.post(`/purchase-orders/${id}/invoice`, { dueDate, paymentTerms });
    return response.data.data;
  },
};
export default poService;
