import apiClient from './client';

export interface Category {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  displayOrder: number;
  ticketCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export const categoriesService = {
  /**
   * Get all categories
   */
  getAll: async (includeInactive = false): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>(`/categories${includeInactive ? '?includeInactive=true' : ''}`);
    return response.data;
  },

  /**
   * Get active categories only
   */
  getActive: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Get category by ID
   */
  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create new category (Admin only)
   */
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  /**
   * Update category (Admin only)
   */
  update: async (id: number, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete category (Admin only)
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Activate category (Admin only)
   */
  activate: async (id: number): Promise<Category> => {
    const response = await apiClient.post<Category>(`/categories/${id}/activate`);
    return response.data;
  },

  /**
   * Deactivate category (Admin only)
   */
  deactivate: async (id: number): Promise<Category> => {
    const response = await apiClient.post<Category>(`/categories/${id}/deactivate`);
    return response.data;
  },
};
