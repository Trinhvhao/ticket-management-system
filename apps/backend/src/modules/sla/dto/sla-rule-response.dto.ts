export class SlaRuleResponseDto {
  declare id: number;
  declare priority: string;
  declare responseTimeHours: number;
  declare resolutionTimeHours: number;
  declare responseTimeFormatted: string;
  declare resolutionTimeFormatted: string;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}
