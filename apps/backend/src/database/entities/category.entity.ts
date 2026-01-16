import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Ticket } from './ticket.entity';

@Table({
  tableName: 'categories',
  timestamps: true,
  underscored: true,
})
export class Category extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string | undefined;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare icon?: string | undefined;

  @Column({
    type: DataType.STRING(7),
    allowNull: true,
  })
  declare color?: string | undefined;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare displayOrder: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Associations
  @HasMany(() => Ticket, 'categoryId')
  declare tickets: Ticket[];

  // Virtual properties
  get ticketCount(): number {
    return this.tickets?.length || 0;
  }

  // Business methods
  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  canBeDeleted(): boolean {
    return this.ticketCount === 0;
  }

  // Serialization
  override toJSON() {
    const values = { ...this.get() } as any;
    return values;
  }
}
