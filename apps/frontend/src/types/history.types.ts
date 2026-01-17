import type { User } from './user.types';

export type HistoryAction =
  | 'created'
  | 'updated'
  | 'assigned'
  | 'status_changed'
  | 'priority_changed'
  | 'category_changed'
  | 'comment_added'
  | 'attachment_added'
  | 'resolved'
  | 'closed'
  | 'reopened';

export interface TicketHistory {
  id: number;
  ticketId: number;
  userId: number;
  action: HistoryAction;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  createdAt: string;

  // Relations
  user?: User;
}

export interface TicketHistoryFilters {
  ticketId?: number;
  action?: HistoryAction;
  userId?: number;
  page?: number;
  limit?: number;
}
