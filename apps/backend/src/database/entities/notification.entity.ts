import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';

export enum NotificationType {
  TICKET_CREATED = 'ticket_created',
  TICKET_ASSIGNED = 'ticket_assigned',
  TICKET_UPDATED = 'ticket_updated',
  TICKET_COMMENTED = 'ticket_commented',
  TICKET_RESOLVED = 'ticket_resolved',
  TICKET_CLOSED = 'ticket_closed',
  TICKET_ESCALATED = 'ticket_escalated',
  SLA_WARNING = 'sla_warning',
  SLA_BREACH = 'sla_breach',
}

@Table({
  tableName: 'notifications',
  timestamps: false,
})
export class Notification extends Model<Notification> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  override id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  userId!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  type!: NotificationType;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string;

  @ForeignKey(() => Ticket)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'ticket_id',
  })
  ticketId?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_read',
  })
  isRead!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'read_at',
  })
  readAt?: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  override createdAt!: Date;

  // Associations
  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Ticket)
  ticket?: Ticket;

  // Methods
  markAsRead(): void {
    this.isRead = true;
    this.readAt = new Date();
  }
}
