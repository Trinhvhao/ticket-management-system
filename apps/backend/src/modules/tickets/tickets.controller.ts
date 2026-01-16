import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TicketsService, TicketFilters, PaginationOptions } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { ResolveTicketDto } from './dto/resolve-ticket.dto';
import { RateTicketDto } from './dto/rate-ticket.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { BulkAssignDto } from './dto/bulk-assign.dto';
import { BulkStatusDto } from './dto/bulk-status.dto';
import { BulkDeleteDto } from './dto/bulk-delete.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from '../../database/entities';
import { TicketStatus, TicketPriority } from '../../database/entities/ticket.entity';

@ApiTags('tickets')
@ApiBearerAuth('JWT-auth')
@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create ticket', description: 'Create a new support ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.create(createTicketDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets', description: 'Get all tickets with filters and pagination' })
  @ApiQuery({ name: 'status', required: false, enum: TicketStatus })
  @ApiQuery({ name: 'priority', required: false, enum: TicketPriority })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'submitterId', required: false, type: Number })
  @ApiQuery({ name: 'assigneeId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @CurrentUser() user: User,
    @Query('status') status?: TicketStatus,
    @Query('priority') priority?: TicketPriority,
    @Query('categoryId') categoryId?: string,
    @Query('submitterId') submitterId?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters: TicketFilters = {
      status,
      priority,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      submitterId: submitterId ? parseInt(submitterId) : undefined,
      assigneeId: assigneeId ? parseInt(assigneeId) : undefined,
      search,
    };

    const pagination: PaginationOptions = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'DESC',
    };

    return this.ticketsService.findAll(filters, pagination, user);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get ticket statistics', description: 'Get ticket statistics for current user' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getStats(@CurrentUser() user: User) {
    return this.ticketsService.getStats(user);
  }

  @Get('my-tickets')
  @ApiOperation({ summary: 'Get my tickets', description: 'Get tickets created by current user' })
  @ApiQuery({ name: 'status', required: false, enum: TicketStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyTickets(
    @CurrentUser() user: User,
    @Query('status') status?: TicketStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: TicketFilters = {
      status,
      submitterId: user.id,
    };

    const pagination: PaginationOptions = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };

    return this.ticketsService.findAll(filters, pagination, user);
  }

  @Get('assigned-to-me')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get assigned tickets', description: 'Get tickets assigned to current user (IT Staff/Admin only)' })
  @ApiQuery({ name: 'status', required: false, enum: TicketStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  getAssignedToMe(
    @CurrentUser() user: User,
    @Query('status') status?: TicketStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: TicketFilters = {
      status,
      assigneeId: user.id,
    };

    const pagination: PaginationOptions = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };

    return this.ticketsService.findAll(filters, pagination, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID', description: 'Get detailed information of a specific ticket' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ticket', description: 'Update ticket information' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.update(id, updateTicketDto, user);
  }

  @Post(':id/change-status')
  @ApiOperation({ summary: 'Change ticket status', description: 'Change ticket status (for Kanban board)' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket status changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.changeStatus(id, changeStatusDto.status, user);
  }

  @Post(':id/assign')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign ticket', description: 'Assign ticket to IT staff (IT Staff/Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket assigned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignTicketDto: AssignTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.assign(id, assignTicketDto, user);
  }

  @Post(':id/start-progress')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiOperation({ summary: 'Start ticket progress', description: 'Change ticket status to in_progress (IT Staff/Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket status updated to in_progress' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  startProgress(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.startProgress(id, user);
  }

  @Post(':id/resolve')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiOperation({ summary: 'Resolve ticket', description: 'Mark ticket as resolved with solution (IT Staff/Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket resolved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  resolve(
    @Param('id', ParseIntPipe) id: number,
    @Body() resolveTicketDto: ResolveTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.resolve(id, resolveTicketDto, user);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close ticket', description: 'Close a resolved ticket' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket closed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  close(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.close(id, user);
  }

  @Post(':id/reopen')
  @ApiOperation({ summary: 'Reopen ticket', description: 'Reopen a closed ticket' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket reopened successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  reopen(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.reopen(id, user);
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate ticket', description: 'Rate ticket satisfaction after resolution' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket rated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid rating' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  rate(
    @Param('id', ParseIntPipe) id: number,
    @Body() rateTicketDto: RateTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.rate(id, rateTicketDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete ticket', description: 'Delete a ticket (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.remove(id, user);
  }

  @Post('bulk-assign')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiOperation({ summary: 'Bulk assign tickets', description: 'Assign multiple tickets to an IT staff member (IT Staff/Admin only)' })
  @ApiResponse({ status: 200, description: 'Bulk assign completed' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  bulkAssign(
    @Body() bulkAssignDto: BulkAssignDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.bulkAssign(bulkAssignDto.ticketIds, bulkAssignDto.assigneeId, user);
  }

  @Post('bulk-status')
  @ApiOperation({ summary: 'Bulk change status', description: 'Change status of multiple tickets at once' })
  @ApiResponse({ status: 200, description: 'Bulk status change completed' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  bulkChangeStatus(
    @Body() bulkStatusDto: BulkStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.bulkChangeStatus(bulkStatusDto.ticketIds, bulkStatusDto.status, user);
  }

  @Post('bulk-delete')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Bulk delete tickets', description: 'Delete multiple tickets at once (Admin only)' })
  @ApiResponse({ status: 200, description: 'Bulk delete completed' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  bulkDelete(
    @Body() bulkDeleteDto: BulkDeleteDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.bulkDelete(bulkDeleteDto.ticketIds, user);
  }
}
