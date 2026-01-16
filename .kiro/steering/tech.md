# Technology Stack & Build System

## Architecture
- **Pattern**: 3-tier architecture (Presentation, Application, Data layers)
- **API**: RESTful services with real-time Socket.io integration

## Backend Stack
- **Runtime**: Node.js với NestJS framework
- **Database**: MySQL 8.0+ với Sequelize ORM và sequelize-typescript
- **Authentication**: JWT tokens với @nestjs/jwt và Passport strategies
- **File Storage**: Multer với @nestjs/platform-express hoặc AWS S3
- **Real-time**: Socket.io với @nestjs/websockets và @nestjs/platform-socket.io

## Frontend Stack
- **Framework**: React.js với functional components và hooks
- **UI Library**: Material-UI hoặc Ant Design
- **HTTP Client**: Axios cho API calls
- **Styling**: CSS3 với responsive design

## AI/Chatbot
- **NLP**: Natural Language Processing với rule-based responses
- **Integration**: Tích hợp với Knowledge Base cho FAQ

## Development Tools
- **Testing**: Jest cho NestJS backend, React Testing Library cho frontend
- **Process Manager**: PM2 cho production deployment
- **Proxy**: Nginx reverse proxy
- **Security**: SSL certificates, CORS, security headers, Guards, Interceptors

## Common Commands

### Development
```bash
# Backend development
npm run dev          # Start NestJS server với watch mode
npm run test         # Chạy Jest tests
npm run test:watch   # Chạy tests trong watch mode
npm run test:e2e     # Chạy end-to-end tests

# Frontend development  
npm start            # Start React development server
npm run build        # Build production React app
npm test             # Chạy React tests

# Database
npm run db:create    # Tạo database
npm run db:migrate   # Chạy database migrations
npm run db:seed      # Chạy database seeders
```

### Production
```bash
# Deployment
npm run build        # Build NestJS application
pm2 start ecosystem.config.js    # Start với PM2
pm2 restart all                  # Restart tất cả processes
pm2 logs                         # Xem logs
pm2 monit                        # Monitor processes

# Database backup
mysqldump -u user -p database > backup.sql
```

## Environment Configuration
- **Development**: `.env.development`
- **Production**: `.env.production`
- **Testing**: `.env.test`

Required environment variables:
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_SECRET`
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- `NODE_ENV`