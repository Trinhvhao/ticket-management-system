import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { KnowledgeArticle } from '../../database/entities/knowledge-article.entity';
import { Category } from '../../database/entities/category.entity';
import { User } from '../../database/entities/user.entity';
import { Op } from 'sequelize';

export interface RAGContext {
  articles: KnowledgeArticle[];
  relevanceScores: number[];
  totalArticles: number;
}

export interface ChatResponse {
  type: string;
  message: string;
  context?: RAGContext;
  articles?: any[];
  suggestions?: string[];
  confidence?: number;
}

@Injectable()
export class ChatbotRAGService {
  private readonly logger = new Logger(ChatbotRAGService.name);

  // Company-specific keywords for 28H
  private readonly companyKeywords = {
    erp: ['erp', 'hệ thống erp', 'đăng nhập erp', 'nghỉ phép', 'chấm công', 'tăng ca'],
    wifi: ['wifi', 'mạng', 'kết nối', 'internet', '28h-staff', 'access point'],
    meeting: ['phòng họp', 'đặt phòng', 'meeting', 'họp', 'phòng a', 'phòng b'],
    printer: ['máy in', 'in ấn', 'photocopy', 'scan', 'ricoh', 'canon', 'hp'],
    security: ['bảo mật', 'mật khẩu', 'password', 'vpn', 'security'],
    hardware: ['máy tính', 'laptop', 'chuột', 'bàn phím', 'màn hình'],
    software: ['phần mềm', 'office', 'windows', 'cài đặt'],
    network: ['mạng', 'network', 'vpn', 'ip', 'dns'],
  };

  constructor(
    @InjectModel(KnowledgeArticle)
    private knowledgeArticleModel: typeof KnowledgeArticle,
  ) {}

  /**
   * Main RAG processing method
   */
  async processMessage(message: string, user: User): Promise<ChatResponse> {
    const lowerMessage = message.toLowerCase();
    this.logger.log(`Processing message from ${user.fullName}: "${message}"`);

    // Step 1: Intent Detection
    const intent = this.detectIntent(lowerMessage);
    this.logger.debug(`Detected intent: ${intent}`);

    // Step 2: Handle specific intents
    if (intent === 'greeting') {
      return this.handleGreeting(user);
    }

    if (intent === 'help') {
      return this.handleHelp();
    }

    // Step 3: Retrieve relevant context (RAG)
    const context = await this.retrieveContext(message);
    this.logger.debug(`Retrieved ${context.articles.length} relevant articles`);

    // Step 4: Generate response based on context
    return this.generateResponse(message, context, user);
  }

  /**
   * Detect user intent from message
   */
  private detectIntent(message: string): string {
    // Greeting detection
    if (/^(xin chào|chào|hello|hi|hey|good morning|good afternoon)/i.test(message)) {
      return 'greeting';
    }

    // Help detection
    if (/(help|trợ giúp|hỗ trợ|giúp|hướng dẫn|làm sao|làm thế nào)/i.test(message)) {
      return 'help';
    }

    // Specific problem detection
    if (/(lỗi|error|không|bị|sự cố|vấn đề|problem)/i.test(message)) {
      return 'problem';
    }

    // How-to detection
    if (/(cách|how to|hướng dẫn|làm sao|làm thế nào)/i.test(message)) {
      return 'howto';
    }

    return 'query';
  }

  /**
   * Retrieve relevant context using RAG approach
   */
  private async retrieveContext(query: string): Promise<RAGContext> {
    const lowerQuery = query.toLowerCase();

    // Step 1: Extract keywords and categories
    const detectedCategories = this.detectCategories(lowerQuery);
    const keywords = this.extractKeywords(lowerQuery);

    this.logger.debug(`Detected categories: ${detectedCategories.join(', ')}`);
    this.logger.debug(`Extracted keywords: ${keywords.join(', ')}`);

    // Step 2: Build search conditions
    const searchConditions: any = {
      isPublished: true,
    };

    // Add category filter if detected
    if (detectedCategories.length > 0) {
      const categories = await Category.findAll({
        where: {
          name: {
            [Op.in]: detectedCategories,
          },
        },
      });

      if (categories.length > 0) {
        searchConditions.categoryId = {
          [Op.in]: categories.map((c) => c.id),
        };
      }
    }

    // Step 3: Perform multi-field search
    const articles = await this.knowledgeArticleModel.findAll({
      where: {
        ...searchConditions,
        [Op.or]: [
          // Search in title (highest priority)
          {
            title: {
              [Op.iLike]: `%${query}%`,
            },
          },
          // Search in content
          {
            content: {
              [Op.iLike]: `%${query}%`,
            },
          },
          // Search in tags
          {
            tags: {
              [Op.iLike]: `%${query}%`,
            },
          },
          // Search by keywords
          ...keywords.map((keyword) => ({
            [Op.or]: [
              { title: { [Op.iLike]: `%${keyword}%` } },
              { content: { [Op.iLike]: `%${keyword}%` } },
              { tags: { [Op.iLike]: `%${keyword}%` } },
            ],
          })),
        ],
      },
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName'],
        },
      ],
      order: [
        ['viewCount', 'DESC'],
        ['helpfulCount', 'DESC'],
      ],
      limit: 5,
    });

    // Step 4: Calculate relevance scores
    const relevanceScores = articles.map((article) =>
      this.calculateRelevance(query, article, keywords),
    );

    // Step 5: Sort by relevance
    const sortedArticles = articles
      .map((article, index) => ({ article, score: relevanceScores[index] || 0 }))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .map((item) => item.article);

    return {
      articles: sortedArticles,
      relevanceScores: relevanceScores.sort((a, b) => b - a),
      totalArticles: sortedArticles.length,
    };
  }

  /**
   * Detect categories from query
   */
  private detectCategories(query: string): string[] {
    const categories: string[] = [];

    if (/(máy in|in ấn|photocopy|scan|printer)/i.test(query)) {
      categories.push('Hardware');
    }

    if (/(phần mềm|software|office|windows|cài đặt|erp)/i.test(query)) {
      categories.push('Software');
    }

    if (/(mạng|network|wifi|internet|vpn|kết nối)/i.test(query)) {
      categories.push('Network');
    }

    if (/(tài khoản|account|email|password|mật khẩu)/i.test(query)) {
      categories.push('Account');
    }

    return categories;
  }

  /**
   * Extract meaningful keywords from query
   */
  private extractKeywords(query: string): string[] {
    const keywords: string[] = [];

    // Check company-specific keywords
    for (const [, terms] of Object.entries(this.companyKeywords)) {
      for (const term of terms) {
        if (query.includes(term)) {
          keywords.push(term);
        }
      }
    }

    // Extract nouns and important words (simple approach)
    const words = query.split(/\s+/);
    const importantWords = words.filter(
      (word) =>
        word.length > 3 &&
        !['như', 'thế', 'nào', 'làm', 'được', 'không', 'có', 'the', 'how', 'what'].includes(word),
    );

    keywords.push(...importantWords);

    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Calculate relevance score for an article
   */
  private calculateRelevance(query: string, article: KnowledgeArticle, keywords: string[]): number {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    const lowerTitle = article.title.toLowerCase();
    const lowerContent = article.content.toLowerCase();
    const lowerTags = (article.tags || '').toLowerCase();

    // Title exact match (highest weight)
    if (lowerTitle.includes(lowerQuery)) {
      score += 100;
    }

    // Title keyword match
    keywords.forEach((keyword) => {
      if (lowerTitle.includes(keyword)) {
        score += 50;
      }
    });

    // Content keyword match
    keywords.forEach((keyword) => {
      const occurrences = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
      score += occurrences * 10;
    });

    // Tags match
    keywords.forEach((keyword) => {
      if (lowerTags.includes(keyword)) {
        score += 30;
      }
    });

    // Popularity boost
    score += article.viewCount * 0.1;
    score += article.helpfulCount * 2;

    return score;
  }

  /**
   * Generate response based on retrieved context
   */
  private generateResponse(query: string, context: RAGContext, user: User): ChatResponse {
    if (context.articles.length === 0) {
      return {
        type: 'no_results',
        message: `Xin lỗi ${user.fullName}, tôi không tìm thấy thông tin liên quan đến "${query}" trong cơ sở kiến thức. Bạn có muốn tạo ticket để được hỗ trợ trực tiếp không?`,
        suggestions: [
          'Tạo ticket hỗ trợ',
          'Tìm kiếm khác',
          'Liên hệ IT',
        ],
        confidence: 0,
      };
    }

    // High confidence response (top article is very relevant)
    if (context.relevanceScores.length > 0 && (context.relevanceScores[0] || 0) > 100 && context.articles[0]) {
      const topArticle = context.articles[0];
      return {
        type: 'high_confidence',
        message: `Tôi tìm thấy bài viết phù hợp với câu hỏi của bạn về "${query}":`,
        context,
        articles: context.articles.slice(0, 3).map((a) => ({
          id: a.id,
          title: a.title,
          category: a.category?.name,
          viewCount: a.viewCount,
          helpfulCount: a.helpfulCount,
          excerpt: this.extractExcerpt(a.content, query),
        })),
        suggestions: [
          `Xem chi tiết: ${topArticle.title}`,
          'Tìm bài viết khác',
          'Vẫn cần hỗ trợ',
        ],
        confidence: 0.9,
      };
    }

    // Medium confidence response
    return {
      type: 'medium_confidence',
      message: `Tôi tìm thấy ${context.articles.length} bài viết có thể giúp bạn:`,
      context,
      articles: context.articles.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category?.name,
        viewCount: a.viewCount,
        helpfulCount: a.helpfulCount,
      })),
      suggestions: [
        'Xem bài viết đầu tiên',
        'Tìm kiếm chi tiết hơn',
        'Tạo ticket nếu chưa giải quyết',
      ],
      confidence: 0.6,
    };
  }

  /**
   * Extract relevant excerpt from content
   */
  private extractExcerpt(content: string, query: string, maxLength: number = 200): string {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();

    // Find the position of the query in content
    const index = lowerContent.indexOf(lowerQuery);

    if (index === -1) {
      // Query not found, return beginning
      return content.substring(0, maxLength) + '...';
    }

    // Extract context around the query
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + maxLength);

    let excerpt = content.substring(start, end);

    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    return excerpt;
  }

  /**
   * Handle greeting intent
   */
  private handleGreeting(user: User): ChatResponse {
    return {
      type: 'greeting',
      message: `Xin chào ${user.fullName}! Tôi là trợ lý ảo của Công ty TNHH 28H. Tôi có thể giúp bạn:

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
    };
  }

  /**
   * Handle help intent
   */
  private handleHelp(): ChatResponse {
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
    };
  }
}
