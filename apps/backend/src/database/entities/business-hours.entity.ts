import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'business_hours',
  timestamps: true,
})
export class BusinessHours extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  override id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday',
  })
  dayOfWeek!: number;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  startTime!: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  endTime!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isWorkingDay!: boolean;

  @CreatedAt
  override createdAt!: Date;

  @UpdatedAt
  override updatedAt!: Date;
}
