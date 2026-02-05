import { IsString, IsNotEmpty, IsOptional, IsArray, MaxLength, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  summary?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  categoryId!: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
