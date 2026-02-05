import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole, PasswordReset } from '../../database/entities';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../../common/services/email.service';

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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(PasswordReset)
    private readonly passwordResetModel: typeof PasswordReset,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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

  /**
   * Generate 6-digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to user's email for password reset
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Find user by email
    const user = await this.userModel.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return { message: 'If the email exists, an OTP has been sent to it' };
    }

    // Generate OTP
    const otp = this.generateOTP();
    const expiresAtTime = Date.now() + 30 * 60 * 1000; // 30 minutes in milliseconds

    this.logger.log(`Generating OTP for ${email}`);
    this.logger.log(`Current time: ${new Date().toISOString()}`);
    this.logger.log(`Expires at: ${new Date(expiresAtTime).toISOString()}`);
    this.logger.log(`Expires timestamp: ${expiresAtTime}`);

    // Save OTP to database - lưu timestamp để tránh timezone issue
    await this.passwordResetModel.create({
      email: email.toLowerCase(),
      otp,
      expiresAt: new Date(expiresAtTime),
      isUsed: false,
    } as any);

    // Send OTP via email
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Password Reset OTP - NexusFlow Ticket System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hi ${user.fullName},</p>
          <p>You have requested to reset your password. Please use the following OTP code:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #2563eb; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated email from NexusFlow Ticket Management System.<br>
            Please do not reply to this email.
          </p>
        </div>
      `,
      text: `Password Reset Request\n\nHi ${user.fullName},\n\nYou have requested to reset your password. Please use the following OTP code:\n\n${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this password reset, please ignore this email.`,
    });

    return { message: 'If the email exists, an OTP has been sent to it' };
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string; valid: boolean }> {
    const { email, otp } = verifyOtpDto;

    // Find the most recent unused OTP for this email
    const passwordReset = await this.passwordResetModel.findOne({
      where: {
        email: email.toLowerCase(),
        otp,
        isUsed: false,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!passwordReset) {
      throw new BadRequestException('Invalid OTP code');
    }

    this.logger.log(`Verifying OTP for ${email}`);
    this.logger.log(`Current time: ${new Date().toISOString()}`);
    this.logger.log(`OTP expires at: ${passwordReset.expiresAt.toISOString()}`);
    this.logger.log(`Is expired: ${passwordReset.isExpired()}`);

    if (passwordReset.isExpired()) {
      throw new BadRequestException('OTP has expired. Please request a new one');
    }

    return {
      message: 'OTP verified successfully',
      valid: true,
    };
  }

  /**
   * Reset password using OTP
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, otp, newPassword } = resetPasswordDto;

    // Find user
    const user = await this.userModel.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find and validate OTP
    const passwordReset = await this.passwordResetModel.findOne({
      where: {
        email: email.toLowerCase(),
        otp,
        isUsed: false,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!passwordReset) {
      throw new BadRequestException('Invalid OTP code');
    }

    if (passwordReset.isExpired()) {
      throw new BadRequestException('OTP has expired. Please request a new one');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Mark OTP as used
    passwordReset.isUsed = true;
    await passwordReset.save();

    // Send confirmation email
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Password Reset Successful - NexusFlow Ticket System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Password Reset Successful</h2>
          <p>Hi ${user.fullName},</p>
          <p>Your password has been successfully reset.</p>
          <p>You can now log in with your new password.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated email from NexusFlow Ticket Management System.<br>
            Please do not reply to this email.
          </p>
        </div>
      `,
      text: `Password Reset Successful\n\nHi ${user.fullName},\n\nYour password has been successfully reset.\n\nYou can now log in with your new password.\n\nIf you didn't make this change, please contact support immediately.`,
    });

    return { message: 'Password reset successfully' };
  }
}
