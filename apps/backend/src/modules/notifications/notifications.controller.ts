import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities';
import { EmailService } from '../../common/services/email.service';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications', description: 'Get all notifications for current user' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: User) {
    return this.notificationsService.findAllByUser(user.id);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread notifications', description: 'Get all unread notifications for current user' })
  @ApiResponse({ status: 200, description: 'Unread notifications retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findUnread(@CurrentUser() user: User) {
    return this.notificationsService.findUnreadByUser(user.id);
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get unread count', description: 'Get count of unread notifications' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUnreadCount(@CurrentUser() user: User) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark as read', description: 'Mark a notification as read' })
  @ApiParam({ name: 'id', type: Number, description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all as read', description: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  markAllAsRead(@CurrentUser() user: User) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification', description: 'Delete a notification' })
  @ApiParam({ name: 'id', type: Number, description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.delete(id, user.id);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all notifications', description: 'Delete all notifications for current user' })
  @ApiResponse({ status: 200, description: 'All notifications deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeAll(@CurrentUser() user: User) {
    return this.notificationsService.deleteAll(user.id);
  }

  @Post('test-email')
  @ApiOperation({ summary: 'Test email configuration', description: 'Send a test email to verify SMTP settings' })
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async testEmail(@CurrentUser() user: User) {
    const success = await this.emailService.sendEmail({
      to: user.email,
      subject: 'Test Email - NexusFlow Ticket System',
      html: `
        <h2>🎉 Email Configuration Successful!</h2>
        <p>Hi ${user.fullName},</p>
        <p>This is a test email to confirm that your SMTP configuration is working correctly.</p>
        <ul>
          <li><strong>System:</strong> NexusFlow Ticket Management System</li>
          <li><strong>Sent to:</strong> ${user.email}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('vi-VN')}</li>
        </ul>
        <p>You will now receive email notifications for:</p>
        <ul>
          <li>✅ Ticket assignments</li>
          <li>✅ Ticket updates</li>
          <li>✅ New comments</li>
          <li>✅ SLA warnings</li>
          <li>✅ Ticket resolutions</li>
        </ul>
        <p>Best regards,<br>NexusFlow Support Team</p>
      `,
      text: `Email Configuration Successful!\n\nHi ${user.fullName},\n\nThis is a test email to confirm that your SMTP configuration is working correctly.\n\nSystem: NexusFlow Ticket Management System\nSent to: ${user.email}\nTime: ${new Date().toLocaleString('vi-VN')}\n\nBest regards,\nNexusFlow Support Team`,
    });

    return {
      success,
      message: success 
        ? 'Test email sent successfully! Check your inbox.' 
        : 'Failed to send test email. Please check your SMTP configuration.',
      recipient: user.email,
    };
  }
}
