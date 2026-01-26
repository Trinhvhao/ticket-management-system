import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
}

@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    const baseURL = this.configService.get<string>('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1');
    this.model = this.configService.get<string>('OPENROUTER_MODEL', 'google/gemini-flash-1.5-8b');

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    this.client = new OpenAI({
      apiKey,
      baseURL,
      defaultHeaders: {
        'HTTP-Referer': 'https://ticket.28h.com.vn',
        'X-Title': '28H Ticket Management System',
      },
    });

    this.logger.log(`✅ LLM Service initialized with model: ${this.model}`);
  }

  /**
   * Generate completion from messages
   */
  async generateCompletion(messages: LLMMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  }): Promise<LLMResponse> {
    try {
      const startTime = Date.now();

      this.logger.debug(`Generating completion with ${messages.length} messages`);

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages as any,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1000,
        stream: false,
      });

      const duration = Date.now() - startTime;

      const result: LLMResponse = {
        content: response.choices[0]?.message?.content || '',
        model: response.model,
        tokensUsed: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0,
        },
      };

      this.logger.log(
        `✅ Completion generated in ${duration}ms | Tokens: ${result.tokensUsed.total} (prompt: ${result.tokensUsed.prompt}, completion: ${result.tokensUsed.completion})`
      );

      return result;
    } catch (error) {
      this.logger.error('Error generating completion:', error);
      throw error;
    }
  }

  /**
   * Generate RAG response with context
   */
  async generateRAGResponse(
    query: string,
    context: Array<{ title: string; content: string }>,
    userName: string,
  ): Promise<LLMResponse> {
    // Build context string
    const contextString = context
      .map((article, index) => {
        return `[Bài viết ${index + 1}: ${article.title}]\n${article.content}\n`;
      })
      .join('\n---\n\n');

    // Build system prompt
    const systemPrompt = `Bạn là trợ lý ảo thông minh của Công ty TNHH 28H, chuyên hỗ trợ nhân viên về các vấn đề IT và hệ thống nội bộ.

**Thông tin về hệ thống:**
- Tên: Hệ thống Quản lý Ticket (Ticket Management System)
- Tác giả: Nguyễn Thị Thu Trang, lớp ĐH12C2
- Mục đích: Số hóa quy trình hỗ trợ kỹ thuật cho Công ty TNHH 28H
- Công nghệ: NestJS, Next.js, PostgreSQL, AI Chatbot

**Vai trò của bạn:**
- Trả lời câu hỏi dựa trên cơ sở kiến thức được cung cấp
- Giải thích rõ ràng, chi tiết và dễ hiểu
- Sử dụng tiếng Việt tự nhiên, thân thiện
- Trích dẫn thông tin từ các bài viết khi cần
- Khi được hỏi về dự án/hệ thống/tác giả, hãy trả lời: "Hệ thống này được phát triển bởi Nguyễn Thị Thu Trang, lớp ĐH12C2"

**Quy tắc:**
1. CHỈ sử dụng thông tin từ các bài viết được cung cấp
2. Nếu không tìm thấy thông tin, hãy thừa nhận và đề xuất tạo ticket
3. Trả lời ngắn gọn nhưng đầy đủ (2-4 đoạn văn)
4. Sử dụng bullet points khi liệt kê các bước
5. Kết thúc bằng câu hỏi "Bạn cần thêm thông tin gì không?"

**Cơ sở kiến thức:**
${contextString}`;

    const userPrompt = `Câu hỏi từ ${userName}: ${query}

Hãy trả lời dựa trên các bài viết trên.`;

    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return this.generateCompletion(messages, {
      temperature: 0.7,
      maxTokens: 800,
    });
  }

  /**
   * Generate conversational response (no context)
   */
  async generateConversationalResponse(
    query: string,
    userName: string,
    conversationHistory?: LLMMessage[],
  ): Promise<LLMResponse> {
    const systemPrompt = `Bạn là trợ lý ảo của Công ty TNHH 28H. Hãy trả lời thân thiện và hữu ích.`;

    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: `${userName}: ${query}` },
    ];

    return this.generateCompletion(messages, {
      temperature: 0.8,
      maxTokens: 500,
    });
  }

  /**
   * Check if service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.generateCompletion([
        { role: 'user', content: 'Hello' },
      ], {
        maxTokens: 10,
      });

      return response.content.length > 0;
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Get current model name
   */
  getModel(): string {
    return this.model;
  }
}
