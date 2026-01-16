# Notifications Module

Module quản lý thông báo và gửi email cho người dùng trong hệ thống.

## Tính năng

### 1. Thông báo trong hệ thống
- Tạo thông báo cho người dùng
- Xem danh sách thông báo
- Đánh dấu đã đọc/chưa đọc
- Xóa thông báo
- Đếm số thông báo chưa đọc

### 2. Email Notifications
- Gửi email tự động khi có sự kiện
- Hỗ trợ SMTP configuration
- Template email cho từng loại thông báo
- Có thể bật/tắt email notifications

## Loại thông báo

- `TICKET_CREATED`: Ticket mới được tạo
- `TICKET_ASSIGNED`: Ticket được phân công
- `TICKET_UPDATED`: Ticket được cập nhật
- `TICKET_COMMENTED`: Có comment mới trên ticket
- `TICKET_RESOLVED`: Ticket được giải quyết
- `TICKET_CLOSED`: Ticket được đóng
- `SLA_WARNING`: Cảnh báo SLA sắp hết hạn
- `SLA_BREACH`: SLA đã bị vi phạm

## API Endpoints

### GET /api/v1/notifications
Lấy tất cả thông báo của user hiện tại

**Response:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "type": "ticket_assigned",
    "title": "Ticket Assigned to You",
    "message": "Ticket #5: Laptop not working has been assigned to you by John Doe",
    "ticketId": 5,
    "isRead": false,
    "readAt": null,
    "createdAt": "2024-12-30T10:00:00Z",
    "ticket": {
      "id": 5,
      "title": "Laptop not working",
      "status": "assigned"
    }
  }
]
```

### GET /api/v1/notifications/unread
Lấy thông báo chưa đọc

### GET /api/v1/notifications/unread/count
Đếm số thông báo chưa đọc

**Response:**
```json
{
  "count": 5
}
```

### PATCH /api/v1/notifications/:id/read
Đánh dấu thông báo đã đọc

### PATCH /api/v1/notifications/read-all
Đánh dấu tất cả thông báo đã đọc

### DELETE /api/v1/notifications/:id
Xóa một thông báo

### DELETE /api/v1/notifications
Xóa tất cả thông báo

## Email Configuration

Cấu hình trong file `.env`:

```env
# Email Configuration
EMAIL_ENABLED=true                    # Bật/tắt email notifications
SMTP_HOST=smtp.gmail.com              # SMTP server
SMTP_PORT=587                         # SMTP port
SMTP_SECURE=false                     # Use TLS
SMTP_USER=your-email@gmail.com        # SMTP username
SMTP_PASS=your-app-password           # SMTP password (App Password for Gmail)
EMAIL_FROM=noreply@28h.com            # From email address
```

### Gmail Setup

Để sử dụng Gmail:
1. Bật 2-Factor Authentication
2. Tạo App Password tại: https://myaccount.google.com/apppasswords
3. Sử dụng App Password trong `SMTP_PASS`

### Disable Email (Development)

Trong môi trường development, có thể tắt email:
```env
EMAIL_ENABLED=false
```

Thông báo vẫn được lưu trong database nhưng không gửi email.

## Sử dụng trong Code

### Inject NotificationsService

```typescript
import { NotificationsService } from '../notifications/notifications.service';

constructor(
  private notificationsService: NotificationsService,
) {}
```

### Tạo thông báo thủ công

```typescript
await this.notificationsService.create({
  userId: 123,
  type: NotificationType.TICKET_CREATED,
  title: 'New Ticket',
  message: 'A new ticket has been created',
  ticketId: 456,
});
```

### Sử dụng helper methods

```typescript
// Thông báo ticket được tạo
await this.notificationsService.notifyTicketCreated(ticketId);

// Thông báo ticket được phân công
await this.notificationsService.notifyTicketAssigned(
  ticketId,
  assigneeId,
  assignedByUser
);

// Thông báo ticket được cập nhật
await this.notificationsService.notifyTicketUpdated(ticketId, updatedByUser);

// Thông báo có comment mới
await this.notificationsService.notifyTicketCommented(
  ticketId,
  commentedByUser,
  commentContent
);

// Thông báo ticket được giải quyết
await this.notificationsService.notifyTicketResolved(ticketId, resolvedByUser);

// Thông báo ticket được đóng
await this.notificationsService.notifyTicketClosed(ticketId);
```

## Email Templates

Email service có sẵn các template:

- `sendTicketCreatedEmail()` - Ticket mới
- `sendTicketAssignedEmail()` - Phân công ticket
- `sendTicketUpdatedEmail()` - Cập nhật ticket
- `sendTicketCommentedEmail()` - Comment mới
- `sendTicketResolvedEmail()` - Ticket đã giải quyết
- `sendTicketClosedEmail()` - Ticket đã đóng
- `sendSLAWarningEmail()` - Cảnh báo SLA

## Tích hợp với Tickets Module

Để tự động gửi thông báo khi có sự kiện ticket:

1. Import NotificationsModule vào TicketsModule
2. Inject NotificationsService vào TicketsService
3. Gọi notification methods trong các ticket operations

**Ví dụ:**

```typescript
// In tickets.service.ts
async create(createTicketDto: CreateTicketDto, userId: number): Promise<Ticket> {
  const ticket = await this.ticketModel.create({...});
  
  // Send notification
  await this.notificationsService.notifyTicketCreated(ticket.id);
  
  return ticket;
}

async assign(id: number, assignTicketDto: AssignTicketDto, currentUser: User): Promise<Ticket> {
  const ticket = await this.ticketModel.findByPk(id);
  ticket.assign(assignTicketDto.assigneeId);
  await ticket.save();
  
  // Send notification
  await this.notificationsService.notifyTicketAssigned(
    ticket.id,
    assignTicketDto.assigneeId,
    currentUser
  );
  
  return ticket;
}
```

## Database Schema

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    ticket_id INTEGER,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);
```

## Testing

Test notifications API:

```powershell
# Login
$body = @{email='user@example.com';password='password'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/auth/login' -Method POST -Body $body -ContentType 'application/json'
$token = ($response.Content | ConvertFrom-Json).data.accessToken
$headers = @{Authorization="Bearer $token"}

# Get all notifications
Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/notifications' -Headers $headers | Select-Object -ExpandProperty Content

# Get unread count
Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/notifications/unread/count' -Headers $headers | Select-Object -ExpandProperty Content

# Mark as read
Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/notifications/1/read' -Method PATCH -Headers $headers | Select-Object -ExpandProperty Content

# Mark all as read
Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/notifications/read-all' -Method PATCH -Headers $headers | Select-Object -ExpandProperty Content
```

## Notes

- Thông báo được tự động gửi đến người liên quan (submitter, assignee, IT staff)
- Email chỉ gửi khi `EMAIL_ENABLED=true`
- Thông báo luôn được lưu trong database dù email có được gửi hay không
- Frontend có thể poll endpoint `/notifications/unread/count` để cập nhật badge
- Có thể tích hợp WebSocket để push real-time notifications (future enhancement)
