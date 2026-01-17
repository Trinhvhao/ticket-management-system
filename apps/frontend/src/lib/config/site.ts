export const siteConfig = {
  name: 'Ticket Management System',
  shortName: 'TMS',
  description: 'Hệ thống quản lý yêu cầu hỗ trợ kỹ thuật - Công ty TNHH 28H',
  company: 'Công ty TNHH 28H',
  
  // URLs
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  
  // Limits
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760', 10), // 10MB
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed',
  ],
  
  // Pagination
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
  
  // Date formats
  dateFormat: 'DD/MM/YYYY',
  dateTimeFormat: 'DD/MM/YYYY HH:mm',
  timeFormat: 'HH:mm',
  
  // Ticket priorities
  priorities: [
    { value: 'low', label: 'Thấp', color: 'green' },
    { value: 'medium', label: 'Trung bình', color: 'yellow' },
    { value: 'high', label: 'Cao', color: 'red' },
  ],
  
  // Ticket statuses
  statuses: [
    { value: 'new', label: 'Mới', color: 'blue' },
    { value: 'assigned', label: 'Đã phân công', color: 'purple' },
    { value: 'in_progress', label: 'Đang xử lý', color: 'yellow' },
    { value: 'resolved', label: 'Đã giải quyết', color: 'green' },
    { value: 'closed', label: 'Đã đóng', color: 'gray' },
  ],
  
  // User roles
  roles: [
    { value: 'Employee', label: 'Nhân viên' },
    { value: 'IT_Staff', label: 'IT Staff' },
    { value: 'Admin', label: 'Quản trị viên' },
  ],
  
  // SLA status
  slaStatuses: [
    { value: 'met', label: 'Đạt SLA', color: 'green' },
    { value: 'at_risk', label: 'Có nguy cơ', color: 'yellow' },
    { value: 'breached', label: 'Vi phạm SLA', color: 'red' },
    { value: 'not_applicable', label: 'Không áp dụng', color: 'gray' },
  ],
} as const;

export type Priority = typeof siteConfig.priorities[number]['value'];
export type Status = typeof siteConfig.statuses[number]['value'];
export type Role = typeof siteConfig.roles[number]['value'];
export type SlaStatus = typeof siteConfig.slaStatuses[number]['value'];
