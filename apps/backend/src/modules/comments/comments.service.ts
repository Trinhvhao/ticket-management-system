import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment, CommentType } from '../../database/entities/comment.entity';
import { User, UserRole } from '../../database/entities/user.entity';
import { Ticket } from '../../database/entities/ticket.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,
    @InjectModel(Ticket)
    private readonly ticketModel: typeof Ticket,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Create a new comment on a ticket
   */
  async create(
    ticketId: number,
    createCommentDto: CreateCommentDto,
    currentUser: User,
  ): Promise<Comment> {
    // Verify ticket exists
    const ticket = await this.ticketModel.findByPk(ticketId);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    // Check if user can comment on this ticket
    if (currentUser.role === UserRole.EMPLOYEE) {
      // Employees can only comment on their own tickets
      if (ticket.submitterId !== currentUser.id) {
        throw new ForbiddenException('You can only comment on your own tickets');
      }
      // Employees can only create public comments
      if (createCommentDto.type && createCommentDto.type !== CommentType.PUBLIC) {
        throw new ForbiddenException('You can only create public comments');
      }
    }

    // Set default comment type based on role
    let commentType = createCommentDto.type || CommentType.PUBLIC;
    if (currentUser.role === UserRole.EMPLOYEE) {
      commentType = CommentType.PUBLIC;
    }

    // Create comment
    const comment = await this.commentModel.create({
      ticketId,
      userId: currentUser.id,
      content: createCommentDto.content,
      type: commentType,
    } as any);

    // 🔔 Send notification about new comment (only for public and internal comments)
    if (commentType !== CommentType.SYSTEM) {
      await this.notificationsService.notifyTicketCommented(
        ticketId,
        currentUser,
        createCommentDto.content,
      );
    }

    return this.findOne(comment.id, currentUser);
  }

  /**
   * Get all comments for a ticket
   */
  async findAllByTicket(ticketId: number, currentUser: User): Promise<Comment[]> {
    // Verify ticket exists
    const ticket = await this.ticketModel.findByPk(ticketId);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    // Check if user can view this ticket
    if (currentUser.role === UserRole.EMPLOYEE) {
      if (ticket.submitterId !== currentUser.id) {
        throw new ForbiddenException('You can only view comments on your own tickets');
      }
    }

    // Build where clause based on role
    const where: any = { ticketId };

    // Employees can only see public and system comments
    if (currentUser.role === UserRole.EMPLOYEE) {
      where.type = [CommentType.PUBLIC, CommentType.SYSTEM];
    }

    const comments = await this.commentModel.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'fullName', 'email', 'avatarUrl'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    return comments;
  }

  /**
   * Get a single comment by ID
   */
  async findOne(id: number, currentUser: User): Promise<Comment> {
    const comment = await this.commentModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'fullName', 'email', 'avatarUrl'],
        },
        {
          model: Ticket,
          attributes: ['id', 'ticketNumber', 'title', 'submitterId'],
        },
      ],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    // Check if user can view this comment
    if (!comment.canBeViewedBy(currentUser.id, currentUser.role)) {
      throw new ForbiddenException('You do not have permission to view this comment');
    }

    return comment;
  }

  /**
   * Update a comment (within 15 minutes)
   */
  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    currentUser: User,
  ): Promise<Comment> {
    const comment = await this.commentModel.findByPk(id);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    // Check if user can edit this comment
    if (!comment.canBeEditedBy(currentUser.id)) {
      if (comment.userId !== currentUser.id) {
        throw new ForbiddenException('You can only edit your own comments');
      }
      if (!comment.canBeEdited) {
        throw new BadRequestException('Comments can only be edited within 15 minutes of creation');
      }
    }

    // System comments cannot be edited
    if (comment.isSystem) {
      throw new ForbiddenException('System comments cannot be edited');
    }

    // Update comment
    comment.edit(updateCommentDto.content);
    await comment.save();

    return this.findOne(id, currentUser);
  }

  /**
   * Delete a comment (soft delete)
   */
  async remove(id: number, currentUser: User): Promise<{ message: string }> {
    const comment = await this.commentModel.findByPk(id);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    // Check if user can delete this comment
    if (!comment.canBeDeletedBy(currentUser.id, currentUser.role)) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    // System comments cannot be deleted
    if (comment.isSystem) {
      throw new ForbiddenException('System comments cannot be deleted');
    }

    await comment.destroy();

    return { message: 'Comment deleted successfully' };
  }

  /**
   * Create a system comment (for automated actions)
   */
  async createSystemComment(
    ticketId: number,
    content: string,
    metadata?: Record<string, any>,
  ): Promise<Comment> {
    // Verify ticket exists
    const ticket = await this.ticketModel.findByPk(ticketId);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    const commentData = Comment.createSystemComment(
      ticketId,
      content,
      metadata,
    );

    const comment = await this.commentModel.create(commentData as any);

    return this.commentModel.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'fullName'],
        },
      ],
    }) as Promise<Comment>;
  }

  /**
   * Get comment statistics for a ticket
   */
  async getTicketCommentStats(ticketId: number): Promise<{
    total: number;
    public: number;
    internal: number;
    system: number;
  }> {
    const [total, publicCount, internalCount, systemCount] = await Promise.all([
      this.commentModel.count({ where: { ticketId } }),
      this.commentModel.count({
        where: { ticketId, type: CommentType.PUBLIC },
      }),
      this.commentModel.count({
        where: { ticketId, type: CommentType.INTERNAL },
      }),
      this.commentModel.count({
        where: { ticketId, type: CommentType.SYSTEM },
      }),
    ]);

    return {
      total,
      public: publicCount,
      internal: internalCount,
      system: systemCount,
    };
  }

  /**
   * Get recent comments by user
   */
  async getRecentCommentsByUser(userId: number, limit = 10): Promise<Comment[]> {
    return this.commentModel.findAll({
      where: { userId },
      include: [
        {
          model: Ticket,
          attributes: ['id', 'ticketNumber', 'title'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
    });
  }
}