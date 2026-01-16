import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SlaRule } from '../../database/entities/sla-rule.entity';
import { Ticket, TicketStatus } from '../../database/entities/ticket.entity';
import { CreateSlaRuleDto } from './dto/create-sla-rule.dto';
import { UpdateSlaRuleDto } from './dto/update-sla-rule.dto';
import { SlaRuleResponseDto } from './dto/sla-rule-response.dto';
import { SlaStatusDto, SlaStatus } from './dto/sla-status.dto';
import { BusinessHoursService } from '../../common/services/business-hours.service';

@Injectable()
export class SlaService {
  constructor(
    @InjectModel(SlaRule)
    private slaRuleModel: typeof SlaRule,
    @InjectModel(Ticket)
    private ticketModel: typeof Ticket,
    private businessHoursService: BusinessHoursService,
  ) {}

  /**
   * Create a new SLA rule
   */
  async create(createSlaRuleDto: CreateSlaRuleDto): Promise<SlaRuleResponseDto> {
    // Check if rule already exists for this priority
    const existing = await this.slaRuleModel.findOne({
      where: { priority: createSlaRuleDto.priority },
    });

    if (existing) {
      throw new ConflictException(
        `SLA rule for priority ${createSlaRuleDto.priority} already exists`,
      );
    }

    const slaRule = await this.slaRuleModel.create({
      ...createSlaRuleDto,
      isActive: createSlaRuleDto.isActive ?? true,
    });

    return this.toResponseDto(slaRule);
  }

  /**
   * Get all SLA rules
   */
  async findAll(): Promise<SlaRuleResponseDto[]> {
    const rules = await this.slaRuleModel.findAll({
      order: [
        ['priority', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });

    return rules.map((rule) => this.toResponseDto(rule));
  }

  /**
   * Get SLA rule by ID
   */
  async findOne(id: number): Promise<SlaRuleResponseDto> {
    const rule = await this.slaRuleModel.findByPk(id);

    if (!rule) {
      throw new NotFoundException(`SLA rule with ID ${id} not found`);
    }

    return this.toResponseDto(rule);
  }

  /**
   * Get SLA rule by priority
   */
  async findByPriority(priority: string): Promise<SlaRule | null> {
    return this.slaRuleModel.findOne({
      where: { priority, isActive: true },
    });
  }

  /**
   * Update SLA rule
   */
  async update(
    id: number,
    updateSlaRuleDto: UpdateSlaRuleDto,
  ): Promise<SlaRuleResponseDto> {
    const rule = await this.slaRuleModel.findByPk(id);

    if (!rule) {
      throw new NotFoundException(`SLA rule with ID ${id} not found`);
    }

    await rule.update(updateSlaRuleDto);

    return this.toResponseDto(rule);
  }

  /**
   * Delete SLA rule
   */
  async remove(id: number): Promise<void> {
    const rule = await this.slaRuleModel.findByPk(id);

    if (!rule) {
      throw new NotFoundException(`SLA rule with ID ${id} not found`);
    }

    await rule.destroy();
  }

  /**
   * Check SLA status for a ticket
   */
  async checkTicketSlaStatus(ticketId: number): Promise<SlaStatusDto> {
    const ticket = await this.ticketModel.findByPk(ticketId);

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    // If ticket is closed or resolved, check if it was resolved within SLA
    if (
      ticket.status === TicketStatus.CLOSED ||
      ticket.status === TicketStatus.RESOLVED
    ) {
      return this.calculateCompletedTicketSla(ticket);
    }

    // For open tickets, check current SLA status
    return this.calculateOpenTicketSla(ticket);
  }

  /**
   * Get tickets at risk of SLA breach
   */
  async getTicketsAtRisk(): Promise<Ticket[]> {
    const now = new Date();

    const tickets = await this.ticketModel.findAll({
      where: {
        status: [
          TicketStatus.NEW,
          TicketStatus.ASSIGNED,
          TicketStatus.IN_PROGRESS,
        ],
      },
    });

    const atRiskTickets: Ticket[] = [];

    for (const ticket of tickets) {
      if (!ticket.dueDate) continue;

      const slaRule = await this.findByPriority(ticket.priority);
      if (!slaRule) continue;

      // Calculate warning threshold (80% of total SLA time)
      const totalTime = ticket.dueDate.getTime() - ticket.createdAt.getTime();
      const warningTime = ticket.createdAt.getTime() + (totalTime * 0.8);
      const warningThreshold = new Date(warningTime);

      if (now >= warningThreshold && now < ticket.dueDate) {
        atRiskTickets.push(ticket);
      }
    }

    return atRiskTickets;
  }

  /**
   * Get tickets with breached SLA
   */
  async getBreachedTickets(): Promise<Ticket[]> {
    return this.ticketModel.findAll({
      where: {
        status: [
          TicketStatus.NEW,
          TicketStatus.ASSIGNED,
          TicketStatus.IN_PROGRESS,
        ],
      },
    });
  }

  /**
   * Calculate SLA due date for a ticket using business hours
   */
  async calculateDueDate(
    priority: string,
    createdAt: Date,
  ): Promise<Date | null> {
    const slaRule = await this.findByPriority(priority);

    if (!slaRule) {
      return null;
    }

    // Use business hours calculation
    return this.businessHoursService.addBusinessHours(
      createdAt,
      slaRule.resolutionTimeHours,
    );
  }

  // Private helper methods

  private calculateOpenTicketSla(ticket: Ticket): SlaStatusDto {
    const now = new Date();

    if (!ticket.dueDate) {
      return {
        ticketId: ticket.id,
        status: SlaStatus.NOT_APPLICABLE,
        dueDate: null,
        timeRemaining: null,
        percentageUsed: null,
        isBreached: false,
        isAtRisk: false,
      };
    }

    const totalTime = ticket.dueDate.getTime() - ticket.createdAt.getTime();
    const elapsedTime = now.getTime() - ticket.createdAt.getTime();
    const remainingTime = ticket.dueDate.getTime() - now.getTime();

    const percentageUsed = Math.min(100, (elapsedTime / totalTime) * 100);
    const isBreached = now > ticket.dueDate;
    const isAtRisk = percentageUsed >= 80 && !isBreached;

    let status: SlaStatus;
    if (isBreached) {
      status = SlaStatus.BREACHED;
    } else if (isAtRisk) {
      status = SlaStatus.AT_RISK;
    } else {
      status = SlaStatus.MET;
    }

    return {
      ticketId: ticket.id,
      status,
      dueDate: ticket.dueDate,
      timeRemaining: this.formatTimeRemaining(remainingTime),
      percentageUsed: Math.round(percentageUsed),
      isBreached,
      isAtRisk,
    };
  }

  private calculateCompletedTicketSla(ticket: Ticket): SlaStatusDto {
    const resolvedAt = ticket.resolvedAt || ticket.closedAt;

    if (!ticket.dueDate || !resolvedAt) {
      return {
        ticketId: ticket.id,
        status: SlaStatus.NOT_APPLICABLE,
        dueDate: ticket.dueDate || null,
        timeRemaining: null,
        percentageUsed: null,
        isBreached: false,
        isAtRisk: false,
      };
    }

    const isBreached = resolvedAt > ticket.dueDate;
    const totalTime = ticket.dueDate.getTime() - ticket.createdAt.getTime();
    const usedTime = resolvedAt.getTime() - ticket.createdAt.getTime();
    const percentageUsed = Math.min(100, (usedTime / totalTime) * 100);

    return {
      ticketId: ticket.id,
      status: isBreached ? SlaStatus.BREACHED : SlaStatus.MET,
      dueDate: ticket.dueDate,
      timeRemaining: null,
      percentageUsed: Math.round(percentageUsed),
      isBreached,
      isAtRisk: false,
    };
  }

  private formatTimeRemaining(milliseconds: number): string {
    if (milliseconds < 0) {
      const absMs = Math.abs(milliseconds);
      const hours = Math.floor(absMs / (1000 * 60 * 60));
      const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
      return `-${hours}h ${minutes}m (overdue)`;
    }

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }

    return `${hours}h ${minutes}m`;
  }

  private toResponseDto(rule: SlaRule): SlaRuleResponseDto {
    return {
      id: rule.id,
      priority: rule.priority,
      responseTimeHours: rule.responseTimeHours,
      resolutionTimeHours: rule.resolutionTimeHours,
      responseTimeFormatted: this.formatHours(rule.responseTimeHours),
      resolutionTimeFormatted: this.formatHours(rule.resolutionTimeHours),
      isActive: rule.isActive,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    };
  }

  private formatHours(hours: number): string {
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }

    return `${days}d ${remainingHours}h`;
  }
}
