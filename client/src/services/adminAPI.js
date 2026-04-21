import api from './api';

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  blockUser: (id) => api.patch(`/admin/users/${id}/block`),
  banUser: (id) => api.patch(`/admin/users/${id}/ban`),
  getSessions: (status) => api.get(`/admin/sessions${status ? `?status=${status}` : ''}`),
  deleteSession: (id) => api.delete(`/admin/sessions/${id}`),
  forceCompleteSession: (id) => api.patch(`/admin/sessions/${id}/force-complete`),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
};
