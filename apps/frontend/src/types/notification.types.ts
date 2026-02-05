export interface Notification {
  id: number;
  userId: number;
  type: 'ticket_created' | 'ticket_assigned' | 'ticket_updated' | 'ticket_resolved' | 'ticket_commented' | 'ticket_closed' | 'ticket_escalated' | 'sla_warning' | 'sla_breach';
  title: string;
  message: string;
  ticketId?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  ticket?: {
    id: number;
    title: string;
    status: string;
  };
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}
