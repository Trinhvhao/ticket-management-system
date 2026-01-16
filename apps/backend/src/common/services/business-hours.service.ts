import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BusinessHours } from '../../database/entities/business-hours.entity';
import { Holiday } from '../../database/entities/holiday.entity';
import { Op } from 'sequelize';

@Injectable()
export class BusinessHoursService {
  constructor(
    @InjectModel(BusinessHours)
    private businessHoursModel: typeof BusinessHours,
    @InjectModel(Holiday)
    private holidayModel: typeof Holiday,
  ) {}

  async isWorkingDay(date: Date): Promise<boolean> {
    const dayOfWeek = date.getDay();
    
    const businessHour = await this.businessHoursModel.findOne({
      where: { dayOfWeek, isWorkingDay: true },
    });
    
    if (!businessHour) {
      return false;
    }

    const dateOnly = date.toISOString().split('T')[0];
    const holiday = await this.holidayModel.findOne({
      where: { date: dateOnly },
    });

    return !holiday;
  }

  async getBusinessHours(dayOfWeek: number): Promise<BusinessHours | null> {
    return this.businessHoursModel.findOne({
      where: { dayOfWeek },
    });
  }

  async calculateBusinessHours(startDate: Date, endDate: Date): Promise<number> {
    if (startDate >= endDate) {
      return 0;
    }

    let totalHours = 0;
    const current = new Date(startDate);

    while (current < endDate) {
      const dayOfWeek = current.getDay();
      const isWorking = await this.isWorkingDay(current);

      if (isWorking) {
        const businessHour = await this.getBusinessHours(dayOfWeek);
        
        if (businessHour) {
          const [startHour = 0, startMin = 0] = businessHour.startTime.split(':').map(Number);
          const [endHour = 0, endMin = 0] = businessHour.endTime.split(':').map(Number);

          const dayStart = new Date(current);
          dayStart.setHours(startHour, startMin, 0, 0);

          const dayEnd = new Date(current);
          dayEnd.setHours(endHour, endMin, 0, 0);

          const overlapStart = current < dayStart ? dayStart : current;
          const overlapEnd = endDate < dayEnd ? endDate : dayEnd;

          if (overlapStart < overlapEnd) {
            const hours = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60);
            totalHours += hours;
          }
        }
      }

      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
    }

    return totalHours;
  }

  async addBusinessHours(startDate: Date, hoursToAdd: number): Promise<Date> {
    if (hoursToAdd <= 0) {
      return startDate;
    }

    let remainingHours = hoursToAdd;
    const current = new Date(startDate);

    while (remainingHours > 0) {
      const dayOfWeek = current.getDay();
      const isWorking = await this.isWorkingDay(current);

      if (isWorking) {
        const businessHour = await this.getBusinessHours(dayOfWeek);
        
        if (businessHour) {
          const [startHour = 0, startMin = 0] = businessHour.startTime.split(':').map(Number);
          const [endHour = 0, endMin = 0] = businessHour.endTime.split(':').map(Number);

          const dayStart = new Date(current);
          dayStart.setHours(startHour, startMin, 0, 0);

          const dayEnd = new Date(current);
          dayEnd.setHours(endHour, endMin, 0, 0);

          if (current < dayStart) {
            current.setTime(dayStart.getTime());
          }

          if (current >= dayEnd) {
            current.setDate(current.getDate() + 1);
            current.setHours(0, 0, 0, 0);
            continue;
          }

          const availableHours = (dayEnd.getTime() - current.getTime()) / (1000 * 60 * 60);

          if (remainingHours <= availableHours) {
            current.setTime(current.getTime() + remainingHours * 60 * 60 * 1000);
            remainingHours = 0;
          } else {
            remainingHours -= availableHours;
            current.setDate(current.getDate() + 1);
            current.setHours(0, 0, 0, 0);
          }
        } else {
          current.setDate(current.getDate() + 1);
          current.setHours(0, 0, 0, 0);
        }
      } else {
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
      }
    }

    return current;
  }

  async getAllHolidays(): Promise<Holiday[]> {
    return this.holidayModel.findAll({
      order: [['date', 'ASC']],
    });
  }

  async getHolidaysByYear(year: number): Promise<Holiday[]> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    return this.holidayModel.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['date', 'ASC']],
    });
  }
}
