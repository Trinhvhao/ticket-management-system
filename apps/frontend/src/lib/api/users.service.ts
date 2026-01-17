import apiClient from './client';

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  role?: string;
  department?: string;
  phone?: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
  department?: string;
  phone?: string;
}

export interface UsersFilters {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export const usersService = {
  /**
   * Get all users with optional filters
   */
  getAll: async (filters?: UsersFilters): Promise<{ users: any[]; total: number; page: number; totalPages: number }> => {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    
    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create user
   */
  create: async (data: CreateUserRequest): Promise<any> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  /**
   * Update user
   */
  update: async (id: number, data: UpdateUserRequest): Promise<any> => {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Activate user
   */
  activate: async (id: number): Promise<any> => {
    const response = await apiClient.post(`/users/${id}/activate`);
    return response.data;
  },

  /**
   * Deactivate user
   */
  deactivate: async (id: number): Promise<any> => {
    const response = await apiClient.post(`/users/${id}/deactivate`);
    return response.data;
  },

  /**
   * Delete user
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};
