/**
 * API Endpoints - Khớp với Backend NestJS
 * Base URL: /api/v1
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    REFRESH: '/auth/refresh',
  },

  // Users Management
  USERS: {
    LIST: '/users',
    GET: (id: number) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    STATUS: (id: number) => `/users/${id}/status`,
  },

  // Tickets Management
  TICKETS: {
    LIST: '/tickets',
    GET: (id: number) => `/tickets/${id}`,
    CREATE: '/tickets',
    UPDATE: (id: number) => `/tickets/${id}`,
    DELETE: (id: number) => `/tickets/${id}`,
    ASSIGN: (id: number) => `/tickets/${id}/assign`,
    START_PROGRESS: (id: number) => `/tickets/${id}/start-progress`,
    RESOLVE: (id: number) => `/tickets/${id}/resolve`,
    CLOSE: (id: number) => `/tickets/${id}/close`,
    REOPEN: (id: number) => `/tickets/${id}/reopen`,
    RATE: (id: number) => `/tickets/${id}/rate`,
  },

  // Comments
  COMMENTS: {
    LIST: (ticketId: number) => `/comments/ticket/${ticketId}`,
    CREATE: '/comments',
    UPDATE: (id: number) => `/comments/${id}`,
    DELETE: (id: number) => `/comments/${id}`,
  },

  // Attachments
  ATTACHMENTS: {
    UPLOAD: '/attachments/upload',
    LIST: '/attachments',
    GET: (id: number) => `/attachments/${id}`,
    DOWNLOAD: (id: number) => `/attachments/${id}/download`,
    DELETE: (id: number) => `/attachments/${id}`,
  },

  // Ticket History (Audit Trail)
  TICKET_HISTORY: {
    BY_TICKET: (ticketId: number) => `/ticket-history/ticket/${ticketId}`,
    ALL: '/ticket-history',
  },

  // SLA Management
  SLA: {
    RULES: '/sla/rules',
    RULE: (id: number) => `/sla/rules/${id}`,
    TICKET_STATUS: (ticketId: number) => `/sla/tickets/${ticketId}/status`,
    AT_RISK: '/sla/at-risk',
    BREACHED: '/sla/breached',
  },

  // Reports & Analytics
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    BY_STATUS: '/reports/tickets-by-status',
    BY_CATEGORY: '/reports/tickets-by-category',
    BY_PRIORITY: '/reports/tickets-by-priority',
    SLA_COMPLIANCE: '/reports/sla-compliance',
    STAFF_PERFORMANCE: '/reports/staff-performance',
    TRENDS: '/reports/trends',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    GET: (id: number) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id: number) => `/categories/${id}`,
    DELETE: (id: number) => `/categories/${id}`,
  },

  // Knowledge Base
  KNOWLEDGE: {
    LIST: '/knowledge',
    GET: (id: number) => `/knowledge/${id}`,
    CREATE: '/knowledge',
    UPDATE: (id: number) => `/knowledge/${id}`,
    DELETE: (id: number) => `/knowledge/${id}`,
    VOTE: (id: number) => `/knowledge/${id}/vote`,
    SEARCH: '/knowledge/search',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD: '/notifications/unread',
    UNREAD_COUNT: '/notifications/unread/count',
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: number) => `/notifications/${id}`,
    DELETE_ALL: '/notifications',
  },

  // Chatbot
  CHATBOT: {
    CHAT: '/chatbot/chat',
    CONVERSATIONS: '/chatbot/conversations',
    CONVERSATION: (id: number) => `/chatbot/conversations/${id}`,
  },
} as const;

// Type helper for endpoint functions
export type EndpointFunction = (id: number) => string;
