# 🗄️ Database Setup - Quick Guide

## 📋 Phân tích Project từ Specs

### **Từ Requirements.md:**

**10 Requirements chính:**
1. ✅ Employee submit tickets → **tickets table**
2. ✅ Track ticket progress → **ticket_history, notifications**
3. ✅ IT Staff manage tickets → **ticket_assignments, comments**
4. ✅ Knowledge base access → **knowledge_articles**
5. ✅ Admin manage system → **users, categories, settings**
6. ✅ Reports & analytics → **views, audit_logs**
7. ✅ Chatbot integration → **chatbot_conversations, chatbot_messages**
8. ✅ SLA enforcement → **sla_rules, triggers**
9. ✅ Satisfaction ratings → **tickets.satisfaction_rating**
10. ✅ Team collaboration → **ticket_assignments, comments.is_internal**

### **Từ Design.md:**

**6 Components được map vào database:**
1. **User Management** → users table
2. **Ticket Management** → tickets, ticket_assignments, comments, attachments
3. **SLA Management** → sla_rules, triggers, views
4. **Chatbot** → chatbot_conversations, chatbot_messages
5. **Knowledge Base** → knowledge_articles
6. **Reporting** → views, audit_logs

## 🎯 Database Schema Highlights

### **14 Tables Created:**

```
Core Tables:
├── users (3 roles: Employee, IT_Staff, Admin)
├── categories (Hardware, Software, Network...)
├── tickets (Main ticket tracking)
├── ticket_assignments (Multi-staff collaboration)
├── comments (Public & internal notes)
├── attachments (File uploads)
└── ticket_history (Full audit trail)

Knowledge & AI:
├── knowledge_articles (FAQ & solutions)
├── chatbot_conversations (Chat sessions)
└── chatbot_messages (Chat history)

System:
├── sla_rules (Priority-based SLA)
├── notifications (User notifications)
├── audit_logs (System-wide logging)
└── settings (Configuration)
```

### **Key Features:**

✅ **Auto-generated Ticket Numbers**: TKT-2025-0001, TKT-2025-0002...
✅ **Automatic SLA Calculation**: Due dates based on priority
✅ **Full Audit Trail**: Every change logged
✅ **Multi-staff Assignment**: Team collaboration support
✅ **Internal Notes**: IT staff private communication
✅ **Full-text Search**: Fast search on tickets & knowledge base
✅ **Chatbot Integration**: Conversation history & auto-ticket creation
✅ **Satisfaction Ratings**: 5-point scale with comments

## 🚀 Setup Instructions

### **Prerequisites:**

```bash
# 1. Check MySQL is installed
mysql --version

# 2. Start MySQL service
net start mysql

# 3. Verify connection
mysql -u root -p
```

### **Method 1: Automated Setup (Recommended)**

```bash
# Step 1: Navigate to backend
cd apps/backend

# Step 2: Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials:
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=ticket_management_dev
# DB_USER=root
# DB_PASS=your_password

# Step 3: Run automated setup
npm run db:setup
```

### **Method 2: Manual Setup**

```bash
# Step 1: Login to MySQL
mysql -u root -p

# Step 2: Run schema
source apps/backend/database/schema.sql

# Step 3: Verify
USE ticket_management_dev;
SHOW TABLES;
SELECT COUNT(*) FROM users; -- Should return 1 (admin user)
```

## 🔐 Default Login

After setup, login with:

```
Username: admin
Email: admin@28h.com  
Password: Admin@123
```

⚠️ **Change password after first login!**

## 📊 Default Data Included

### **6 Categories:**
- Hardware (computers, printers)
- Software (applications, installations)
- Network (connectivity, access)
- Account (user accounts, permissions)
- Email (email issues)
- Other (miscellaneous)

### **3 SLA Rules:**
| Priority | Response Time | Resolution Time |
|----------|---------------|-----------------|
| High     | 1 hour        | 4 hours         |
| Medium   | 4 hours       | 24 hours        |
| Low      | 8 hours       | 72 hours        |

### **8 System Settings:**
- Application name & company info
- File upload limits (10MB)
- Allowed file types
- Business hours (8:00-17:00)
- Working days (Mon-Fri)

## 🧪 Test Database

### **Verify Tables:**
```sql
USE ticket_management_dev;
SHOW TABLES;
-- Should show 14 tables
```

### **Check Default Data:**
```sql
-- Categories
SELECT id, name, icon FROM categories;

-- SLA Rules
SELECT priority, response_time_hours, resolution_time_hours FROM sla_rules;

-- Admin User
SELECT username, email, role FROM users;
```

### **Test Ticket Creation:**
```sql
-- Create test ticket (will auto-generate ticket_number and due_date)
INSERT INTO tickets (title, description, category_id, priority, submitter_id)
VALUES ('Test Printer Issue', 'Printer not working', 1, 'High', 1);

-- Check auto-generated values
SELECT ticket_number, due_date, created_at 
FROM tickets 
WHERE id = LAST_INSERT_ID();
```

## 📈 Database Relationships

```
users (1) ──── (N) tickets (submitter)
users (1) ──── (N) tickets (assignee)
users (1) ──── (N) ticket_assignments
users (1) ──── (N) comments
users (1) ──── (N) knowledge_articles (author)
users (1) ──── (N) chatbot_conversations

categories (1) ──── (N) tickets
categories (1) ──── (N) knowledge_articles

tickets (1) ──── (N) comments
tickets (1) ──── (N) attachments
tickets (1) ──── (N) ticket_history
tickets (1) ──── (N) ticket_assignments
tickets (1) ──── (N) notifications

chatbot_conversations (1) ──── (N) chatbot_messages
chatbot_conversations (1) ──── (1) tickets (optional)
```

## 🔄 Database Scripts

```bash
# Setup database (first time)
npm run db:setup

# Create database only
npm run db:create

# Drop database
npm run db:drop

# Run migrations
npm run db:migrate

# Rollback migration
npm run db:migrate:undo

# Seed data
npm run db:seed

# Reset everything (⚠️ CAUTION: Deletes all data!)
npm run db:reset
```

## 🐛 Common Issues & Solutions

### **Issue 1: Connection Refused**
```bash
# Solution: Start MySQL
net start mysql

# Verify it's running
netstat -ano | findstr :3306
```

### **Issue 2: Access Denied**
```bash
# Solution: Check credentials in .env
DB_USER=root
DB_PASS=your_actual_password

# Or grant privileges
mysql -u root -p
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### **Issue 3: Database Already Exists**
```bash
# Solution: Drop and recreate
npm run db:reset
```

### **Issue 4: mysql2 module not found**
```bash
# Solution: Install dependencies
npm install
```

## 📚 Next Steps

After database setup:

1. ✅ **Verify Setup**: Run test queries above
2. ✅ **Start Backend**: `npm run dev`
3. ✅ **Test API**: http://localhost:3000/health
4. ✅ **Login**: Use default admin credentials
5. ✅ **Change Password**: Update admin password
6. ✅ **Create Users**: Add IT staff and employees
7. ✅ **Configure Categories**: Customize for your needs
8. ✅ **Adjust SLA Rules**: Set appropriate timeframes

## 🎓 Database Best Practices

✅ **Indexes**: All foreign keys and frequently queried columns indexed
✅ **Constraints**: Foreign keys with appropriate ON DELETE actions
✅ **Timestamps**: All tables have created_at and updated_at
✅ **Audit Trail**: Complete history of all changes
✅ **Data Integrity**: Triggers ensure data consistency
✅ **Performance**: Views for complex queries
✅ **Security**: Password hashing, audit logs
✅ **Scalability**: Proper normalization and indexing

## 📞 Support

For database issues:
1. Check this guide
2. Review `apps/backend/database/README.md`
3. Check MySQL error logs
4. Verify .env configuration

---

**Database Schema Version**: 1.0.0  
**Last Updated**: 2025-12-23  
**Compatible with**: MySQL 8.0+