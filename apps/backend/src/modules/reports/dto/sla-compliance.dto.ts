export class SlaComplianceByPriorityDto {
  declare priority: string;
  declare total: number;
  declare met: number;
  declare breached: number;
  declare rate: number;
}

export class SlaComplianceDto {
  declare totalTickets: number;
  declare metSla: number;
  declare breachedSla: number;
  declare complianceRate: number;
  declare averageResolutionHours: number;
  declare byPriority: SlaComplianceByPriorityDto[];
}
