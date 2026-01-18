import apiClient from './client';

export interface EscalationRule {
  id: number;
  name: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  categoryId?: number;
  triggerType: 'sla_at_risk' | 'sla_breached' | 'no_response' | 'no_assignment';
  triggerHours?: number;
  escalationLevel: number;
  targetType: 'role' | 'user' | 'manager';
  targetRole?: string;
  targetUserId?: number;
  notifyManager: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  };
  targetUser?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface EscalationHistory {
  id: number;
  ticketId: number;
  ruleId?: number;
  fromLevel: number;
  toLevel: number;
  escalatedBy: string;
  escalatedToUserId?: number;
  escalatedToRole?: string;
  reason: string;
  createdAt: string;
  ticket?: {
    id: number;
    ticketNumber: string;
    title: string;
  };
  rule?: {
    id: number;
    name: string;
  };
  escalatedToUser?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface CreateEscalationRuleDto {
  name: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  categoryId?: number;
  triggerType: 'sla_at_risk' | 'sla_breached' | 'no_response' | 'no_assignment';
  triggerHours?: number;
  escalationLevel: number;
  targetType: 'role' | 'user' | 'manager';
  targetRole?: string;
  targetUserId?: number;
  notifyManager?: boolean;
  isActive?: boolean;
}

export interface UpdateEscalationRuleDto extends Partial<CreateEscalationRuleDto> {}

export interface EscalateTicketDto {
  ruleId?: number;
  targetUserId?: number;
  reason?: string;
}

class EscalationService {
  private baseUrl = '/escalation';

  // Rules Management
  async createRule(data: CreateEscalationRuleDto): Promise<EscalationRule> {
    const response = await apiClient.post(`${this.baseUrl}/rules`, data);
    return response.data;
  }

  async getRules(params?: {
    isActive?: boolean;
    triggerType?: string;
    targetType?: string;
  }): Promise<EscalationRule[]> {
    const response = await apiClient.get(`${this.baseUrl}/rules`, { params });
    return response.data;
  }

  async getRule(id: number): Promise<EscalationRule> {
    const response = await apiClient.get(`${this.baseUrl}/rules/${id}`);
    return response.data;
  }

  async updateRule(id: number, data: UpdateEscalationRuleDto): Promise<EscalationRule> {
    const response = await apiClient.put(`${this.baseUrl}/rules/${id}`, data);
    return response.data;
  }

  async deleteRule(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/rules/${id}`);
  }

  // Escalation History
  async getTicketHistory(ticketId: number): Promise<EscalationHistory[]> {
    const response = await apiClient.get(`${this.baseUrl}/history/ticket/${ticketId}`);
    return response.data;
  }

  async getAllHistory(params?: {
    ticketId?: number;
    ruleId?: number;
    escalatedToUserId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<EscalationHistory[]> {
    const response = await apiClient.get(`${this.baseUrl}/history`, { params });
    return response.data;
  }

  // Manual Escalation
  async escalateTicket(ticketId: number, data?: EscalateTicketDto): Promise<EscalationHistory> {
    const response = await apiClient.post(`${this.baseUrl}/tickets/${ticketId}/escalate`, data);
    return response.data;
  }

  // Trigger Manual Check
  async triggerCheck(): Promise<{ message: string; escalatedCount: number }> {
    const response = await apiClient.post(`${this.baseUrl}/check-now`);
    return response.data;
  }
}

export const escalationService = new EscalationService();
