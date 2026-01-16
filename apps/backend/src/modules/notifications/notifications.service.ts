import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification, NotificationType, User, Ticket } from '../../database/entities';
import { EmailService } from '../../common/services/email.service';

export interface CreateNotificationDto {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  ticketId?: number;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Ticket)
    private ticketModel: typeof Ticket,
    private emailService: EmailService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = await this.notificationModel.create({
      userId: createNotificationDto.userId,
      type: createNotificationDto.type,
      title: createNotificationDto.title,
      message: createNotificationDto.message,
      ticketId: createNotificationDto.ticketId,
    } as any);

    // Send email notification
    const user = await this.userModel.findByPk(createNotificationDto.userId);
    if (user && user.email) {
      await this.sendEmailNotification(user.email, notification);
    }

    return notification;
  }

  async findAllByUser(userId: number, limit: number = 50): Promise<Notification[]> {
    return this.notificationModel.findAll({
      where: { userId },
      include: [
        {
          model: Ticket,
          as: 'ticket',
          attributes: ['id', 'title', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  async findUnreadByUser(userId: number): Promise<Notification[]> {
    return this.notificationModel.findAll({
      where: { userId, isRead: false },
      include: [
        {
          model: Ticket,
          as: 'ticket',
          attributes: ['id', 'title', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationModel.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: number, userId: number): Promise<Notification> {
    const notification = await this.notificationModel.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.markAsRead();
    await notification.save();

    return notification;
  }

  async markAllAsRead(userId: number): Promise<{ count: number }> {
    const [count] = await this.notificationModel.update(
      { isRead: true, readAt: new Date() },
      { where: { userId, isRead: false } },
    );

    return { count };
  }

  async delete(id: number, userId: number): Promise<void> {
    const notification = await this.notificationModel.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await notification.destroy();
  }

  async deleteAll(userId: number): Promise<{ count: number }> {
    const count = await this.notificationModel.destroy({
      where: { userId },
    });

    return { count };
  }

  // Helper methods for creating specific notification types
  async notifyTicketCreated(ticketId: number): Promise<void> {
    const ticket = await this.ticketModel.findByPk(ticketId, {
      include: [{ model: User, as: 'submitter' }],
    });

    if (!ticket) return;

    // Notify IT Staff and Admins
    const itStaff = await this.userModel.findAll({
      where: { role: ['IT_Staff', 'Admin'], isActive: true },
    });

    for (const staff of itStaff) {
      await this.create({
        userId: staff.id,
        type: NotificationType.TICKET_CREATED,
        title: 'New Ticket Created',
        message: `Ticket #${ticket.id}: ${ticket.title}`,
        ticketId: ticket.id,
      });
    }
  }

  async notifyTicketAssigned(ticketId: number, assigneeId: number, assignedBy: User): Promise<void> {
    const ticket = await this.ticketModel.findByPk(ticketId);
    if (!ticket) return;

    await this.create({
      userId: assigneeId,
      type: NotificationType.TICKET_ASSIGNED,
      title: 'Ticket Assigned to You',
      message: `Ticket #${ticket.id}: ${ticket.title} has been assigned to you by ${assignedBy.fullName}`,
      ticketId: ticket.id,
    });

    // Send email
    const assignee = await this.userModel.findByPk(assigneeId);
    if (assignee) {
      await this.emailService.sendTicketAssignedEmail(
        assignee.email,
        ticket.id,
        ticket.title,
        assignedBy.fullName,
      );
    }
  }

  async notifyTicketUpdated(ticketId: number, updatedBy: User): Promise<void> {
    const ticket = await this.ticketModel.findByPk(ticketId);
    if (!ticket) return;

    // Notify submitter and assignee
    const userIds = [ticket.submitterId];
    if (ticket.assigneeId && ticket.assigneeId !== updatedBy.id) {
      userIds.push(ticket.assigneeId);
    }

    for (const userId of userIds) {
      if (userId !== updatedBy.id) {
        await this.create({
          userId,
          type: NotificationType.TICKET_UPDATED,
          title: 'Ticket Updated',
          message: `Ticket #${ticket.id}: ${ticket.title} has been updated by ${updatedBy.fullName}`,
          ticketId: ticket.id,
        });
      }
    }
  }

  async notifyTicketCommented(ticketId: number, commentedBy: User, comment: string): Promise<void> {
    const ticket = await this.ticketModel.findByPk(ticketId);
    if (!ticket) return;

    // Notify submitter and assignee
    const userIds = [ticket.submitterId];
    if (ticket.assigneeId && ticket.assigneeId !== commentedBy.id) {
      userIds.push(ticket.assigneeId);
    }

    for (const userId of userIds) {
      if (userId !== commentedBy.id) {
        await this.create({
          userId,
          type: NotificationType.TICKET_COMMENTED,
          title: 'New Comment on Ticket',
          message: `${commentedBy.fullName} commented on Ticket #${ticket.id}: ${ticket.title}`,
          ticketId: ticket.id,
        });

        // Send email
        const user = await this.userModel.findByPk(userId);
        if (user) {
          await this.emailService.sendTicketCommentedEmail(
            user.email,
            ticket.id,
            ticket.title,
            commentedBy.fullName,
            comment,
          );
        }
      }
    }
  }

  async notifyTicketResolved(ticketId: number, resolvedBy: User): Promise<void> {
    const ticket = await this.ticketModel.findByPk(ticketId);
    if (!ticket) return;

    await this.create({
      userId: ticket.submitterId,
      type: NotificationType.TICKET_RESOLVED,
      title: 'Ticket Resolved',
      message: `Your ticket #${ticket.id}: ${ticket.title} has been resolved by ${resolvedBy.fullName}`,
      ticketId: ticket.id,
    });

    // Send email
    const submitter = await this.userModel.findByPk(ticket.submitterId);
    if (submitter) {
      await this.emailService.sendTicketResolvedEmail(
        submitter.email,
        ticket.id,
        ticket.title,
        resolvedBy.fullName,
      );
    }
  }

  async notifyTicketClosed(ticketId: number): Promise<void> {
    const ticket = await this.ticketModel.findByPk(ticketId);
    if (!ticket) return;

    // Notify assignee if exists
    if (ticket.assigneeId) {
      await this.create({
        userId: ticket.assigneeId,
        type: NotificationType.TICKET_CLOSED,
        title: 'Ticket Closed',
        message: `Ticket #${ticket.id}: ${ticket.title} has been closed`,
        ticketId: ticket.id,
      });
    }
  }

  private async sendEmailNotification(email: string, notification: Notification): Promise<void> {
    const ticket = notification.ticketId
      ? await this.ticketModel.findByPk(notification.ticketId)
      : null;

    switch (notification.type) {
      case NotificationType.TICKET_CREATED:
        if (ticket) {
          await this.emailService.sendTicketCreatedEmail(email, ticket.id, ticket.title);
        }
        break;
      // Other cases are handled in specific notify methods
    }
  }
}
