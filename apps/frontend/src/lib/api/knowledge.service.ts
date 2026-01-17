import apiClient from './client';

export interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  categoryId: number | null;
  authorId: number;
  tags: string[];
  viewCount: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  category?: { id: number; name: string };
  author?: { id: number; fullName: string };
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  categoryId?: number;
  tags?: string[];
  isPublished?: boolean;
}

export interface ArticleFilters {
  categoryId?: number;
  search?: string;
  tags?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedArticles {
  articles: KnowledgeArticle[];
  total: number;
  page: number;
  totalPages: number;
}

export const knowledgeService = {
  getAll: async (filters: ArticleFilters = {}): Promise<PaginatedArticles> => {
    const params = new URLSearchParams();
    if (filters.categoryId) params.append('categoryId', String(filters.categoryId));
    if (filters.search) params.append('search', filters.search);
    if (filters.tags) params.append('tags', filters.tags);
    if (filters.isPublished !== undefined) params.append('isPublished', String(filters.isPublished));
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    
    const response = await apiClient.get<PaginatedArticles>(`/knowledge?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<KnowledgeArticle> => {
    const response = await apiClient.get<KnowledgeArticle>(`/knowledge/${id}`);
    return response.data;
  },

  create: async (data: CreateArticleRequest): Promise<KnowledgeArticle> => {
    const response = await apiClient.post<KnowledgeArticle>('/knowledge', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateArticleRequest>): Promise<KnowledgeArticle> => {
    const response = await apiClient.patch<KnowledgeArticle>(`/knowledge/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/knowledge/${id}`);
    return response.data;
  },

  vote: async (id: number, helpful: boolean): Promise<KnowledgeArticle> => {
    const response = await apiClient.post<KnowledgeArticle>(`/knowledge/${id}/vote`, { helpful });
    return response.data;
  },

  search: async (query: string): Promise<KnowledgeArticle[]> => {
    const response = await apiClient.get<KnowledgeArticle[]>(`/knowledge/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
