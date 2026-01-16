import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EscalationController } from './escalation.controller';
import { EscalationService } from './escalation.service';
import {
  EscalationRule,
  EscalationHistory,
  Ticket,
  User,
} from '../../database/entities';
import { SlaModule } from '../sla/sla.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EscalationRule,
      EscalationHistory,
      Ticket,
      User,
    ]),
    SlaModule,
    NotificationsModule,
  ],
  controllers: [EscalationController],
  providers: [EscalationService],
  exports: [EscalationService],
})
export class EscalationModule {}
