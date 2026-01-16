import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max } from 'class-validator';

export class RateTicketDto {
  @IsInt({ message: 'Rating must be an integer' })
  @IsNotEmpty({ message: 'Rating is required' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating!: number;

  @IsOptional()
  @IsString({ message: 'Comment must be a string' })
  comment?: string;
}
