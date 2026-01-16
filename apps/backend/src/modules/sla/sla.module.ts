import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SlaService } from './sla.service';
import { SlaController } from './sla.controller';
import { SlaRule } from '../../database/entities/sla-rule.entity';
import { Ticket } from '../../database/entities/ticket.entity';
import { BusinessHours } from '../../database/entities/business-hours.entity';
import { Holiday } from '../../database/entities/holiday.entity';
import { BusinessHoursService } from '../../common/services/business-hours.service';

@Module({
  imports: [SequelizeModule.forFeature([SlaRule, Ticket, BusinessHours, Holiday])],
  controllers: [SlaController],
  providers: [SlaService, BusinessHoursService],
  exports: [SlaService],
})
export class SlaModule {}
