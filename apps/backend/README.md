# Backend - Ticket Management System

Backend API cho hệ thống quản lý ticket sử dụng NestJS và Supabase PostgreSQL.

## 🚀 Quick Start

### 1. Cài đặt dependencies
```bash
cd apps/backend
npm install
```

### 2. Cấu hình môi trường
Tạo file `.env` từ `.env.example` và cập nhật thông tin Supabase:

```env
DB_HOST=aws-0-ap-south-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.oxyhzfrhkzxghgnpxjse
DB_PASS=your-actual-password
DB_SSL=true
```

### 3. Chạy database schema
Kết nối đến Supabase và chạy file `database/schema-postgres.sql`:

```bash
# Sử dụng Supabase SQL Editor hoặc
psql "postgresql://postgres.oxyhzfrhkzxghgnpxjse:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres" -f database/schema-postgres.sql
```

### 4. Chạy development server
```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:3000

## 📁 Cấu trúc thư mục

```
apps/backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Sequelize models
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── app.module.ts    # Root module
│   └── app.ts           # Entry point
├── database/
│   ├── schema-postgres.sql  # PostgreSQL schema
│   └── schema-mysql.sql     # MySQL schema (backup)
└── package.json
```

## 🔧 Scripts

- `npm run dev` - Start development server với watch mode
- `npm run build` - Build production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code

## 🗄️ Database

Sử dụng **Supabase PostgreSQL** với connection pooling mode: transaction

### Connection Info:
- Host: aws-0-ap-south-1.pooler.supabase.com
- Port: 6543
- Database: postgres
- User: postgres.oxyhzfrhkzxghgnpxjse
- SSL: Required

## 📝 Development Workflow

### Thứ tự phát triển (Backend First):

1. ✅ **Database Schema** - Đã có
2. 🔄 **Models** - Tạo Sequelize models
3. 🔄 **Services** - Business logic
4. 🔄 **Controllers** - API endpoints
5. 🔄 **Authentication** - JWT auth
6. 🔄 **Testing** - Unit & E2E tests
7. ⏳ **Frontend** - Sau khi API hoàn thiện

### Tại sao Backend trước?

- ✅ Database schema đã sẵn
- ✅ Định nghĩa API contract trước
- ✅ Test API độc lập với Postman/Thunder Client
- ✅ Frontend phụ thuộc vào Backend APIs
- ✅ Dễ debug và validate logic

## 🔐 Authentication

Sử dụng JWT tokens với Passport strategies:
- Local strategy cho login
- JWT strategy cho protected routes

## 📊 API Documentation

API sẽ có prefix: `/api/v1`

Ví dụ endpoints:
- `POST /api/v1/auth/login`
- `GET /api/v1/tickets`
- `POST /api/v1/tickets`
- `GET /api/v1/users/me`

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Sequelize + sequelize-typescript
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Security**: Helmet, CORS, Rate limiting
