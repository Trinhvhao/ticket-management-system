import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { ChatbotRAGService } from './chatbot-rag.service';
import { ChatbotLLMRAGService } from './chatbot-llm-rag.service';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { KnowledgeArticle } from '../../database/entities/knowledge-article.entity';
import { EmbeddingService } from '../../common/services/embedding.service';
import { LLMService } from '../../common/services/llm.service';

@Module({
  imports: [
    ConfigModule,
    KnowledgeModule,
    SequelizeModule.forFeature([KnowledgeArticle]),
  ],
  controllers: [ChatbotController],
  providers: [
    ChatbotService,
    ChatbotRAGService,
    ChatbotLLMRAGService,
    EmbeddingService,
    LLMService,
  ],
  exports: [ChatbotService, ChatbotRAGService, ChatbotLLMRAGService],
})
export class ChatbotModule {}