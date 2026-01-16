import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';

export enum CommentType {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  SYSTEM = 'system',
}

@Table({
  tableName: 'comments',
  timestamps: true,
  paranoid: true, // Soft delete
  underscored: true, // Use snake_case for column names
  indexes: [
    { fields: ['ticket_id'] },
    { fields: ['user_id'] },
    { fields: ['type'] },
    { fields: ['created_at'] },
  ],
})
export class Comment extends Model {
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
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  @Column({
    type: DataType.ENUM(...Object.values(CommentType)),
    allowNull: false,
    defaultValue: CommentType.PUBLIC,
  })
  declare type: CommentType;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_edited',
  })
  declare isEdited: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'edited_at',
  })
  declare editedAt?: Date;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare metadata?: Record<string, any> | undefined;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Associations
  @BelongsTo(() => Ticket)
  declare ticket: Ticket;

  @BelongsTo(() => User)
  declare user: User;

  // Virtual properties
  get isPublic(): boolean {
    return this.type === CommentType.PUBLIC;
  }

  get isInternal(): boolean {
    return this.type === CommentType.INTERNAL;
  }

  get isSystem(): boolean {
    return this.type === CommentType.SYSTEM;
  }

  get canBeEdited(): boolean {
    if (this.isSystem) return false;
    const editTimeLimit = 15 * 60 * 1000; // 15 minutes
    return Date.now() - this.createdAt.getTime() < editTimeLimit;
  }

  get ageInMinutes(): number {
    return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60));
  }

  // Business methods
  canBeEditedBy(userId: number): boolean {
    return this.userId === userId && this.canBeEdited;
  }

  canBeDeletedBy(userId: number, userRole: string): boolean {
    return this.userId === userId || userRole === 'Admin';
  }

  canBeViewedBy(userId: number, userRole: string): boolean {
    if (this.isPublic) return true;
    if (this.isInternal) {
      return userRole === 'IT_Staff' || userRole === 'Admin';
    }
    return this.userId === userId || userRole === 'Admin';
  }

  edit(newContent: string): void {
    if (!this.canBeEdited) {
      throw new Error('Comment cannot be edited after 15 minutes');
    }
    this.content = newContent;
    this.isEdited = true;
    this.editedAt = new Date();
  }

  // Static methods
  static createSystemComment(ticketId: number, content: string, metadata?: Record<string, any> | undefined): Partial<Comment> {
    return {
      ticketId,
      userId: 1, // System user ID (should be created in seeders)
      content,
      type: CommentType.SYSTEM,
      metadata,
    };
  }

  // Serialization
  override toJSON() {
    const values = { ...this.get() } as any;
    delete values.deletedAt;
    return values;
  }
}