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
  refreshToken?: string;
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
   * @param loginDto - Login credentials
   * @returns Authentication response with user and tokens
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

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: user.toJSON() as Omit<User, 'password'>,
      ...tokens,
    };
  }

  /**
   * Register new user
   * @param registerDto - Registration data
   * @returns Authentication response with user and tokens
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

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: user.toJSON() as Omit<User, 'password'>,
      ...tokens,
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
   * Generate JWT access and refresh tokens
   * @param user - User object
   * @returns Object with access and refresh tokens
   */
  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m', // Short-lived access token
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d', // Long-lived refresh token
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Valid refresh token
   * @returns New access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.validateUser(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '15m',
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user (in a real app, you might want to blacklist the token)
   * @param _userId - User ID
   */
  async logout(_userId: number): Promise<{ message: string }> {
    // In a production app, you might want to:
    // 1. Blacklist the current token
    // 2. Clear refresh tokens from database
    // 3. Log the logout event
    
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
