import apiClient from './client';

export interface ChatResponse {
  type: 'greeting' | 'help' | 'knowledge_results' | 'no_results' | 'fallback';
  message: string;
  suggestions?: string[];
  options?: Array<{ text: string; action: string }>;
  articles?: Array<{ id: number; title: string; viewCount?: number }>;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  options?: Array<{ text: string; action: string }>;
  articles?: Array<{ id: number; title: string }>;
}

export const chatbotService = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>('/chatbot/chat', { message });
    return response.data;
  },
};
