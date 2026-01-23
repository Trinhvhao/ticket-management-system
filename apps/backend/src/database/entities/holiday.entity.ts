import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'holidays',
  timestamps: true,
  underscored: true,
})
export class Holiday extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  override id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_recurring',
    comment: 'If true, repeats every year',
  })
  isRecurring!: boolean;

  @CreatedAt
  override createdAt!: Date;

  @UpdatedAt
  override updatedAt!: Date;
}
