import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService, DateRange } from './reports.service';
import {
  DashboardStatsDto,
  TicketsByStatusDto,
  TicketsByCategoryDto,
  TicketsByPriorityDto,
  SlaComplianceDto,
  StaffPerformanceDto,
  TrendDataDto,
} from './dto';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole, User } from '../../database/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('action-required')
  async getActionRequired(
    @CurrentUser() user: User,
  ): Promise<{
    actionRequired: number;
    breakdown: {
      newTickets: number;
      assignedToMe: number;
      unassigned: number;
      myOpenTickets: number;
    };
  }> {
    return this.reportsService.getActionRequiredCount(user.id, user.role);
  }

  @Get('dashboard')
  async getDashboard(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<DashboardStatsDto> {
    const dateRange: DateRange = {};
    if (startDate) dateRange.startDate = new Date(startDate);
    if (endDate) dateRange.endDate = new Date(endDate);

    return this.reportsService.getDashboardStats(dateRange);
  }

  @Get('tickets-by-status')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  async getTicketsByStatus(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<TicketsByStatusDto[]> {
    const dateRange: DateRange = {};
    if (startDate) dateRange.startDate = new Date(startDate);
    if (endDate) dateRange.endDate = new Date(endDate);

    return this.reportsService.getTicketsByStatus(dateRange);
  }

  @Get('tickets-by-category')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  async getTicketsByCategory(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<TicketsByCategoryDto[]> {
    const dateRange: DateRange = {};
    if (startDate) dateRange.startDate = new Date(startDate);
    if (endDate) dateRange.endDate = new Date(endDate);

    return this.reportsService.getTicketsByCategory(dateRange);
  }

  @Get('tickets-by-priority')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  async getTicketsByPriority(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<TicketsByPriorityDto[]> {
    const dateRange: DateRange = {};
    if (startDate) dateRange.startDate = new Date(startDate);
    if (endDate) dateRange.endDate = new Date(endDate);

    return this.reportsService.getTicketsByPriority(dateRange);
  }

  @Get('sla-compliance')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  async getSlaCompliance(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<SlaComplianceDto> {
    const dateRange: DateRange = {};
    if (startDate) dateRange.startDate = new Date(startDate);
    if (endDate) dateRange.endDate = new Date(endDate);

    return this.reportsService.getSlaCompliance(dateRange);
  }

  @Get('staff-performance')
  @Roles(UserRole.ADMIN)
  async getStaffPerformance(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<StaffPerformanceDto[]> {
    const dateRange: DateRange = {};
    if (startDate) dateRange.startDate = new Date(startDate);
    if (endDate) dateRange.endDate = new Date(endDate);

    return this.reportsService.getStaffPerformance(dateRange);
  }

  @Get('trends')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  async getTicketTrends(
    @Query('period') period: 'day' | 'week' | 'month' = 'week',
    @Query('limit') limit: string = '12',
  ): Promise<TrendDataDto[]> {
    return this.reportsService.getTicketTrends(period, parseInt(limit));
  }
}
