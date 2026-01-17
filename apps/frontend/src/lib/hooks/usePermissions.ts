import { useAuth } from './useAuth';
import { Permissions } from '../utils/permissions';
import { Ticket } from '../types/ticket.types';

/**
 * Hook for checking user permissions
 * Provides convenient methods to check permissions throughout the app
 */
export function usePermissions() {
  const { user } = useAuth();

  return {
    // Ticket permissions
    canViewTicket: (ticket: Ticket) => Permissions.canViewTicket(user, ticket),
    canEditTicket: (ticket: Ticket) => Permissions.canEditTicket(user, ticket),
    canDeleteTicket: () => Permissions.canDeleteTicket(user),
    canAssignTicket: () => Permissions.canAssignTicket(user),
    canChangeTicketStatus: (ticket?: Ticket) => Permissions.canChangeTicketStatus(user, ticket),
    canRateTicket: (ticket: Ticket) => Permissions.canRateTicket(user, ticket),
    canViewAllTickets: () => Permissions.canViewAllTickets(user),
    canCreateTicket: () => Permissions.canCreateTicket(user),

    // Knowledge base permissions
    canCreateArticle: () => Permissions.canCreateArticle(user),
    canEditArticle: (authorId: number) => Permissions.canEditArticle(user, authorId),
    canDeleteArticle: (authorId: number) => Permissions.canDeleteArticle(user, authorId),
    canPublishArticle: () => Permissions.canPublishArticle(user),

    // User management permissions
    canViewUsers: () => Permissions.canViewUsers(user),
    canCreateUser: () => Permissions.canCreateUser(user),
    canEditUser: (targetUserId: number) => Permissions.canEditUser(user, targetUserId),
    canDeleteUser: () => Permissions.canDeleteUser(user),

    // Category permissions
    canManageCategories: () => Permissions.canManageCategories(user),

    // Dashboard & Reports permissions
    canViewDashboard: () => Permissions.canViewDashboard(user),
    canViewReports: () => Permissions.canViewReports(user),
    canViewStaffPerformance: () => Permissions.canViewStaffPerformance(user),

    // Comment permissions
    canAddComment: (ticket: Ticket) => Permissions.canAddComment(user, ticket),
    canAddInternalComment: () => Permissions.canAddInternalComment(user),
    canEditComment: (commentUserId: number) => Permissions.canEditComment(user, commentUserId),
    canDeleteComment: (commentUserId: number) => Permissions.canDeleteComment(user, commentUserId),

    // SLA permissions
    canManageSLA: () => Permissions.canManageSLA(user),

    // Settings permissions
    canManageSettings: () => Permissions.canManageSettings(user),

    // Navigation permissions
    getAllowedNavigation: () => Permissions.getAllowedNavigation(user),
    isNavigationAllowed: (item: string) => Permissions.isNavigationAllowed(user, item),

    // Current user
    user,
  };
}

