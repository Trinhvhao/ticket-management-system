import { IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class UpdateSlaRuleDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  declare responseTimeHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  declare resolutionTimeHours?: number;

  @IsOptional()
  @IsBoolean()
  declare isActive?: boolean;
}
