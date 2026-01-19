import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { ChatbotRAGService } from './chatbot-rag.service';
import { ChatbotLLMRAGService } from './chatbot-llm-rag.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({ description: 'User message to chatbot', example: 'Làm sao để kết nối WiFi 28H?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message!: string;
}

@ApiTags('chatbot')
@ApiBearerAuth('JWT-auth')
@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly chatbotRAGService: ChatbotRAGService,
    private readonly chatbotLLMRAGService: ChatbotLLMRAGService,
  ) {}

  @Post('chat')
  @ApiOperation({ 
    summary: 'Chat with AI bot (LLM + RAG)', 
    description: 'Send a message to the chatbot and receive an AI-powered response using LLM + RAG (Retrieval-Augmented Generation) with embeddings and OpenRouter' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Chatbot response with LLM + RAG',
    schema: {
      properties: {
        type: { type: 'string', description: 'Response type' },
        message: { type: 'string', description: 'AI-generated response' },
        articles: { 
          type: 'array', 
          description: 'Related articles with similarity scores',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              similarity: { type: 'number' }
            }
          }
        },
        suggestions: { type: 'array', items: { type: 'string' } },
        confidence: { type: 'number', description: 'Confidence score (0-1)' },
        tokensUsed: { type: 'number', description: 'LLM tokens used' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid message' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async chat(@Body() chatMessageDto: ChatMessageDto, @CurrentUser() user: User) {
    // Use LLM RAG service for best results
    return this.chatbotLLMRAGService.processMessage(chatMessageDto.message, user);
  }

  @Post('chat/keyword')
  @ApiOperation({ 
    summary: 'Chat with bot (Keyword-based RAG)', 
    description: 'Legacy keyword-based RAG without LLM' 
  })
  async chatKeyword(@Body() chatMessageDto: ChatMessageDto, @CurrentUser() user: User) {
    return this.chatbotRAGService.processMessage(chatMessageDto.message, user);
  }

  @Post('chat/simple')
  @ApiOperation({ 
    summary: 'Chat with bot (Simple)', 
    description: 'Simple keyword matching without embeddings' 
  })
  async chatSimple(@Body() chatMessageDto: ChatMessageDto, @CurrentUser() user: User) {
    return this.chatbotService.processMessage(chatMessageDto.message, user);
  }
}
