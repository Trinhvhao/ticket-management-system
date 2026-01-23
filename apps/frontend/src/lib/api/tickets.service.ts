import apiClient from './client';
import {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  AssignTicketRequest,
  RateTicketRequest,
  TicketFilters,
  PaginatedTickets,
} from '../types/ticket.types';

export const ticketsService = {
  /**
   * Get all tickets with filters and pagination
   */
  getAll: async (filters: TicketFilters = {}): Promise<PaginatedTickets> => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.categoryId) params.append('categoryId', String(filters.categoryId));
    if (filters.submitterId) params.append('submitterId', String(filters.submitterId));
    
    // Handle assigneeId - support null for unassigned tickets
    if (filters.assigneeId !== undefined) {
      params.append('assigneeId', filters.assigneeId === null ? 'null' : String(filters.assigneeId));
    }
    
    if (filters.createdById) params.append('submitterId', String(filters.createdById));
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<PaginatedTickets>(`/tickets?${params.toString()}`);
    return response.data;
  },

  /**
   * Get my tickets (created by current user)
   */
  getMyTickets: async (filters: TicketFilters = {}): Promise<PaginatedTickets> => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const response = await apiClient.get<PaginatedTickets>(`/tickets/my-tickets?${params.toString()}`);
    return response.data;
  },

  /**
   * Get tickets assigned to current user (IT Staff/Admin)
   */
  getAssignedToMe: async (filters: TicketFilters = {}): Promise<PaginatedTickets> => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const response = await apiClient.get<PaginatedTickets>(`/tickets/assigned-to-me?${params.toString()}`);
    return response.data;
  },

  /**
   * Get ticket by ID
   */
  getById: async (id: number): Promise<Ticket> => {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Create new ticket
   */
  create: async (data: CreateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>('/tickets', data);
    return response.data;
  },

  /**
   * Update ticket
   */
  update: async (id: number, data: UpdateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.patch<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },

  /**
   * Assign ticket to IT staff
   */
  assign: async (id: number, data: AssignTicketRequest): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/assign`, data);
    return response.data;
  },

  /**
   * Start working on ticket
   */
  startProgress: async (id: number): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/start-progress`);
    return response.data;
  },

  /**
   * Resolve ticket
   */
  resolve: async (id: number, resolutionNotes: string): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/resolve`, { resolutionNotes });
    return response.data;
  },

  /**
   * Close ticket
   */
  close: async (id: number): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/close`);
    return response.data;
  },

  /**
   * Reopen ticket
   */
  reopen: async (id: number): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/reopen`);
    return response.data;
  },

  /**
   * Rate ticket satisfaction
   */
  rate: async (id: number, data: RateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/rate`, data);
    return response.data;
  },

  /**
   * Change ticket status (for Kanban board)
   */
  changeStatus: async (id: number, status: string): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/change-status`, { status });
    return response.data;
  },

  /**
   * Bulk assign tickets
   */
  bulkAssign: async (ticketIds: number[], assigneeId: number): Promise<{ success: number; failed: number; errors: string[] }> => {
    const response = await apiClient.post(`/tickets/bulk-assign`, { ticketIds, assigneeId });
    return response.data;
  },

  /**
   * Bulk change status
   */
  bulkChangeStatus: async (ticketIds: number[], status: string): Promise<{ success: number; failed: number; errors: string[] }> => {
    const response = await apiClient.post(`/tickets/bulk-status`, { ticketIds, status });
    return response.data;
  },

  /**
   * Bulk delete tickets
   */
  bulkDelete: async (ticketIds: number[]): Promise<{ success: number; failed: number; errors: string[] }> => {
    const response = await apiClient.post(`/tickets/bulk-delete`, { ticketIds });
    return response.data;
  },

  /**
   * Delete ticket (Admin only)
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Get ticket statistics
   */
  getStats: async (): Promise<{
    total: number;
    byStatus: {
      new: number;
      assigned: number;
      inProgress: number;
      pending: number;
      resolved: number;
      closed: number;
    };
  }> => {
    const response = await apiClient.get('/tickets/stats');
    return response.data;
  },
};
