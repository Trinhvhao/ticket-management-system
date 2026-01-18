export class HolidayResponseDto {
  id!: number;
  name!: string;
  date!: string;
  isRecurring!: boolean;
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
