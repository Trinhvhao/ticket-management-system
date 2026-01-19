import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Category } from './category.entity';

@Table({
  tableName: 'knowledge_articles',
  timestamps: true,
  paranoid: false, // Disable soft delete - database doesn't have deleted_at column
  underscored: true, // Use snake_case for column names
  indexes: [
    { fields: ['title'] },
    { fields: ['is_published'] },
    { fields: ['category_id'] },
    { fields: ['author_id'] },
    { fields: ['view_count'] },
    { fields: ['created_at'] },
  ],
})
export class KnowledgeArticle extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_published',
  })
  declare isPublished: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'author_id',
  })
  declare authorId: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'category_id',
  })
  declare categoryId: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare tags?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON string of embedding vector (384 dimensions)',
  })
  declare embedding?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'view_count',
  })
  declare viewCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'helpful_votes',
  })
  declare helpfulCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'not_helpful_votes',
  })
  declare notHelpfulCount: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'published_at',
  })
  declare publishedAt?: Date | null;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Associations
  @BelongsTo(() => User, 'authorId')
  declare author: User;

  @BelongsTo(() => Category)
  declare category?: Category;

  // Virtual properties
  get isDraft(): boolean {
    return !this.isPublished;
  }

  get helpfulRatio(): number {
    const total = this.helpfulCount + this.notHelpfulCount;
    if (total === 0) return 0;
    return (this.helpfulCount / total) * 100;
  }

  get readingTime(): number {
    // Estimate reading time based on content length (average 200 words per minute)
    const wordCount = this.content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  }

  // Business methods
  canBeEditedBy(userId: number, userRole: string): boolean {
    return this.authorId === userId || userRole === 'Admin' || userRole === 'IT_Staff';
  }

  canBeDeletedBy(userId: number, userRole: string): boolean {
    return this.authorId === userId || userRole === 'Admin';
  }

  canBeViewedBy(userId: number, userRole: string): boolean {
    if (!this.isPublished) {
      return this.authorId === userId || userRole === 'Admin' || userRole === 'IT_Staff';
    }
    return true; // All published articles are public
  }

  publish(): void {
    if (this.isPublished) {
      throw new Error('Article is already published');
    }
    this.isPublished = true;
    this.publishedAt = new Date();
  }

  unpublish(): void {
    if (!this.isPublished) {
      throw new Error('Article is not published');
    }
    this.isPublished = false;
    this.publishedAt = null;
  }

  incrementViewCount(): void {
    this.viewCount += 1;
  }

  rate(isHelpful: boolean): void {
    if (isHelpful) {
      this.helpfulCount += 1;
    } else {
      this.notHelpfulCount += 1;
    }
  }

  markAsHelpful(): void {
    this.helpfulCount += 1;
  }

  markAsNotHelpful(): void {
    this.notHelpfulCount += 1;
  }

  // Static methods
  static async getPopularArticles(limit: number = 10): Promise<KnowledgeArticle[]> {
    return this.findAll({
      where: { isPublished: true },
      order: [['viewCount', 'DESC']],
      limit,
    });
  }

  static async searchArticles(query: string, limit: number = 20): Promise<KnowledgeArticle[]> {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        isPublished: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { content: { [Op.iLike]: `%${query}%` } },
        ],
      },
      order: [['viewCount', 'DESC']],
      limit,
    });
  }

  // Serialization
  override toJSON() {
    const values = { ...this.get() } as any;
    return values;
  }
}