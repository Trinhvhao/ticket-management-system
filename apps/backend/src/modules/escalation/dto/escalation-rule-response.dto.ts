export class EscalationRuleResponseDto {
  id!: number;
  name!: string;
  description?: string;
  priority?: string;
  categoryId?: number;
  triggerType!: string;
  triggerHours?: number;
  escalationLevel!: number;
  targetType!: string;
  targetRole?: string;
  targetUserId?: number;
  notifyManager!: boolean;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  category?: {
    id: number;
    name: string;
  };
}
