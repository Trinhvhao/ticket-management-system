import apiClient from './client';
import type { Notification } from '@/types/notification.types';

export type { Notification };

export const notificationsService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },

  getUnread: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/notifications/unread');
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<number>('/notifications/unread/count');
    return response.data;
  },

  markAsRead: async (id: number): Promise<Notification> => {
    const response = await apiClient.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ message: string }>('/notifications/read-all');
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/notifications/${id}`);
    return response.data;
  },

  deleteAll: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>('/notifications');
    return response.data;
  },
};
