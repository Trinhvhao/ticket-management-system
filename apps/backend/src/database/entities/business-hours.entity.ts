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
  underscored: true,
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
    field: 'day_of_week',
    comment: '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday',
  })
  dayOfWeek!: number;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    field: 'start_time',
  })
  startTime!: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    field: 'end_time',
  })
  endTime!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    field: 'is_working_day',
  })
  isWorkingDay!: boolean;

  @CreatedAt
  override createdAt!: Date;

  @UpdatedAt
  override updatedAt!: Date;
}
