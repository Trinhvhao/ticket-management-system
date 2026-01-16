import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { KnowledgeService } from './knowledge.service';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeArticle } from '../../database/entities/knowledge-article.entity';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([KnowledgeArticle, User])],
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  exports: [KnowledgeService],
})
export class KnowledgeModule {}
