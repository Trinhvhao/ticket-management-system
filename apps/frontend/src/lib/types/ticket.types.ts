export enum TicketStatus {
  NEW = 'New',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  PENDING = 'Pending',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface Ticket {
  id: number;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus | string;
  priority: TicketPriority | string;
  categoryId: number;
  submitterId: number;
  assigneeId: number | null;
  dueDate: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  satisfactionRating: number | null;
  satisfactionFeedback: string | null;
  resolutionNotes: string | null;
  slaBreached: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  category?: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  submitter?: {
    id: number;
    fullName: string;
    email: string;
    department?: string;
  };
  assignee?: {
    id: number;
    fullName: string;
    email: string;
  } | null;
  slaRule?: {
    id: number;
    name: string;
    responseTime: number;
    resolutionTime: number;
  } | null;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  categoryId: number;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  categoryId?: number;
}

export interface AssignTicketRequest {
  assigneeId: number;
}

export interface RateTicketRequest {
  rating: number; // 1-5
  feedback?: string;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  categoryId?: number;
  submitterId?: number;
  assigneeId?: number;
  createdById?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedTickets {
  tickets: Ticket[];
  total: number;
  page: number;
  totalPages: number;
}
