import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HolidaysService } from './holidays.service';
import { HolidaysController } from './holidays.controller';
import { Holiday } from '../../database/entities/holiday.entity';

@Module({
  imports: [SequelizeModule.forFeature([Holiday])],
  controllers: [HolidaysController],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule {}
