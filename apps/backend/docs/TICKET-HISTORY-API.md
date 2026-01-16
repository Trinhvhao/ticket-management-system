# Ticket History API Documentation

## Overview

Module quản lý lịch sử thay đổi của tickets (Audit Trail). Tự động tracking tất cả thay đổi quan trọng theo chuẩn ITIL/ITSM.

## Base URL

```
/api/ticket-history
```

## Authentication

Tất cả endpoints yêu cầu JWT authentication token trong header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Get Ticket History

Lấy lịch sử thay đổi của một ticket cụ thể.

**Endpoint:** `GET /ticket-history/ticket/:ticketId`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ticketId | Integer | Yes | ID của ticket |

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "ticketId": 123,
    "userId": 5,
    "action": "created",
    "actionLabel": "Ticket created",
    "fieldName": null,
    "oldValue": null,
    "newValue": null,
    "description": "Ticket created",
    "changeDescription": "Ticket created",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "user": {
      "id": 5,
      "fullName": "John Doe",
      "email": "john@28h.com",
      "role": "Employee"
    }
  },
  {
    "id": 2,
    "ticketId": 123,
    "userId": 10,
    "action": "assigned",
    "actionLabel": "Ticket assigned",
    "fieldName": "assignee",
    "oldValue": "Unassigned",
    "newValue": "10",
    "description": "Ticket assigned to staff member",
    "changeDescription": "assignee changed from \"Unassigned\" to \"10\"",
    "createdAt": "2024-01-01T10:05:00.000Z",
    "user": {
      "id": 10,
      "fullName": "IT Staff",
      "email": "it.staff@28h.com",
      "role": "IT_Staff"
    }
  },
  {
    "id": 3,
    "ticketId": 123,
    "userId": 10,
    "action": "status_changed",
    "actionLabel": "Status changed",
    "fieldName": "status",
    "oldValue": "New",
    "newValue": "In Progress",
    "description": "Status changed from New to In Progress",
    "changeDescription": "status changed from \"New\" to \"In Progress\"",
    "createdAt": "2024-01-01T10:10:00.000Z",
    "user": {
      "id": 10,
      "fullName": "IT Staff",
      "email": "it.staff@28h.com",
      "role": "IT_Staff"
    }
  }
]
```

**Example:**

```bash
curl -X GET http://localhost:3000/api/ticket-history/ticket/123 \
  -H "Authorization: Bearer <token>"
```

---

### 2. Get All History (Admin/IT Staff Only)

Lấy tất cả lịch sử thay đổi trong hệ thống (system-wide audit log).

**Endpoint:** `GET /ticket-history`

**Authorization:** Admin or IT_Staff only

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | Integer | No | 100 | Số lượng records trả về |
| offset | Integer | No | 0 | Offset cho pagination |

**Response:** `200 OK`

```json
[
  {
    "id": 150,
    "ticketId": 456,
    "userId": 8,
    "action": "resolved",
    "actionLabel": "Ticket resolved",
    "fieldName": null,
    "oldValue": null,
    "newValue": null,
    "description": "Ticket marked as resolved",
    "changeDescription": "Ticket marked as resolved",
    "createdAt": "2024-01-02T14:30:00.000Z",
    "user": {
      "id": 8,
      "fullName": "IT Staff 2",
      "email": "it.staff2@28h.com",
      "role": "IT_Staff"
    }
  }
]
```

**Example:**

```bash
# Get first 50 records
curl -X GET "http://localhost:3000/api/ticket-history?limit=50&offset=0" \
  -H "Authorization: Bearer <token>"

# Get next 50 records
curl -X GET "http://localhost:3000/api/ticket-history?limit=50&offset=50" \
  -H "Authorization: Bearer <token>"
```

---

## Action Types

Các loại actions được tự động log:

| Action | Description | When Triggered |
|--------|-------------|----------------|
| `created` | Ticket created | Khi ticket được tạo mới |
| `updated` | Ticket updated | Khi ticket được cập nhật (general) |
| `assigned` | Ticket assigned | Khi ticket được assign cho IT staff |
| `status_changed` | Status changed | Khi status thay đổi |
| `priority_changed` | Priority changed | Khi priority thay đổi |
| `category_changed` | Category changed | Khi category thay đổi |
| `comment_added` | Comment added | Khi có comment mới |
| `attachment_added` | Attachment added | Khi có file attachment mới |
| `resolved` | Ticket resolved | Khi ticket được resolve |
| `closed` | Ticket closed | Khi ticket được close |
| `reopened` | Ticket reopened | Khi ticket được reopen |

---

## Auto-Logging

Module tự động log các thay đổi quan trọng:

### Ticket Creation
```typescript
// Automatically logged when ticket is created
await ticketHistoryService.logTicketCreated(ticketId, userId);
```

### Status Changes
```typescript
// Automatically logged when status changes
await ticketHistoryService.logStatusChange(
  ticketId,
  userId,
  'New',
  'In Progress'
);
```

### Priority Changes
```typescript
// Automatically logged when priority changes
await ticketHistoryService.logPriorityChange(
  ticketId,
  userId,
  'Low',
  'High'
);
```

### Assignment
```typescript
// Automatically logged when ticket is assigned
await ticketHistoryService.logAssignment(
  ticketId,
  userId,
  oldAssigneeId,
  newAssigneeId
);
```

### Comments
```typescript
// Automatically logged when comment is added
await ticketHistoryService.logCommentAdded(ticketId, userId);
```

### Attachments
```typescript
// Automatically logged when file is uploaded
await ticketHistoryService.logAttachmentAdded(
  ticketId,
  userId,
  'screenshot.png'
);
```

---

## Access Control

### Ticket History (GET /ticket-history/ticket/:id)
- **Employee**: Có thể xem history của tickets mình tạo
- **IT_Staff**: Có thể xem history của tickets được assign
- **Admin**: Có thể xem tất cả

### System-wide History (GET /ticket-history)
- **Employee**: ❌ Không có quyền
- **IT_Staff**: ✅ Có quyền
- **Admin**: ✅ Có quyền

---

## Use Cases

### 1. Audit Trail
Tracking tất cả thay đổi cho compliance và troubleshooting:
```bash
GET /ticket-history/ticket/123
```

### 2. Ticket Timeline
Hiển thị timeline của ticket cho user:
```javascript
const history = await fetch('/api/ticket-history/ticket/123');
// Display as timeline in UI
```

### 3. System Audit
Admin xem tất cả activities trong hệ thống:
```bash
GET /ticket-history?limit=100&offset=0
```

### 4. Performance Analysis
Phân tích thời gian xử lý tickets:
```sql
-- Tính average time từ created đến resolved
SELECT AVG(resolved_time - created_time) 
FROM ticket_history 
WHERE action IN ('created', 'resolved');
```

---

## ITIL/ITSM Compliance

Module này đáp ứng các yêu cầu ITIL/ITSM:

✅ **Change Management**: Track tất cả thay đổi  
✅ **Audit Trail**: Full history cho compliance  
✅ **Accountability**: Biết ai làm gì, khi nào  
✅ **Troubleshooting**: Dễ dàng trace lại vấn đề  
✅ **Reporting**: Data cho performance reports  

---

## Database Schema

```sql
CREATE TABLE ticket_history (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL,
    field_name VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_ticket_history_ticket ON ticket_history(ticket_id);
CREATE INDEX idx_ticket_history_user ON ticket_history(user_id);
CREATE INDEX idx_ticket_history_action ON ticket_history(action);
CREATE INDEX idx_ticket_history_created_at ON ticket_history(created_at);
```

---

## Integration Example

### Frontend (React)

```javascript
const TicketTimeline = ({ ticketId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`/api/ticket-history/ticket/${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setHistory(data));
  }, [ticketId]);

  return (
    <div className="timeline">
      {history.map(entry => (
        <div key={entry.id} className="timeline-entry">
          <div className="timestamp">{entry.createdAt}</div>
          <div className="user">{entry.user.fullName}</div>
          <div className="action">{entry.changeDescription}</div>
        </div>
      ))}
    </div>
  );
};
```

---

## Testing

Run test script:

```bash
.\test-ticket-history-module.ps1
```

Manual testing với Postman hoặc cURL theo examples trên.
