# 🚀 QUICK ROLE REFERENCE
## Tham khảo nhanh phân quyền hệ thống

---

## 📱 SIDEBAR MENU THEO ROLE

### Employee (Nhân viên)
```
✅ Tickets (My Tickets only)
✅ Knowledge Base (View only)
✅ Notifications
✅ Settings (Profile only)
```

### IT_Staff (Nhân viên IT)
```
✅ Dashboard
✅ Tickets (All Tickets + Assigned to Me)
✅ Knowledge Base (Create/Edit)
✅ Notifications
✅ Users (View only)
✅ Categories (Create/Edit)
✅ SLA Rules
✅ Escalation
✅ Reports
✅ Settings
```

### Admin (Quản trị viên)
```
✅ Dashboard
✅ Tickets (All + Delete)
✅ Knowledge Base (Full control)
✅ Notifications
✅ Users (Full CRUD)
✅ Categories (Full CRUD)
✅ SLA Rules
✅ Escalation
✅ Reports (+ Staff Performance)
✅ Settings (Full access)
```

---

## 🎯 CHỨC NĂNG CHÍNH

### Tickets

| Chức năng | Employee | IT_Staff | Admin |
|-----------|:--------:|:--------:|:-----:|
| Tạo | ✅ | ✅ | ✅ |
| Xem của mình | ✅ | ✅ | ✅ |
| Xem tất cả | ❌ | ✅ | ✅ |
| Sửa của mình | ✅* | ✅ | ✅ |
| Sửa bất kỳ | ❌ | ✅ | ✅ |
| Xóa | ❌ | ❌ | ✅ |
| Assign | ❌ | ✅ | ✅ |
| Resolve | ❌ | ✅ | ✅ |
| Đánh giá | ✅* | ❌ | ❌ |

*Employee chỉ sửa khi status = New/Assigned  
*Employee chỉ đánh giá ticket của mình

### Users

| Chức năng | Employee | IT_Staff | Admin |
|-----------|:--------:|:--------:|:-----:|
| Xem danh sách | ❌ | ✅ | ✅ |
| Xem profile mình | ✅ | ✅ | ✅ |
| Sửa profile mình | ✅ | ✅ | ✅ |
| Tạo user | ❌ | ❌ | ✅ |
| Sửa user | ❌ | ❌ | ✅ |
| Xóa user | ❌ | ❌ | ✅ |

### Knowledge Base

| Chức năng | Employee | IT_Staff | Admin |
|-----------|:--------:|:--------:|:-----:|
| Xem | ✅ | ✅ | ✅ |
| Tạo | ❌ | ✅ | ✅ |
| Sửa của mình | ❌ | ✅ | ✅ |
| Sửa bất kỳ | ❌ | ❌ | ✅ |
| Xóa | ❌ | ✅* | ✅ |
| Publish | ❌ | ✅ | ✅ |

*IT_Staff chỉ xóa bài viết của mình

### Dashboard & Reports

| Chức năng | Employee | IT_Staff | Admin |
|-----------|:--------:|:--------:|:-----:|
| Dashboard | ❌ | ✅ | ✅ |
| Reports | ❌ | ✅ | ✅ |
| Staff Performance | ❌ | ❌ | ✅ |

---

## 🔑 BACKEND ENDPOINTS

### Chỉ Admin
```
POST   /users
PATCH  /users/:id
DELETE /users/:id
DELETE /tickets/:id
POST   /tickets/bulk-delete
DELETE /categories/:id
POST   /categories/reorder
POST   /sla/rules
PUT    /sla/rules/:id
DELETE /sla/rules/:id
POST   /escalation
PATCH  /escalation/:id
DELETE /escalation/:id
GET    /reports/staff-performance
```

### IT_Staff + Admin
```
GET    /users
GET    /tickets/assigned-to-me
POST   /tickets/:id/assign
POST   /tickets/:id/resolve
POST   /tickets/bulk-assign
POST   /categories
PATCH  /categories/:id
GET    /sla/rules
GET    /escalation
POST   /escalation/check-now
GET    /reports/tickets-by-*
GET    /reports/sla-compliance
POST   /knowledge (create article)
PATCH  /knowledge/:id (edit article)
```

### All Roles (Authenticated)
```
POST   /tickets
GET    /tickets
GET    /tickets/my-tickets
GET    /tickets/:id
PATCH  /tickets/:id
POST   /tickets/:id/close
POST   /tickets/:id/reopen
POST   /tickets/:id/rate
GET    /users/profile
PATCH  /users/profile
POST   /users/change-password
GET    /categories
GET    /knowledge (view articles)
POST   /tickets/:ticketId/comments
GET    /reports/action-required
GET    /reports/dashboard
```

### Public (No Auth)
```
GET    /knowledge (published articles only)
GET    /knowledge/:id
POST   /auth/login
POST   /auth/register
POST   /auth/refresh
```

---

## 💡 TIPS

### Employee
- Chỉ thấy ticket của mình trong danh sách
- Không thể assign ticket cho IT staff
- Chỉ sửa được ticket khi status = New hoặc Assigned
- Có thể đánh giá ticket sau khi resolved

### IT_Staff
- Thấy tất cả tickets
- Có thể assign ticket cho bản thân hoặc IT staff khác
- Có thể tạo internal comments (chỉ IT staff thấy)
- Có thể tạo và publish knowledge articles
- Không thể xóa tickets (chỉ Admin)

### Admin
- Toàn quyền trên hệ thống
- Có thể xóa tickets, users, categories
- Có thể xem staff performance report
- Có thể sửa/xóa bất kỳ comment/article nào
- Quản lý SLA rules và escalation rules

---

## 🔒 BẢO MẬT

### Authentication
- JWT tokens: Access (15 min) + Refresh (7 days)
- Password: bcryptjs với salt rounds = 12
- Auto refresh token khi hết hạn

### Authorization
- Frontend: Ẩn/hiện UI theo role
- Backend: @Roles() decorator + RolesGuard
- Service: Ownership checks
- Audit: Log tất cả actions

### Validation
- DTOs validate inputs
- TypeScript type checking
- Sequelize ORM prevent SQL injection
- CORS protection

---

*Quick Reference - Cập nhật: 17/01/2026*
