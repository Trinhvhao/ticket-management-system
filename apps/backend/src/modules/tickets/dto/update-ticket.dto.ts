import { IsString, IsOptional, IsInt, IsEnum, MinLength } from 'class-validator';
import { TicketPriority, TicketStatus } from '../../../database/entities/ticket.entity';

export class UpdateTicketDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Category ID must be an integer' })
  categoryId?: number;

  @IsOptional()
  @IsEnum(TicketPriority, { message: 'Priority must be Low, Medium, or High' })
  priority?: TicketPriority;

  @IsOptional()
  @IsEnum(TicketStatus, { message: 'Invalid status' })
  status?: TicketStatus;

  @IsOptional()
  @IsInt({ message: 'Assignee ID must be an integer' })
  assigneeId?: number;
}
