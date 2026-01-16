# 🎫 Ticket Management System

> Hệ thống quản lý yêu cầu hỗ trợ kỹ thuật hiện đại cho Công ty TNHH 28H

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Tổng quan

Hệ thống Quản lý Ticket là giải pháp toàn diện để số hóa quy trình hỗ trợ kỹ thuật, tuân thủ tiêu chuẩn ITIL/ITSM, giúp doanh nghiệp quản lý và xử lý yêu cầu hỗ trợ một cách hiệu quả.

### ✨ Tính năng nổi bật

- 🎯 **Quản lý Ticket đầy đủ** - Tạo, theo dõi, phân công và xử lý ticket
- 👥 **Phân quyền linh hoạt** - 3 roles: Employee, IT Staff, Admin
- 📊 **Dashboard & Reports** - Thống kê, báo cáo chi tiết
- ⏰ **SLA Management** - Quản lý SLA với business hours và holiday calendar
- 🔄 **Auto-Escalation** - Tự động leo thang khi SLA breach
- 💬 **Comments & Attachments** - Trao đổi và đính kèm file
- 📚 **Knowledge Base** - Cơ sở tri thức với search và tags
- 🤖 **AI Chatbot** - Hỗ trợ tự động với NLP
- 🔔 **Notifications** - Thông báo real-time
- 📱 **Responsive Design** - Hoạt động mượt mà trên mọi thiết bị

## 🏗️ Kiến trúc

```
┌─────────────────────────────────────────┐
│      Frontend (Next.js 14 + React)     │
│   - TypeScript + TailwindCSS            │
│   - TanStack Query + Zustand            │
│   - Responsive UI với Shadcn           │
└─────────────────┬───────────────────────┘
                  │ REST API + JWT
┌─────────────────▼───────────────────────┐
│         Backend (NestJS)                │
│   - 13 Feature Modules                  │
│   - JWT Authentication                  │
│   - Role-based Access Control           │
│   - Auto-Escalation Cron Jobs          │
└─────────────────┬───────────────────────┘
                  │ Sequelize ORM
┌─────────────────▼───────────────────────┐
│      Database (PostgreSQL)              │
│   - 14+ Tables                          │
│   - Business Hours & Holidays          │
│   - Full Audit Trail                    │
└─────────────────────────────────────────┘
```

## 🚀 Bắt đầu

### Yêu cầu hệ thống

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm hoặc yarn

### Cài đặt

1. **Clone repository**
```bash
git clone https://github.com/Trinhvhao/ticket-management-system.git
cd ticket-management-system
```

2. **Cài đặt dependencies**
```bash
# Root
npm install

# Backend
cd apps/backend
npm install

# Frontend
cd apps/frontend
npm install
```

3. **Cấu hình Database**

Tạo database PostgreSQL:
```bash
createdb ticket_management
```

Cấu hình file `.env` trong `apps/backend`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=ticket_management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3000
NODE_ENV=development
```

4. **Chạy migrations**
```bash
cd apps/backend
npm run db:migrate
```

5. **Seed dữ liệu mẫu**
```bash
npm run seed:users
```

### Chạy ứng dụng

**Development mode:**

```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev
```

Truy cập:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api

**Tài khoản mẫu:**
- Admin: `admin@28h.com` / `Admin@123`
- IT Staff: `itstaff@28h.com` / `Staff@123`
- Employee: `employee@28h.com` / `Employee@123`

## 📁 Cấu trúc Project

```
ticket-management-system/
├── apps/
│   ├── backend/              # NestJS API
│   │   ├── src/
│   │   │   ├── modules/      # Feature modules
│   │   │   ├── common/       # Shared utilities
│   │   │   ├── database/     # Entities & config
│   │   │   └── config/       # App configuration
│   │   ├── migrations/       # Database migrations
│   │   └── docs/             # API documentation
│   │
│   └── frontend/             # Next.js App
│       ├── src/
│       │   ├── app/          # App Router pages
│       │   ├── components/   # React components
│       │   ├── lib/          # Utilities & hooks
│       │   └── styles/       # Global styles
│       └── public/           # Static assets
│
├── docs/                     # Project documentation
├── .kiro/                    # Kiro AI configuration
└── README.md
```

## 🔧 Scripts

### Backend
```bash
npm run dev          # Start dev server
npm run build        # Build production
npm run start:prod   # Start production
npm run db:migrate   # Run migrations
npm run seed:users   # Seed users
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build production
npm run start        # Start production
npm run lint         # Run ESLint
```

## 📚 Tài liệu

- [API Documentation](./apps/backend/docs/)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Comprehensive Report](./docs/COMPREHENSIVE-PROJECT-REPORT.md)
- [Database Setup](./docs/DATABASE-SETUP.md)
- [Auth Debug Guide](./docs/AUTH-DEBUG-GUIDE.md)

## 🎯 Roadmap

### ✅ Phase 1: Core Features (Complete)
- [x] Authentication & Authorization
- [x] Ticket Management (CRUD)
- [x] User Management
- [x] Comments & Attachments
- [x] SLA Management
- [x] Knowledge Base
- [x] Reports & Analytics
- [x] Notifications

### ✅ Phase 2: Business Logic (Complete)
- [x] Business Hours SLA
- [x] Holiday Calendar
- [x] Auto-Escalation Engine
- [x] Workload-based Assignment

### 🚧 Phase 3: Enhanced Features (In Progress)
- [ ] Frontend UI for Escalation
- [ ] Frontend UI for Holiday Management
- [ ] Ticket Templates
- [ ] Ticket Linking & Merging
- [ ] Recurring Tickets

### 📋 Phase 4: Advanced ITIL
- [ ] Problem Management
- [ ] Change Management
- [ ] Asset Management
- [ ] Advanced Survey System

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS 10
- **Language:** TypeScript 5
- **Database:** PostgreSQL 14+ với Sequelize ORM
- **Authentication:** JWT với Passport
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 18
- **Styling:** TailwindCSS 3
- **State Management:** Zustand + TanStack Query
- **Forms:** React Hook Form
- **Charts:** Recharts

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Team

- **Developer:** Trinh Van Hao
- **Company:** Công ty TNHH 28H
- **Contact:** [GitHub](https://github.com/Trinhvhao)

## 🙏 Acknowledgments

- NestJS Team for the amazing framework
- Next.js Team for the powerful React framework
- All open-source contributors

---

**Made with ❤️ by Trinh Van Hao**

**Status:** 🟢 Active Development | Backend: 100% ✅ | Frontend: 85% 🟡 | Overall: 92% 🎯
