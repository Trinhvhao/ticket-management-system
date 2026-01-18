import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Holiday } from '../../database/entities/holiday.entity';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { Op } from 'sequelize';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectModel(Holiday)
    private holidayModel: typeof Holiday,
  ) {}

  async create(createHolidayDto: CreateHolidayDto): Promise<Holiday> {
    return this.holidayModel.create(createHolidayDto as any);
  }

  async findAll(year?: number): Promise<Holiday[]> {
    const where: any = {};
    
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    return this.holidayModel.findAll({
      where,
      order: [['date', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Holiday> {
    const holiday = await this.holidayModel.findByPk(id);
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    return holiday;
  }

  async update(id: number, updateHolidayDto: UpdateHolidayDto): Promise<Holiday> {
    const holiday = await this.findOne(id);
    await holiday.update(updateHolidayDto);
    return holiday;
  }

  async remove(id: number): Promise<void> {
    const holiday = await this.findOne(id);
    await holiday.destroy();
  }

  async bulkCreate(holidays: CreateHolidayDto[]): Promise<Holiday[]> {
    return this.holidayModel.bulkCreate(holidays as any);
  }

  async getYears(): Promise<number[]> {
    const holidays = await this.holidayModel.findAll({
      attributes: ['date'],
      order: [['date', 'ASC']],
    });

    const years = new Set<number>();
    holidays.forEach(holiday => {
      const year = new Date(holiday.date).getFullYear();
      years.add(year);
    });

    return Array.from(years).sort((a, b) => b - a);
  }
}
