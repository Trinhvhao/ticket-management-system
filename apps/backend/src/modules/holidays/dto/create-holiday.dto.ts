import { IsString, IsDateString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateHolidayDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsDateString()
  date!: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
