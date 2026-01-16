import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TicketHistory, TicketHistoryAction } from '../../database/entities/ticket-history.entity';
import { User } from '../../database/entities/user.entity';
import { CreateTicketHistoryDto, TicketHistoryResponseDto } from './dto';

@Injectable()
export class TicketHistoryService {
  constructor(
    @InjectModel(TicketHistory)
    private ticketHistoryModel: typeof TicketHistory,
  ) {}

  async create(createDto: CreateTicketHistoryDto): Promise<TicketHistory> {
    return this.ticketHistoryModel.create({
      ticketId: createDto.ticketId,
      userId: createDto.userId,
      action: createDto.action,
      fieldName: createDto.fieldName,
      oldValue: createDto.oldValue,
      newValue: createDto.newValue,
      description: createDto.description,
    });
  }

  async findByTicketId(ticketId: number): Promise<TicketHistoryResponseDto[]> {
    const histories = await this.ticketHistoryModel.findAll({
      where: { ticketId },
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'email', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return histories.map((history) => this.toResponseDto(history));
  }

  async findAll(limit = 100, offset = 0): Promise<TicketHistoryResponseDto[]> {
    const histories = await this.ticketHistoryModel.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'email', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return histories.map((history) => this.toResponseDto(history));
  }

  // Helper methods for logging specific actions
  async logTicketCreated(ticketId: number, userId: number): Promise<void> {
    await this.create({
      ticketId,
      userId,
      action: TicketHistoryAction.CREATED,
      description: 'Ticket created',
    });
  }

  async logStatusChange(
    ticketId: number,
    userId: number,
    oldStatus: string,
    newStatus: string,
  ): Promise<void> {
    await this.create({
      ticketId,
      userId,
      action: TicketHistoryAction.STATUS_CHANGED,
      fieldName: 'status',
      oldValue: oldStatus,
      newValue: newStatus,
      description: `Status changed from ${oldStatus} to ${newStatus}`,
    });
  }

  async logPriorityChange(
    ticketId: number,
    userId: number,
    oldPriority: string,
    newPriority: string,
  ): Promise<void> {
    await this.create({
      ticketId,
      userId,
      action: TicketHistoryAction.PRIORITY_CHANGED,
      fieldName: 'priority',
      oldValue: oldPriority,
      newValue: newPriority,
      description: `Priority changed from ${oldPriority} to ${newPriority}`,
    });
  }

  async logAssignment(
    ticketId: number,
    userId: number,
    oldAssigneeId: number | null,
    newAssigneeId: number,
  ): Promise<void> {
    await this.create({
      ticketId,
      userId,
      action: TicketHistoryAction.ASSIGNED,
      fieldName: 'assignee',
      oldValue: oldAssigneeId?.toString() || 'Unassigned',
      newValue: newAssigneeId.toString(),
      description: oldAssigneeId
        ? 'Ticket reassigned to another staff member'
        : 'Ticket assigned to staff member',
    });
  }

  async logCategoryChange(
    ticketId: number,
    userId: number,
    oldCategoryId: number,
    newCategoryId: number,
  ): Promise<void> {
    await this.create({
      ticketId,
      userId,
      action: TicketHistoryAction.CATEGORY_CHANGED,
      fieldName: 'category',
      oldValue: oldCategoryId.toString(),
      newValue: newCategoryId.toString(),
      description: 'Category changed',
    });
  }

  async logCommentAdded(ticketId: number, userId: number): Promise<void> {
    await this.create({
      ticketId,
      userId,
      action: TicketHistoryAction.COMMENT_ADDED,
      description: 'Comment added',
    });
  }

  async logAttachmentAdded(
    ticketId: number,
    userId: number,
    fileName: string,
  ): Promise<void> {
    await this.create({
      ticketId,
      userId,
      action: TicketHistoryAction.ATTACHMENT_ADDED,
      description: `File attached: ${fileName}`,
    });
  }

  async logTicketResolved(ticketId: number, userId: number): Promise<void> {
    await this.create({
      ticketId,
      userId,
      action: TicketHistoryAction.RESOLVED,
      description: 'Ticket marked as resolved',
    });
  }

  async logTicketClosed(ticketId: number, userId: number): Promise<void> {
    await this.create({
      ticketId,
      userId,
      action: TicketHistoryAction.CLOSED,
      description: 'Ticket closed',
    });
  }

  async logTicketReopened(ticketId: number, userId: number): Promise<void> {
    await this.create({
      ticketId,
      userId,
      action: TicketHistoryAction.REOPENED,
      description: 'Ticket reopened',
    });
  }

  private toResponseDto(history: TicketHistory): TicketHistoryResponseDto {
    const dto: TicketHistoryResponseDto = {
      id: history.id,
      ticketId: history.ticketId,
      userId: history.userId,
      action: history.action,
      actionLabel: history.actionLabel,
      fieldName: history.fieldName,
      oldValue: history.oldValue,
      newValue: history.newValue,
      description: history.description,
      changeDescription: history.changeDescription,
      createdAt: history.createdAt,
    };

    if (history.user) {
      dto.user = {
        id: history.user.id,
        fullName: history.user.fullName,
        email: history.user.email,
        role: history.user.role,
      };
    }

    return dto;
  }
}
