import api from '@/services/axios';

export const approvalService = {
  getApprovals: async () => {
    const response = await api.get('/approvals');
    return response.data.data;
  },

  getApproval: async (id) => {
    const response = await api.get(`/approvals/${id}`);
    return response.data.data;
  },

  getTimeline: async (id) => {
    const response = await api.get(`/approvals/${id}/timeline`);
    return response.data.data;
  },

  getAudit: async (id) => {
    const response = await api.get(`/approvals/${id}/audit`);
    return response.data.data;
  },

  approve: async (id, comment) => {
    const response = await api.post(`/approvals/${id}/approve`, { comment });
    return response.data.data;
  },

  reject: async (id, comment) => {
    const response = await api.post(`/approvals/${id}/reject`, { comment });
    return response.data.data;
  },

  sendBack: async (id, comment) => {
    const response = await api.post(`/approvals/${id}/send-back`, { comment });
    return response.data.data;
  },

  updateRemarks: async (id, remarks, internalNotes) => {
    const response = await api.post(`/approvals/${id}/remarks`, { remarks, internalNotes });
    return response.data.data;
  },
};
export default approvalService;
