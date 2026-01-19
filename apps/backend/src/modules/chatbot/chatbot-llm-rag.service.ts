import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { KnowledgeArticle } from '../../database/entities/knowledge-article.entity';
import { Category } from '../../database/entities/category.entity';
import { User } from '../../database/entities/user.entity';
import { EmbeddingService } from '../../common/services/embedding.service';
import { LLMService } from '../../common/services/llm.service';

export interface RAGResponse {
  type: string;
  message: string;
  articles?: Array<{
    id: number;
    title: string;
    similarity: number;
  }>;
  suggestions?: string[];
  confidence: number;
  tokensUsed?: number;
}

@Injectable()
export class ChatbotLLMRAGService {
  private readonly logger = new Logger(ChatbotLLMRAGService.name);

  constructor(
    @InjectModel(KnowledgeArticle)
    private knowledgeArticleModel: typeof KnowledgeArticle,
    private readonly embeddingService: EmbeddingService,
    private readonly llmService: LLMService,
  ) {}

  /**
   * Main RAG processing with LLM
   */
  async processMessage(message: string, user: User): Promise<RAGResponse> {
    const startTime = Date.now();
    this.logger.log(`Processing RAG query from ${user.fullName}: "${message}"`);

    try {
      // Step 1: Detect intent
      const intent = this.detectIntent(message.toLowerCase());
      
      if (intent === 'greeting') {
        return this.handleGreeting(user);
      }

      if (intent === 'help') {
        return this.handleHelp();
      }

      // Step 2: Generate embedding for query
      const queryEmbedding = await this.embeddingService.generateEmbedding(message);
      this.logger.debug(`Generated query embedding: ${queryEmbedding.length} dimensions`);

      // Step 3: Find similar articles using vector search
      const similarArticles = await this.findSimilarArticles(queryEmbedding, 3);
      this.logger.debug(`Found ${similarArticles.length} similar articles`);

      // Step 4: Generate response with LLM
      if (similarArticles.length === 0) {
        return {
          type: 'no_results',
          message: `Xin lỗi ${user.fullName}, tôi không tìm thấy thông tin liên quan trong cơ sở kiến thức. Bạn có muốn tạo ticket để được hỗ trợ trực tiếp không?`,
          suggestions: ['Tạo ticket hỗ trợ', 'Thử tìm kiếm khác', 'Liên hệ IT'],
          confidence: 0,
        };
      }

      // Build context from similar articles
      const context = similarArticles.map(item => ({
        title: item.article.title,
        content: this.truncateContent(item.article.content, 1000),
      }));

      // Generate LLM response
      const llmResponse = await this.llmService.generateRAGResponse(
        message,
        context,
        user.fullName,
      );

      const duration = Date.now() - startTime;
      this.logger.log(`✅ RAG response generated in ${duration}ms | Tokens: ${llmResponse.tokensUsed.total}`);

      return {
        type: 'rag_response',
        message: llmResponse.content,
        articles: similarArticles.map(item => ({
          id: item.article.id,
          title: item.article.title,
          similarity: item.similarity,
        })),
        suggestions: [
          'Xem bài viết chi tiết',
          'Tìm kiếm thêm',
          'Tạo ticket nếu cần',
        ],
        confidence: similarArticles[0]?.similarity || 0,
        tokensUsed: llmResponse.tokensUsed.total,
      };
    } catch (error) {
      this.logger.error('Error processing RAG query:', error);
      
      return {
        type: 'error',
        message: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc tạo ticket để được hỗ trợ.',
        suggestions: ['Thử lại', 'Tạo ticket'],
        confidence: 0,
      };
    }
  }

  /**
   * Find similar articles using vector search
   */
  private async findSimilarArticles(
    queryEmbedding: number[],
    topK: number = 3,
  ): Promise<Array<{ article: KnowledgeArticle; similarity: number }>> {
    // Get all published articles with embeddings
    const articles = await this.knowledgeArticleModel.findAll({
      where: {
        isPublished: true,
      },
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
      ],
    });

    // Filter articles that have embeddings
    const articlesWithEmbeddings = articles.filter(article => article.embedding);

    if (articlesWithEmbeddings.length === 0) {
      this.logger.warn('No articles with embeddings found');
      return [];
    }

    // Calculate similarities
    const similarities = articlesWithEmbeddings.map(article => {
      try {
        const articleEmbedding = JSON.parse(article.embedding!);
        const similarity = this.embeddingService.cosineSimilarity(
          queryEmbedding,
          articleEmbedding,
        );

        return {
          article,
          similarity,
        };
      } catch (error) {
        this.logger.error(`Error parsing embedding for article ${article.id}:`, error);
        return {
          article,
          similarity: 0,
        };
      }
    });

    // Sort by similarity (descending) and take top K
    const topResults = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .filter(item => item.similarity > 0.3); // Threshold: 0.3

    return topResults;
  }

  /**
   * Truncate content to max length
   */
  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }

    return content.substring(0, maxLength) + '...';
  }

  /**
   * Detect user intent
   */
  private detectIntent(message: string): string {
    if (/^(xin chào|chào|hello|hi|hey)/i.test(message)) {
      return 'greeting';
    }

    if (/(help|trợ giúp|hỗ trợ|giúp)/i.test(message)) {
      return 'help';
    }

    return 'query';
  }

  /**
   * Handle greeting
   */
  private handleGreeting(user: User): RAGResponse {
    return {
      type: 'greeting',
      message: `Xin chào ${user.fullName}! 👋

Tôi là trợ lý AI của Công ty TNHH 28H. Tôi có thể giúp bạn:

• Tìm kiếm thông tin trong cơ sở kiến thức
• Hướng dẫn sử dụng hệ thống nội bộ (ERP, WiFi, Phòng họp)
• Giải đáp thắc mắc về IT
• Hỗ trợ tạo ticket khi cần thiết

Bạn cần hỗ trợ gì hôm nay?`,
      suggestions: [
        'Hướng dẫn sử dụng ERP',
        'Kết nối WiFi văn phòng',
        'Đặt phòng họp',
        'Sử dụng máy in',
      ],
      confidence: 1,
    };
  }

  /**
   * Handle help request
   */
  private handleHelp(): RAGResponse {
    return {
      type: 'help',
      message: `Tôi có thể hỗ trợ bạn với các vấn đề sau:

**Hệ thống nội bộ:**
• ERP: Đăng nhập, nghỉ phép, chấm công, tăng ca
• WiFi: Kết nối mạng 28H-Staff
• Phòng họp: Đặt và sử dụng phòng họp

**Thiết bị:**
• Máy in và photocopy
• Máy tính, laptop
• Thiết bị văn phòng

**Bảo mật:**
• Chính sách bảo mật
• Mật khẩu và VPN
• Quy định sử dụng

Hãy cho tôi biết bạn cần hỗ trợ về vấn đề gì?`,
      suggestions: [
        'Hướng dẫn ERP',
        'Kết nối WiFi',
        'Sử dụng máy in',
        'Chính sách bảo mật',
      ],
      confidence: 1,
    };
  }
}
