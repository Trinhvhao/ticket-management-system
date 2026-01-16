import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';

export class ChatMessageDto {
  @ApiProperty({ description: 'User message to chatbot', example: 'How do I reset my password?' })
  message!: string;
}

@ApiTags('chatbot')
@ApiBearerAuth('JWT-auth')
@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  @ApiOperation({ 
    summary: 'Chat with bot', 
    description: 'Send a message to the chatbot and receive an AI-powered response with knowledge base integration' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Chatbot response received successfully',
    schema: {
      properties: {
        response: { type: 'string', description: 'Bot response message' },
        intent: { type: 'string', description: 'Detected user intent' },
        articles: { type: 'array', description: 'Related knowledge base articles', items: { type: 'object' } }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid message' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async chat(@Body() chatMessageDto: ChatMessageDto, @CurrentUser() user: User) {
    return this.chatbotService.processMessage(chatMessageDto.message, user);
  }
}