import { IsEnum, IsInt, Min, IsBoolean, IsOptional } from 'class-validator';
import { TicketPriority } from '../../../database/entities/ticket.entity';

export class CreateSlaRuleDto {
  @IsEnum(TicketPriority)
  declare priority: TicketPriority;

  @IsInt()
  @Min(1)
  declare responseTimeHours: number;

  @IsInt()
  @Min(1)
  declare resolutionTimeHours: number;

  @IsOptional()
  @IsBoolean()
  declare isActive?: boolean;
}
