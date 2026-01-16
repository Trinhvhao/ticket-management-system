import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'http://localhost:5173';
  const corsCredentials = configService.get<string>('CORS_CREDENTIALS') === 'true';
  
  app.enableCors({
    origin: corsOrigin,
    credentials: corsCredentials,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // API prefix
  const apiVersion = configService.get<string>('API_VERSION') || 'v1';
  app.setGlobalPrefix(`api/${apiVersion}`);

  // Swagger/OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Ticket Management System API')
    .setDescription('API documentation for the Ticket Management System - Hệ thống quản lý yêu cầu hỗ trợ kỹ thuật')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('tickets', 'Ticket management endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('categories', 'Category management endpoints')
    .addTag('comments', 'Comment management endpoints')
    .addTag('knowledge', 'Knowledge base endpoints')
    .addTag('chatbot', 'Chatbot endpoints')
    .addTag('notifications', 'Notification endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Ticket System API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  const dbHost = configService.get<string>('DB_HOST') || 'localhost';
  const dbPort = configService.get<number>('DB_PORT') || 5432;
  
  console.log(`🚀 Server running on http://localhost:${port}/api/${apiVersion}`);
  console.log(`📊 Database: ${dbHost}:${dbPort}`);
  console.log(`🔐 Auth endpoints: http://localhost:${port}/api/${apiVersion}/auth`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
