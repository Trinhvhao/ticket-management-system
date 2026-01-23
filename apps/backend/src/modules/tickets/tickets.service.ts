import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Ticket, TicketStatus, TicketPriority } from '../../database/entities/ticket.entity';
import { User, UserRole } from '../../database/entities/user.entity';
import { Category } from '../../database/entities/category.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { ResolveTicketDto } from './dto/resolve-ticket.dto';
import { RateTicketDto } from './dto/rate-ticket.dto';
import { TicketHistoryService } from '../ticket-history/ticket-history.service';
import { SlaService } from '../sla/sla.service';
import { PermissionsUtil } from '../../common/utils/permissions.util';

export interface TicketFilters {
  status?: TicketStatus | undefined;
  priority?: TicketPriority | undefined;
  categoryId?: number | undefined;
  submitterId?: number | undefined;
  assigneeId?: number | null | undefined; // Support null for unassigned tickets
  search?: string | undefined;
  slaBreached?: boolean | undefined; // Filter for SLA breached tickets
  slaAtRisk?: boolean | undefined; // Filter for tickets at risk of breaching SLA
}

export interface PaginationOptions {
  page?: number | undefined;
  limit?: number | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'ASC' | 'DESC' | undefined;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket)
    private readonly ticketModel: typeof Ticket,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
    private readonly ticketHistoryService: TicketHistoryService,
    private readonly slaService: SlaService,
  ) {}

  /**
   * Create a new ticket
   */
  async create(createTicketDto: CreateTicketDto, userId: number): Promise<Ticket> {
    // Verify category exists
    const category = await this.categoryModel.findByPk(createTicketDto.categoryId);
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    if (!category.isActive) {
      throw new BadRequestException('Category is not active');
    }

    // Generate ticket number
    const year = new Date().getFullYear();
    const count = await this.ticketModel.count({
      where: {
        ticketNumber: {
          [Op.like]: `TKT-${year}-%`,
        },
      },
    });
    const ticketNumber = `TKT-${year}-${String(count + 1).padStart(4, '0')}`;

    // Calculate SLA due date based on priority
    const priority = createTicketDto.priority || TicketPriority.MEDIUM;
    const createdAt = new Date();
    const dueDate = await this.slaService.calculateDueDate(priority, createdAt);

    // Create ticket
    const ticket = await this.ticketModel.create({
      ...createTicketDto,
      ticketNumber,
      submitterId: userId,
      status: TicketStatus.NEW,
      priority,
      dueDate, // ✅ Auto-set dueDate based on SLA
    } as any);

    // Log ticket creation
    await this.ticketHistoryService.logTicketCreated(ticket.id, userId);

    return this.findOne(ticket.id);
  }

  /**
   * Get all tickets with filters and pagination
   */
  async findAll(
    filters: TicketFilters = {},
    pagination: PaginationOptions = {},
    currentUser: User,
  ): Promise<{ tickets: Ticket[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Role-based filtering
    if (currentUser.role === UserRole.EMPLOYEE) {
      // Employees can only see their own tickets
      where.submitterId = currentUser.id;
    }

    // Apply filters
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.submitterId) where.submitterId = filters.submitterId;
    
    // Handle assigneeId filter - support null for unassigned tickets
    if (filters.assigneeId !== undefined) {
      if (filters.assigneeId === null) {
        where.assigneeId = { [Op.is]: null };
      } else {
        where.assigneeId = filters.assigneeId;
      }
    }

    // Search in title and description
    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
        { ticketNumber: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    // SLA filters
    const now = new Date();
    if (filters.slaBreached) {
      // Tickets that have passed their due date and are not resolved/closed
      where.dueDate = { [Op.lt]: now };
      where.status = { [Op.notIn]: [TicketStatus.RESOLVED, TicketStatus.CLOSED] };
    }
    if (filters.slaAtRisk) {
      // Tickets that will breach SLA in next 2 hours and are not resolved/closed
      const riskThreshold = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
      where.dueDate = { [Op.between]: [now, riskThreshold] };
      where.status = { [Op.notIn]: [TicketStatus.RESOLVED, TicketStatus.CLOSED] };
    }

    // Get tickets with associations
    const { rows: tickets, count: total } = await this.ticketModel.findAndCountAll({
      where,
      include: [
        { model: User, as: 'submitter', attributes: ['id', 'username', 'fullName', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'username', 'fullName', 'email'] },
        { model: Category, attributes: ['id', 'name', 'icon', 'color'] },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return {
      tickets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get ticket by ID
   */
  async findOne(id: number, currentUser?: User): Promise<Ticket> {
    const ticket = await this.ticketModel.findByPk(id, {
      include: [
        { model: User, as: 'submitter', attributes: ['id', 'username', 'fullName', 'email', 'department'] },
        { model: User, as: 'assignee', attributes: ['id', 'username', 'fullName', 'email', 'department'] },
        { model: Category, attributes: ['id', 'name', 'description', 'icon', 'color'] },
      ],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    // Check permissions using PermissionsUtil
    if (currentUser && !PermissionsUtil.canViewTicket(currentUser, ticket)) {
      throw new ForbiddenException('You do not have permission to view this ticket');
    }

    return ticket;
  }

  /**
   * Update ticket
   */
  async update(id: number, updateTicketDto: UpdateTicketDto, currentUser: User): Promise<Ticket> {
    const ticket = await this.findOne(id, currentUser);

    // Check permissions using PermissionsUtil
    if (!PermissionsUtil.canEditTicket(currentUser, ticket)) {
      throw new ForbiddenException('You do not have permission to edit this ticket');
    }

    // Employees cannot change status, priority, or assignee
    if (currentUser.role === UserRole.EMPLOYEE) {
      if (updateTicketDto.status || updateTicketDto.priority || updateTicketDto.assigneeId) {
        throw new ForbiddenException('You cannot change status, priority, or assignee');
      }
    }

    // Verify category if changed
    if (updateTicketDto.categoryId) {
      const category = await this.categoryModel.findByPk(updateTicketDto.categoryId);
      if (!category || !category.isActive) {
        throw new BadRequestException('Invalid or inactive category');
      }
    }

    // Verify assignee if changed
    if (updateTicketDto.assigneeId) {
      const assignee = await this.userModel.findByPk(updateTicketDto.assigneeId);
      if (!assignee) {
        throw new BadRequestException('Assignee not found');
      }
      if (assignee.role !== UserRole.IT_STAFF && assignee.role !== UserRole.ADMIN) {
        throw new BadRequestException('Assignee must be IT Staff or Admin');
      }
    }

    await ticket.update(updateTicketDto);
    
    // Log ticket update based on what changed
    if (updateTicketDto.status) {
      await this.ticketHistoryService.logStatusChange(ticket.id, currentUser.id, updateTicketDto.status, ticket.status);
    }
    if (updateTicketDto.priority) {
      await this.ticketHistoryService.logPriorityChange(ticket.id, currentUser.id, updateTicketDto.priority, ticket.priority);
    }
    if (updateTicketDto.categoryId) {
      await this.ticketHistoryService.logCategoryChange(ticket.id, currentUser.id, updateTicketDto.categoryId, ticket.categoryId);
    }
    
    return this.findOne(id);
  }

  /**
   * Assign ticket to IT staff
   */
  async assign(id: number, assignTicketDto: AssignTicketDto, currentUser: User): Promise<Ticket> {
    const ticket = await this.findOne(id);

    // Check permissions using PermissionsUtil
    if (!PermissionsUtil.canAssignTicket(currentUser)) {
      throw new ForbiddenException('You do not have permission to assign tickets');
    }

    // Verify assignee
    const assignee = await this.userModel.findByPk(assignTicketDto.assigneeId);
    if (!assignee) {
      throw new BadRequestException('Assignee not found');
    }
    if (assignee.role !== UserRole.IT_STAFF && assignee.role !== UserRole.ADMIN) {
      throw new BadRequestException('Assignee must be IT Staff or Admin');
    }

    ticket.assign(assignTicketDto.assigneeId);
    const oldAssigneeId = ticket.assigneeId || null;
    await ticket.save();

    // Log assignment
    await this.ticketHistoryService.logAssignment(ticket.id, currentUser.id, oldAssigneeId, assignTicketDto.assigneeId);

    return this.findOne(id);
  }

  /**
   * Change ticket status (for Kanban board)
   */
  async changeStatus(id: number, newStatus: TicketStatus, currentUser: User): Promise<Ticket> {
    const ticket = await this.findOne(id, currentUser);

    // Check permission
    if (!PermissionsUtil.canChangeTicketStatus(currentUser, ticket)) {
      throw new ForbiddenException('You do not have permission to change ticket status');
    }

    // Validate status transition
    const validTransitions: Record<TicketStatus, TicketStatus[]> = {
      [TicketStatus.NEW]: [TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
      [TicketStatus.ASSIGNED]: [TicketStatus.NEW, TicketStatus.IN_PROGRESS, TicketStatus.PENDING, TicketStatus.CLOSED],
      [TicketStatus.IN_PROGRESS]: [TicketStatus.ASSIGNED, TicketStatus.PENDING, TicketStatus.RESOLVED, TicketStatus.CLOSED],
      [TicketStatus.PENDING]: [TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED, TicketStatus.CLOSED],
      [TicketStatus.RESOLVED]: [TicketStatus.IN_PROGRESS, TicketStatus.PENDING, TicketStatus.CLOSED],
      [TicketStatus.CLOSED]: [TicketStatus.NEW, TicketStatus.ASSIGNED],
    };

    const currentStatus = ticket.status as TicketStatus;
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(`Cannot transition from ${currentStatus} to ${newStatus}`);
    }

    // Update status
    ticket.status = newStatus;

    // Set timestamps based on status
    if (newStatus === TicketStatus.RESOLVED && !ticket.resolvedAt) {
      ticket.resolvedAt = new Date();
    }
    if (newStatus === TicketStatus.CLOSED && !ticket.closedAt) {
      ticket.closedAt = new Date();
    }

    await ticket.save();

    // Log status change
    await this.ticketHistoryService.logStatusChange(
      ticket.id,
      currentUser.id,
      currentStatus,
      newStatus,
    );

    return this.findOne(id, currentUser);
  }

  /**
   * Start working on ticket
   */
  async startProgress(id: number, currentUser: User): Promise<Ticket> {
    const ticket = await this.findOne(id);

    // Only assigned user can start progress
    if (ticket.assigneeId !== currentUser.id) {
      throw new ForbiddenException('Only the assigned user can start progress on this ticket');
    }

    ticket.startProgress();
    await ticket.save();

    return this.findOne(id);
  }

  /**
   * Resolve ticket
   */
  async resolve(id: number, resolveTicketDto: ResolveTicketDto, currentUser: User): Promise<Ticket> {
    const ticket = await this.findOne(id);

    ticket.resolve(resolveTicketDto.resolutionNotes, currentUser.id);
    await ticket.save();

    return this.findOne(id);
  }

  /**
   * Close ticket
   */
  async close(id: number, currentUser: User): Promise<Ticket> {
    const ticket = await this.findOne(id, currentUser);

    // Check permissions using PermissionsUtil
    if (!PermissionsUtil.canChangeTicketStatus(currentUser, ticket)) {
      throw new ForbiddenException('You do not have permission to close this ticket');
    }

    ticket.close(currentUser.id, currentUser.role);
    await ticket.save();

    // Log status change
    await this.ticketHistoryService.logTicketClosed(ticket.id, currentUser.id);

    return this.findOne(id);
  }

  /**
   * Reopen ticket
   */
  async reopen(id: number, currentUser: User): Promise<Ticket> {
    const ticket = await this.findOne(id, currentUser);

    // Check permissions using PermissionsUtil
    if (!PermissionsUtil.canChangeTicketStatus(currentUser, ticket)) {
      throw new ForbiddenException('You do not have permission to reopen this ticket');
    }

    ticket.reopen();
    await ticket.save();

    // Log status change
    await this.ticketHistoryService.logTicketReopened(ticket.id, currentUser.id);

    return this.findOne(id);
  }

  /**
   * Rate ticket
   */
  async rate(id: number, rateTicketDto: RateTicketDto, currentUser: User): Promise<Ticket> {
    const ticket = await this.findOne(id, currentUser);

    // Check permissions using PermissionsUtil
    if (!PermissionsUtil.canRateTicket(currentUser, ticket)) {
      throw new ForbiddenException('You do not have permission to rate this ticket');
    }

    ticket.rate(rateTicketDto.rating, rateTicketDto.comment);
    await ticket.save();

    return this.findOne(id);
  }

  /**
   * Delete ticket (soft delete)
   */
  async remove(id: number, currentUser: User): Promise<{ message: string }> {
    const ticket = await this.findOne(id);

    // Check permissions using PermissionsUtil
    if (!PermissionsUtil.canDeleteTicket(currentUser)) {
      throw new ForbiddenException('You do not have permission to delete tickets');
    }

    await ticket.destroy();

    return { message: 'Ticket deleted successfully' };
  }

  /**
   * Get ticket statistics
   */
  async getStats(currentUser: User): Promise<any> {
    const where: any = {};

    // Role-based filtering
    if (currentUser.role === UserRole.EMPLOYEE) {
      where.submitterId = currentUser.id;
    } else if (currentUser.role === UserRole.IT_STAFF) {
      where.assigneeId = currentUser.id;
    }

    const [total, newTickets, assigned, inProgress, pending, resolved, closed] = await Promise.all([
      this.ticketModel.count({ where }),
      this.ticketModel.count({ where: { ...where, status: TicketStatus.NEW } }),
      this.ticketModel.count({ where: { ...where, status: TicketStatus.ASSIGNED } }),
      this.ticketModel.count({ where: { ...where, status: TicketStatus.IN_PROGRESS } }),
      this.ticketModel.count({ where: { ...where, status: TicketStatus.PENDING } }),
      this.ticketModel.count({ where: { ...where, status: TicketStatus.RESOLVED } }),
      this.ticketModel.count({ where: { ...where, status: TicketStatus.CLOSED } }),
    ]);

    return {
      total,
      byStatus: {
        new: newTickets,
        assigned,
        inProgress,
        pending,
        resolved,
        closed,
      },
    };
  }

  /**
   * Bulk assign tickets
   */
  async bulkAssign(ticketIds: number[], assigneeId: number, currentUser: User): Promise<{ success: number; failed: number; errors: string[] }> {
    // Verify assignee exists and is IT Staff or Admin
    const assignee = await this.userModel.findByPk(assigneeId);
    if (!assignee) {
      throw new BadRequestException('Assignee not found');
    }

    if (assignee.role !== UserRole.IT_STAFF && assignee.role !== UserRole.ADMIN) {
      throw new BadRequestException('Can only assign to IT Staff or Admin');
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const ticketId of ticketIds) {
      try {
        const ticket = await this.ticketModel.findByPk(ticketId);
        
        if (!ticket) {
          errors.push(`Ticket ${ticketId}: Not found`);
          failed++;
          continue;
        }

        // Check permission
        if (!PermissionsUtil.canAssignTicket(currentUser)) {
          errors.push(`Ticket ${ticketId}: No permission to assign`);
          failed++;
          continue;
        }

        // Assign ticket
        ticket.assigneeId = assigneeId;
        if (ticket.status === TicketStatus.NEW) {
          ticket.status = TicketStatus.ASSIGNED;
        }
        await ticket.save();

        // Log history
        await this.ticketHistoryService.logAssignment(ticketId, currentUser.id, ticket.assigneeId || null, assigneeId);

        success++;
      } catch (error: any) {
        errors.push(`Ticket ${ticketId}: ${error?.message || 'Unknown error'}`);
        failed++;
      }
    }

    return { success, failed, errors };
  }

  /**
   * Bulk change status
   */
  async bulkChangeStatus(ticketIds: number[], newStatus: TicketStatus, currentUser: User): Promise<{ success: number; failed: number; errors: string[] }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const ticketId of ticketIds) {
      try {
        const ticket = await this.ticketModel.findByPk(ticketId);
        
        if (!ticket) {
          errors.push(`Ticket ${ticketId}: Not found`);
          failed++;
          continue;
        }

        // Check permission
        if (!PermissionsUtil.canChangeTicketStatus(currentUser, ticket)) {
          errors.push(`Ticket ${ticketId}: No permission to change status`);
          failed++;
          continue;
        }

        const oldStatus = ticket.status as TicketStatus;

        // Update status
        ticket.status = newStatus;
        
        // Set timestamps
        if (newStatus === TicketStatus.RESOLVED && !ticket.resolvedAt) {
          ticket.resolvedAt = new Date();
        }
        if (newStatus === TicketStatus.CLOSED && !ticket.closedAt) {
          ticket.closedAt = new Date();
        }

        await ticket.save();

        // Log history
        await this.ticketHistoryService.logStatusChange(ticketId, currentUser.id, oldStatus, newStatus);

        success++;
      } catch (error: any) {
        errors.push(`Ticket ${ticketId}: ${error?.message || 'Unknown error'}`);
        failed++;
      }
    }

    return { success, failed, errors };
  }

  /**
   * Bulk delete tickets
   */
  async bulkDelete(ticketIds: number[], currentUser: User): Promise<{ success: number; failed: number; errors: string[] }> {
    // Check permission - only Admin can bulk delete
    if (!PermissionsUtil.canDeleteTicket(currentUser)) {
      throw new ForbiddenException('Only Admin can bulk delete tickets');
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const ticketId of ticketIds) {
      try {
        const ticket = await this.ticketModel.findByPk(ticketId);
        
        if (!ticket) {
          errors.push(`Ticket ${ticketId}: Not found`);
          failed++;
          continue;
        }

        await ticket.destroy();
        success++;
      } catch (error: any) {
        errors.push(`Ticket ${ticketId}: ${error?.message || 'Unknown error'}`);
        failed++;
      }
    }

    return { success, failed, errors };
  }
}
