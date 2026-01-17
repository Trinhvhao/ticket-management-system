export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  closedToday: number;
  closedThisWeek: number;
  closedThisMonth: number;
  avgResolutionTime: number;
  slaComplianceRate: number;
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
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

export interface SlaCompliance {
  totalWithSla: number;
  met: number;
  breached: number;
  complianceRate: number;
  byPriority: {
    [key: string]: {
      total: number;
      met: number;
      breached: number;
      rate: number;
    };
  };
  avgResolutionTime: number;
}

export interface StaffPerformance {
  userId: number;
  fullName: string;
  email: string;
  assignedTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  slaComplianceRate: number;
  currentWorkload: number;
}

export interface TrendData {
  period: string;
  created: number;
  resolved: number;
  avgResolutionTime: number;
}

export interface TrendFilters {
  period?: 'day' | 'week' | 'month';
  startDate?: string;
  endDate?: string;
}
