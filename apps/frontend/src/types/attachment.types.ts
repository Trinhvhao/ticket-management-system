import type { User } from './user.types';

export interface Attachment {
  id: number;
  ticketId: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: number;
  createdAt: string;

  // Relations
  uploader?: User;
}

export interface UploadAttachmentDto {
  ticketId: number;
  file: File;
}

export interface AttachmentFilters {
  ticketId?: number;
}
