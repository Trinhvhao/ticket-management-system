import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, fn, col, literal } from 'sequelize';
import { Ticket, TicketStatus } from '../../database/entities/ticket.entity';
import { User, UserRole } from '../../database/entities/user.entity';
import { Category } from '../../database/entities/category.entity';
import {
  DashboardStatsDto,
  TicketsByStatusDto,
  TicketsByCategoryDto,
  TicketsByPriorityDto,
  SlaComplianceDto,
  StaffPerformanceDto,
  TrendDataDto,
} from './dto';

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Ticket)
    private ticketModel: typeof Ticket,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  /**
   * Get action required counts based on user role
   * - IT_Staff: New tickets + Assigned to them
   * - Admin: New + Unassigned (non-NEW) tickets
   * - Employee: Their open tickets
   */
  async getActionRequiredCount(userId: number, userRole: UserRole): Promise<{
    actionRequired: number;
    breakdown: {
      newTickets: number;
      newUnassigned: number;
      assignedToMe: number;
      unassigned: number;
      myOpenTickets: number;
    };
  }> {
    // New tickets (all new tickets regardless of assignment)
    const newTickets = await this.ticketModel.count({
      where: {
        status: TicketStatus.NEW,
      },
    });

    // New tickets that are unassigned
    const newUnassigned = await this.ticketModel.count({
      where: {
        status: TicketStatus.NEW,
        assigneeId: null,
      },
    });

    // Assigned to current user (for IT_Staff)
    const assignedToMe = await this.ticketModel.count({
      where: {
        assigneeId: userId,
        status: {
          [Op.in]: [TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS],
        },
      },
    });

    // Unassigned tickets (EXCLUDING NEW to avoid double counting)
    // These are tickets in other statuses (ASSIGNED, IN_PROGRESS, PENDING) that lost their assignee
    const unassigned = await this.ticketModel.count({
      where: {
        assigneeId: null,
        status: {
          [Op.notIn]: [TicketStatus.NEW, TicketStatus.RESOLVED, TicketStatus.CLOSED],
        },
      },
    });

    // My open tickets (for Employee - tickets they created)
    const myOpenTickets = await this.ticketModel.count({
      where: {
        submitterId: userId,
        status: {
          [Op.notIn]: [TicketStatus.RESOLVED, TicketStatus.CLOSED],
        },
      },
    });

    // Calculate action required based on role
    let actionRequired = 0;
    if (userRole === UserRole.ADMIN) {
      actionRequired = newTickets + unassigned;
    } else if (userRole === UserRole.IT_STAFF) {
      actionRequired = newTickets + assignedToMe;
    } else {
      // Employee
      actionRequired = myOpenTickets;
    }

    return {
      actionRequired,
      breakdown: {
        newTickets,
        newUnassigned,
        assignedToMe,
        unassigned,
        myOpenTickets,
      },
    };
  }

  async getDashboardStats(dateRange?: DateRange): Promise<DashboardStatsDto> {
    const where = this.buildDateRangeWhere(dateRange);

    // Total tickets
    const totalTickets = await this.ticketModel.count({ where });

    // Open tickets (New, Assigned, In Progress, Pending)
    const openTickets = await this.ticketModel.count({
      where: {
        ...where,
        status: {
          [Op.in]: [
            TicketStatus.NEW,
            TicketStatus.ASSIGNED,
            TicketStatus.IN_PROGRESS,
            TicketStatus.PENDING,
          ],
        },
      },
    });

    // Closed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const closedToday = await this.ticketModel.count({
      where: {
        status: TicketStatus.CLOSED,
        closedAt: { [Op.gte]: today },
      },
    });

    // Closed this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const closedThisWeek = await this.ticketModel.count({
      where: {
        status: TicketStatus.CLOSED,
        closedAt: { [Op.gte]: weekStart },
      },
    });

    // Closed this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const closedThisMonth = await this.ticketModel.count({
      where: {
        status: TicketStatus.CLOSED,
        closedAt: { [Op.gte]: monthStart },
      },
    });

    // Average resolution time
    const avgResolution = await this.ticketModel.findOne({
      where: {
        ...where,
        resolvedAt: { [Op.ne]: null },
      },
      attributes: [
        [
          fn(
            'AVG',
            literal(
              'EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600',
            ),
          ),
          'avgHours',
        ],
      ],
      raw: true,
    });

    const averageResolutionHours = avgResolution
      ? parseFloat((avgResolution as any).avgHours || '0')
      : 0;

    // SLA compliance rate and counts
    const slaCompliance = await this.calculateSlaComplianceRate(where);
    
    // SLA breached count (resolved tickets that missed SLA)
    const slaBreached = await this.ticketModel.count({
      where: {
        ...where,
        dueDate: { [Op.ne]: null },
        resolvedAt: { [Op.ne]: null },
        [Op.and]: [
          literal('resolved_at > due_date'),
        ],
      },
    });

    // SLA at risk count (open tickets approaching due date - within 2 hours)
    const twoHoursFromNow = new Date();
    twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);
    const slaAtRisk = await this.ticketModel.count({
      where: {
        dueDate: {
          [Op.ne]: null,
          [Op.lte]: twoHoursFromNow,
          [Op.gte]: new Date(),
        },
        status: {
          [Op.in]: [
            TicketStatus.NEW,
            TicketStatus.ASSIGNED,
            TicketStatus.IN_PROGRESS,
            TicketStatus.PENDING,
          ],
        },
      },
    });

    // Tickets by priority
    const priorityCounts = await this.ticketModel.findAll({
      where,
      attributes: [
        'priority',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['priority'],
      raw: true,
    });

    const ticketsByPriority = {
      high: 0,
      medium: 0,
      low: 0,
    };

    priorityCounts.forEach((item: any) => {
      const priority = item.priority.toLowerCase();
      if (priority in ticketsByPriority) {
        ticketsByPriority[priority as keyof typeof ticketsByPriority] = parseInt(item.count);
      }
    });

    // Tickets by status
    const statusCounts = await this.ticketModel.findAll({
      where,
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    const ticketsByStatus = {
      new: 0,
      assigned: 0,
      in_progress: 0,
      pending: 0,
      resolved: 0,
      closed: 0,
    };

    statusCounts.forEach((item: any) => {
      // Convert status to lowercase with underscores
      const status = item.status.toLowerCase().replace(/ /g, '_');
      if (status in ticketsByStatus) {
        ticketsByStatus[status as keyof typeof ticketsByStatus] = parseInt(item.count);
      }
    });

    return {
      totalTickets,
      openTickets,
      closedToday,
      closedThisWeek,
      closedThisMonth,
      avgResolutionTime: Math.round(averageResolutionHours * 10) / 10,
      slaComplianceRate: Math.round(slaCompliance * 10) / 10,
      slaBreached,
      slaAtRisk,
      ticketsByPriority,
      ticketsByStatus,
    };
  }

  async getTicketsByStatus(
    dateRange?: DateRange,
  ): Promise<TicketsByStatusDto[]> {
    const where = this.buildDateRangeWhere(dateRange);

    const total = await this.ticketModel.count({ where });

    const statusCounts = await this.ticketModel.findAll({
      where,
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    return statusCounts.map((item: any) => ({
      status: item.status,
      count: parseInt(item.count),
      percentage: total > 0 ? Math.round((parseInt(item.count) / total) * 1000) / 10 : 0,
    }));
  }

  async getTicketsByCategory(
    dateRange?: DateRange,
  ): Promise<TicketsByCategoryDto[]> {
    const where = this.buildDateRangeWhere(dateRange);

    const total = await this.ticketModel.count({ where });

    const categoryCounts = await this.ticketModel.findAll({
      where,
      attributes: [
        'categoryId',
        [fn('COUNT', col('Ticket.id')), 'count'], // Specify table name to avoid ambiguity
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
      group: ['categoryId', 'category.id', 'category.name'],
      raw: true,
    });

    return categoryCounts.map((item: any) => ({
      categoryId: item.categoryId,
      categoryName: item['category.name'],
      count: parseInt(item.count),
      percentage: total > 0 ? Math.round((parseInt(item.count) / total) * 1000) / 10 : 0,
    }));
  }

  async getTicketsByPriority(
    dateRange?: DateRange,
  ): Promise<TicketsByPriorityDto[]> {
    const where = this.buildDateRangeWhere(dateRange);

    const total = await this.ticketModel.count({ where });

    const priorityCounts = await this.ticketModel.findAll({
      where: {
        ...where,
        resolvedAt: { [Op.ne]: null },
      },
      attributes: [
        'priority',
        [fn('COUNT', col('id')), 'count'],
        [
          fn(
            'AVG',
            literal(
              'EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600',
            ),
          ),
          'avgHours',
        ],
      ],
      group: ['priority'],
      raw: true,
    });

    return priorityCounts.map((item: any) => ({
      priority: item.priority,
      count: parseInt(item.count),
      percentage: total > 0 ? Math.round((parseInt(item.count) / total) * 1000) / 10 : 0,
      averageResolutionHours: Math.round(parseFloat(item.avgHours || '0') * 10) / 10,
    }));
  }

  async getSlaCompliance(dateRange?: DateRange): Promise<SlaComplianceDto> {
    const where = this.buildDateRangeWhere(dateRange);

    const tickets = await this.ticketModel.findAll({
      where: {
        ...where,
        dueDate: { [Op.ne]: null },
        resolvedAt: { [Op.ne]: null },
      },
      attributes: ['priority', 'dueDate', 'resolvedAt'],
      raw: true,
    });

    const totalTickets = tickets.length;
    let metSla = 0;
    let breachedSla = 0;
    let totalResolutionHours = 0;

    const byPriority: { [key: string]: { total: number; met: number; breached: number } } = {
      High: { total: 0, met: 0, breached: 0 },
      Medium: { total: 0, met: 0, breached: 0 },
      Low: { total: 0, met: 0, breached: 0 },
    };

    tickets.forEach((ticket: any) => {
      const priority = ticket.priority as keyof typeof byPriority;
      if (byPriority[priority]) {
        byPriority[priority].total++;

        if (new Date(ticket.resolvedAt) <= new Date(ticket.dueDate)) {
          metSla++;
          byPriority[priority].met++;
        } else {
          breachedSla++;
          byPriority[priority].breached++;
        }
      }

      const resolutionHours =
        (new Date(ticket.resolvedAt).getTime() - new Date(ticket.createdAt).getTime()) /
        (1000 * 60 * 60);
      totalResolutionHours += resolutionHours;
    });

    const complianceRate = totalTickets > 0 ? (metSla / totalTickets) * 100 : 0;
    const averageResolutionHours = totalTickets > 0 ? totalResolutionHours / totalTickets : 0;

    const byPriorityArray = Object.entries(byPriority).map(([priority, data]) => ({
      priority,
      total: data.total,
      met: data.met,
      breached: data.breached,
      rate: data.total > 0 ? Math.round((data.met / data.total) * 1000) / 10 : 0,
    }));

    return {
      totalTickets,
      metSla,
      breachedSla,
      complianceRate: Math.round(complianceRate * 10) / 10,
      averageResolutionHours: Math.round(averageResolutionHours * 10) / 10,
      byPriority: byPriorityArray,
    };
  }

  async getStaffPerformance(
    dateRange?: DateRange,
  ): Promise<StaffPerformanceDto[]> {
    const where = this.buildDateRangeWhere(dateRange);

    const staff = await this.userModel.findAll({
      where: {
        role: {
          [Op.in]: [UserRole.IT_STAFF, UserRole.ADMIN],
        },
      },
    });

    const performance: StaffPerformanceDto[] = [];

    for (const member of staff) {
      const assignedTickets = await this.ticketModel.count({
        where: {
          ...where,
          assigneeId: member.id,
        },
      });

      const resolvedTickets = await this.ticketModel.count({
        where: {
          ...where,
          assigneeId: member.id,
          resolvedAt: { [Op.ne]: null },
        },
      });

      const avgResolution = await this.ticketModel.findOne({
        where: {
          ...where,
          assigneeId: member.id,
          resolvedAt: { [Op.ne]: null },
        },
        attributes: [
          [
            fn(
              'AVG',
              literal(
                'EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600',
              ),
            ),
            'avgHours',
          ],
        ],
        raw: true,
      });

      const slaCompliance = await this.calculateStaffSlaCompliance(
        member.id,
        where,
      );

      const currentWorkload = await this.ticketModel.count({
        where: {
          assigneeId: member.id,
          status: {
            [Op.in]: [
              TicketStatus.ASSIGNED,
              TicketStatus.IN_PROGRESS,
              TicketStatus.PENDING,
            ],
          },
        },
      });

      performance.push({
        staffId: member.id,
        staffName: member.fullName,
        staffEmail: member.email,
        assignedTickets,
        resolvedTickets,
        averageResolutionHours: avgResolution
          ? Math.round(parseFloat((avgResolution as any).avgHours || '0') * 10) / 10
          : 0,
        slaComplianceRate: Math.round(slaCompliance * 10) / 10,
        currentWorkload,
      });
    }

    return performance.sort((a, b) => b.resolvedTickets - a.resolvedTickets);
  }

  async getTicketTrends(
    period: 'day' | 'week' | 'month',
    limit: number,
  ): Promise<TrendDataDto[]> {
    const trends: TrendDataDto[] = [];
    
    // Get current date at start of day (00:00:00)
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = limit - 1; i >= 0; i--) {
      let periodStart: Date;
      let periodEnd: Date;

      if (period === 'day') {
        // Calculate date by subtracting milliseconds (more reliable than setDate)
        const daysAgoMs = i * 24 * 60 * 60 * 1000;
        periodStart = new Date(now.getTime() - daysAgoMs);
        periodEnd = new Date(periodStart.getTime() + (24 * 60 * 60 * 1000) - 1); // End of day
      } else if (period === 'week') {
        // Week calculation
        const weeksAgoMs = i * 7 * 24 * 60 * 60 * 1000;
        periodStart = new Date(now.getTime() - weeksAgoMs);
        periodEnd = new Date(periodStart.getTime() + (7 * 24 * 60 * 60 * 1000) - 1);
      } else {
        // Month calculation - use proper Date constructor
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        periodStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 0, 0, 0, 0);
        periodEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);
      }

      const ticketsCreated = await this.ticketModel.count({
        where: {
          createdAt: {
            [Op.between]: [periodStart, periodEnd],
          },
        },
      });

      const ticketsResolved = await this.ticketModel.count({
        where: {
          resolvedAt: {
            [Op.between]: [periodStart, periodEnd],
          },
        },
      });

      const ticketsClosed = await this.ticketModel.count({
        where: {
          closedAt: {
            [Op.between]: [periodStart, periodEnd],
          },
        },
      });

      const avgResolution = await this.ticketModel.findOne({
        where: {
          resolvedAt: {
            [Op.between]: [periodStart, periodEnd],
          },
        },
        attributes: [
          [
            fn(
              'AVG',
              literal(
                'EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600',
              ),
            ),
            'avgHours',
          ],
        ],
        raw: true,
      });

      trends.push({
        period: periodStart.toISOString().split('T')[0] || '',
        ticketsCreated,
        ticketsResolved,
        ticketsClosed,
        averageResolutionHours: avgResolution
          ? Math.round(parseFloat((avgResolution as any).avgHours || '0') * 10) / 10
          : 0,
      });
    }

    return trends;
  }

  // Helper methods
  private buildDateRangeWhere(dateRange?: DateRange): any {
    const where: any = {};

    if (dateRange?.startDate) {
      where.createdAt = { [Op.gte]: dateRange.startDate };
    }

    if (dateRange?.endDate) {
      where.createdAt = {
        ...where.createdAt,
        [Op.lte]: dateRange.endDate,
      };
    }

    return where;
  }

  private async calculateSlaComplianceRate(where: any): Promise<number> {
    const tickets = await this.ticketModel.findAll({
      where: {
        ...where,
        dueDate: { [Op.ne]: null },
        resolvedAt: { [Op.ne]: null },
      },
      attributes: ['dueDate', 'resolvedAt'],
      raw: true,
    });

    if (tickets.length === 0) return 0;

    const metSla = tickets.filter(
      (ticket: any) =>
        new Date(ticket.resolvedAt) <= new Date(ticket.dueDate),
    ).length;

    return (metSla / tickets.length) * 100;
  }

  private async calculateStaffSlaCompliance(
    staffId: number,
    where: any,
  ): Promise<number> {
    const tickets = await this.ticketModel.findAll({
      where: {
        ...where,
        assigneeId: staffId,
        dueDate: { [Op.ne]: null },
        resolvedAt: { [Op.ne]: null },
      },
      attributes: ['dueDate', 'resolvedAt'],
      raw: true,
    });

    if (tickets.length === 0) return 0;

    const metSla = tickets.filter(
      (ticket: any) =>
        new Date(ticket.resolvedAt) <= new Date(ticket.dueDate),
    ).length;

    return (metSla / tickets.length) * 100;
  }
}
