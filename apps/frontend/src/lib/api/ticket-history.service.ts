import apiClient from './client';

export interface TicketHistory {
  id: number;
  ticketId: number;
  userId: number;
  action: string;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  description: string;
  createdAt: string;
  user?: {
    id: number;
    fullName: string;
  };
}

export const ticketHistoryService = {
  getByTicket: async (ticketId: number): Promise<TicketHistory[]> => {
    const response = await apiClient.get<TicketHistory[]>(`/ticket-history/ticket/${ticketId}`);
    return response.data;
  },

  getActionIcon: (action: string): string => {
    const icons: Record<string, string> = {
      'created': '🆕',
      'updated': '✏️',
      'assigned': '👤',
      'status_changed': '🔄',
      'priority_changed': '⚡',
      'category_changed': '📁',
      'comment_added': '💬',
      'attachment_added': '📎',
      'resolved': '✅',
      'closed': '🔒',
      'reopened': '🔓',
    };
    return icons[action] || '📝';
  },

  getActionColor: (action: string): string => {
    const colors: Record<string, string> = {
      'created': 'bg-blue-100 text-blue-700',
      'assigned': 'bg-purple-100 text-purple-700',
      'status_changed': 'bg-yellow-100 text-yellow-700',
      'resolved': 'bg-green-100 text-green-700',
      'closed': 'bg-gray-100 text-gray-700',
      'reopened': 'bg-orange-100 text-orange-700',
    };
    return colors[action] || 'bg-gray-100 text-gray-700';
  },
};
