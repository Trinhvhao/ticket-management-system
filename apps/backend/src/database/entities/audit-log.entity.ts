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

@Table({ tableName: 'audit_logs', timestamps: false })
export class AuditLog extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare action: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare entityType: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare entityId: number;

  @Column({ type: DataType.STRING(45), allowNull: true })
  declare ipAddress: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare userAgent: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare details: any;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare createdAt: Date;
}
