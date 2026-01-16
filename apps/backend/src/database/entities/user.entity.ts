import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { Ticket } from './ticket.entity';
import { Comment } from './comment.entity';
import { KnowledgeArticle } from './knowledge-article.entity';

export enum UserRole {
  EMPLOYEE = 'Employee',
  IT_STAFF = 'IT_Staff',
  ADMIN = 'Admin',
}

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true, // Convert camelCase to snake_case
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare fullName: string;

  @Column({
    type: DataType.ENUM('Employee', 'IT_Staff', 'Admin'),
    allowNull: false,
    defaultValue: 'Employee',
  })
  declare role: UserRole;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare department?: string | undefined;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare phone?: string | undefined;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare avatarUrl?: string | undefined;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare lastLoginAt?: Date | undefined;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Associations
  @HasMany(() => Ticket, 'submitterId')
  declare submittedTickets: Ticket[];

  @HasMany(() => Ticket, 'assigneeId')
  declare assignedTickets: Ticket[];

  @HasMany(() => Comment, 'userId')
  declare comments: Comment[];

  @HasMany(() => KnowledgeArticle, 'authorId')
  declare knowledgeArticles: KnowledgeArticle[];

  // Hooks - Password hashing
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(12);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  // Instance methods
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Virtual properties
  get isEmployee(): boolean {
    return this.role === UserRole.EMPLOYEE;
  }

  get isITStaff(): boolean {
    return this.role === UserRole.IT_STAFF;
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  // Business methods
  canManageTickets(): boolean {
    return this.role === UserRole.IT_STAFF || this.role === UserRole.ADMIN;
  }

  canManageUsers(): boolean {
    return this.role === UserRole.ADMIN;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  updateLastLogin(): void {
    this.lastLoginAt = new Date();
  }

  // Serialization
  override toJSON() {
    const values = { ...this.get() } as any;
    delete values.password; // Never expose password
    return values;
  }
}
