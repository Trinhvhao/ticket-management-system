import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EscalationService } from './escalation.service';
import { CreateEscalationRuleDto } from './dto/create-escalation-rule.dto';
import { UpdateEscalationRuleDto } from './dto/update-escalation-rule.dto';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../database/entities';

@Controller('escalation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EscalationController {
  constructor(private readonly escalationService: EscalationService) {}

  // Escalation Rules Management (Admin only)

  @Post('rules')
  @Roles(UserRole.ADMIN)
  async createRule(@Body() dto: CreateEscalationRuleDto) {
    return this.escalationService.createRule(dto);
  }

  @Get('rules')
  @Roles(UserRole.ADMIN, UserRole.IT_STAFF)
  async getAllRules(
    @Query('isActive') isActive?: string,
    @Query('priority') priority?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const filters: any = {};
    
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    if (priority) {
      filters.priority = priority;
    }
    if (categoryId) {
      filters.categoryId = parseInt(categoryId);
    }

    return this.escalationService.findAllRules(filters);
  }

  @Get('rules/:id')
  @Roles(UserRole.ADMIN, UserRole.IT_STAFF)
  async getRuleById(@Param('id', ParseIntPipe) id: number) {
    return this.escalationService.findRuleById(id);
  }

  @Put('rules/:id')
  @Roles(UserRole.ADMIN)
  async updateRule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEscalationRuleDto,
  ) {
    return this.escalationService.updateRule(id, dto);
  }

  @Delete('rules/:id')
  @Roles(UserRole.ADMIN)
  async deleteRule(@Param('id', ParseIntPipe) id: number) {
    await this.escalationService.deleteRule(id);
    return { message: 'Escalation rule deleted successfully' };
  }

  // Escalation History

  @Get('history/ticket/:ticketId')
  async getTicketHistory(@Param('ticketId', ParseIntPipe) ticketId: number) {
    return this.escalationService.getTicketEscalationHistory(ticketId);
  }

  @Get('history')
  @Roles(UserRole.ADMIN, UserRole.IT_STAFF)
  async getAllHistory(
    @Query('ticketId') ticketId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};

    if (ticketId) {
      filters.ticketId = parseInt(ticketId);
    }
    if (startDate) {
      filters.startDate = new Date(startDate);
    }
    if (endDate) {
      filters.endDate = new Date(endDate);
    }

    return this.escalationService.getAllEscalationHistory(filters);
  }

  // Manual Escalation

  @Post('tickets/:ticketId/escalate')
  @Roles(UserRole.ADMIN, UserRole.IT_STAFF)
  async escalateTicket(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body('ruleId', ParseIntPipe) ruleId: number,
    @CurrentUser() user: any,
  ) {
    return this.escalationService.escalateTicket(ticketId, ruleId, user.id.toString());
  }

  // Trigger manual check (Admin only)

  @Post('check-now')
  @Roles(UserRole.ADMIN)
  async triggerManualCheck() {
    await this.escalationService.checkAndEscalateTickets();
    return { message: 'Escalation check triggered successfully' };
  }
}
