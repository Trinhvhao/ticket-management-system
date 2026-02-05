import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentsService } from './comments.service';
import { CommentsController, CommentsManagementController } from './comments.controller';
import { Comment } from '../../database/entities/comment.entity';
import { Ticket } from '../../database/entities/ticket.entity';
import { User } from '../../database/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment, Ticket, User]),
    NotificationsModule,
  ],
  controllers: [CommentsController, CommentsManagementController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
