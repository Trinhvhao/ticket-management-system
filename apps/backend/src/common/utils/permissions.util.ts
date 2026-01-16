import { User, UserRole } from '../../database/entities';
import { Ticket } from '../../database/entities/ticket.entity';
import { KnowledgeArticle } from '../../database/entities/knowledge-article.entity';
import { Comment } from '../../database/entities/comment.entity';

/**
 * Permission utility for role-based and resource-based authorization
 */
export class PermissionsUtil {
  /**
   * Check if user can view ticket
   */
  static canViewTicket(user: User, ticket: Ticket): boolean {
    // Admin and IT Staff can view all tickets
    if (user.role === UserRole.ADMIN || user.role === UserRole.IT_STAFF) {
      return true;
    }

    // Employee can only view their own tickets
    if (user.role === UserRole.EMPLOYEE) {
      return ticket.submitterId === user.id;
    }

    return false;
  }

  /**
   * Check if user can edit ticket
   */
  static canEditTicket(user: User, ticket: Ticket): boolean {
    // Admin can edit all tickets
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // IT Staff can edit all tickets
    if (user.role === UserRole.IT_STAFF) {
      return true;
    }

    // Employee can only edit their own tickets if status is New or Assigned
    if (user.role === UserRole.EMPLOYEE && ticket.submitterId === user.id) {
      return ticket.status === 'New' || ticket.status === 'Assigned';
    }

    return false;
  }

  /**
   * Check if user can delete ticket
   */
  static canDeleteTicket(user: User): boolean {
    // Only Admin can delete tickets
    return user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can assign ticket
   */
  static canAssignTicket(user: User): boolean {
    // IT Staff and Admin can assign tickets
    return user.role === UserRole.IT_STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can change ticket status
   */
  static canChangeTicketStatus(user: User, ticket: Ticket): boolean {
    // Admin and IT Staff can change status
    if (user.role === UserRole.ADMIN || user.role === UserRole.IT_STAFF) {
      return true;
    }

    // Employee can close or reopen their own tickets
    if (user.role === UserRole.EMPLOYEE && ticket.submitterId === user.id) {
      return true;
    }

    return false;
  }

  /**
   * Check if user can rate ticket
   */
  static canRateTicket(user: User, ticket: Ticket): boolean {
    // Only the ticket submitter can rate
    return ticket.submitterId === user.id;
  }

  /**
   * Check if user can view all tickets
   */
  static canViewAllTickets(user: User): boolean {
    // IT Staff and Admin can view all tickets
    return user.role === UserRole.IT_STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can create knowledge article
   */
  static canCreateArticle(user: User): boolean {
    // IT Staff and Admin can create articles
    return user.role === UserRole.IT_STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can edit knowledge article
   */
  static canEditArticle(user: User, article: KnowledgeArticle): boolean {
    // Admin can edit all articles
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // IT Staff can edit their own articles
    if (user.role === UserRole.IT_STAFF && article.authorId === user.id) {
      return true;
    }

    return false;
  }

  /**
   * Check if user can delete knowledge article
   */
  static canDeleteArticle(user: User, article: KnowledgeArticle): boolean {
    // Admin can delete all articles
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // IT Staff can delete their own articles
    if (user.role === UserRole.IT_STAFF && article.authorId === user.id) {
      return true;
    }

    return false;
  }

  /**
   * Check if user can publish/unpublish article
   */
  static canPublishArticle(user: User): boolean {
    // IT Staff and Admin can publish articles
    return user.role === UserRole.IT_STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can view users list
   */
  static canViewUsers(user: User): boolean {
    // IT Staff and Admin can view users
    return user.role === UserRole.IT_STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can create user
   */
  static canCreateUser(user: User): boolean {
    // Only Admin can create users
    return user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can edit user
   */
  static canEditUser(user: User, targetUser: User): boolean {
    // Admin can edit all users
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Users can edit their own profile
    return user.id === targetUser.id;
  }

  /**
   * Check if user can delete user
   */
  static canDeleteUser(user: User): boolean {
    // Only Admin can delete users
    return user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can manage categories
   */
  static canManageCategories(user: User): boolean {
    // IT Staff and Admin can manage categories
    return user.role === UserRole.IT_STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can view dashboard
   */
  static canViewDashboard(user: User): boolean {
    // IT Staff and Admin can view dashboard
    return user.role === UserRole.IT_STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can view reports
   */
  static canViewReports(user: User): boolean {
    // IT Staff and Admin can view reports
    return user.role === UserRole.IT_STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can view staff performance
   */
  static canViewStaffPerformance(user: User): boolean {
    // Only Admin can view staff performance
    return user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can add comment
   */
  static canAddComment(user: User, ticket: Ticket): boolean {
    // Admin and IT Staff can comment on all tickets
    if (user.role === UserRole.ADMIN || user.role === UserRole.IT_STAFF) {
      return true;
    }

    // Employee can comment on their own tickets
    if (user.role === UserRole.EMPLOYEE && ticket.submitterId === user.id) {
      return true;
    }

    return false;
  }

  /**
   * Check if user can add internal comment
   */
  static canAddInternalComment(user: User): boolean {
    // Only IT Staff and Admin can add internal comments
    return user.role === UserRole.IT_STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can edit comment
   */
  static canEditComment(user: User, comment: Comment): boolean {
    // Admin can edit all comments
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Users can edit their own comments
    return comment.userId === user.id;
  }

  /**
   * Check if user can delete comment
   */
  static canDeleteComment(user: User, comment: Comment): boolean {
    // Admin can delete all comments
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Users can delete their own comments
    return comment.userId === user.id;
  }

  /**
   * Check if user can manage SLA rules
   */
  static canManageSLA(user: User): boolean {
    // IT Staff and Admin can manage SLA
    return user.role === UserRole.IT_STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Check if user can view notifications
   */
  static canViewNotifications(): boolean {
    // All authenticated users can view their own notifications
    return true;
  }

  /**
   * Check if user can manage system settings
   */
  static canManageSettings(user: User): boolean {
    // Only Admin can manage system settings
    return user.role === UserRole.ADMIN;
  }
}

