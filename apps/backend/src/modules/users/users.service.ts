import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

export interface UserFilters {
  role?: UserRole | undefined;
  department?: string | undefined;
  isActive?: boolean | undefined;
  search?: string | undefined;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  /**
   * Create a new user (Admin only)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username or email already exists
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.EMPLOYEE,
      isActive: true,
    } as any);

    // Return user without password
    const { password, ...result } = user.toJSON();
    return result as User;
  }

  /**
   * Get all users with filters and pagination
   */
  async findAll(
    filters: UserFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (filters.role) where.role = filters.role;
    if (filters.department) where.department = filters.department;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    // Search in username, email, fullName
    if (filters.search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } },
        { fullName: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const { rows: users, count: total } = await this.userModel.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get user by ID
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Get user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
    });
  }

  /**
   * Get user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { username },
    });
  }

  /**
   * Update user (Admin only)
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if new username or email conflicts
    if (updateUserDto.username || updateUserDto.email) {
      const conflictWhere: any = {
        id: { [Op.ne]: id },
      };

      if (updateUserDto.username && updateUserDto.username !== user.username) {
        conflictWhere.username = updateUserDto.username;
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        conflictWhere.email = updateUserDto.email;
      }

      const existingUser = await this.userModel.findOne({
        where: conflictWhere,
      });

      if (existingUser) {
        if (existingUser.username === updateUserDto.username) {
          throw new ConflictException('Username already exists');
        }
        if (existingUser.email === updateUserDto.email) {
          throw new ConflictException('Email already exists');
        }
      }
    }

    await user.update(updateUserDto);

    return this.findOne(id);
  }

  /**
   * Update user profile (self)
   */
  async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await user.update(updateProfileDto);

    return this.findOne(id);
  }

  /**
   * Change password
   */
  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(changePasswordDto.currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update password
    await user.update({ password: hashedPassword });

    return { message: 'Password changed successfully' };
  }

  /**
   * Activate user
   */
  async activate(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.activate();
    await user.save();

    return this.findOne(id);
  }

  /**
   * Deactivate user
   */
  async deactivate(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.deactivate();
    await user.save();

    return this.findOne(id);
  }

  /**
   * Delete user (soft delete)
   */
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Cannot delete admin users
    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Cannot delete admin users');
    }

    await user.destroy();

    return { message: 'User deleted successfully' };
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<any> {
    const [total, active, inactive, byRole] = await Promise.all([
      this.userModel.count(),
      this.userModel.count({ where: { isActive: true } }),
      this.userModel.count({ where: { isActive: false } }),
      Promise.all([
        this.userModel.count({ where: { role: UserRole.EMPLOYEE } }),
        this.userModel.count({ where: { role: UserRole.IT_STAFF } }),
        this.userModel.count({ where: { role: UserRole.ADMIN } }),
      ]),
    ]);

    return {
      total,
      active,
      inactive,
      byRole: {
        employee: byRole[0],
        itStaff: byRole[1],
        admin: byRole[2],
      },
    };
  }

  /**
   * Get IT staff users (for ticket assignment)
   */
  async getITStaff(): Promise<User[]> {
    return this.userModel.findAll({
      where: {
        role: [UserRole.IT_STAFF, UserRole.ADMIN],
        isActive: true,
      },
      attributes: { exclude: ['password'] },
      order: [['fullName', 'ASC']],
    });
  }

  /**
   * Get users by department
   */
  async getUsersByDepartment(department: string): Promise<User[]> {
    return this.userModel.findAll({
      where: { department, isActive: true },
      attributes: { exclude: ['password'] },
      order: [['fullName', 'ASC']],
    });
  }
}
