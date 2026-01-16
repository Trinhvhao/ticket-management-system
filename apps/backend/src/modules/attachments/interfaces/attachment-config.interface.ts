export interface AttachmentConfig {
  maxFileSize: number;
  allowedMimeTypes: string[];
  uploadPath: string;
}

export const DEFAULT_ATTACHMENT_CONFIG: AttachmentConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    // Archives
    'application/zip',
    'application/x-rar-compressed',
  ],
  uploadPath: './uploads/attachments',
};
