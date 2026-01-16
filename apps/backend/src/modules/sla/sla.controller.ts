import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SlaService } from './sla.service';
import { CreateSlaRuleDto } from './dto/create-sla-rule.dto';
import { UpdateSlaRuleDto } from './dto/update-sla-rule.dto';
import { SlaRuleResponseDto } from './dto/sla-rule-response.dto';
import { SlaStatusDto } from './dto/sla-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@Controller('sla')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SlaController {
  constructor(private readonly slaService: SlaService) {}

  /**
   * Create a new SLA rule (Admin only)
   * POST /sla/rules
   */
  @Post('rules')
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createSlaRuleDto: CreateSlaRuleDto,
  ): Promise<SlaRuleResponseDto> {
    return this.slaService.create(createSlaRuleDto);
  }

  /**
   * Get all SLA rules
   * GET /sla/rules
   */
  @Get('rules')
  async findAll(): Promise<SlaRuleResponseDto[]> {
    return this.slaService.findAll();
  }

  /**
   * Get SLA rule by ID
   * GET /sla/rules/:id
   */
  @Get('rules/:id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SlaRuleResponseDto> {
    return this.slaService.findOne(id);
  }

  /**
   * Update SLA rule (Admin only)
   * PUT /sla/rules/:id
   */
  @Put('rules/:id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSlaRuleDto: UpdateSlaRuleDto,
  ): Promise<SlaRuleResponseDto> {
    return this.slaService.update(id, updateSlaRuleDto);
  }

  /**
   * Delete SLA rule (Admin only)
   * DELETE /sla/rules/:id
   */
  @Delete('rules/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.slaService.remove(id);
  }

  /**
   * Check SLA status for a specific ticket
   * GET /sla/tickets/:id/status
   */
  @Get('tickets/:id/status')
  async checkTicketStatus(
    @Param('id', ParseIntPipe) ticketId: number,
  ): Promise<SlaStatusDto> {
    return this.slaService.checkTicketSlaStatus(ticketId);
  }

  /**
   * Get tickets at risk of SLA breach (IT Staff & Admin)
   * GET /sla/at-risk
   */
  @Get('at-risk')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  async getAtRiskTickets() {
    const tickets = await this.slaService.getTicketsAtRisk();
    return {
      count: tickets.length,
      tickets: tickets.map((ticket) => ({
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        priority: ticket.priority,
        status: ticket.status,
        dueDate: ticket.dueDate,
        createdAt: ticket.createdAt,
      })),
    };
  }

  /**
   * Get tickets with breached SLA (IT Staff & Admin)
   * GET /sla/breached
   */
  @Get('breached')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  async getBreachedTickets() {
    const tickets = await this.slaService.getBreachedTickets();
    const now = new Date();

    const breachedTickets = tickets.filter(
      (ticket) => ticket.dueDate && now > ticket.dueDate,
    );

    return {
      count: breachedTickets.length,
      tickets: breachedTickets.map((ticket) => ({
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        priority: ticket.priority,
        status: ticket.status,
        dueDate: ticket.dueDate,
        createdAt: ticket.createdAt,
        breachedBy: ticket.dueDate
          ? Math.floor((now.getTime() - ticket.dueDate.getTime()) / (1000 * 60 * 60))
          : 0,
      })),
    };
  }
}
