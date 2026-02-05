import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { KnowledgeArticle } from '../../database/entities/knowledge-article.entity';
import { User, UserRole } from '../../database/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { RateArticleDto } from './dto/rate-article.dto';
import { EmbeddingService } from '../../common/services/embedding.service';

export interface ArticleFilters {
  category?: string | undefined;
  tags?: string[] | undefined;
  isPublished?: boolean | undefined;
  search?: string | undefined;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);

  constructor(
    @InjectModel(KnowledgeArticle)
    private readonly articleModel: typeof KnowledgeArticle,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /**
   * Create a new article (IT Staff/Admin only)
   */
  async create(createArticleDto: CreateArticleDto, currentUser: User): Promise<KnowledgeArticle> {
    this.logger.log(`Creating article: ${createArticleDto.title}`);

    // Generate embedding for the article
    let embedding: string | undefined;
    try {
      const textToEmbed = `${createArticleDto.title}\n\n${createArticleDto.content}`;
      const embeddingVector = await this.embeddingService.generateEmbedding(textToEmbed);
      embedding = JSON.stringify(embeddingVector);
      this.logger.log(`Generated embedding for article: ${embeddingVector.length} dimensions`);
    } catch (error) {
      this.logger.error('Failed to generate embedding:', error);
      // Continue without embedding - article can still be created
    }

    const article = await this.articleModel.create({
      ...createArticleDto,
      authorId: currentUser.id,
      isPublished: createArticleDto.isPublished ?? false,
      publishedAt: createArticleDto.isPublished ? new Date() : null,
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      embedding,
    } as any);

    return this.findOne(article.id, currentUser);
  }

  /**
   * Get all articles with filters and pagination
   */
  async findAll(
    filters: ArticleFilters = {},
    pagination: PaginationOptions = {},
    currentUser?: User,
  ): Promise<{ articles: KnowledgeArticle[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Non-staff users can only see published articles
    if (!currentUser || (currentUser.role !== UserRole.IT_STAFF && currentUser.role !== UserRole.ADMIN)) {
      where.isPublished = true;
    } else if (filters.isPublished !== undefined) {
      where.isPublished = filters.isPublished;
    }

    if (filters.category) where.categoryId = filters.category;

    // Search in title, content
    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filters.search}%` } },
        { content: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        [Op.overlap]: filters.tags,
      };
    }

    const { rows: articles, count: total } = await this.articleModel.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'avatarUrl'],
        },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return {
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get article by ID
   */
  async findOne(id: number, currentUser?: User): Promise<KnowledgeArticle> {
    const article = await this.articleModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'email', 'avatarUrl'],
        },
      ],
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Check if user can view unpublished articles
    if (!article.isPublished) {
      if (!currentUser || (currentUser.role !== UserRole.IT_STAFF && currentUser.role !== UserRole.ADMIN)) {
        throw new ForbiddenException('This article is not published');
      }
    }

    // Increment view count
    article.incrementViewCount();
    await article.save();

    return article;
  }

  /**
   * Update article
   */
  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    currentUser: User,
  ): Promise<KnowledgeArticle> {
    const article = await this.articleModel.findByPk(id);

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Only author or admin can update
    if (article.authorId !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own articles');
    }

    // Regenerate embedding if title or content changed
    if (updateArticleDto.title || updateArticleDto.content) {
      try {
        const title = updateArticleDto.title || article.title;
        const content = updateArticleDto.content || article.content;
        const textToEmbed = `${title}\n\n${content}`;
        
        const embeddingVector = await this.embeddingService.generateEmbedding(textToEmbed);
        const embedding = JSON.stringify(embeddingVector);
        
        // Update with embedding
        await article.update({
          ...updateArticleDto,
          embedding,
        } as any);
        
        this.logger.log(`Regenerated embedding for article ${id}`);
        return article;
      } catch (error) {
        this.logger.error('Failed to regenerate embedding:', error);
        // Continue without updating embedding
      }
    }

    await article.update(updateArticleDto);

    return this.findOne(id, currentUser);
  }

  /**
   * Delete article
   */
  async remove(id: number, currentUser: User): Promise<{ message: string }> {
    const article = await this.articleModel.findByPk(id);

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Only author or admin can delete
    if (article.authorId !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    await article.destroy();

    return { message: 'Article deleted successfully' };
  }

  /**
   * Publish article
   */
  async publish(id: number, currentUser: User): Promise<KnowledgeArticle> {
    const article = await this.articleModel.findByPk(id);

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    article.publish();
    await article.save();

    return this.findOne(id, currentUser);
  }

  /**
   * Unpublish article
   */
  async unpublish(id: number, currentUser: User): Promise<KnowledgeArticle> {
    const article = await this.articleModel.findByPk(id);

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    article.unpublish();
    await article.save();

    return this.findOne(id, currentUser);
  }

  /**
   * Rate article
   */
  async rate(id: number, rateArticleDto: RateArticleDto): Promise<KnowledgeArticle> {
    const article = await this.articleModel.findByPk(id);

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    if (!article.isPublished) {
      throw new ForbiddenException('Cannot rate unpublished articles');
    }

    article.rate(rateArticleDto.isHelpful);
    await article.save();

    return article;
  }

  /**
   * Search articles
   */
  async search(query: string, limit = 10): Promise<KnowledgeArticle[]> {
    return this.articleModel.findAll({
      where: {
        isPublished: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { content: { [Op.iLike]: `%${query}%` } },
        ],
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName'],
        },
      ],
      order: [['viewCount', 'DESC']],
      limit,
    });
  }

  /**
   * Get popular articles
   */
  async getPopular(limit = 10): Promise<KnowledgeArticle[]> {
    return this.articleModel.findAll({
      where: { isPublished: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName'],
        },
      ],
      order: [['viewCount', 'DESC']],
      limit,
    });
  }

  /**
   * Get recent articles
   */
  async getRecent(limit = 10): Promise<KnowledgeArticle[]> {
    return this.articleModel.findAll({
      where: { isPublished: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName'],
        },
      ],
      order: [['publishedAt', 'DESC']],
      limit,
    });
  }

  /**
   * Get articles by category
   */
  async getByCategory(category: string, limit = 10): Promise<KnowledgeArticle[]> {
    return this.articleModel.findAll({
      where: {
        categoryId: parseInt(category),
        isPublished: true,
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName'],
        },
      ],
      order: [['viewCount', 'DESC']],
      limit,
    });
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    const articles = await this.articleModel.findAll({
      where: { 
        isPublished: true,
        categoryId: { [Op.ne]: null } 
      },
      attributes: ['categoryId'],
      group: ['categoryId'],
      raw: true,
    });

    return articles.map((a: any) => String(a.categoryId)).filter(Boolean);
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<string[]> {
    const articles = await this.articleModel.findAll({
      where: { isPublished: true },
      attributes: ['tags'],
      raw: true,
    });

    const allTags: string[] = [];
    articles.forEach((a: any) => {
      if (a.tags) {
        const tags = a.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        allTags.push(...tags);
      }
    });
    
    return [...new Set(allTags)];
  }

  /**
   * Get article statistics
   */
  async getStats(): Promise<any> {
    const [total, published, draft, totalViews] = await Promise.all([
      this.articleModel.count(),
      this.articleModel.count({ where: { isPublished: true } }),
      this.articleModel.count({ where: { isPublished: false } }),
      this.articleModel.sum('viewCount'),
    ]);

    return {
      total,
      published,
      draft,
      totalViews: totalViews || 0,
    };
  }
}
