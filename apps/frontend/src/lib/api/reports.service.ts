import apiClient from './client';

export interface ActionRequiredResponse {
  actionRequired: number;
  breakdown: {
    newTickets: number;
    newUnassigned: number;
    assignedToMe: number;
    unassigned: number;
    myOpenTickets: number;
  };
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  closedToday: number;
  closedThisWeek: number;
  closedThisMonth: number;
  avgResolutionTime: string;
  slaComplianceRate: number;
  slaBreached?: number;
  slaAtRisk?: number;
  ticketsByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  ticketsByStatus: {
    new: number;
    assigned: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
}

export interface TicketsByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface TicketsByCategory {
  categoryId: number;
  categoryName: string;
  count: number;
  percentage: number;
}

export interface TicketsByPriority {
  priority: string;
  count: number;
  percentage: number;
}

export interface SLACompliance {
  totalTickets: number;
  metSLA: number;
  breachedSLA: number;
  complianceRate: number;
  byPriority: {
    priority: string;
    total: number;
    met: number;
    breached: number;
    rate: number;
  }[];
  avgResolutionTime: string;
}

export interface StaffPerformance {
  userId: number;
  fullName: string;
  assignedTickets: number;
  resolvedTickets: number;
  avgResolutionTime: string;
  slaComplianceRate: number;
  currentWorkload: number;
}

export interface TrendData {
  period: string;
  created: number;
  resolved: number;
  avgResolutionTime: number;
}

export const reportsService = {
  /**
   * Get action required count for sidebar badge
   */
  getActionRequired: async (): Promise<ActionRequiredResponse> => {
    const response = await apiClient.get<ActionRequiredResponse>('/reports/action-required');
    return response.data;
  },

  /**
   * Get dashboard statistics
   */
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/reports/dashboard');
    return response.data;
  },

  /**
   * Get tickets by status breakdown
   */
  getTicketsByStatus: async (): Promise<TicketsByStatus[]> => {
    const response = await apiClient.get<TicketsByStatus[]>('/reports/tickets-by-status');
    return response.data;
  },

  /**
   * Get tickets by category breakdown
   */
  getTicketsByCategory: async (): Promise<TicketsByCategory[]> => {
    const response = await apiClient.get<TicketsByCategory[]>('/reports/tickets-by-category');
    return response.data;
  },

  /**
   * Get tickets by priority breakdown
   */
  getTicketsByPriority: async (): Promise<TicketsByPriority[]> => {
    const response = await apiClient.get<TicketsByPriority[]>('/reports/tickets-by-priority');
    return response.data;
  },

  /**
   * Get SLA compliance report
   */
  getSLACompliance: async (): Promise<SLACompliance> => {
    const response = await apiClient.get<SLACompliance>('/reports/sla-compliance');
    return response.data;
  },

  /**
   * Get staff performance report (Admin only)
   */
  getStaffPerformance: async (): Promise<StaffPerformance[]> => {
    const response = await apiClient.get<StaffPerformance[]>('/reports/staff-performance');
    return response.data;
  },

  /**
   * Get trends over time
   */
  getTrends: async (params: {
    period?: 'day' | 'week' | 'month';
    startDate?: string;
    endDate?: string;
  }): Promise<TrendData[]> => {
    const response = await apiClient.get<TrendData[]>('/reports/trends', { params });
    return response.data;
  },
};
