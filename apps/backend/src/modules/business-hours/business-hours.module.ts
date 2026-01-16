import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BusinessHoursController } from './business-hours.controller';
import { BusinessHoursService } from '../../common/services/business-hours.service';
import { BusinessHours } from '../../database/entities/business-hours.entity';
import { Holiday } from '../../database/entities/holiday.entity';

@Module({
  imports: [SequelizeModule.forFeature([BusinessHours, Holiday])],
  controllers: [BusinessHoursController],
  providers: [BusinessHoursService],
  exports: [BusinessHoursService],
})
export class BusinessHoursModule {}
