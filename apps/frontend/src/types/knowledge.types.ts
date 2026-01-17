import type { User } from './user.types';
import type { Category } from './category.types';

export interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  authorId: number;
  tags?: string;
  viewCount: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  category?: Category;
  author?: User;
}

export interface CreateKnowledgeArticleDto {
  title: string;
  content: string;
  categoryId: number;
  tags?: string;
  isPublished?: boolean;
}

export interface UpdateKnowledgeArticleDto {
  title?: string;
  content?: string;
  categoryId?: number;
  tags?: string;
  isPublished?: boolean;
}

export interface VoteArticleDto {
  helpful: boolean;
}

export interface KnowledgeFilters {
  categoryId?: number;
  isPublished?: boolean;
  search?: string;
  tags?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'viewCount' | 'helpfulVotes';
  sortOrder?: 'ASC' | 'DESC';
}
