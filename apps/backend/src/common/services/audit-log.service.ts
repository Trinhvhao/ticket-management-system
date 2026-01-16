import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from '../../database/entities/audit-log.entity';
import { User } from '../../database/entities/user.entity';
import { Op } from 'sequelize';

export interface AuditLogData {
  userId: number;
  action: string;
  entityType: string;
  entityId?: number | undefined;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog)
    private auditLogModel: typeof AuditLog,
  ) {}

  /**
   * Log an action to audit trail
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await this.auditLogModel.create({
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        details: data.details,
      });
    } catch (error) {
      // Don't throw error to avoid breaking main flow
      console.error('Failed to create audit log:', error);
    }
  }

  /**
   * Get audit trail for a specific entity
   */
  async getAuditTrail(entityType: string, entityId: number) {
    return this.auditLogModel.findAll({
      where: { entityType, entityId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'fullName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Get user activity history
   */
  async getUserActivity(userId: number, limit: number = 100) {
    return this.auditLogModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  /**
   * Get failed attempts count
   */
  async getFailedAttempts(
    userId: number,
    action: string,
    since: Date,
  ): Promise<number> {
    return this.auditLogModel.count({
      where: {
        userId,
        action,
        createdAt: { [Op.gte]: since },
        details: {
          success: false,
        },
      },
    });
  }

  /**
   * Get total actions count
   */
  async getTotalActions(since?: Date): Promise<number> {
    const where: any = {};
    if (since) {
      where.createdAt = { [Op.gte]: since };
    }
    return this.auditLogModel.count({ where });
  }

  /**
   * Get failed actions count
   */
  async getFailedActions(since?: Date): Promise<number> {
    const where: any = {
      details: {
        success: false,
      },
    };
    if (since) {
      where.createdAt = { [Op.gte]: since };
    }
    return this.auditLogModel.count({ where });
  }

  /**
   * Detect suspicious activity
   */
  async getSuspiciousActivity(since?: Date) {
    const sinceDate = since || new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (!this.auditLogModel.sequelize) {
      return { failedLogins: [], unusualDeletes: [] };
    }

    // Find users with multiple failed login attempts
    const failedLogins = await this.auditLogModel.findAll({
      where: {
        action: 'LOGIN_FAILED',
        createdAt: { [Op.gte]: sinceDate },
      },
      attributes: [
        'userId',
        [this.auditLogModel.sequelize.fn('COUNT', '*'), 'count'],
      ],
      group: ['userId'],
      having: this.auditLogModel.sequelize.literal('COUNT(*) >= 5'),
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    // Find users with unusual delete activity
    const unusualDeletes = await this.auditLogModel.findAll({
      where: {
        action: { [Op.in]: ['DELETE_TICKET', 'DELETE_USER', 'DELETE_ARTICLE'] },
        createdAt: { [Op.gte]: sinceDate },
      },
      attributes: [
        'userId',
        [this.auditLogModel.sequelize.fn('COUNT', '*'), 'count'],
      ],
      group: ['userId'],
      having: this.auditLogModel.sequelize.literal('COUNT(*) >= 10'),
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    return {
      failedLogins,
      unusualDeletes,
    };
  }

  /**
   * Get top active users
   */
  async getTopUsers(limit: number = 10, since?: Date) {
    const where: any = {};
    if (since) {
      where.createdAt = { [Op.gte]: since };
    }

    if (!this.auditLogModel.sequelize) {
      return [];
    }

    return this.auditLogModel.findAll({
      where,
      attributes: [
        'userId',
        [this.auditLogModel.sequelize.fn('COUNT', '*'), 'actionCount'],
      ],
      group: ['userId'],
      order: [[this.auditLogModel.sequelize.literal('actionCount'), 'DESC']],
      limit,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'fullName', 'email'],
        },
      ],
    });
  }
}
