import { IsString, IsOptional, IsArray, MaxLength, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

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
  @IsOptional()
  categoryId?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
