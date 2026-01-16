import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { TicketPriority } from './ticket.entity';


@Table({
  tableName: 'sla_rules',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['priority'], unique: true },
    { fields: ['is_active'] },
  ],
})
export class SlaRule extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.ENUM(...Object.values(TicketPriority)),
    allowNull: false,
    unique: true,
  })
  declare priority: TicketPriority;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'response_time_hours',
  })
  declare responseTimeHours: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'resolution_time_hours',
  })
  declare resolutionTimeHours: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  declare isActive: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updatedAt: Date;

  // Helper methods
  calculateDueDate(createdAt: Date = new Date()): Date {
    const dueDate = new Date(createdAt);
    dueDate.setHours(dueDate.getHours() + this.resolutionTimeHours);
    return dueDate;
  }

  calculateResponseDueDate(createdAt: Date = new Date()): Date {
    const dueDate = new Date(createdAt);
    dueDate.setHours(dueDate.getHours() + this.responseTimeHours);
    return dueDate;
  }

  getWarningThreshold(): number {
    // Warning at 80% of SLA time
    return this.resolutionTimeHours * 0.8;
  }

  // Format for display
  get responseTimeFormatted(): string {
    if (this.responseTimeHours < 24) {
      return `${this.responseTimeHours} hours`;
    }
    const days = Math.floor(this.responseTimeHours / 24);
    const hours = this.responseTimeHours % 24;
    return hours > 0 ? `${days} days ${hours} hours` : `${days} days`;
  }

  get resolutionTimeFormatted(): string {
    if (this.resolutionTimeHours < 24) {
      return `${this.resolutionTimeHours} hours`;
    }
    const days = Math.floor(this.resolutionTimeHours / 24);
    const hours = this.resolutionTimeHours % 24;
    return hours > 0 ? `${days} days ${hours} hours` : `${days} days`;
  }
}
