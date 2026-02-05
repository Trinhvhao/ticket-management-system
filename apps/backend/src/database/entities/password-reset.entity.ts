import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'password_resets',
  timestamps: false,
})
export class PasswordReset extends Model<PasswordReset> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  override id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(6),
    allowNull: false,
  })
  otp!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'expires_at',
  })
  expiresAt!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'is_used',
  })
  isUsed!: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  override createdAt!: Date;

  // Helper methods
  isExpired(): boolean {
    const nowTimestamp = Date.now();
    const expiresTimestamp = new Date(this.expiresAt).getTime();
    
    // PostgreSQL đang lưu với timezone sai, luôn cộng 7 giờ để fix
    const offset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
    const adjustedExpiresTimestamp = expiresTimestamp + offset;
    
    const isExp = nowTimestamp > adjustedExpiresTimestamp;
    
    console.log('isExpired check (with timezone fix):', {
      now: new Date(nowTimestamp).toISOString(),
      expiresRaw: new Date(expiresTimestamp).toISOString(),
      expiresAdjusted: new Date(adjustedExpiresTimestamp).toISOString(),
      diffMinutes: (adjustedExpiresTimestamp - nowTimestamp) / 1000 / 60,
      isExpired: isExp
    });
    
    return isExp;
  }

  isValid(): boolean {
    return !this.isUsed && !this.isExpired();
  }
}
