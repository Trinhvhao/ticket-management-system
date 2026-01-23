import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
  BeforeCreate,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Category } from './category.entity';

export enum TicketStatus {
  NEW = 'New',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  PENDING = 'Pending',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

@Table({
  tableName: 'tickets',
  timestamps: true,
  underscored: true,
})
export class Ticket extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  declare ticketNumber: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare categoryId: number;

  @Column({
    type: DataType.ENUM('Low', 'Medium', 'High'),
    allowNull: false,
    defaultValue: 'Medium',
  })
  declare priority: TicketPriority;

  @Column({
    type: DataType.ENUM('New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed'),
    allowNull: false,
    defaultValue: 'New',
  })
  declare status: TicketStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare submitterId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare assigneeId?: number | undefined;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dueDate?: Date | undefined;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare resolvedAt?: Date | undefined;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare closedAt?: Date | undefined;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  })
  declare satisfactionRating?: number | undefined;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare satisfactionComment?: string | undefined;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare resolutionNotes?: string | undefined;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Associations
  @BelongsTo(() => User, 'submitterId')
  declare submitter: User;

  @BelongsTo(() => User, 'assigneeId')
  declare assignee?: User;

  @BelongsTo(() => Category)
  declare category: Category;

  // Hooks - Auto-generate ticket number
  @BeforeCreate
  static async generateTicketNumber(instance: Ticket) {
    const year = new Date().getFullYear();
    const count = await Ticket.count({
      where: {
        ticketNumber: {
          [require('sequelize').Op.like]: `TKT-${year}-%`,
        },
      },
    });
    instance.ticketNumber = `TKT-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  // Virtual properties
  get isNew(): boolean {
    return this.status === TicketStatus.NEW;
  }

  get isAssigned(): boolean {
    return this.status === TicketStatus.ASSIGNED;
  }

  get isInProgress(): boolean {
    return this.status === TicketStatus.IN_PROGRESS;
  }

  get isPending(): boolean {
    return this.status === TicketStatus.PENDING;
  }

  get isResolved(): boolean {
    return this.status === TicketStatus.RESOLVED;
  }

  get isClosed(): boolean {
    return this.status === TicketStatus.CLOSED;
  }

  get isOverdue(): boolean {
    if (!this.dueDate || this.isClosed) return false;
    return new Date() > this.dueDate;
  }

  get ageInDays(): number {
    const now = new Date();
    const created = new Date(this.createdAt);
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Business methods
  canBeAssignedTo(_userId: number): boolean {
    return this.isNew || this.isAssigned || this.isInProgress;
  }

  canBeResolvedBy(userId: number): boolean {
    return this.assigneeId === userId && (this.isInProgress || this.isPending);
  }

  canBeClosedBy(userId: number, userRole?: string): boolean {
    // Admin can close any ticket
    if (userRole === 'Admin') {
      return this.isResolved || this.isInProgress || this.isPending;
    }
    // Submitter can only close resolved tickets
    return this.submitterId === userId && this.isResolved;
  }

  canBeRatedBy(userId: number): boolean {
    return this.submitterId === userId && this.isClosed && !this.satisfactionRating;
  }

  // Status transition methods
  assign(userId: number): void {
    if (!this.canBeAssignedTo(userId)) {
      throw new Error('Ticket cannot be assigned in current status');
    }
    this.assigneeId = userId;
    this.status = TicketStatus.ASSIGNED;
  }

  startProgress(): void {
    if (!this.isAssigned) {
      throw new Error('Ticket must be assigned before starting progress');
    }
    this.status = TicketStatus.IN_PROGRESS;
  }

  resolve(resolutionNotes: string, userId: number): void {
    if (!this.canBeResolvedBy(userId)) {
      throw new Error('Ticket cannot be resolved by this user or in current status');
    }
    this.status = TicketStatus.RESOLVED;
    this.resolutionNotes = resolutionNotes;
    this.resolvedAt = new Date();
  }

  close(userId: number, userRole?: string): void {
    if (!this.canBeClosedBy(userId, userRole)) {
      if (userRole === 'Admin') {
        throw new Error('Ticket must be in Resolved, In Progress, or Pending status to be closed');
      } else {
        throw new Error('Only the ticket submitter can close a resolved ticket');
      }
    }
    this.status = TicketStatus.CLOSED;
    this.closedAt = new Date();
  }

  reopen(): void {
    if (!this.isResolved && !this.isClosed) {
      throw new Error('Only resolved or closed tickets can be reopened');
    }
    this.status = TicketStatus.NEW;
    this.resolvedAt = undefined;
    this.closedAt = undefined;
    this.resolutionNotes = undefined;
  }

  rate(rating: number, comment?: string): void {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    this.satisfactionRating = rating;
    this.satisfactionComment = comment;
  }

  // Serialization
  override toJSON() {
    const values = { ...this.get() } as any;
    return values;
  }
}
