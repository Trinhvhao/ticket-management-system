import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TicketHistoryController } from './ticket-history.controller';
import { TicketHistoryService } from './ticket-history.service';
import { TicketHistory } from '../../database/entities/ticket-history.entity';

@Module({
  imports: [SequelizeModule.forFeature([TicketHistory])],
  controllers: [TicketHistoryController],
  providers: [TicketHistoryService],
  exports: [TicketHistoryService],
})
export class TicketHistoryModule {}
