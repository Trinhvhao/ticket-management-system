export type NotificationType =
  | 'ticket_created'
  | 'ticket_assigned'
  | 'ticket_updated'
  | 'ticket_resolved'
  | 'ticket_closed'
  | 'comment_added'
  | 'sla_warning'
  | 'sla_breach'
  | 'system';

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  ticketId?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: NotificationType;
  page?: number;
  limit?: number;
}

export interface UnreadCountResponse {
  count: number;
}
