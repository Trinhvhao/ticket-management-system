import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { EscalationTriggerType, EscalationTargetType } from '../../../database/entities';

export class CreateEscalationRuleDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['Low', 'Medium', 'High'])
  priority?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsEnum(EscalationTriggerType)
  triggerType!: EscalationTriggerType;

  @IsOptional()
  @IsInt()
  @Min(1)
  triggerHours?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  escalationLevel!: number;

  @IsEnum(EscalationTargetType)
  targetType!: EscalationTargetType;

  @IsOptional()
  @IsString()
  targetRole?: string;

  @IsOptional()
  @IsInt()
  targetUserId?: number;

  @IsOptional()
  @IsBoolean()
  notifyManager?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
