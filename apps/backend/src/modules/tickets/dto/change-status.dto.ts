import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus } from '../../../database/entities/ticket.entity';

export class ChangeStatusDto {
  @ApiProperty({
    description: 'New ticket status',
    enum: TicketStatus,
    example: TicketStatus.IN_PROGRESS,
  })
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status!: TicketStatus;
}
