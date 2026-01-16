# Database Setup Guide

## 📋 Overview

This directory contains database schema and setup scripts for the Ticket Management System.

## 📁 Files

- `schema.sql` - Complete database schema with tables, views, procedures, and triggers
- `setup-database.js` - Automated setup script
- `seed-data.sql` - Additional seed data (optional)

## 🗄️ Database Structure

### Core Tables (14 tables)

1. **users** - User accounts with role-based access
2. **categories** - Ticket categories (Hardware, Software, Network, etc.)
3. **tickets** - Main ticket tracking table
4. **ticket_assignments** - Multiple IT staff assignments
5. **comments** - Ticket comments and internal notes
6. **attachments** - File attachments for tickets
7. **ticket_history** - Audit log for ticket changes
8. **knowledge_articles** - Knowledge base articles and FAQs
9. **chatbot_conversations** - Chatbot conversation sessions
10. **chatbot_messages** - Individual chatbot messages
11. **sla_rules** - SLA configuration by priority
12. **notifications** - System notifications for users
13. **audit_logs** - System-wide audit logging
14. **settings** - System configuration settings

### Views

- `v_active_tickets_summary` - Active tickets with full details
- `v_sla_compliance` - SLA compliance report

### Stored Procedures

- `sp_generate_ticket_number()` - Auto-generate ticket numbers (TKT-2025-0001)
- `sp_calculate_sla_due_date()` - Calculate SLA deadline based on priority

### Triggers

- `trg_tickets_before_insert` - Auto-generate ticket number and due date
- `trg_tickets_after_update` - Log changes to ticket_history

## 🚀 Quick Setup

### Method 1: Automated Script (Recommended)

```bash
# 1. Make sure MySQL is running
net start mysql

# 2. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# 3. Run setup script
node database/setup-database.js
```

### Method 2: Manual Setup

```bash
# 1. Login to MySQL
mysql -u root -p

# 2. Run schema file
source apps/backend/database/schema.sql

# 3. Verify
USE ticket_management_dev;
SHOW TABLES;
```

### Method 3: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script → Select `schema.sql`
4. Execute (⚡ icon or Ctrl+Shift+Enter)

## 🔐 Default Credentials

After setup, you can login with:

```
Username: admin
Email: admin@28h.com
Password: Admin@123
```

⚠️ **IMPORTANT**: Change this password immediately after first login!

## 📊 Default Data

The schema includes:

### Categories (6)
- Hardware
- Software
- Network
- Account
- Email
- Other

### SLA Rules (3)
- **High Priority**: Response 1h, Resolution 4h
- **Medium Priority**: Response 4h, Resolution 24h
- **Low Priority**: Response 8h, Resolution 72h

### Settings (8)
- Application configuration
- File upload limits
- Business hours
- Working days

## 🔧 Configuration

### Environment Variables

Create `.env` file in backend root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ticket_management_dev
DB_USER=root
DB_PASS=your_password
```

### Database User (Production)

For production, create a dedicated database user:

```sql
CREATE USER 'ticket_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ticket_management_dev.* TO 'ticket_app'@'localhost';
FLUSH PRIVILEGES;
```

## 📈 Database Features

### Auto-generated Ticket Numbers
```
TKT-2025-0001
TKT-2025-0002
...
```

### Automatic SLA Calculation
- Due dates calculated based on priority
- Business hours support
- Automatic escalation tracking

### Full Audit Trail
- All ticket changes logged
- User actions tracked
- Timestamp for every change

### Full-text Search
- Search tickets by title/description
- Search knowledge base articles
- Fast and efficient indexing

## 🧪 Testing Database

### Check Tables
```sql
USE ticket_management_dev;
SHOW TABLES;
```

### Check Default Data
```sql
-- Check categories
SELECT * FROM categories;

-- Check SLA rules
SELECT * FROM sla_rules;

-- Check admin user
SELECT id, username, email, role FROM users;
```

### Test Ticket Creation
```sql
-- This will auto-generate ticket number and due date
INSERT INTO tickets (title, description, category_id, priority, submitter_id)
VALUES ('Test Ticket', 'This is a test', 1, 'High', 1);

-- Check generated values
SELECT ticket_number, due_date FROM tickets WHERE id = LAST_INSERT_ID();
```

## 🔄 Database Migrations

For future schema changes, use Sequelize migrations:

```bash
# Create new migration
npx sequelize-cli migration:generate --name add-new-field

# Run migrations
npm run db:migrate

# Rollback
npm run db:migrate:undo
```

## 🗑️ Reset Database

⚠️ **CAUTION**: This will delete all data!

```bash
# Drop and recreate
mysql -u root -p -e "DROP DATABASE IF EXISTS ticket_management_dev;"
node database/setup-database.js
```

## 📝 Schema Diagram

```
users ──┬─── tickets ──┬─── comments
        │              ├─── attachments
        │              ├─── ticket_history
        │              └─── ticket_assignments
        │
        ├─── knowledge_articles
        ├─── chatbot_conversations ─── chatbot_messages
        └─── notifications

categories ─── tickets
           └── knowledge_articles

sla_rules ─── (referenced by tickets)
```

## 🐛 Troubleshooting

### Error: Access Denied
```bash
# Check MySQL credentials
mysql -u root -p

# Grant privileges
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Error: Connection Refused
```bash
# Check if MySQL is running
net start mysql

# Check port
netstat -ano | findstr :3306
```

### Error: Database Already Exists
```bash
# Drop existing database
mysql -u root -p -e "DROP DATABASE ticket_management_dev;"

# Run setup again
node database/setup-database.js
```

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Sequelize Documentation](https://sequelize.org/)
- [Database Design Best Practices](https://www.sqlshack.com/database-design-best-practices/)

## 🤝 Support

For issues or questions:
1. Check troubleshooting section above
2. Review MySQL error logs
3. Contact IT support team