export enum SlaStatus {
  MET = 'met',
  AT_RISK = 'at_risk',
  BREACHED = 'breached',
  NOT_APPLICABLE = 'not_applicable',
}

export class SlaStatusDto {
  declare ticketId: number;
  declare status: SlaStatus;
  declare dueDate: Date | null;
  declare timeRemaining: string | null;
  declare percentageUsed: number | null;
  declare isBreached: boolean;
  declare isAtRisk: boolean;
}
