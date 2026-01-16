import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { TicketHistoryService } from './ticket-history.service';
import { TicketHistoryResponseDto } from './dto';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../database/entities/user.entity';

@Controller('ticket-history')
export class TicketHistoryController {
  constructor(private readonly ticketHistoryService: TicketHistoryService) {}

  @Get('ticket/:ticketId')
  async getTicketHistory(
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<TicketHistoryResponseDto[]> {
    return this.ticketHistoryService.findByTicketId(ticketId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.IT_STAFF)
  async getAllHistory(
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 100,
    @Query('offset', new ParseIntPipe({ optional: true })) offset = 0,
  ): Promise<TicketHistoryResponseDto[]> {
    return this.ticketHistoryService.findAll(limit, offset);
  }
}
