import type { User } from './user.types';

export type CommentType = 'public' | 'internal' | 'system';

export interface Comment {
  id: number;
  ticketId: number;
  userId: number;
  content: string;
  type: CommentType;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
}

export interface CreateCommentDto {
  ticketId: number;
  content: string;
  type?: CommentType;
}

export interface UpdateCommentDto {
  content: string;
}
