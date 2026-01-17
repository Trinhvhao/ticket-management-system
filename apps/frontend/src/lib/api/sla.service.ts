import apiClient from './client';

export interface SlaRule {
  id: number;
  priority: 'High' | 'Medium' | 'Low';
  responseTimeHours: number;
  resolutionTimeHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlaRuleRequest {
  priority: 'High' | 'Medium' | 'Low';
  responseTimeHours: number;
  resolutionTimeHours: number;
}

export interface SlaStatus {
  ticketId: number;
  priority: string;
  status: 'Met' | 'At Risk' | 'Breached';
  dueDate: string;
  timeRemaining: string;
  percentageUsed: number;
}

export const slaService = {
  getRules: async (): Promise<SlaRule[]> => {
    const response = await apiClient.get<SlaRule[]>('/sla/rules');
    return response.data;
  },

  createRule: async (data: CreateSlaRuleRequest): Promise<SlaRule> => {
    const response = await apiClient.post<SlaRule>('/sla/rules', data);
    return response.data;
  },

  updateRule: async (id: number, data: Partial<CreateSlaRuleRequest>): Promise<SlaRule> => {
    const response = await apiClient.patch<SlaRule>(`/sla/rules/${id}`, data);
    return response.data;
  },

  deleteRule: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/sla/rules/${id}`);
    return response.data;
  },

  getTicketStatus: async (ticketId: number): Promise<SlaStatus> => {
    const response = await apiClient.get<SlaStatus>(`/sla/tickets/${ticketId}/status`);
    return response.data;
  },

  getAtRiskTickets: async (): Promise<any[]> => {
    const response = await apiClient.get('/sla/at-risk');
    return response.data;
  },

  getBreachedTickets: async (): Promise<any[]> => {
    const response = await apiClient.get('/sla/breached');
    return response.data;
  },
};
