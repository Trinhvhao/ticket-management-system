export class StaffPerformanceDto {
  declare staffId: number;
  declare staffName: string;
  declare staffEmail: string;
  declare assignedTickets: number;
  declare resolvedTickets: number;
  declare averageResolutionHours: number;
  declare slaComplianceRate: number;
  declare currentWorkload: number;
}
