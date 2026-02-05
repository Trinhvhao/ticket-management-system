import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TimezoneCheckController } from './timezone-check.controller';
import { Ticket } from '../../database/entities/ticket.entity';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Ticket, User]),
  ],
  controllers: [TimezoneCheckController],
})
export class DebugModule {}
