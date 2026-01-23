export class DashboardStatsDto {
  declare totalTickets: number;
  declare openTickets: number;
  declare closedToday: number;
  declare closedThisWeek: number;
  declare closedThisMonth: number;
  declare avgResolutionTime: number;
  declare slaComplianceRate: number;
  declare slaBreached: number;
  declare slaAtRisk: number;
  declare ticketsByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  declare ticketsByStatus: {
    new: number;
    assigned: number;
    in_progress: number;
    pending: number;
    resolved: number;
    closed: number;
  };
}
