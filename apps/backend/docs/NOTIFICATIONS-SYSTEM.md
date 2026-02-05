# Hệ Thống Thông Báo (Notifications System)

## Tổng Quan

Hệ thống thông báo web real-time cho phép người dùng nhận thông báo ngay lập tức về các sự kiện liên quan đến ticket mà họ tham gia.

## Kiến Trúc

### Backend Components

1. **NotificationsService** (`apps/backend/src/modules/notifications/notifications.service.ts`)
   - Quản lý logic nghiệp vụ thông báo
   - Tạo, đọc, cập nhật, xóa thông báo
   - Tích hợp với EmailService (tùy chọn)

2. **NotificationsGateway** (`apps/backend/src/common/gateways/notifications.gateway.ts`)
   - WebSocket Gateway sử dụng Socket.IO
   - Gửi thông báo real-time đến client
   - Quản lý kết nối user

3. **NotificationsController** (`apps/backend/src/modules/notifications/notifications.controller.ts`)
   - REST API endpoints cho thông báo
   - GET, PATCH, DELETE operations

### Frontend Components

1. **NotificationBell** (`apps/frontend/src/components/layout/NotificationBell.tsx`)
   - Component hiển thị icon chuông thông báo
   - Dropdown menu với danh sách thông báo
   - WebSocket client connection
   - Browser notifications

2. **NotificationsPage** (`apps/frontend/src/app/(dashboard)/notifications/page.tsx`)
   - Trang quản lý thông báo đầy đủ
   - Lọc, đánh dấu đã đọc, xóa thông báo

## Các Loại Thông Báo

### 1. TICKET_CREATED
**Khi nào:** Ticket mới được tạo
**Người nhận:** IT Staff và Admin
**Nội dung:** "New Ticket Created: Ticket #123: [Title]"

### 2. TICKET_ASSIGNED
**Khi nào:** Ticket được gán cho IT Staff
**Người nhận:** Người được gán
**Nội dung:** "Ticket #123: [Title] has been assigned to you by [Assigner Name]"

### 3. TICKET_UPDATED
**Khi nào:** Thông tin ticket thay đổi (priority, category, status, etc.)
**Người nhận:** Người tạo ticket và người được gán
**Nội dung:** "Ticket #123: [Title] has been updated by [Updater Name]"

### 4. TICKET_COMMENTED
**Khi nào:** Comment mới được thêm vào ticket
**Người nhận:** Người tạo ticket và người được gán (trừ người comment)
**Nội dung:** "[Commenter Name] commented on Ticket #123: [Title]"

### 5. TICKET_RESOLVED
**Khi nào:** Ticket được đánh dấu resolved
**Người nhận:** Người tạo ticket
**Nội dung:** "Your ticket #123: [Title] has been resolved by [Resolver Name]"

### 6. TICKET_CLOSED
**Khi nào:** Ticket được đóng
**Người nhận:** Người được gán (nếu có)
**Nội dung:** "Ticket #123: [Title] has been closed"

### 7. TICKET_ESCALATED
**Khi nào:** Ticket được escalate
**Người nhận:** Manager hoặc người được escalate đến
**Nội dung:** "Ticket #123: [Title] has been escalated"

### 8. SLA_WARNING
**Khi nào:** Ticket sắp vi phạm SLA (còn 2 giờ)
**Người nhận:** Người được gán và Manager
**Nội dung:** "SLA Warning: Ticket #123 will breach SLA in 2 hours"

### 9. SLA_BREACH
**Khi nào:** Ticket đã vi phạm SLA
**Người nhận:** Người được gán và Manager
**Nội dung:** "SLA Breach: Ticket #123 has breached SLA"

## API Endpoints

### GET /api/notifications
Lấy tất cả thông báo của user hiện tại
```typescript
Response: Notification[]
```

### GET /api/notifications/unread
Lấy thông báo chưa đọc
```typescript
Response: Notification[]
```

### GET /api/notifications/unread/count
Lấy số lượng thông báo chưa đọc
```typescript
Response: { count: number }
```

### PATCH /api/notifications/:id/read
Đánh dấu thông báo đã đọc
```typescript
Response: Notification
```

### PATCH /api/notifications/read-all
Đánh dấu tất cả thông báo đã đọc
```typescript
Response: { count: number }
```

### DELETE /api/notifications/:id
Xóa một thông báo
```typescript
Response: { message: string }
```

### DELETE /api/notifications
Xóa tất cả thông báo
```typescript
Response: { count: number }
```

## WebSocket Events

### Client → Server

#### connect
Kết nối WebSocket với userId
```typescript
socket.connect({
  query: { userId: '123' }
});
```

#### markAsRead
Đánh dấu thông báo đã đọc
```typescript
socket.emit('markAsRead', notificationId);
```

#### getUnreadCount
Lấy số lượng thông báo chưa đọc
```typescript
socket.emit('getUnreadCount');
```

### Server → Client

#### notification
Nhận thông báo mới
```typescript
socket.on('notification', (notification: Notification) => {
  // Handle new notification
});
```

#### unreadCount
Nhận cập nhật số lượng thông báo chưa đọc
```typescript
socket.on('unreadCount', (count: number) => {
  // Update unread count
});
```

## Cách Tích Hợp

### Backend - Gửi Thông Báo

```typescript
// Trong TicketsService
import { NotificationsService } from '../notifications/notifications.service';

constructor(
  private readonly notificationsService: NotificationsService,
) {}

async create(createTicketDto: CreateTicketDto, userId: number) {
  // ... create ticket logic
  
  // 🔔 Send notification
  await this.notificationsService.notifyTicketCreated(ticket.id);
  
  return ticket;
}
```

### Frontend - Nhận Thông Báo

```typescript
// Trong component
import { io } from 'socket.io-client';

useEffect(() => {
  const socket = io(`${backendUrl}/notifications`, {
    query: { userId: user.id.toString() }
  });

  socket.on('notification', (notification) => {
    console.log('New notification:', notification);
    // Update UI
  });

  return () => socket.disconnect();
}, [user]);
```

## Browser Notifications

Hệ thống hỗ trợ browser notifications nếu user cho phép:

```typescript
// Request permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Show notification
if (Notification.permission === 'granted') {
  new Notification(notification.title, {
    body: notification.message,
    icon: '/favicon.ico',
  });
}
```

## Database Schema

```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  ticket_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id)
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

## Performance Considerations

1. **Pagination**: API endpoints hỗ trợ limit để tránh load quá nhiều thông báo
2. **Indexing**: Database indexes trên user_id, is_read, created_at
3. **WebSocket Rooms**: Mỗi user có room riêng để gửi thông báo targeted
4. **Cleanup**: Nên có job định kỳ xóa thông báo cũ (> 30 ngày)

## Testing

### Test WebSocket Connection
```bash
# Sử dụng wscat
npm install -g wscat
wscat -c "ws://localhost:3001/notifications?userId=1"
```

### Test API Endpoints
```bash
# Get unread notifications
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/notifications/unread

# Mark as read
curl -X PATCH -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/notifications/1/read
```

## Troubleshooting

### WebSocket không kết nối
1. Kiểm tra CORS configuration trong main.ts
2. Kiểm tra firewall/proxy settings
3. Kiểm tra userId được truyền đúng

### Thông báo không hiển thị
1. Kiểm tra NotificationsGateway đã được import trong module
2. Kiểm tra user có quyền nhận thông báo
3. Kiểm tra console logs

### Browser notifications không hoạt động
1. Kiểm tra permission đã được granted
2. Kiểm tra HTTPS (required cho production)
3. Kiểm tra browser compatibility

## Future Enhancements

1. **Email Notifications**: Tích hợp gửi email cho thông báo quan trọng
2. **Push Notifications**: Mobile push notifications
3. **Notification Preferences**: User có thể tùy chỉnh loại thông báo nhận
4. **Notification Groups**: Nhóm thông báo theo ticket hoặc category
5. **Read Receipts**: Tracking khi nào user đã xem thông báo
6. **Notification Templates**: Template system cho custom messages
