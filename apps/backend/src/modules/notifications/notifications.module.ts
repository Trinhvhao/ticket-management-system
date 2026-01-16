import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification, User, Ticket } from '../../database/entities';
import { EmailService } from '../../common/services/email.service';

@Module({
  imports: [SequelizeModule.forFeature([Notification, User, Ticket])],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
