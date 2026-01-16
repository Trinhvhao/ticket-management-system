import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { KnowledgeService, ArticleFilters, PaginationOptions } from './knowledge.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { RateArticleDto } from './dto/rate-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { User, UserRole } from '../../database/entities';

@ApiTags('knowledge')
@Controller('knowledge')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create knowledge article', description: 'Create a new knowledge base article (IT Staff/Admin only)' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: User,
  ) {
    return this.knowledgeService.create(createArticleDto, user);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all articles', description: 'Get all knowledge base articles with filters and pagination (Public)' })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'tags', required: false, type: String, description: 'Comma-separated tags' })
  @ApiQuery({ name: 'isPublished', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  findAll(
    @Query('category') category?: string,
    @Query('tags') tags?: string,
    @Query('isPublished') isPublished?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @CurrentUser() user?: User,
  ) {
    const filters: ArticleFilters = {
      category: category || undefined,
      tags: tags ? tags.split(',') : undefined,
      isPublished: isPublished ? isPublished === 'true' : undefined,
      search: search || undefined,
    };

    const pagination: PaginationOptions = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'DESC',
    };

    return this.knowledgeService.findAll(filters, pagination, user);
  }

  @Get('stats')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get article statistics', description: 'Get knowledge base statistics (IT Staff/Admin only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  getStats() {
    return this.knowledgeService.getStats();
  }

  @Get('popular')
  @Public()
  @ApiOperation({ summary: 'Get popular articles', description: 'Get most viewed knowledge base articles (Public)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of articles to return (default: 10)' })
  @ApiResponse({ status: 200, description: 'Popular articles retrieved successfully' })
  getPopular(@Query('limit') limit?: string) {
    return this.knowledgeService.getPopular(limit ? parseInt(limit) : 10);
  }

  @Get('recent')
  @Public()
  @ApiOperation({ summary: 'Get recent articles', description: 'Get recently published knowledge base articles (Public)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of articles to return (default: 10)' })
  @ApiResponse({ status: 200, description: 'Recent articles retrieved successfully' })
  getRecent(@Query('limit') limit?: string) {
    return this.knowledgeService.getRecent(limit ? parseInt(limit) : 10);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all categories', description: 'Get list of all article categories (Public)' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  getCategories() {
    return this.knowledgeService.getCategories();
  }

  @Get('tags')
  @Public()
  @ApiOperation({ summary: 'Get all tags', description: 'Get list of all article tags (Public)' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully' })
  getTags() {
    return this.knowledgeService.getTags();
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search articles', description: 'Search knowledge base articles by keyword (Public)' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results (default: 10)' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  search(@Query('q') query: string, @Query('limit') limit?: string) {
    return this.knowledgeService.search(query, limit ? parseInt(limit) : 10);
  }

  @Get('category/:category')
  @Public()
  @ApiOperation({ summary: 'Get articles by category', description: 'Get knowledge base articles by category (Public)' })
  @ApiParam({ name: 'category', type: String, description: 'Category name' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of articles (default: 10)' })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  getByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: string,
  ) {
    return this.knowledgeService.getByCategory(category, limit ? parseInt(limit) : 10);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get article by ID', description: 'Get detailed information of a specific article (Public)' })
  @ApiParam({ name: 'id', type: Number, description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user?: User) {
    return this.knowledgeService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update article', description: 'Update knowledge base article (IT Staff/Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @CurrentUser() user: User,
  ) {
    return this.knowledgeService.update(id, updateArticleDto, user);
  }

  @Post(':id/publish')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Publish article', description: 'Publish a knowledge base article (IT Staff/Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article published successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  publish(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.knowledgeService.publish(id, user);
  }

  @Post(':id/unpublish')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Unpublish article', description: 'Unpublish a knowledge base article (IT Staff/Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article unpublished successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  unpublish(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.knowledgeService.unpublish(id, user);
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate article', description: 'Rate article as helpful or not helpful' })
  @ApiParam({ name: 'id', type: Number, description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article rated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid rating' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  rate(@Param('id', ParseIntPipe) id: number, @Body() rateArticleDto: RateArticleDto) {
    return this.knowledgeService.rate(id, rateArticleDto);
  }

  @Delete(':id')
  @Roles(UserRole.IT_STAFF, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete article', description: 'Delete a knowledge base article (IT Staff/Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - IT Staff or Admin role required' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.knowledgeService.remove(id, user);
  }
}
