import { IsString, IsNotEmpty, IsInt, IsEnum, IsOptional, MinLength } from 'class-validator';
import { TicketPriority } from '../../../database/entities/ticket.entity';

export class CreateTicketDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  title!: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description!: string;

  @IsInt({ message: 'Category ID must be an integer' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId!: number;

  @IsOptional()
  @IsEnum(TicketPriority, { message: 'Priority must be Low, Medium, or High' })
  priority?: TicketPriority;
}
