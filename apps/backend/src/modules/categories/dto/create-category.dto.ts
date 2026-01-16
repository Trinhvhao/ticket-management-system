import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Icon must be a string' })
  icon?: string;

  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'Color must be a valid hex color code (e.g., #FF5733)' })
  color?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsInt({ message: 'displayOrder must be an integer' })
  @Min(0, { message: 'displayOrder must be at least 0' })
  displayOrder?: number;
}
