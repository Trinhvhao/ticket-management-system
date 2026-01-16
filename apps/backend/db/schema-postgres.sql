-- ============================================
-- Ticket Management System - Database Schema
-- Company: TNHH 28H
-- Database: PostgreSQL 14+
-- Created: 2025-12-24
-- ============================================

-- Drop existing database if exists (CAUTION: Use only in development)
-- DROP DATABASE IF EXISTS ticket_management_dev;

-- Create database
-- CREATE DATABASE ticket_management_dev
--     WITH 
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.UTF-8'
--     LC_CTYPE = 'en_US.UTF-8'
--     TEMPLATE = template0;

-- \c ticket_management_dev;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================
-- CUSTOM TYPES (ENUMS)
-- ============================================

CREATE TYPE user_role AS ENUM ('Employee', 'IT_Staff', 'Admin');
CREATE TYPE ticket_priority AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE ticket_status AS ENUM ('New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed');
CREATE TYPE sender_type AS ENUM ('user', 'bot');

-- ============================================
-- 1. USERS TABLE
-- Stores all system users (Employees, IT Staff, Admins)
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hashed password with bcrypt
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'Employee',
    department VARCHAR(50),
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

COMMENT ON TABLE users IS 'User accounts with role-based access control';
COMMENT ON COLUMN users.password IS 'Hashed password with bcrypt';

-- ============================================
-- 2. CATEGORIES TABLE
-- Ticket categories (Hardware, Software, Network, etc.)
-- ============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50), -- Icon name for UI
    color VARCHAR(7), -- Hex color code
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_is_active ON categories(is_active);

COMMENT ON TABLE categories IS 'Ticket categories for classification';

-- ============================================
-- 3. TICKETS TABLE
-- Main ticket tracking table
-- ============================================
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(20) NOT NULL UNIQUE, -- Human-readable ticket ID (e.g., TKT-2025-0001)
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    priority ticket_priority NOT NULL DEFAULT 'Medium',
    status ticket_status NOT NULL DEFAULT 'New',
    submitter_id INTEGER NOT NULL, -- Employee who created the ticket
    assignee_id INTEGER, -- IT Staff assigned to handle the ticket
    due_date TIMESTAMP, -- SLA deadline
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    satisfaction_comment TEXT,
    resolution_notes TEXT, -- Final resolution summary
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (submitter_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_submitter ON tickets(submitter_id);
CREATE INDEX idx_tickets_assignee ON tickets(assignee_id);
CREATE INDEX idx_tickets_category ON tickets(category_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_due_date ON tickets(due_date);

-- Full-text search index
CREATE INDEX idx_tickets_title_description ON tickets USING gin(to_tsvector('english', title || ' ' || description));

COMMENT ON TABLE tickets IS 'Main ticket tracking table';
COMMENT ON COLUMN tickets.ticket_number IS 'Human-readable ticket ID (e.g., TKT-2025-0001)';
COMMENT ON COLUMN tickets.submitter_id IS 'Employee who created the ticket';
COMMENT ON COLUMN tickets.assignee_id IS 'IT Staff assigned to handle the ticket';
COMMENT ON COLUMN tickets.due_date IS 'SLA deadline';
COMMENT ON COLUMN tickets.resolution_notes IS 'Final resolution summary';

-- ============================================
-- 4. TICKET_ASSIGNMENTS TABLE
-- Track multiple IT staff assignments (for collaboration)
-- ============================================
CREATE TABLE ticket_assignments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL, -- IT Staff member
    assigned_by INTEGER NOT NULL, -- Who assigned this staff
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE, -- Primary assignee
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE RESTRICT,
    
    UNIQUE (ticket_id, user_id)
);

CREATE INDEX idx_ticket_assignments_ticket ON ticket_assignments(ticket_id);
CREATE INDEX idx_ticket_assignments_user ON ticket_assignments(user_id);

COMMENT ON TABLE ticket_assignments IS 'Multiple IT staff assignments per ticket';
COMMENT ON COLUMN ticket_assignments.user_id IS 'IT Staff member';
COMMENT ON COLUMN ticket_assignments.assigned_by IS 'Who assigned this staff';
COMMENT ON COLUMN ticket_assignments.is_primary IS 'Primary assignee';

-- ============================================
-- 5. COMMENTS TABLE
-- Ticket comments and updates
-- ============================================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE, -- Internal notes for IT staff only
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_comments_ticket ON comments(ticket_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

COMMENT ON TABLE comments IS 'Ticket comments and internal notes';
COMMENT ON COLUMN comments.is_internal IS 'Internal notes for IT staff only';

-- ============================================
-- 6. ATTACHMENTS TABLE
-- File attachments for tickets
-- ============================================
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL, -- File size in bytes
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_attachments_ticket ON attachments(ticket_id);
CREATE INDEX idx_attachments_uploaded_by ON attachments(uploaded_by);

COMMENT ON TABLE attachments IS 'File attachments for tickets';
COMMENT ON COLUMN attachments.file_size IS 'File size in bytes';

-- ============================================
-- 7. TICKET_HISTORY TABLE
-- Audit log for ticket changes
-- ============================================
CREATE TABLE ticket_history (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL, -- User who made the change
    action VARCHAR(50) NOT NULL, -- created, updated, assigned, status_changed, etc.
    field_name VARCHAR(50), -- Field that was changed
    old_value TEXT,
    new_value TEXT,
    description TEXT, -- Human-readable description
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_ticket_history_ticket ON ticket_history(ticket_id);
CREATE INDEX idx_ticket_history_user ON ticket_history(user_id);
CREATE INDEX idx_ticket_history_action ON ticket_history(action);
CREATE INDEX idx_ticket_history_created_at ON ticket_history(created_at);

COMMENT ON TABLE ticket_history IS 'Audit log for all ticket changes';
COMMENT ON COLUMN ticket_history.user_id IS 'User who made the change';
COMMENT ON COLUMN ticket_history.action IS 'created, updated, assigned, status_changed, etc.';
COMMENT ON COLUMN ticket_history.field_name IS 'Field that was changed';
COMMENT ON COLUMN ticket_history.description IS 'Human-readable description';

-- ============================================
-- 8. KNOWLEDGE_ARTICLES TABLE
-- Knowledge base for solutions and FAQs
-- ============================================
CREATE TABLE knowledge_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    tags VARCHAR(500), -- Comma-separated tags
    view_count INTEGER NOT NULL DEFAULT 0,
    helpful_votes INTEGER NOT NULL DEFAULT 0,
    not_helpful_votes INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_knowledge_articles_category ON knowledge_articles(category_id);
CREATE INDEX idx_knowledge_articles_author ON knowledge_articles(author_id);
CREATE INDEX idx_knowledge_articles_is_published ON knowledge_articles(is_published);

-- Full-text search index
CREATE INDEX idx_knowledge_articles_search ON knowledge_articles USING gin(to_tsvector('english', title || ' ' || content || ' ' || COALESCE(tags, '')));

COMMENT ON TABLE knowledge_articles IS 'Knowledge base articles and FAQs';
COMMENT ON COLUMN knowledge_articles.tags IS 'Comma-separated tags';

-- ============================================
-- 9. CHATBOT_CONVERSATIONS TABLE
-- Store chatbot conversation history
-- ============================================
CREATE TABLE chatbot_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    ticket_id INTEGER, -- Ticket created from this conversation
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL
);

CREATE INDEX idx_chatbot_conversations_user ON chatbot_conversations(user_id);
CREATE INDEX idx_chatbot_conversations_session ON chatbot_conversations(session_id);
CREATE INDEX idx_chatbot_conversations_started_at ON chatbot_conversations(started_at);

COMMENT ON TABLE chatbot_conversations IS 'Chatbot conversation sessions';
COMMENT ON COLUMN chatbot_conversations.ticket_id IS 'Ticket created from this conversation';

-- ============================================
-- 10. CHATBOT_MESSAGES TABLE
-- Individual messages in chatbot conversations
-- ============================================
CREATE TABLE chatbot_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    sender_type sender_type NOT NULL,
    message TEXT NOT NULL,
    intent VARCHAR(100), -- Detected user intent
    confidence DECIMAL(3,2), -- Intent confidence score (0.00-1.00)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id) REFERENCES chatbot_conversations(id) ON DELETE CASCADE
);

CREATE INDEX idx_chatbot_messages_conversation ON chatbot_messages(conversation_id);
CREATE INDEX idx_chatbot_messages_created_at ON chatbot_messages(created_at);

COMMENT ON TABLE chatbot_messages IS 'Individual chatbot messages';
COMMENT ON COLUMN chatbot_messages.intent IS 'Detected user intent';
COMMENT ON COLUMN chatbot_messages.confidence IS 'Intent confidence score (0.00-1.00)';

-- ============================================
-- 11. SLA_RULES TABLE
-- SLA configuration by priority
-- ============================================
CREATE TABLE sla_rules (
    id SERIAL PRIMARY KEY,
    priority ticket_priority NOT NULL UNIQUE,
    response_time_hours INTEGER NOT NULL, -- Hours to first response
    resolution_time_hours INTEGER NOT NULL, -- Hours to resolution
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sla_rules_priority ON sla_rules(priority);

COMMENT ON TABLE sla_rules IS 'SLA rules configuration';
COMMENT ON COLUMN sla_rules.response_time_hours IS 'Hours to first response';
COMMENT ON COLUMN sla_rules.resolution_time_hours IS 'Hours to resolution';

-- ============================================
-- 12. NOTIFICATIONS TABLE
-- System notifications for users
-- ============================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- ticket_created, ticket_updated, sla_warning, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    ticket_id INTEGER,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

COMMENT ON TABLE notifications IS 'User notifications';
COMMENT ON COLUMN notifications.type IS 'ticket_created, ticket_updated, sla_warning, etc.';

-- ============================================
-- 13. AUDIT_LOGS TABLE
-- System-wide audit logging
-- ============================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- user, ticket, category, etc.
    entity_id INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB, -- Additional details in JSON format
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_details ON audit_logs USING gin(details);

COMMENT ON TABLE audit_logs IS 'System-wide audit logging';
COMMENT ON COLUMN audit_logs.entity_type IS 'user, ticket, category, etc.';
COMMENT ON COLUMN audit_logs.details IS 'Additional details in JSON format';

-- ============================================
-- 14. SETTINGS TABLE
-- System configuration settings
-- ============================================
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) NOT NULL DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE, -- Can be accessed by frontend
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(setting_key);

COMMENT ON TABLE settings IS 'System configuration settings';
COMMENT ON COLUMN settings.setting_type IS 'string, number, boolean, json';
COMMENT ON COLUMN settings.is_public IS 'Can be accessed by frontend';

-- ============================================
-- FUNCTIONS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_articles_updated_at BEFORE UPDATE ON knowledge_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sla_rules_updated_at BEFORE UPDATE ON sla_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Default Categories
INSERT INTO categories (name, description, icon, color, display_order) VALUES
('Hardware', 'Hardware issues (computers, printers, peripherals)', 'computer', '#3B82F6', 1),
('Software', 'Software installation and issues', 'code', '#10B981', 2),
('Network', 'Network connectivity and access issues', 'wifi', '#F59E0B', 3),
('Account', 'User account and access management', 'user', '#8B5CF6', 4),
('Email', 'Email and communication issues', 'mail', '#EF4444', 5),
('Other', 'Other technical support requests', 'help-circle', '#6B7280', 6);

-- Default SLA Rules
INSERT INTO sla_rules (priority, response_time_hours, resolution_time_hours) VALUES
('High', 1, 4),
('Medium', 4, 24),
('Low', 8, 72);

-- Default Admin User (password: Admin@123)
-- Password hash generated with bcrypt rounds=12
INSERT INTO users (username, email, password, full_name, role, department) VALUES
('admin', 'admin@28h.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWU7u3oi', 'System Administrator', 'Admin', 'IT');

-- Default Settings
INSERT INTO settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_name', 'Ticket Management System', 'string', 'Application name', TRUE),
('company_name', 'TNHH 28H', 'string', 'Company name', TRUE),
('support_email', 'support@28h.com', 'string', 'Support email address', TRUE),
('max_file_size', '10485760', 'number', 'Maximum file upload size in bytes (10MB)', FALSE),
('allowed_file_types', 'jpg,jpeg,png,gif,pdf,doc,docx,txt,zip', 'string', 'Allowed file extensions', FALSE),
('business_hours_start', '08:00', 'string', 'Business hours start time', FALSE),
('business_hours_end', '17:00', 'string', 'Business hours end time', FALSE),
('working_days', '1,2,3,4,5', 'string', 'Working days (1=Monday, 7=Sunday)', FALSE);

-- ============================================
-- CREATE VIEWS FOR REPORTING
-- ============================================

-- View: Active Tickets Summary
CREATE OR REPLACE VIEW v_active_tickets_summary AS
SELECT 
    t.id,
    t.ticket_number,
    t.title,
    t.status,
    t.priority,
    c.name AS category_name,
    s.full_name || ' (' || s.email || ')' AS submitter,
    CASE 
        WHEN a.full_name IS NOT NULL THEN a.full_name || ' (' || a.email || ')'
        ELSE NULL
    END AS assignee,
    t.created_at,
    t.due_date,
    EXTRACT(EPOCH FROM (COALESCE(t.resolved_at, NOW()) - t.created_at)) / 3600 AS age_hours
FROM tickets t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN users s ON t.submitter_id = s.id
LEFT JOIN users a ON t.assignee_id = a.id
WHERE t.status NOT IN ('Closed');

-- View: SLA Compliance Report
CREATE OR REPLACE VIEW v_sla_compliance AS
SELECT 
    t.id,
    t.ticket_number,
    t.priority,
    t.status,
    t.created_at,
    t.due_date,
    t.resolved_at,
    sla.response_time_hours,
    sla.resolution_time_hours,
    CASE 
        WHEN t.resolved_at IS NOT NULL AND t.resolved_at <= t.due_date THEN 'Met'
        WHEN t.resolved_at IS NOT NULL AND t.resolved_at > t.due_date THEN 'Breached'
        WHEN t.resolved_at IS NULL AND NOW() > t.due_date THEN 'Breached'
        ELSE 'In Progress'
    END AS sla_status
FROM tickets t
LEFT JOIN sla_rules sla ON t.priority = sla.priority;

-- ============================================
-- STORED FUNCTIONS
-- ============================================

-- Function: Generate Ticket Number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    year_part VARCHAR(4);
    seq_num INTEGER;
    ticket_num VARCHAR(20);
BEGIN
    year_part := EXTRACT(YEAR FROM NOW())::VARCHAR;
    
    SELECT COALESCE(MAX(SUBSTRING(ticket_number FROM 10)::INTEGER), 0) + 1
    INTO seq_num
    FROM tickets
    WHERE ticket_number LIKE 'TKT-' || year_part || '-%';
    
    ticket_num := 'TKT-' || year_part || '-' || LPAD(seq_num::VARCHAR, 4, '0');
    
    RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate SLA Due Date
CREATE OR REPLACE FUNCTION calculate_sla_due_date(
    p_priority ticket_priority,
    p_created_at TIMESTAMP
)
RETURNS TIMESTAMP AS $$
DECLARE
    resolution_hours INTEGER;
    due_date TIMESTAMP;
BEGIN
    SELECT resolution_time_hours INTO resolution_hours
    FROM sla_rules
    WHERE priority = p_priority;
    
    due_date := p_created_at + (resolution_hours || ' hours')::INTERVAL;
    
    RETURN due_date;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Auto-generate ticket number and due date on insert
CREATE OR REPLACE FUNCTION trg_tickets_before_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    
    IF NEW.due_date IS NULL THEN
        NEW.due_date := calculate_sla_due_date(NEW.priority, NEW.created_at);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tickets_before_insert
BEFORE INSERT ON tickets
FOR EACH ROW
EXECUTE FUNCTION trg_tickets_before_insert();

-- Trigger: Log ticket changes to history
CREATE OR REPLACE FUNCTION trg_tickets_after_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO ticket_history (ticket_id, user_id, action, field_name, old_value, new_value, description)
        VALUES (
            NEW.id, 
            COALESCE(NEW.assignee_id, NEW.submitter_id), 
            'status_changed', 
            'status', 
            OLD.status::TEXT, 
            NEW.status::TEXT,
            'Status changed from ' || OLD.status || ' to ' || NEW.status
        );
    END IF;
    
    -- Log assignee changes
    IF OLD.assignee_id IS DISTINCT FROM NEW.assignee_id THEN
        INSERT INTO ticket_history (ticket_id, user_id, action, field_name, old_value, new_value, description)
        VALUES (
            NEW.id,
            COALESCE(NEW.assignee_id, NEW.submitter_id),
            'assigned',
            'assignee_id',
            OLD.assignee_id::TEXT,
            NEW.assignee_id::TEXT,
            'Ticket assigned to new staff member'
        );
    END IF;
    
    -- Log priority changes
    IF OLD.priority IS DISTINCT FROM NEW.priority THEN
        INSERT INTO ticket_history (ticket_id, user_id, action, field_name, old_value, new_value, description)
        VALUES (
            NEW.id,
            COALESCE(NEW.assignee_id, NEW.submitter_id),
            'priority_changed',
            'priority',
            OLD.priority::TEXT,
            NEW.priority::TEXT,
            'Priority changed from ' || OLD.priority || ' to ' || NEW.priority
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tickets_after_update
AFTER UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION trg_tickets_after_update();

-- ============================================
-- DATABASE SCHEMA COMPLETED
-- ============================================

SELECT 'PostgreSQL database schema created successfully!' AS status;
