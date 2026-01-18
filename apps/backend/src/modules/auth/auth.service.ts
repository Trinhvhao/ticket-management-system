import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole, RefreshToken } from '../../database/entities';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Op } from 'sequelize';

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
    @InjectModel(RefreshToken)
    private readonly refreshTokenModel: typeof RefreshToken,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticate user with email and password
   * @param loginDto - Login credentials
   * @param ipAddress - Client IP address
   * @param userAgent - Client user agent
   * @returns Authentication response with user and tokens
   */
  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
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
    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    return {
      user: user.toJSON() as Omit<User, 'password'>,
      ...tokens,
    };
  }

  /**
   * Register new user
   * @param registerDto - Registration data
   * @param ipAddress - Client IP address
   * @param userAgent - Client user agent
   * @returns Authentication response with user and tokens
   */
  async register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
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
    const tokens = await this.generateTokens(user, ipAddress, userAgent);

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
   * @param ipAddress - Client IP address
   * @param userAgent - Client user agent
   * @returns Object with access and refresh tokens
   */
  private async generateTokens(user: User, ipAddress?: string, userAgent?: string): Promise<{ accessToken: string; refreshToken: string }> {
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

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenModel.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
      ipAddress,
      userAgent,
    });

    // Clean up expired tokens for this user (optional, can be done via cron)
    await this.cleanupExpiredTokens(user.id);

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
      // Verify JWT signature and expiration
      const payload = await this.jwtService.verifyAsync(refreshToken);
      
      // Check if token exists in database and is valid
      const storedToken = await this.refreshTokenModel.findOne({
        where: { token: refreshToken },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (storedToken.isRevoked) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      if (storedToken.isExpired()) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      // Validate user still exists and is active
      const user = await this.validateUser(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
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
   * Logout user and revoke refresh token
   * @param userId - User ID
   * @param refreshToken - Refresh token to revoke
   */
  async logout(userId: number, refreshToken?: string): Promise<{ message: string }> {
    if (refreshToken) {
      // Revoke specific refresh token
      await this.refreshTokenModel.update(
        { isRevoked: true },
        { where: { token: refreshToken, userId } }
      );
    } else {
      // Revoke all refresh tokens for this user
      await this.refreshTokenModel.update(
        { isRevoked: true },
        { where: { userId, isRevoked: false } }
      );
    }
    
    return { message: 'Logged out successfully' };
  }

  /**
   * Logout from all devices (revoke all refresh tokens)
   * @param userId - User ID
   */
  async logoutAllDevices(userId: number): Promise<{ message: string }> {
    await this.refreshTokenModel.update(
      { isRevoked: true },
      { where: { userId, isRevoked: false } }
    );
    
    return { message: 'Logged out from all devices successfully' };
  }

  /**
   * Clean up expired tokens for a user
   * @param userId - User ID
   */
  private async cleanupExpiredTokens(userId: number): Promise<void> {
    await this.refreshTokenModel.destroy({
      where: {
        userId,
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });
  }

  /**
   * Clean up all expired tokens (can be called by cron job)
   */
  async cleanupAllExpiredTokens(): Promise<number> {
    const result = await this.refreshTokenModel.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });
    return result;
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
