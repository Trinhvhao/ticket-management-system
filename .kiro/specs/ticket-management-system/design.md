# Design Document - Hệ thống Quản lý Ticket

## Overview

Hệ thống quản lý Ticket được thiết kế theo kiến trúc 3-tier với web-based interface, tích hợp chatbot AI và tuân thủ các tiêu chuẩn ITIL/ITSM. Hệ thống hỗ trợ quy trình từ tiếp nhận yêu cầu đến giải quyết và đánh giá, với khả năng tự động hóa thông minh và báo cáo chi tiết.

## Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Application   │    │      Data       │
│     Layer       │    │     Layer       │    │     Layer       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Web Portal    │    │ • Ticket Engine │    │ • MySQL DB      │
│ • Dashboard     │◄──►│ • Chatbot API   │◄──►│ • Knowledge Base│
│ • Mobile View   │    │ • SLA Manager   │    │ • File Storage  │
│ • REST APIs     │    │ • Notification  │    │ • Audit Logs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Frontend**: React.js, CSS3, Material-UI/Ant Design, Axios
- **Backend**: NestJS framework với TypeScript
- **Database**: MySQL 8.0+ với Sequelize ORM
- **Chatbot**: Natural Language Processing với rule-based responses
- **File Storage**: Multer cho local storage hoặc AWS S3
- **Notification**: Email SMTP, Socket.io cho real-time updates

## Components and Interfaces

### 1. User Management Component
**Chức năng**: Quản lý authentication, authorization và user profiles

**Interfaces**:
- `UserService`: Xử lý đăng nhập, phân quyền
- `RoleManager`: Quản lý vai trò (Employee, IT_Staff, Admin)
- `ProfileManager`: Quản lý thông tin cá nhân

**Key Methods**:
```typescript
// UserService với NestJS
@Injectable()
export class UserService {
  async authenticate(username: string, password: string): Promise<User> { /* returns User */ }
  async authorize(user: User, resource: string): Promise<boolean> { /* returns boolean */ }
  async getUsersByRole(role: string): Promise<User[]> { /* returns User[] */ }
}
```

### 2. Ticket Management Component
**Chức năng**: Core business logic cho việc tạo, cập nhật và theo dõi tickets

**Interfaces**:
- `TicketService`: CRUD operations cho tickets
- `CategoryManager`: Quản lý phân loại ticket
- `PriorityManager`: Xử lý mức độ ưu tiên
- `StatusManager`: Quản lý trạng thái ticket

**Ticket Lifecycle States**:
```
New → Assigned → In Progress → Pending → Resolved → Closed
                     ↓
                 Escalated
```

**Key Methods**:
```typescript
// TicketService với NestJS
@Injectable()
export class TicketService {
  async createTicket(ticketData: CreateTicketDto): Promise<Ticket> { /* returns Ticket */ }
  async assignTicket(ticketId: number, staffId: number): Promise<boolean> { /* returns boolean */ }
  async updateStatus(ticketId: number, status: TicketStatus): Promise<boolean> { /* returns boolean */ }
  async escalateTicket(ticketId: number, reason: string): Promise<boolean> { /* returns boolean */ }
}
```

### 3. SLA Management Component
**Chức năng**: Quản lý cam kết thời gian xử lý và cảnh báo

**SLA Rules**:
- **High Priority**: Response 1h, Resolution 4h
- **Medium Priority**: Response 4h, Resolution 24h  
- **Low Priority**: Response 8h, Resolution 72h

**Interfaces**:
- `SLACalculator`: Tính toán thời gian SLA
- `EscalationManager`: Xử lý leo thang tự động
- `NotificationService`: Gửi cảnh báo SLA

### 4. Chatbot Component
**Chức năng**: Hỗ trợ tự động và tạo ticket từ conversation

**Architecture**:
```
User Input → Intent Recognition → Knowledge Base Search → Response Generation
                    ↓
            Auto Ticket Creation (if unresolved)
```

**Interfaces**:
- `ChatbotEngine`: Xử lý conversation logic
- `IntentClassifier`: Phân loại ý định người dùng
- `KnowledgeSearcher`: Tìm kiếm trong knowledge base
- `TicketGenerator`: Tự động tạo ticket từ chat

### 5. Knowledge Base Component
**Chức năng**: Lưu trữ và tìm kiếm giải pháp đã biết

**Interfaces**:
- `KnowledgeService`: CRUD cho knowledge articles
- `SearchEngine`: Full-text search trong knowledge base
- `SolutionMatcher`: Gợi ý giải pháp tương tự

### 6. Reporting & Analytics Component
**Chức năng**: Tạo báo cáo và thống kê hiệu suất

**Key Metrics**:
- Ticket volume by category/time
- SLA compliance rate
- Average resolution time
- Customer satisfaction scores
- IT staff performance

**Interfaces**:
- `ReportGenerator`: Tạo các loại báo cáo
- `MetricsCalculator`: Tính toán KPIs
- `DashboardService`: Cung cấp dữ liệu cho dashboard

## Data Models

### Core Entities

#### Ticket Entity (Sequelize với NestJS)
```typescript
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.entity';
import { Category } from './category.entity';

@Table({
  tableName: 'tickets',
  timestamps: true
})
export class Ticket extends Model<Ticket> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.TEXT
  })
  description: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER
  })
  categoryId: number;

  @Column({
    type: DataType.ENUM('Low', 'Medium', 'High')
  })
  priority: string;

  @Column({
    type: DataType.ENUM('New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed')
  })
  status: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER
  })
  submitterId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER
  })
  assigneeId: number;

  @Column({
    type: DataType.DATE
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE
  })
  resolvedAt: Date;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  })
  satisfactionRating: number;

  // Relations
  @BelongsTo(() => User, 'submitterId')
  submitter: User;

  @BelongsTo(() => User, 'assigneeId')
  assignee: User;

  @BelongsTo(() => Category)
  category: Category;
}
```

#### User Entity (Sequelize với NestJS)
```typescript
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Ticket } from './ticket.entity';

@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING(50),
    unique: true,
    allowNull: false
  })
  username: string;

  @Column({
    type: DataType.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  password: string;

  @Column({
    type: DataType.STRING(100)
  })
  fullName: string;

  @Column({
    type: DataType.ENUM('Employee', 'IT_Staff', 'Admin')
  })
  role: string;

  @Column({
    type: DataType.STRING(50)
  })
  department: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive: boolean;

  // Relations
  @HasMany(() => Ticket, 'submitterId')
  submittedTickets: Ticket[];

  @HasMany(() => Ticket, 'assigneeId')
  assignedTickets: Ticket[];
}
```

#### Knowledge Base Entity (Sequelize với NestJS)
```typescript
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.entity';
import { Category } from './category.entity';

@Table({
  tableName: 'knowledge_articles',
  timestamps: true
})
export class KnowledgeArticle extends Model<KnowledgeArticle> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.TEXT
  })
  content: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER
  })
  categoryId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER
  })
  authorId: number;

  @Column({
    type: DataType.STRING(500)
  })
  tags: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  viewCount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  helpfulVotes: number;

  // Relations
  @BelongsTo(() => User)
  author: User;

  @BelongsTo(() => Category)
  category: Category;
}
```

### Relationships
- One User can have Many Tickets (as submitter)
- One IT_Staff can be assigned to Many Tickets
- One Ticket belongs to One Category
- One Ticket can have Many Comments/Updates
- One Knowledge Article can relate to Many Tickets

## Error Handling

### Error Categories
1. **Validation Errors**: Invalid input data
2. **Authentication Errors**: Login failures, unauthorized access
3. **Business Logic Errors**: SLA violations, invalid state transitions
4. **System Errors**: Database connection, file upload failures

### Error Response Format
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Ticket title is required",
        "details": {
            "field": "title",
            "value": ""
        }
    },
    "timestamp": "2025-12-23T10:30:00Z"
}
```

### Logging Strategy
- **Application Logs**: Business logic events, user actions
- **Error Logs**: Exceptions, system failures
- **Audit Logs**: Security events, data changes
- **Performance Logs**: Response times, database queries

## Testing Strategy

### Unit Testing
- **Coverage Target**: 80% code coverage
- **Focus Areas**: Business logic, data validation, calculations
- **Tools**: Jest cho NestJS backend, React Testing Library cho frontend

### Integration Testing
- **API Testing**: REST endpoint functionality
- **Database Testing**: Data integrity, transactions
- **Third-party Integration**: Email service, file storage

### User Acceptance Testing
- **Role-based Testing**: Test scenarios for each user role
- **Workflow Testing**: End-to-end ticket lifecycle
- **Performance Testing**: Load testing với concurrent users

### Test Data Management
- **Test Database**: Separate database cho testing
- **Mock Data**: Automated test data generation
- **Cleanup**: Automatic test data cleanup after tests

## Security Considerations

### Authentication & Authorization
- **Session Management**: Secure session handling
- **Password Policy**: Strong password requirements
- **Role-based Access**: Strict permission controls

### Data Protection
- **Input Validation**: Prevent SQL injection, XSS
- **File Upload Security**: Virus scanning, file type validation
- **Data Encryption**: Sensitive data encryption at rest

### Audit & Compliance
- **Activity Logging**: All user actions logged
- **Data Retention**: Configurable data retention policies
- **Backup Strategy**: Regular automated backups

## Performance Optimization

### Database Optimization
- **Indexing**: Proper indexes on frequently queried columns
- **Query Optimization**: Efficient SQL queries
- **Connection Pooling**: Database connection management

### Caching Strategy
- **Application Cache**: Frequently accessed data
- **Session Cache**: User session data
- **Query Cache**: Database query results

### Scalability Considerations
- **Horizontal Scaling**: Load balancer support
- **Database Sharding**: For large datasets
- **CDN Integration**: Static asset delivery