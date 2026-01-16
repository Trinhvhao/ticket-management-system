import { Injectable } from '@nestjs/common';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class ChatbotService {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  /**
   * Process user message and return appropriate response
   */
  async processMessage(message: string, user: User): Promise<any> {
    const lowerMessage = message.toLowerCase();

    // Simple keyword-based responses
    if (this.containsGreeting(lowerMessage)) {
      return {
        type: 'greeting',
        message: `Hello ${user.fullName}! How can I help you today?`,
        suggestions: [
          'Search knowledge base',
          'Create a ticket',
          'Check ticket status',
          'Get help',
        ],
      };
    }

    if (this.containsHelp(lowerMessage)) {
      return {
        type: 'help',
        message: 'I can help you with:',
        options: [
          { text: 'Search for solutions in our knowledge base', action: 'search' },
          { text: 'Create a new support ticket', action: 'create_ticket' },
          { text: 'Check your existing tickets', action: 'check_tickets' },
          { text: 'Get technical support', action: 'tech_support' },
        ],
      };
    }

    // Search knowledge base
    if (this.containsSearchIntent(lowerMessage)) {
      const searchQuery = this.extractSearchQuery(message);
      const articles = await this.knowledgeService.search(searchQuery, 5);

      if (articles.length > 0) {
        return {
          type: 'knowledge_results',
          message: `I found ${articles.length} article(s) that might help:`,
          articles: articles.map((a) => ({
            id: a.id,
            title: a.title,
            viewCount: a.viewCount,
          })),
        };
      } else {
        return {
          type: 'no_results',
          message: 'I couldn\'t find any articles matching your query. Would you like to create a support ticket?',
          suggestions: ['Create ticket', 'Try different search'],
        };
      }
    }

    // Default response - search knowledge base
    const articles = await this.knowledgeService.search(message, 3);

    if (articles.length > 0) {
      return {
        type: 'knowledge_results',
        message: 'Here are some articles that might help:',
        articles: articles.map((a) => ({
          id: a.id,
          title: a.title,
        })),
        suggestions: ['Create ticket if not resolved', 'Search again'],
      };
    }

    return {
      type: 'fallback',
      message: 'I\'m not sure how to help with that. Would you like to create a support ticket or search our knowledge base?',
      suggestions: ['Create ticket', 'Search knowledge base', 'Talk to support'],
    };
  }

  private containsGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some((g) => message.includes(g));
  }

  private containsHelp(message: string): boolean {
    const helpKeywords = ['help', 'support', 'assist', 'what can you do'];
    return helpKeywords.some((k) => message.includes(k));
  }

  private containsSearchIntent(message: string): boolean {
    const searchKeywords = ['search', 'find', 'look for', 'how to', 'how do i'];
    return searchKeywords.some((k) => message.includes(k));
  }

  private extractSearchQuery(message: string): string {
    // Remove common search prefixes
    let query = message
      .replace(/^(search for|find|look for|how to|how do i)\s+/i, '')
      .trim();

    return query || message;
  }
}