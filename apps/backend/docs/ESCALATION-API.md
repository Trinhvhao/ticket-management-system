# Escalation Management API Documentation

## Overview

Auto-escalation system để đảm bảo không có ticket nào bị bỏ sót. Tự động leo thang tickets dựa trên SLA status, thời gian không phản hồi, hoặc không được assign.

**Base URL:** `/escalation`

---

## Features

- ✅ Escalation rules management (CRUD)
- ✅ Auto-escalation based on triggers
- ✅ Escalation history tracking
- ✅ Manual escalation
- ✅ Workload-based assignment
- ✅ Notification chain
- ✅ Cron job auto-check (every 15 minutes)

---

## Escalation Rules

### 1. Create Escalation Rule

**Endpoint:** `POST /escalation/rules`  
**Auth:** Admin only  
**Description:** Tạo escalation rule mới

**Request Body:**
```json
{
  "name": "High Priority SLA Breach",
  "description": "Escalate high priority tickets when SLA is breached",
  "priority": "High",
  "categoryId": null,
  "triggerType": "sla_breached",
  "triggerHours": null,
  "escalationLevel": 2,
  "targetType": "role",
  "targetRole": "Admin",
  "targetUserId": null,
  "notifyManager": true,
  "isActive": true
}
```

**Trigger Types:**
- `sla_at_risk` - SLA đang at risk (80% time used)
- `sla_breached` - SLA đã breach
- `no_assignment` - Ticket chưa được assign sau X giờ
- `no_response` - Ticket không có response sau X giờ

**Target Types:**
- `role` - Escalate to role (IT_Staff, Admin)
- `user` - Escalate to specific user
- `manager` - Escalate to manager (Admin)

**Response:**
```json
{
  "id": 1,
  "name": "High Priority SLA Breach",
  "description": "Escalate high priority tickets when SLA is breached",
  "priority": "High",
  "categoryId": null,
  "triggerType": "sla_breached",
  "triggerHours": null,
  "escalationLevel": 2,
  "targetType": "role",
  "targetRole": "Admin",
  "targetUserId": null,
  "notifyManager": true,
  "isActive": true,
  "createdAt": "2026-01-16T10:00:00.000Z",
  "updatedAt": "2026-01-16T10:00:00.000Z"
}
```

---

### 2. Get All Escalation Rules

**Endpoint:** `GET /escalation/rules`  
**Auth:** Admin, IT_Staff  
**Description:** Lấy danh sách escalation rules

**Query Parameters:**
- `isActive` (boolean, optional) - Filter by active status
- `priority` (string, optional) - Filter by priority (Low/Medium/High)
- `categoryId` (number, optional) - Filter by category

**Example:**
```
GET /escalation/rules?isActive=true&priority=High
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "High Priority SLA Breach",
    "description": "Escalate high priority tickets when SLA is breached",
    "priority": "High",
    "categoryId": null,
    "triggerType": "sla_breached",
    "escalationLevel": 2,
    "targetType": "role",
    "targetRole": "Admin",
    "isActive": true,
    "createdAt": "2026-01-16T10:00:00.000Z",
    "updatedAt": "2026-01-16T10:00:00.000Z",
    "category": null
  }
]
```

---

### 3. Get Escalation Rule by ID

**Endpoint:** `GET /escalation/rules/:id`  
**Auth:** Admin, IT_Staff  
**Description:** Lấy chi tiết escalation rule

**Response:**
```json
{
  "id": 1,
  "name": "High Priority SLA Breach",
  "description": "Escalate high priority tickets when SLA is breached",
  "priority": "High",
  "categoryId": null,
  "triggerType": "sla_breached",
  "escalationLevel": 2,
  "targetType": "role",
  "targetRole": "Admin",
  "notifyManager": true,
  "isActive": true,
  "createdAt": "2026-01-16T10:00:00.000Z",
  "updatedAt": "2026-01-16T10:00:00.000Z",
  "category": null
}
```

---

### 4. Update Escalation Rule

**Endpoint:** `PUT /escalation/rules/:id`  
**Auth:** Admin only  
**Description:** Cập nhật escalation rule

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Rule Name",
  "isActive": false,
  "escalationLevel": 3
}
```

**Response:** Updated rule object

---

### 5. Delete Escalation Rule

**Endpoint:** `DELETE /escalation/rules/:id`  
**Auth:** Admin only  
**Description:** Xóa escalation rule

**Response:**
```json
{
  "message": "Escalation rule deleted successfully"
}
```

---

## Escalation History

### 6. Get Ticket Escalation History

**Endpoint:** `GET /escalation/history/ticket/:ticketId`  
**Auth:** All authenticated users  
**Description:** Lấy lịch sử escalation của ticket

**Response:**
```json
[
  {
    "id": 1,
    "ticketId": 123,
    "ruleId": 1,
    "fromLevel": 1,
    "toLevel": 2,
    "escalatedBy": "system",
    "escalatedToUserId": 5,
    "escalatedToRole": "Admin",
    "reason": "SLA breached for High priority ticket",
    "createdAt": "2026-01-16T10:30:00.000Z",
    "rule": {
      "id": 1,
      "name": "High Priority SLA Breach"
    },
    "escalatedToUser": {
      "id": 5,
      "fullName": "Admin User",
      "email": "admin@28h.com"
    }
  }
]
```

---

### 7. Get All Escalation History

**Endpoint:** `GET /escalation/history`  
**Auth:** Admin, IT_Staff  
**Description:** Lấy toàn bộ lịch sử escalation

**Query Parameters:**
- `ticketId` (number, optional) - Filter by ticket
- `startDate` (ISO date, optional) - Filter from date
- `endDate` (ISO date, optional) - Filter to date

**Example:**
```
GET /escalation/history?startDate=2026-01-01&endDate=2026-01-31
```

**Response:**
```json
[
  {
    "id": 1,
    "ticketId": 123,
    "ruleId": 1,
    "fromLevel": 1,
    "toLevel": 2,
    "escalatedBy": "system",
    "escalatedToUserId": 5,
    "escalatedToRole": "Admin",
    "reason": "SLA breached for High priority ticket",
    "createdAt": "2026-01-16T10:30:00.000Z",
    "ticket": {
      "id": 123,
      "ticketNumber": "TKT-2026-0123",
      "title": "Server down"
    },
    "rule": {
      "id": 1,
      "name": "High Priority SLA Breach"
    },
    "escalatedToUser": {
      "id": 5,
      "fullName": "Admin User",
      "email": "admin@28h.com"
    }
  }
]
```

---

## Manual Escalation

### 8. Escalate Ticket Manually

**Endpoint:** `POST /escalation/tickets/:ticketId/escalate`  
**Auth:** Admin, IT_Staff  
**Description:** Escalate ticket manually theo rule

**Request Body:**
```json
{
  "ruleId": 1
}
```

**Response:**
```json
{
  "id": 2,
  "ticketId": 123,
  "ruleId": 1,
  "fromLevel": 1,
  "toLevel": 2,
  "escalatedBy": "5",
  "escalatedToUserId": 6,
  "escalatedToRole": "Admin",
  "reason": "SLA breached for High priority ticket",
  "createdAt": "2026-01-16T11:00:00.000Z"
}
```

---

### 9. Trigger Manual Check

**Endpoint:** `POST /escalation/check-now`  
**Auth:** Admin only  
**Description:** Trigger manual escalation check (không cần đợi cron)

**Response:**
```json
{
  "message": "Escalation check triggered successfully"
}
```

---

## Auto-Escalation Logic

### Cron Schedule
- **Frequency:** Every 15 minutes
- **Checks:**
  1. SLA breached tickets
  2. SLA at-risk tickets
  3. Unassigned tickets (> trigger hours)
  4. No response tickets (> trigger hours)

### Escalation Flow

```
1. Cron job runs every 15 minutes
2. For each active escalation rule:
   a. Find matching tickets
   b. Check if rule applies (priority, category)
   c. Check if not escalated recently (last 1 hour)
   d. Escalate ticket
   e. Reassign to target user/role
   f. Send notifications
   g. Log escalation history
```

### Workload-Based Assignment

Khi escalate to role, system tự động chọn user với:
- Least current workload (số ticket đang xử lý)
- Active status
- Matching role

---

## Default Escalation Rules

System tạo sẵn 4 rules:

1. **High Priority SLA Breach**
   - Trigger: SLA breached
   - Priority: High
   - Target: Admin role
   - Level: 2

2. **High Priority At Risk**
   - Trigger: SLA at risk
   - Priority: High
   - Target: IT_Staff role
   - Level: 1

3. **No Assignment After 2 Hours**
   - Trigger: No assignment
   - Hours: 2
   - Target: Admin role
   - Level: 1

4. **No Response After 4 Hours**
   - Trigger: No response
   - Hours: 4
   - Target: Admin role
   - Level: 1

---

## Notifications

Khi ticket được escalate, notifications được gửi đến:

1. **Escalated User** - User được assign ticket
2. **Manager** (if notifyManager = true) - All Admins
3. **Original Assignee** - User đang hold ticket

**Notification Type:** `ticket_escalated`

---

## Error Responses

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Escalation rule with ID 999 not found",
  "error": "Not Found"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["triggerType must be a valid enum value"],
  "error": "Bad Request"
}
```

---

## Usage Examples

### Example 1: Create Rule for Unassigned Tickets

```bash
curl -X POST http://localhost:3000/escalation/rules \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unassigned After 1 Hour",
    "description": "Auto-assign unassigned tickets after 1 hour",
    "triggerType": "no_assignment",
    "triggerHours": 1,
    "escalationLevel": 1,
    "targetType": "role",
    "targetRole": "IT_Staff",
    "notifyManager": true,
    "isActive": true
  }'
```

### Example 2: Get Active Rules

```bash
curl -X GET "http://localhost:3000/escalation/rules?isActive=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 3: Manual Escalation

```bash
curl -X POST http://localhost:3000/escalation/tickets/123/escalate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ruleId": 1}'
```

### Example 4: View Escalation History

```bash
curl -X GET http://localhost:3000/escalation/history/ticket/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Best Practices

1. **Start with default rules** - Test với 4 rules mặc định trước
2. **Monitor escalation frequency** - Adjust trigger hours nếu quá nhiều escalations
3. **Use priority-specific rules** - High priority cần escalate nhanh hơn
4. **Enable manager notifications** - Đảm bảo managers được thông báo
5. **Review escalation history** - Phân tích để optimize rules

---

## Integration with Other Modules

### SLA Module
- Checks SLA status (at-risk, breached)
- Uses SLA due dates for escalation

### Notifications Module
- Sends escalation notifications
- Notifies all stakeholders

### Tickets Module
- Reassigns tickets to escalated users
- Updates ticket status if needed

### Users Module
- Finds available users by role
- Checks workload for assignment

---

## Database Schema

### escalation_rules
```sql
CREATE TABLE escalation_rules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  priority ENUM('Low', 'Medium', 'High'),
  category_id INT REFERENCES categories(id),
  trigger_type ENUM('sla_at_risk', 'sla_breached', 'no_response', 'no_assignment'),
  trigger_hours INT,
  escalation_level INT DEFAULT 1,
  target_type ENUM('role', 'user', 'manager'),
  target_role VARCHAR(50),
  target_user_id INT REFERENCES users(id),
  notify_manager BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### escalation_history
```sql
CREATE TABLE escalation_history (
  id SERIAL PRIMARY KEY,
  ticket_id INT REFERENCES tickets(id),
  rule_id INT REFERENCES escalation_rules(id),
  from_level INT DEFAULT 1,
  to_level INT NOT NULL,
  escalated_by VARCHAR(50),
  escalated_to_user_id INT REFERENCES users(id),
  escalated_to_role VARCHAR(50),
  reason TEXT NOT NULL,
  created_at TIMESTAMP
);
```

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** January 16, 2026
