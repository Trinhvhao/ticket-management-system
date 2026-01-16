import { IsArray, IsEnum, IsInt, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus } from '../../../database/entities/ticket.entity';

export class BulkStatusDto {
  @ApiProperty({
    description: 'Array of ticket IDs to update',
    example: [1, 2, 3, 4, 5],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  ticketIds!: number[];

  @ApiProperty({
    description: 'New status for all tickets',
    enum: TicketStatus,
    example: TicketStatus.CLOSED,
  })
  @IsEnum(TicketStatus)
  status!: TicketStatus;
}
