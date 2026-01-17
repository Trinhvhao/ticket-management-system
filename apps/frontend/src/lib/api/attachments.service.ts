import apiClient from './client';

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
  uploader?: {
    id: number;
    fullName: string;
  };
}

export const attachmentsService = {
  getByTicket: async (ticketId: number): Promise<Attachment[]> => {
    const response = await apiClient.get<Attachment[]>(`/attachments?ticketId=${ticketId}`);
    return response.data;
  },

  upload: async (ticketId: number, file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ticketId', String(ticketId));
    
    const response = await apiClient.post<Attachment>('/attachments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  download: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/attachments/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/attachments/${id}`);
    return response.data;
  },

  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getFileIcon: (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    return '📎';
  },
};
