import type { TicketPriority } from './ticket.types';

export type SlaStatusType = 'met' | 'at_risk' | 'breached' | 'not_applicable';

export interface SlaRule {
  id: number;
  priority: TicketPriority;
  responseTimeHours: number;
  resolutionTimeHours: number;
  responseTimeFormatted: string;
  resolutionTimeFormatted: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlaRuleDto {
  priority: TicketPriority;
  responseTimeHours: number;
  resolutionTimeHours: number;
  isActive?: boolean;
}

export interface UpdateSlaRuleDto {
  responseTimeHours?: number;
  resolutionTimeHours?: number;
  isActive?: boolean;
}

export interface SlaStatus {
  ticketId: number;
  status: SlaStatusType;
  dueDate: string | null;
  timeRemaining: string | null;
  percentageUsed: number | null;
  isBreached: boolean;
  isAtRisk: boolean;
}

export interface AtRiskTicket {
  id: number;
  ticketNumber: string;
  title: string;
  priority: TicketPriority;
  status: string;
  dueDate: string;
  createdAt: string;
}

export interface BreachedTicket extends AtRiskTicket {
  breachedBy: number; // Hours overdue
}

export interface AtRiskResponse {
  count: number;
  tickets: AtRiskTicket[];
}

export interface BreachedResponse {
  count: number;
  tickets: BreachedTicket[];
}
