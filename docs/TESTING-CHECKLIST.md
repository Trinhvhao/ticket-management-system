# Testing Checklist - Phase 1

**Ngày bắt đầu:** 18/01/2026  
**Mục tiêu:** Đảm bảo tất cả chức năng hoạt động đúng trước khi deploy production

---

## 🔐 1. Authentication & Authorization

### Login/Register
- [ ] Đăng ký tài khoản mới (Employee)
- [ ] Đăng nhập với email/password
- [ ] Validation: Email format, password strength
- [ ] Error handling: Wrong credentials
- [ ] Token được lưu vào localStorage
- [ ] Auto-redirect sau login thành công

### Token Management
- [ ] Access token expires sau 15 phút
- [ ] Refresh token tự động khi access token hết hạn
- [ ] Logout xóa tokens và redirect về login
- [ ] Logout All Devices revoke tất cả refresh tokens
- [ ] Token blacklist hoạt động (không thể dùng token đã logout)

### Role-Based Access
- [ ] Employee chỉ thấy tickets của mình
- [ ] IT_Staff thấy tất cả tickets
- [ ] Admin có full access
- [ ] Route guards hoạt động đúng
- [ ] API endpoints check permissions

---

## 🎫 2. Ticket Management

### Create Ticket
- [ ] Employee tạo ticket thành công
- [ ] Auto-generate ticket number (TKT-2026-XXXX)
- [ ] Required fields validation
- [ ] Category selection
- [ ] Priority selection (Low/Medium/High)
- [ ] Description với rich text
- [ ] Upload attachments (max 10MB)
- [ ] SLA due date tự động tính

### View Tickets
- [ ] List view hiển thị đúng
- [ ] Kanban view drag & drop
- [ ] Calendar view hiển thị theo due date
- [ ] Filters hoạt động (status, priority, category)
- [ ] Search by title/description
- [ ] Pagination hoạt động
- [ ] Sort by date, priority, status

### Update Ticket
- [ ] IT_Staff assign ticket cho mình
- [ ] Change status: NEW → ASSIGNED → IN_PROGRESS
- [ ] Update priority
- [ ] Update category
- [ ] Add internal notes (IT_Staff only)
- [ ] Add public comments
- [ ] Upload thêm attachments
- [ ] Ticket history ghi lại tất cả changes

### Ticket Workflow
- [ ] NEW → ASSIGNED (khi assign)
- [ ] ASSIGNED → IN_PROGRESS (khi start working)
- [ ] IN_PROGRESS → PENDING (khi cần thêm info)
- [ ] PENDING → IN_PROGRESS (khi có info)
- [ ] IN_PROGRESS → RESOLVED (khi giải quyết xong)
- [ ] RESOLVED → CLOSED (sau 24h hoặc manual)
- [ ] CLOSED → REOPENED (nếu vấn đề chưa xong)

### Bulk Operations
- [ ] Bulk assign tickets
- [ ] Bulk change status
- [ ] Bulk delete (Admin only)

---

## 💬 3. Comments & Attachments

### Comments
- [ ] Add public comment
- [ ] Add internal note (IT_Staff only)
- [ ] Edit own comment
- [ ] Delete own comment
- [ ] System comments tự động (status change, assignment)
- [ ] Comments hiển thị theo timeline

### Attachments
- [ ] Upload file (images, docs, archives)
- [ ] File size validation (max 10MB)
- [ ] File type validation
- [ ] Download attachment
- [ ] Delete attachment (owner/admin)
- [ ] Preview images inline

---

## ⏱️ 4. SLA Management

### SLA Rules
- [ ] Admin tạo SLA rule mới
- [ ] Edit existing rule
- [ ] Delete rule
- [ ] Toggle active/inactive
- [ ] Rules by priority (High: 4h, Medium: 24h, Low: 72h)

### SLA Calculation
- [ ] Due date tính đúng theo business hours (8:00-17:30)
- [ ] Bỏ qua weekends (Sat-Sun)
- [ ] Bỏ qua holidays (9 ngày lễ Vietnam 2026)
- [ ] SLA status: MET / AT_RISK / BREACHED
- [ ] Warning khi đạt 80% SLA time
- [ ] Breach notification khi quá deadline

### SLA Monitoring
- [ ] Dashboard hiển thị SLA compliance rate
- [ ] List tickets at risk
- [ ] List breached tickets
- [ ] SLA badge trên ticket card

---

## 🚨 5. Auto-Escalation System

### Escalation Rules
- [ ] Admin tạo escalation rule
- [ ] 4 trigger types: SLA_BREACHED, SLA_AT_RISK, NO_ASSIGNMENT, NO_RESPONSE
- [ ] 3 target types: USER, ROLE, MANAGER
- [ ] Escalation levels 1-5
- [ ] Category filter (optional)
- [ ] Priority filter (optional)
- [ ] Notify manager checkbox

### Auto-Escalation Cron
- [ ] Cron job chạy mỗi 15 phút
- [ ] Detect tickets matching rules
- [ ] Assign to target user/role
- [ ] Workload balancing (assign to user với ít tickets nhất)
- [ ] Create escalation history record
- [ ] Send notifications
- [ ] Prevent spam (không escalate lại trong 60 phút)

### Manual Escalation
- [ ] IT_Staff/Admin escalate ticket manually
- [ ] "Run Check Now" button trigger immediate check
- [ ] View escalation history
- [ ] Filter history by date range

---

## 📊 6. Reports & Analytics

### Dashboard
- [ ] Total tickets count
- [ ] Open tickets count
- [ ] Closed today/week/month
- [ ] Average resolution time
- [ ] SLA compliance rate
- [ ] Tickets by status (pie chart)
- [ ] Tickets by priority (bar chart)
- [ ] Trend analysis (line chart)

### Staff Performance (Admin only)
- [ ] List all IT Staff
- [ ] Assigned tickets count
- [ ] Resolved tickets count
- [ ] Average resolution time
- [ ] SLA compliance rate per staff
- [ ] Current workload

### Action Required Badge
- [ ] Count new tickets
- [ ] Count unassigned tickets (exclude NEW)
- [ ] Smart tooltip: "X new (Y unassigned)"
- [ ] Badge hiển thị đúng số lượng unique tickets

---

## 📚 7. Knowledge Base

### Articles
- [ ] IT_Staff tạo article mới
- [ ] Edit article
- [ ] Delete article
- [ ] Publish/Draft status
- [ ] Category assignment
- [ ] Tags (multiple)
- [ ] Rich text editor

### Search & Browse
- [ ] Full-text search
- [ ] Filter by category
- [ ] Filter by tags
- [ ] Sort by views, votes, date
- [ ] View count tự động tăng

### Voting
- [ ] Vote helpful (thumbs up)
- [ ] Vote not helpful (thumbs down)
- [ ] Vote count hiển thị

---

## 🤖 8. Chatbot

### Chat Widget
- [ ] Floating button hiển thị
- [ ] Click to open chat window
- [ ] Minimize/maximize
- [ ] Send message
- [ ] Receive bot response

### Bot Features
- [ ] Greeting detection
- [ ] Help menu
- [ ] Search knowledge base
- [ ] Display article results
- [ ] Click article to view full content
- [ ] Quick suggestions
- [ ] Action buttons (Create ticket, Check tickets)

---

## 🔔 9. Notifications

### In-App Notifications
- [ ] Notification badge trên header
- [ ] Unread count
- [ ] Notification list
- [ ] Mark as read (single)
- [ ] Mark all as read
- [ ] Delete notification
- [ ] Click to navigate to ticket

### Notification Types
- [ ] ticket_created
- [ ] ticket_assigned
- [ ] ticket_updated
- [ ] ticket_resolved
- [ ] sla_warning
- [ ] sla_breached
- [ ] ticket_escalated

### Email Notifications (Optional)
- [ ] Configure SMTP settings
- [ ] Send email on ticket_created
- [ ] Send email on ticket_assigned
- [ ] Send email on sla_warning

---

## 👥 10. User Management (Admin)

### CRUD Operations
- [ ] List all users
- [ ] Search users by name/email
- [ ] Filter by role
- [ ] Create new user
- [ ] Edit user
- [ ] Delete user
- [ ] Toggle active/inactive

### User Details
- [ ] View user profile
- [ ] View user's tickets
- [ ] View user's performance (IT_Staff)

---

## 📁 11. Categories Management (Admin)

### CRUD Operations
- [ ] List all categories
- [ ] Create category
- [ ] Edit category
- [ ] Delete category
- [ ] Toggle active/inactive

### Category Details
- [ ] Name, description
- [ ] Icon selection
- [ ] Color selection
- [ ] Ticket count

---

## ⚙️ 12. Settings

### Profile Settings
- [ ] View profile
- [ ] Update full name
- [ ] Update email
- [ ] Change password
- [ ] Upload avatar (optional)

### System Settings (Admin)
- [ ] View system info
- [ ] Configure business hours
- [ ] Manage holidays (via SQL for now)

---

## 🔒 13. Security Testing

### Authentication
- [ ] JWT token validation
- [ ] Token expiration handling
- [ ] Refresh token rotation
- [ ] Token blacklist on logout
- [ ] Password hashing (bcrypt, 12 rounds)

### Authorization
- [ ] Role-based access control
- [ ] Route guards
- [ ] API endpoint permissions
- [ ] Prevent unauthorized access

### Input Validation
- [ ] XSS protection
- [ ] SQL injection prevention
- [ ] File upload validation
- [ ] Email format validation
- [ ] Password strength validation

---

## 🚀 14. Performance Testing

### Load Testing
- [ ] 10 concurrent users
- [ ] 50 concurrent users
- [ ] 100 concurrent users
- [ ] Response time < 500ms for most endpoints
- [ ] Database query optimization

### Frontend Performance
- [ ] Page load time < 3s
- [ ] Time to interactive < 5s
- [ ] Lighthouse score > 80
- [ ] No memory leaks
- [ ] Smooth animations

---

## 🐛 15. Bug Tracking

### Known Issues
- [ ] None currently

### Fixed Issues
- ✅ Reports action required 500 error (missing JWT guard)
- ✅ Action required badge double counting (NEW tickets counted twice)
- ✅ Auth session timeout without redirect (removed debug tools)

---

## 📝 16. Documentation Review

### API Documentation
- [ ] All endpoints documented
- [ ] Request/response examples
- [ ] Error codes explained
- [ ] Authentication requirements

### User Documentation
- [ ] User manual (Employee)
- [ ] Admin guide
- [ ] IT Staff guide
- [ ] FAQ

### Technical Documentation
- [ ] Architecture overview
- [ ] Database schema
- [ ] Deployment guide
- [ ] Environment setup

---

## ✅ Testing Summary

**Total Test Cases:** 200+  
**Completed:** 0  
**Failed:** 0  
**Blocked:** 0  

**Priority:**
- 🔴 Critical: Authentication, Ticket CRUD, SLA
- 🟡 High: Escalation, Reports, Notifications
- 🟢 Medium: Knowledge Base, Chatbot, Settings

**Timeline:** 3-5 ngày testing

---

## 📋 Next Steps After Testing

1. **Fix all bugs found**
2. **Performance optimization**
3. **Security audit**
4. **User acceptance testing**
5. **Production deployment**

---

*Created: 18/01/2026*  
*Status: Ready to start testing*
