import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Category } from './category.entity';

export enum EscalationTriggerType {
  SLA_AT_RISK = 'sla_at_risk',
  SLA_BREACHED = 'sla_breached',
  NO_RESPONSE = 'no_response',
  NO_ASSIGNMENT = 'no_assignment',
}

export enum EscalationTargetType {
  ROLE = 'role',
  USER = 'user',
  MANAGER = 'manager',
}

@Table({
  tableName: 'escalation_rules',
  timestamps: true,
})
export class EscalationRule extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.ENUM('Low', 'Medium', 'High'),
    allowNull: true,
    comment: 'Apply to specific priority, null = all priorities',
  })
  declare priority: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Apply to specific category, null = all categories',
  })
  declare categoryId: number;

  @BelongsTo(() => Category)
  declare category: Category;

  @Column({
    type: DataType.ENUM(...Object.values(EscalationTriggerType)),
    allowNull: false,
  })
  declare triggerType: EscalationTriggerType;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Hours before trigger (for no_response/no_assignment)',
  })
  declare triggerHours: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Escalation level (1, 2, 3...)',
  })
  declare escalationLevel: number;

  @Column({
    type: DataType.ENUM(...Object.values(EscalationTargetType)),
    allowNull: false,
  })
  declare targetType: EscalationTargetType;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'Target role (IT_Staff, Admin) if targetType = role',
  })
  declare targetRole: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Target user ID if targetType = user',
  })
  declare targetUserId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare notifyManager: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;
}
