import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { BusinessHoursService } from '../../common/services/business-hours.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('business-hours')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessHoursController {
  constructor(private readonly businessHoursService: BusinessHoursService) {}

  @Get('holidays')
  async getHolidays(@Query('year') year?: string) {
    if (year) {
      return this.businessHoursService.getHolidaysByYear(parseInt(year));
    }
    return this.businessHoursService.getAllHolidays();
  }

  @Get('check-working-day')
  async checkWorkingDay(@Query('date') dateStr: string) {
    const date = new Date(dateStr);
    const isWorking = await this.businessHoursService.isWorkingDay(date);
    return { date: dateStr, isWorkingDay: isWorking };
  }

  @Get('calculate')
  async calculateBusinessHours(
    @Query('start') startStr: string,
    @Query('end') endStr: string,
  ) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const hours = await this.businessHoursService.calculateBusinessHours(start, end);
    return { start: startStr, end: endStr, businessHours: hours };
  }
}
