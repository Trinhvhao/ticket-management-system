import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron } from '@nestjs/schedule';
import {
  EscalationRule,
  EscalationHistory,
  Ticket,
  User,
  Category,
  EscalationTriggerType,
  EscalationTargetType,
  TicketStatus,
  NotificationType,
} from '../../database/entities';
import { CreateEscalationRuleDto } from './dto/create-escalation-rule.dto';
import { UpdateEscalationRuleDto } from './dto/update-escalation-rule.dto';
import { SlaService } from '../sla/sla.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Op } from 'sequelize';

@Injectable()
export class EscalationService {
  private readonly logger = new Logger(EscalationService.name);

  constructor(
    @InjectModel(EscalationRule)
    private escalationRuleModel: typeof EscalationRule,
    @InjectModel(EscalationHistory)
    private escalationHistoryModel: typeof EscalationHistory,
    @InjectModel(Ticket)
    private ticketModel: typeof Ticket,
    @InjectModel(User)
    private userModel: typeof User,
    private slaService: SlaService,
    private notificationsService: NotificationsService,
  ) {}

  // CRUD Operations for Escalation Rules

  async createRule(dto: CreateEscalationRuleDto): Promise<EscalationRule> {
    return this.escalationRuleModel.create(dto as any);
  }

  async findAllRules(filters?: {
    isActive?: boolean;
    priority?: string;
    categoryId?: number;
  }): Promise<EscalationRule[]> {
    const where: any = {};
    
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    return this.escalationRuleModel.findAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order: [['escalationLevel', 'ASC'], ['createdAt', 'DESC']],
    });
  }

  async findRuleById(id: number): Promise<EscalationRule> {
    const rule = await this.escalationRuleModel.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!rule) {
      throw new NotFoundException(`Escalation rule with ID ${id} not found`);
    }

    return rule;
  }

  async updateRule(id: number, dto: UpdateEscalationRuleDto): Promise<EscalationRule> {
    const rule = await this.findRuleById(id);
    await rule.update(dto);
    return rule;
  }

  async deleteRule(id: number): Promise<void> {
    const rule = await this.findRuleById(id);
    await rule.destroy();
  }

  // Escalation History

  async getTicketEscalationHistory(ticketId: number): Promise<EscalationHistory[]> {
    return this.escalationHistoryModel.findAll({
      where: { ticketId },
      include: [
        {
          model: EscalationRule,
          as: 'rule',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'escalatedToUser',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async getAllEscalationHistory(filters?: {
    ticketId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<EscalationHistory[]> {
    const where: any = {};

    if (filters?.ticketId) {
      where.ticketId = filters.ticketId;
    }
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt[Op.gte] = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt[Op.lte] = filters.endDate;
      }
    }

    return this.escalationHistoryModel.findAll({
      where,
      include: [
        {
          model: Ticket,
          as: 'ticket',
          attributes: ['id', 'ticketNumber', 'title'],
        },
        {
          model: EscalationRule,
          as: 'rule',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'escalatedToUser',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // Core Escalation Logic

  async escalateTicket(
    ticketId: number,
    ruleId: number,
    escalatedBy: string = 'system',
  ): Promise<EscalationHistory> {
    const ticket = await this.ticketModel.findByPk(ticketId);
    if (!ticket) {
      throw new NotFoundException(`Ticket ${ticketId} not found`);
    }

    const rule = await this.findRuleById(ruleId);

    // Determine escalation target
    let escalatedToUserId: number | null = null;
    let escalatedToRole: string | null = null;

    if (rule.targetType === EscalationTargetType.USER && rule.targetUserId) {
      escalatedToUserId = rule.targetUserId;
    } else if (rule.targetType === EscalationTargetType.ROLE && rule.targetRole) {
      escalatedToRole = rule.targetRole;
      // Find available user with target role
      const availableUser = await this.findAvailableUserByRole(rule.targetRole);
      if (availableUser) {
        escalatedToUserId = availableUser.id;
      }
    } else if (rule.targetType === EscalationTargetType.MANAGER) {
      // Find manager (Admin role)
      const manager = await this.userModel.findOne({
        where: { role: 'Admin', isActive: true },
      });
      if (manager) {
        escalatedToUserId = manager.id;
        escalatedToRole = 'Admin';
      }
    }

    // Get current escalation level
    const lastEscalation = await this.escalationHistoryModel.findOne({
      where: { ticketId },
      order: [['createdAt', 'DESC']],
    });

    const fromLevel = lastEscalation ? lastEscalation.toLevel : 1;
    const toLevel = rule.escalationLevel;

    // Create escalation history
    const escalation = await this.escalationHistoryModel.create({
      ticketId,
      ruleId,
      fromLevel,
      toLevel,
      escalatedBy,
      escalatedToUserId,
      escalatedToRole,
      reason: this.buildEscalationReason(rule, ticket),
    } as any);

    // Reassign ticket if target user found
    if (escalatedToUserId && escalatedToUserId !== ticket.assigneeId) {
      await ticket.update({ assigneeId: escalatedToUserId });
    }

    // Send notifications
    await this.sendEscalationNotifications(ticket, escalation, rule);

    this.logger.log(
      `Ticket ${ticket.ticketNumber} escalated from level ${fromLevel} to ${toLevel}`,
    );

    return escalation;
  }

  private buildEscalationReason(rule: EscalationRule, ticket: Ticket): string {
    switch (rule.triggerType) {
      case EscalationTriggerType.SLA_BREACHED:
        return `SLA breached for ${ticket.priority} priority ticket`;
      case EscalationTriggerType.SLA_AT_RISK:
        return `SLA at risk for ${ticket.priority} priority ticket`;
      case EscalationTriggerType.NO_ASSIGNMENT:
        return `Ticket not assigned after ${rule.triggerHours} hours`;
      case EscalationTriggerType.NO_RESPONSE:
        return `No response after ${rule.triggerHours} hours`;
      default:
        return `Escalated by rule: ${rule.name}`;
    }
  }

  private async findAvailableUserByRole(role: string): Promise<User | null> {
    // Find IT Staff with least workload
    const users = await this.userModel.findAll({
      where: { role, isActive: true },
      include: [
        {
          model: Ticket,
          as: 'assignedTickets',
          where: {
            status: {
              [Op.in]: [
                TicketStatus.NEW,
                TicketStatus.ASSIGNED,
                TicketStatus.IN_PROGRESS,
                TicketStatus.PENDING,
              ],
            },
          },
          required: false,
        },
      ],
    });

    if (users.length === 0) return null;

    // Sort by workload (least tickets first)
    users.sort((a, b) => {
      const aWorkload = a.assignedTickets?.length || 0;
      const bWorkload = b.assignedTickets?.length || 0;
      return aWorkload - bWorkload;
    });

    return users[0] || null;
  }

  private async sendEscalationNotifications(
    ticket: Ticket,
    escalation: EscalationHistory,
    rule: EscalationRule,
  ): Promise<void> {
    // Notify escalated user
    if (escalation.escalatedToUserId) {
      await this.notificationsService.create({
        userId: escalation.escalatedToUserId,
        type: NotificationType.TICKET_ESCALATED,
        title: `Ticket Escalated: ${ticket.ticketNumber}`,
        message: `Ticket "${ticket.title}" has been escalated to you. Reason: ${escalation.reason}`,
        ticketId: ticket.id,
      });
    }

    // Notify manager if configured
    if (rule.notifyManager) {
      const managers = await this.userModel.findAll({
        where: { role: 'Admin', isActive: true },
      });

      for (const manager of managers) {
        if (manager.id !== escalation.escalatedToUserId) {
          await this.notificationsService.create({
            userId: manager.id,
            type: NotificationType.TICKET_ESCALATED,
            title: `Ticket Escalated: ${ticket.ticketNumber}`,
            message: `Ticket "${ticket.title}" has been escalated to level ${escalation.toLevel}. Reason: ${escalation.reason}`,
            ticketId: ticket.id,
          });
        }
      }
    }

    // Notify original assignee if exists
    if (ticket.assigneeId && ticket.assigneeId !== escalation.escalatedToUserId) {
      await this.notificationsService.create({
        userId: ticket.assigneeId,
        type: NotificationType.TICKET_ESCALATED,
        title: `Your Ticket Was Escalated: ${ticket.ticketNumber}`,
        message: `Ticket "${ticket.title}" has been escalated. Reason: ${escalation.reason}`,
        ticketId: ticket.id,
      });
    }
  }

  // Auto-Escalation Cron Jobs

  @Cron('0 */15 * * * *') // Every 15 minutes
  async checkAndEscalateTickets(): Promise<void> {
    this.logger.log('Running auto-escalation check...');

    try {
      await this.checkSlaBreachedTickets();
      await this.checkSlaAtRiskTickets();
      await this.checkUnassignedTickets();
      await this.checkNoResponseTickets();

      this.logger.log('Auto-escalation check completed');
    } catch (error) {
      this.logger.error('Error in auto-escalation check', error);
    }
  }

  private async checkSlaBreachedTickets(): Promise<void> {
    const rules = await this.escalationRuleModel.findAll({
      where: {
        triggerType: EscalationTriggerType.SLA_BREACHED,
        isActive: true,
      },
    });

    for (const rule of rules) {
      const breachedTickets = await this.slaService.getBreachedTickets();
      
      for (const ticket of breachedTickets) {
        // Check if rule applies to this ticket
        if (!this.ruleApplies(rule, ticket)) continue;

        // Check if already escalated recently
        const recentEscalation = await this.escalationHistoryModel.findOne({
          where: {
            ticketId: ticket.id,
            ruleId: rule.id,
            createdAt: { [Op.gte]: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
          },
        });

        if (!recentEscalation) {
          await this.escalateTicket(ticket.id, rule.id, 'system');
        }
      }
    }
  }

  private async checkSlaAtRiskTickets(): Promise<void> {
    const rules = await this.escalationRuleModel.findAll({
      where: {
        triggerType: EscalationTriggerType.SLA_AT_RISK,
        isActive: true,
      },
    });

    for (const rule of rules) {
      const atRiskTickets = await this.slaService.getTicketsAtRisk();
      
      for (const ticket of atRiskTickets) {
        if (!this.ruleApplies(rule, ticket)) continue;

        const recentEscalation = await this.escalationHistoryModel.findOne({
          where: {
            ticketId: ticket.id,
            ruleId: rule.id,
            createdAt: { [Op.gte]: new Date(Date.now() - 60 * 60 * 1000) },
          },
        });

        if (!recentEscalation) {
          await this.escalateTicket(ticket.id, rule.id, 'system');
        }
      }
    }
  }

  private async checkUnassignedTickets(): Promise<void> {
    const rules = await this.escalationRuleModel.findAll({
      where: {
        triggerType: EscalationTriggerType.NO_ASSIGNMENT,
        isActive: true,
      },
    });

    for (const rule of rules) {
      if (!rule.triggerHours) continue;

      const cutoffTime = new Date(Date.now() - rule.triggerHours * 60 * 60 * 1000);

      const unassignedTickets = await this.ticketModel.findAll({
        where: {
          assigneeId: null,
          status: TicketStatus.NEW,
          createdAt: { [Op.lte]: cutoffTime },
        },
      });

      for (const ticket of unassignedTickets) {
        if (!this.ruleApplies(rule, ticket)) continue;

        const recentEscalation = await this.escalationHistoryModel.findOne({
          where: {
            ticketId: ticket.id,
            ruleId: rule.id,
            createdAt: { [Op.gte]: new Date(Date.now() - 60 * 60 * 1000) },
          },
        });

        if (!recentEscalation) {
          await this.escalateTicket(ticket.id, rule.id, 'system');
        }
      }
    }
  }

  private async checkNoResponseTickets(): Promise<void> {
    const rules = await this.escalationRuleModel.findAll({
      where: {
        triggerType: EscalationTriggerType.NO_RESPONSE,
        isActive: true,
      },
    });

    for (const rule of rules) {
      if (!rule.triggerHours) continue;

      const cutoffTime = new Date(Date.now() - rule.triggerHours * 60 * 60 * 1000);

      const noResponseTickets = await this.ticketModel.findAll({
        where: {
          assigneeId: { [Op.ne]: null },
          status: {
            [Op.in]: [TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS],
          },
          updatedAt: { [Op.lte]: cutoffTime },
        },
      });

      for (const ticket of noResponseTickets) {
        if (!this.ruleApplies(rule, ticket)) continue;

        const recentEscalation = await this.escalationHistoryModel.findOne({
          where: {
            ticketId: ticket.id,
            ruleId: rule.id,
            createdAt: { [Op.gte]: new Date(Date.now() - 60 * 60 * 1000) },
          },
        });

        if (!recentEscalation) {
          await this.escalateTicket(ticket.id, rule.id, 'system');
        }
      }
    }
  }

  private ruleApplies(rule: EscalationRule, ticket: Ticket): boolean {
    // Check priority match
    if (rule.priority && rule.priority !== ticket.priority) {
      return false;
    }

    // Check category match
    if (rule.categoryId && rule.categoryId !== ticket.categoryId) {
      return false;
    }

    return true;
  }
}
