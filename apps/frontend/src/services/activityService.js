import api from '@/services/axios';

export const activityService = {
  getTimeline: async (module = 'ALL') => {
    const response = await api.get('/activity/timeline', { params: { module } });
    return response.data.data;
  },

  getNotifications: async () => {
    const response = await api.get('/activity/notifications');
    return response.data.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/activity/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/activity/notifications/read-all');
    return response.data;
  },

  clearNotification: async (id) => {
    const response = await api.delete(`/activity/notifications/${id}`);
    return response.data;
  },

  getAuditLogs: async (params) => {
    const response = await api.get('/activity/audit-logs', { params });
    return response.data.data;
  },
};
export default activityService;
