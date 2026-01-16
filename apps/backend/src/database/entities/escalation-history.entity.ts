import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from 'sequelize-typescript';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';
import { EscalationRule } from './escalation-rule.entity';

@Table({
  tableName: 'escalation_history',
  timestamps: false,
})
export class EscalationHistory extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Ticket)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare ticketId: number;

  @BelongsTo(() => Ticket)
  declare ticket: Ticket;

  @ForeignKey(() => EscalationRule)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare ruleId: number;

  @BelongsTo(() => EscalationRule)
  declare rule: EscalationRule;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  declare fromLevel: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare toLevel: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'system or user_id',
  })
  declare escalatedBy: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'User escalated to',
  })
  declare escalatedToUserId: number;

  @BelongsTo(() => User, 'escalatedToUserId')
  declare escalatedToUser: User;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'Role escalated to',
  })
  declare escalatedToRole: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare reason: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;
}
