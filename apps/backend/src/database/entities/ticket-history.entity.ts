import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';

export enum TicketHistoryAction {
  CREATED = 'created',
  UPDATED = 'updated',
  ASSIGNED = 'assigned',
  STATUS_CHANGED = 'status_changed',
  PRIORITY_CHANGED = 'priority_changed',
  CATEGORY_CHANGED = 'category_changed',
  COMMENT_ADDED = 'comment_added',
  ATTACHMENT_ADDED = 'attachment_added',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REOPENED = 'reopened',
}

@Table({
  tableName: 'ticket_history',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['ticket_id'] },
    { fields: ['user_id'] },
    { fields: ['action'] },
    { fields: ['created_at'] },
  ],
})
export class TicketHistory extends Model {
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
    field: 'ticket_id',
  })
  declare ticketId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare action: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'field_name',
  })
  declare fieldName?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'old_value',
  })
  declare oldValue?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'new_value',
  })
  declare newValue?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  declare createdAt: Date;

  // Associations
  @BelongsTo(() => Ticket)
  declare ticket: Ticket;

  @BelongsTo(() => User)
  declare user: User;

  // Helper methods
  static getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      created: 'Ticket created',
      updated: 'Ticket updated',
      assigned: 'Ticket assigned',
      status_changed: 'Status changed',
      priority_changed: 'Priority changed',
      category_changed: 'Category changed',
      comment_added: 'Comment added',
      attachment_added: 'Attachment added',
      resolved: 'Ticket resolved',
      closed: 'Ticket closed',
      reopened: 'Ticket reopened',
    };
    return labels[action] || action;
  }

  get actionLabel(): string {
    return TicketHistory.getActionLabel(this.action);
  }

  // Format change description
  get changeDescription(): string {
    if (this.description) {
      return this.description;
    }

    if (this.fieldName && this.oldValue && this.newValue) {
      return `${this.fieldName} changed from "${this.oldValue}" to "${this.newValue}"`;
    }

    if (this.fieldName && this.newValue) {
      return `${this.fieldName} set to "${this.newValue}"`;
    }

    return this.actionLabel;
  }
}
