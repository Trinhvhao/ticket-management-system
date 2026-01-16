export class DashboardStatsDto {
  declare totalTickets: number;
  declare openTickets: number;
  declare closedToday: number;
  declare closedThisWeek: number;
  declare closedThisMonth: number;
  declare averageResolutionHours: number;
  declare slaComplianceRate: number;
  declare ticketsByPriority: {
    High: number;
    Medium: number;
    Low: number;
  };
  declare ticketsByStatus: {
    New: number;
    Assigned: number;
    'In Progress': number;
    Pending: number;
    Resolved: number;
    Closed: number;
  };
}
