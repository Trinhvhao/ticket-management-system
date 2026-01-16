export class TicketHistoryResponseDto {
  declare id: number;
  declare ticketId: number;
  declare userId: number;
  declare action: string;
  declare actionLabel: string;
  declare fieldName: string | undefined;
  declare oldValue: string | undefined;
  declare newValue: string | undefined;
  declare description: string | undefined;
  declare changeDescription: string;
  declare createdAt: Date;
  declare user?: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}
