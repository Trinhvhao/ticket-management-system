export class EscalationHistoryResponseDto {
  id!: number;
  ticketId!: number;
  ruleId?: number;
  fromLevel!: number;
  toLevel!: number;
  escalatedBy!: string;
  escalatedToUserId?: number;
  escalatedToRole?: string;
  reason!: string;
  createdAt!: Date;
  ticket?: {
    id: number;
    ticketNumber: string;
    title: string;
  };
  rule?: {
    id: number;
    name: string;
  };
  escalatedToUser?: {
    id: number;
    fullName: string;
    email: string;
  };
}
