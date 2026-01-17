// Priority colors
export const PRIORITY_COLORS = {
  low: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  high: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
} as const;

// Status colors
export const STATUS_COLORS = {
  new: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  assigned: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
  },
  in_progress: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  resolved: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  closed: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    dot: 'bg-gray-500',
  },
} as const;

// SLA status colors
export const SLA_STATUS_COLORS = {
  met: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  at_risk: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  breached: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
  not_applicable: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  },
} as const;

// Priority labels (Vietnamese)
export const PRIORITY_LABELS = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
} as const;

// Status labels (Vietnamese)
export const STATUS_LABELS = {
  new: 'Mới',
  assigned: 'Đã phân công',
  in_progress: 'Đang xử lý',
  resolved: 'Đã giải quyết',
  closed: 'Đã đóng',
} as const;

// SLA status labels (Vietnamese)
export const SLA_STATUS_LABELS = {
  met: 'Đạt SLA',
  at_risk: 'Có nguy cơ',
  breached: 'Vi phạm SLA',
  not_applicable: 'Không áp dụng',
} as const;

// Role labels (Vietnamese)
export const ROLE_LABELS = {
  Employee: 'Nhân viên',
  IT_Staff: 'IT Staff',
  Admin: 'Quản trị viên',
} as const;

// Comment type labels
export const COMMENT_TYPE_LABELS = {
  public: 'Công khai',
  internal: 'Nội bộ',
  system: 'Hệ thống',
} as const;

// History action labels
export const HISTORY_ACTION_LABELS = {
  created: 'Tạo ticket',
  updated: 'Cập nhật',
  assigned: 'Phân công',
  status_changed: 'Thay đổi trạng thái',
  priority_changed: 'Thay đổi độ ưu tiên',
  category_changed: 'Thay đổi danh mục',
  comment_added: 'Thêm bình luận',
  attachment_added: 'Thêm tệp đính kèm',
  resolved: 'Giải quyết',
  closed: 'Đóng',
  reopened: 'Mở lại',
} as const;

// File type icons
export const FILE_TYPE_ICONS = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'application/pdf': 'file-text',
  'application/msword': 'file-text',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'file-text',
  'application/vnd.ms-excel': 'file-spreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'file-spreadsheet',
  'text/plain': 'file-text',
  'text/csv': 'file-spreadsheet',
  'application/zip': 'file-archive',
  'application/x-rar-compressed': 'file-archive',
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  // Auth
  AUTH_USER: ['auth', 'user'],
  
  // Users
  USERS: ['users'],
  USER: (id: number) => ['users', id],
  
  // Tickets
  TICKETS: ['tickets'],
  TICKET: (id: number) => ['tickets', id],
  TICKET_HISTORY: (id: number) => ['tickets', id, 'history'],
  
  // Comments
  COMMENTS: (ticketId: number) => ['comments', ticketId],
  
  // Attachments
  ATTACHMENTS: (ticketId: number) => ['attachments', ticketId],
  
  // Categories
  CATEGORIES: ['categories'],
  CATEGORY: (id: number) => ['categories', id],
  
  // Knowledge
  KNOWLEDGE: ['knowledge'],
  KNOWLEDGE_ARTICLE: (id: number) => ['knowledge', id],
  
  // Notifications
  NOTIFICATIONS: ['notifications'],
  UNREAD_COUNT: ['notifications', 'unread-count'],
  
  // SLA
  SLA_RULES: ['sla', 'rules'],
  SLA_STATUS: (ticketId: number) => ['sla', 'status', ticketId],
  SLA_AT_RISK: ['sla', 'at-risk'],
  SLA_BREACHED: ['sla', 'breached'],
  
  // Reports
  DASHBOARD: ['reports', 'dashboard'],
  REPORTS_BY_STATUS: ['reports', 'by-status'],
  REPORTS_BY_CATEGORY: ['reports', 'by-category'],
  REPORTS_BY_PRIORITY: ['reports', 'by-priority'],
  REPORTS_SLA: ['reports', 'sla'],
  REPORTS_STAFF: ['reports', 'staff'],
  REPORTS_TRENDS: ['reports', 'trends'],
} as const;
