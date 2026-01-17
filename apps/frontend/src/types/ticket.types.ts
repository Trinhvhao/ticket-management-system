import type { User } from './user.types';
import type { Category } from './category.types';
import type { Comment } from './comment.types';
import type { Attachment } from './attachment.types';

export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

export interface Ticket {
  id: number;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  categoryId: number;
  submitterId: number;
  assigneeId?: number;
  dueDate?: string;
  resolvedAt?: string;
  closedAt?: string;
  satisfactionRating?: number;
  satisfactionComment?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;

  // Relations (populated)
  category?: Category;
  submitter?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface CreateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
  categoryId: number;
}

export interface UpdateTicketDto {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  categoryId?: number;
}

export interface AssignTicketDto {
  assigneeId: number;
}

export interface ResolveTicketDto {
  resolutionNotes: string;
}

export interface RateTicketDto {
  rating: number; // 1-5
  comment?: string;
}

export interface TicketFilters {
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority | TicketPriority[];
  categoryId?: number;
  submitterId?: number;
  assigneeId?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
