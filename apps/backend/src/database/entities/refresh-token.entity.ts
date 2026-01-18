import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({
  tableName: 'refresh_tokens',
  timestamps: true,
  underscored: true,
})
export class RefreshToken extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  override id!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  token!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isRevoked!: boolean;

  @Column({
    type: DataType.STRING(45),
    allowNull: true,
  })
  ipAddress!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  userAgent!: string;

  @CreatedAt
  override createdAt!: Date;

  @UpdatedAt
  override updatedAt!: Date;

  /**
   * Check if token is expired
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Check if token is valid (not expired and not revoked)
   */
  isValid(): boolean {
    return !this.isExpired() && !this.isRevoked;
  }
}
