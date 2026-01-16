export class TrendDataDto {
  declare period: string; // Date string (YYYY-MM-DD)
  declare ticketsCreated: number;
  declare ticketsResolved: number;
  declare ticketsClosed: number;
  declare averageResolutionHours: number;
}
