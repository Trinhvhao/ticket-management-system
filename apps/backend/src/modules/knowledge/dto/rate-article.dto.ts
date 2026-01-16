import { IsBoolean, IsString, IsOptional, MaxLength } from 'class-validator';

export class RateArticleDto {
  @IsBoolean()
  isHelpful!: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  feedback?: string;
}
