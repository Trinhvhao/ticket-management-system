import apiClient from './client';

export enum CommentType {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  SYSTEM = 'system',
}

export interface Comment {
  id: number;
  ticketId: number;
  userId: number;
  content: string;
  type: CommentType;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}

export interface CreateCommentRequest {
  ticketId: number;
  content: string;
  type?: CommentType;
}

export interface UpdateCommentRequest {
  content: string;
}

export const commentsService = {
  getByTicket: async (ticketId: number): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  create: async (data: CreateCommentRequest): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/tickets/${data.ticketId}/comments`, {
      content: data.content,
      type: data.type,
    });
    return response.data;
  },

  update: async (id: number, data: UpdateCommentRequest): Promise<Comment> => {
    const response = await apiClient.patch<Comment>(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/comments/${id}`);
    return response.data;
  },
};
