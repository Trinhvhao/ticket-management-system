import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from '../../database/entities';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticate user with email and password
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is not active');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    user.updateLastLogin();
    await user.save();

    // Generate access token
    const accessToken = await this.generateAccessToken(user);

    return {
      user: user.toJSON() as Omit<User, 'password'>,
      accessToken,
    };
  }

  /**
   * Register new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, username, ...userData } = registerDto;

    // Check if user already exists by email
    const existingUserByEmail = await this.userModel.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if username already exists
    const existingUserByUsername = await this.userModel.findOne({
      where: { username: username.toLowerCase() },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username already taken');
    }

    // Create new user
    const user = await this.userModel.create({
      ...userData,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      isActive: true,
      role: registerDto.role || UserRole.EMPLOYEE,
    });

    // Generate access token
    const accessToken = await this.generateAccessToken(user);

    return {
      user: user.toJSON() as Omit<User, 'password'>,
      accessToken,
    };
  }

  /**
   * Validate user by ID (used by JWT strategy)
   * @param userId - User ID from JWT payload
   * @returns User object without password
   */
  async validateUser(userId: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findByPk(userId);
    
    if (!user || !user.isActive) {
      return null;
    }

    return user.toJSON() as Omit<User, 'password'>;
  }

  /**
   * Generate JWT access token (7 days expiration)
   */
  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '7d', // 7 days - simple and sufficient for internal system
    });
  }

  /**
   * Logout user (client-side token removal)
   */
  async logout(): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user profile
   * @param userId - User ID from JWT
   * @returns User profile
   */
  async getProfile(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findByPk(userId);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user.toJSON() as Omit<User, 'password'>;
  }
}
