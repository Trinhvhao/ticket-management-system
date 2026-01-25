# 🎫 Hệ Thống Quản Lý Ticket - Project Overview

## 📋 Tổng Quan Dự Án

**Tên dự án**: IT Ticket Management System  
**Khách hàng**: Công ty TNHH 28H  
**Mục đích**: Số hóa quy trình hỗ trợ kỹ thuật từ thủ công (nhắn tin, gọi điện) sang hệ thống tập trung, minh bạch và có thể theo dõi

### 🎯 Mục Tiêu Chính

1. **Thay thế quy trình thủ công** - Chuyển từ email/điện thoại sang hệ thống ticket chuyên nghiệp
2. **Tích hợp AI Chatbot** - Giảm tải cho bộ phận IT bằng FAQ tự động
3. **Tuân thủ ITIL/ITSM** - Áp dụng tiêu chuẩn quản lý dịch vụ CNTT quốc tế
4. **Báo cáo & Phân tích** - Cung cấp insights về hiệu suất và SLA compliance

---

## 👥 Người Dùng & Vai Trò

### 1. Employee (Nhân viên)
- Tạo ticket yêu cầu hỗ trợ
- Theo dõi tiến độ xử lý
- Đánh giá chất lượng dịch vụ
- Xem knowledge base

### 2. IT Staff (Nhân viên IT)
- Nhận và xử lý ticket
- Cập nhật tiến độ
- Thêm ghi chú nội bộ
- Tạo knowledge articles

### 3. Admin (Quản trị viên)
- Quản lý người dùng
- Cấu hình SLA rules
- Xem báo cáo tổng quan
- Quản lý escalation rules

---

## 🏗️ Kiến Trúc Hệ Thống

### Architecture Pattern
**3-Tier Architecture**:
```
┌─────────────────────────────────────┐
│     Presentation Layer (Frontend)   │
│     Next.js 14 + React + TailwindCSS│
└─────────────────────────────────────┘
                 ↓ REST API
┌─────────────────────────────────────┐
│    Application Layer (Backend)      │
│     NestJS + TypeScript             │
└─────────────────────────────────────┘
                 ↓ Sequelize ORM
┌─────────────────────────────────────┐
│      Data Layer (Database)          │
│     PostgreSQL (Supabase)           │
└─────────────────────────────────────┘
```

---

## 💻 Công Nghệ Sử Dụng

### Backend Stack
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Sequelize + sequelize-typescript
- **Authentication**: JWT (7 days expiration)
- **File Upload**: Multer
- **Validation**: class-validator, class-transformer
- **Scheduling**: @nestjs/schedule (cron jobs)
- **AI/NLP**: Transformers.js (embeddings) + OpenRouter (LLM)

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: TailwindCSS + Headless UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query v5)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form

### DevOps & Tools
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Database Migrations**: Sequelize CLI

---

## 🗄️ Database Schema

### Core Tables

#### 1. users
```sql
- id, email, password, full_name, role, department
- phone_number, is_active
- created_at, updated_at
```
**Roles**: Employee, IT_Staff, Admin

#### 2. tickets
```sql
- id, ticket_number, title, description
- status, priority, category_id
- submitter_id, assignee_id
- due_date, resolved_at, closed_at
- satisfaction_rating, satisfaction_feedback
- resolution_notes
- created_at, updated_at
```
**Status**: New, Assigned, In Progress, Pending, Resolved, Closed  
**Priority**: Low, Medium, High

#### 3. comments
```sql
- id, ticket_id, user_id, content, type
- is_edited, deleted_at
- created_at, updated_at
```
**Types**: Public, Internal, System

#### 4. categories
```sql
- id, name, description, icon
- parent_id (self-referencing)
- created_at, updated_at
```

#### 5. knowledge_articles
```sql
- id, title, content, category_id
- author_id, is_published
- tags, view_count, helpful_count
- embedding (vector for RAG)
- created_at, updated_at
```

#### 6. sla_rules
```sql
- id, priority, response_time, resolution_time
- is_active
- created_at, updated_at
```

#### 7. business_hours
```sql
- id, day_of_week (0-6)
- start_time, end_time, is_working_day
- created_at, updated_at
```

#### 8. holidays
```sql
- id, name, date, is_recurring
- created_at, updated_at
```

#### 9. escalation_rules
```sql
- id, name, description, priority, category_id
- trigger_type, trigger_hours, escalation_level
- target_type, target_role, target_user_id
- notify_manager, is_active
- created_at, updated_at
```

#### 10. escalation_history
```sql
- id, ticket_id, rule_id
- from_level, to_level
- escalated_by, escalated_to_user_id, escalated_to_role
- reason, created_at
```

#### 11. attachments
```sql
- id, ticket_id, file_name, original_name
- file_path, mime_type, file_size
- uploaded_by, created_at
```

#### 12. notifications
```sql
- id, user_id, type, title, message
- ticket_id, is_read, read_at
- created_at
```

#### 13. ticket_history
```sql
- id, ticket_id, user_id, action
- field_name, old_value, new_value, description
- created_at
```

---

## 🔧 Backend Modules

### 1. Auth Module
**Chức năng**:
- Login/Logout
- JWT token generation & validation
- Password hashing (bcrypt)
- Role-based access control

**Endpoints**:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### 2. Users Module
**Chức năng**:
- CRUD users
- Change password
- User profile management
- Filter by role/department

**Endpoints**:
- `GET /api/v1/users`
- `GET /api/v1/users/:id`
- `POST /api/v1/users`
- `PATCH /api/v1/users/:id`
- `DELETE /api/v1/users/:id`
- `PATCH /api/v1/users/:id/change-password`

### 3. Tickets Module
**Chức năng**:
- Create/Read/Update/Delete tickets
- Assign tickets to IT staff
- Change status (start progress, resolve, close, reopen)
- Rate ticket satisfaction
- Auto-calculate due date based on SLA
- Filter by status, priority, assignee, SLA breach

**Endpoints**:
- `GET /api/v1/tickets`
- `GET /api/v1/tickets/:id`
- `POST /api/v1/tickets`
- `PATCH /api/v1/tickets/:id`
- `DELETE /api/v1/tickets/:id`
- `PATCH /api/v1/tickets/:id/assign`
- `PATCH /api/v1/tickets/:id/start-progress`
- `PATCH /api/v1/tickets/:id/resolve`
- `PATCH /api/v1/tickets/:id/close`
- `PATCH /api/v1/tickets/:id/reopen`
- `POST /api/v1/tickets/:id/rate`

### 4. Comments Module
**Chức năng**:
- Add comments (public/internal/system)
- Edit/Delete comments
- Soft delete support

**Endpoints**:
- `GET /api/v1/comments/ticket/:ticketId`
- `POST /api/v1/comments`
- `PATCH /api/v1/comments/:id`
- `DELETE /api/v1/comments/:id`

### 5. Categories Module
**Chức năng**:
- Manage ticket categories
- Hierarchical structure (parent-child)

**Endpoints**:
- `GET /api/v1/categories`
- `GET /api/v1/categories/:id`
- `POST /api/v1/categories`
- `PATCH /api/v1/categories/:id`
- `DELETE /api/v1/categories/:id`

### 6. Knowledge Module
**Chức năng**:
- Create/manage knowledge articles
- Search articles
- Track views and helpful votes
- Vector embeddings for RAG

**Endpoints**:
- `GET /api/v1/knowledge`
- `GET /api/v1/knowledge/:id`
- `POST /api/v1/knowledge`
- `PATCH /api/v1/knowledge/:id`
- `DELETE /api/v1/knowledge/:id`
- `POST /api/v1/knowledge/:id/view`
- `POST /api/v1/knowledge/:id/helpful`

### 7. Chatbot Module
**Chức năng**:
- AI-powered FAQ chatbot
- RAG (Retrieval Augmented Generation)
- Auto-create tickets from chat
- Context-aware responses

**Technology**:
- **Embeddings**: Transformers.js (Xenova/all-MiniLM-L6-v2, 384 dims)
- **LLM**: OpenRouter (google/gemini-2.0-flash-exp:free)
- **Vector Search**: Cosine similarity

**Endpoints**:
- `POST /api/v1/chatbot/chat`
- `POST /api/v1/chatbot/create-ticket`

### 8. SLA Module
**Chức năng**:
- Manage SLA rules by priority
- Calculate due dates
- Track SLA compliance
- Identify breached/at-risk tickets

**Endpoints**:
- `GET /api/v1/sla/rules`
- `POST /api/v1/sla/rules`
- `PATCH /api/v1/sla/rules/:id`
- `GET /api/v1/sla/breached`
- `GET /api/v1/sla/at-risk`

### 9. Reports Module
**Chức năng**:
- Dashboard statistics
- Ticket trends (7/14/30 days)
- Category performance
- Staff leaderboard
- SLA compliance metrics
- Action required counts

**Endpoints**:
- `GET /api/v1/reports/dashboard`
- `GET /api/v1/reports/trends?days=7`
- `GET /api/v1/reports/category-performance`
- `GET /api/v1/reports/staff-leaderboard`
- `GET /api/v1/reports/action-required`

### 10. Escalation Module
**Chức năng**:
- Auto-escalate tickets based on rules
- Trigger types: SLA breach, SLA at risk, no assignment, no response
- Target types: Role, User, Manager
- Cron job runs every 15 minutes

**Endpoints**:
- `GET /api/v1/escalation/rules`
- `POST /api/v1/escalation/rules`
- `PATCH /api/v1/escalation/rules/:id`
- `DELETE /api/v1/escalation/rules/:id`
- `GET /api/v1/escalation/history`
- `POST /api/v1/escalation/:ticketId/escalate`

### 11. Notifications Module
**Chức năng**:
- Real-time notifications
- Mark as read
- Filter by type

**Endpoints**:
- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/:id/read`
- `PATCH /api/v1/notifications/read-all`

### 12. Attachments Module
**Chức năng**:
- Upload files to tickets
- Download attachments
- Delete attachments
- File type validation

**Endpoints**:
- `POST /api/v1/attachments/upload/:ticketId`
- `GET /api/v1/attachments/ticket/:ticketId`
- `GET /api/v1/attachments/:id/download`
- `DELETE /api/v1/attachments/:id`

### 13. Ticket History Module
**Chức năng**:
- Track all ticket changes
- Audit trail
- Action types: Created, Updated, Assigned, Status Changed, etc.

**Endpoints**:
- `GET /api/v1/ticket-history/ticket/:ticketId`

---

## 🎨 Frontend Features

### 1. Authentication
- Login page với form validation
- Auto-redirect based on role
- JWT token storage (localStorage)
- Protected routes

### 2. Dashboard
**Widgets**:
- Total tickets by status
- SLA compliance gauge
- Ticket trends chart (7/14/30 days)
- Priority distribution pie chart
- Category performance
- Staff leaderboard
- Recent tickets list

**Features**:
- Chart zoom/fullscreen modal
- Time range selector
- Real-time data with React Query
- Vietnamese UI

### 3. Tickets Management
**List View**:
- Filter by status, priority, assignee, category, SLA
- Search by title/description
- Quick filters (My Tickets, Unassigned, SLA Breached, etc.)
- Pagination
- Due date column with overdue warning

**Detail View**:
- Full ticket information
- Comments section (public/internal)
- Attachments upload/download
- History timeline
- Action buttons based on role & status
- Due date display with SLA warning

**Create/Edit**:
- Form validation
- Category selection
- Priority selection
- Rich text description
- File attachments

### 4. Knowledge Base
- Article list with search
- Category filter
- View count & helpful votes
- Rich text content
- Tags

### 5. Chatbot
- AI-powered chat interface
- Context-aware responses
- Quick ticket creation
- Knowledge base integration

### 6. Reports
- Dashboard overview
- Exportable reports
- Date range filters
- Visual charts

### 7. User Management (Admin)
- User list with filters
- Create/Edit users
- Role assignment
- Department management
- Activate/Deactivate users

### 8. Escalation Rules (Admin)
- Create escalation rules
- Configure triggers
- Set targets (role/user/manager)
- Enable/Disable rules

### 9. Notifications
- Real-time notification bell
- Unread count badge
- Mark as read
- Click to navigate to ticket

---

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Guards: JwtAuthGuard, RolesGuard
- Password hashing with bcrypt
- Token expiration (7 days)

### Data Protection
- Input validation (class-validator)
- SQL injection prevention (Sequelize ORM)
- XSS protection
- CORS configuration
- File upload validation

### Audit Trail
- Ticket history tracking
- User action logging
- Soft delete for comments

---

## ⚙️ Business Logic

### 1. SLA Calculation
**Logic**:
```typescript
// Auto-calculate due date when creating ticket
dueDate = calculateDueDate(priority, createdAt, businessHours, holidays)

// Priority-based SLA:
// High: 4 hours
// Medium: 8 hours  
// Low: 24 hours

// Business hours: Mon-Fri 8AM-5PM
// Skips weekends and holidays
```

**Example**:
- Ticket created: Friday 5:00 PM
- Priority: High (4 hours)
- Due date: Monday 12:00 PM (skips weekend)

### 2. Ticket Status Flow
```
New → Assigned → In Progress → Resolved → Closed
         ↓            ↓
      Pending ←──────┘
         ↓
    Reopened (back to Assigned)
```

**Rules**:
- Only IT Staff/Admin can assign
- Only assignee can start progress
- Only assignee can resolve
- Only submitter/admin can close (after resolved)
- Only submitter/IT/admin can reopen

### 3. Escalation Logic
**Triggers**:
1. **SLA Breached**: Ticket past due date
2. **SLA At Risk**: Ticket within 2 hours of due date
3. **No Assignment**: Ticket unassigned for X hours
4. **No Response**: Ticket no updates for X hours

**Actions**:
- Escalate to higher level
- Reassign to target (role/user/manager)
- Send notifications
- Create escalation history

**Cron Job**: Runs every 15 minutes

### 4. Notification System
**Triggers**:
- Ticket assigned to you
- Ticket status changed
- New comment on your ticket
- Ticket escalated
- SLA breach warning

### 5. RAG Chatbot Flow
```
User Query
    ↓
Generate Embedding (Transformers.js)
    ↓
Search Knowledge Base (Cosine Similarity)
    ↓
Retrieve Top 3 Articles
    ↓
Build Context Prompt
    ↓
Send to LLM (OpenRouter)
    ↓
Return AI Response
```

---

## 📊 Key Metrics & KPIs

### Dashboard Metrics
1. **Total Tickets**: Count by status
2. **SLA Compliance**: % tickets resolved within SLA
3. **Avg Resolution Time**: Hours from created to resolved
4. **Ticket Trends**: Created/Resolved/Closed over time
5. **Category Performance**: Tickets by category
6. **Staff Performance**: Tickets resolved per staff
7. **Priority Distribution**: High/Medium/Low breakdown

### Action Required Badge
- **NEW Unassigned**: Tickets need assignment
- **Assigned to Me**: Tickets waiting for action
- **SLA Breached**: Overdue tickets
- **SLA At Risk**: Tickets near deadline

---

## 🚀 Deployment

### Environment Variables

**Backend (.env)**:
```env
NODE_ENV=production
PORT=3000

# Database
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASS=xxx
DB_NAME=postgres
DB_SSL=true

# JWT
JWT_SECRET=xxx
JWT_EXPIRES_IN=7d

# OpenRouter (Chatbot)
OPENROUTER_API_KEY=sk-or-v1-xxx
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Build & Run

**Backend**:
```bash
cd apps/backend
npm install
npm run build
npm run start:prod
```

**Frontend**:
```bash
cd apps/frontend
npm install
npm run build
npm start
```

### Database Setup
```bash
# Run migrations
cd apps/backend
npx sequelize-cli db:migrate

# Seed data
npm run seed
```

---

## 📁 Project Structure

```
ticket-management-system/
├── apps/
│   ├── backend/              # NestJS API
│   │   ├── src/
│   │   │   ├── modules/      # Feature modules
│   │   │   ├── common/       # Shared utilities
│   │   │   ├── database/     # Entities & config
│   │   │   └── config/       # App configuration
│   │   ├── migrations/       # DB migrations
│   │   └── uploads/          # File storage
│   │
│   └── frontend/             # Next.js App
│       ├── src/
│       │   ├── app/          # App Router pages
│       │   ├── components/   # React components
│       │   ├── lib/          # Utilities & hooks
│       │   └── styles/       # Global styles
│       └── public/           # Static assets
│
├── docs/                     # Documentation
├── .kiro/                    # Kiro AI config
└── README.md
```

---

## 🎓 Key Learnings & Best Practices

### 1. Database Design
- Use `underscored: true` for Sequelize with PostgreSQL
- Proper indexing on foreign keys and search fields
- Soft delete for audit trail

### 2. API Design
- RESTful conventions
- Consistent response format
- Proper HTTP status codes
- Input validation with DTOs

### 3. Frontend Architecture
- Server components for SEO
- Client components for interactivity
- React Query for data fetching & caching
- Zustand for global state

### 4. Security
- Never expose sensitive data
- Validate all inputs
- Use environment variables
- Implement RBAC properly

### 5. Performance
- Database query optimization
- React Query caching (staleTime: 30s)
- Lazy loading components
- Image optimization

---

## 📞 Support & Contact

**Project Repository**: https://github.com/Trinhvhao/ticket-management-system

**Default Login**:
- Email: `admin@28h.com`
- Password: `password123`

**Tech Stack Summary**:
- Backend: NestJS + PostgreSQL
- Frontend: Next.js 14 + TailwindCSS
- AI: Transformers.js + OpenRouter
- Deployment: Supabase (DB) + Vercel (Frontend)

---

## 📝 License

Proprietary - Công ty TNHH 28H

---

**Last Updated**: January 20, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
