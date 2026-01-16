import { IsInt, IsString, IsOptional, IsEnum } from 'class-validator';
import { TicketHistoryAction } from '../../../database/entities/ticket-history.entity';

export class CreateTicketHistoryDto {
  @IsInt()
  declare ticketId: number;

  @IsInt()
  declare userId: number;

  @IsEnum(TicketHistoryAction)
  declare action: TicketHistoryAction;

  @IsOptional()
  @IsString()
  declare fieldName?: string;

  @IsOptional()
  @IsString()
  declare oldValue?: string;

  @IsOptional()
  @IsString()
  declare newValue?: string;

  @IsOptional()
  @IsString()
  declare description?: string;
}
