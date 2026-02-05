-- ============================================================================
-- Migration: Convert TIMESTAMP to TIMESTAMPTZ
-- Purpose: Fix timezone handling by using timezone-aware timestamps
-- Date: 2026-02-02
-- ============================================================================

-- IMPORTANT: This migration assumes all existing timestamps are in UTC
-- If your data is in a different timezone, adjust the AT TIME ZONE clause

BEGIN;

-- ============================================================================
-- 0. DROP VIEWS THAT DEPEND ON TIMESTAMP COLUMNS
-- ============================================================================

DROP VIEW IF EXISTS v_active_tickets_summary CASCADE;
DROP VIEW IF EXISTS v_sla_compliance CASCADE;

-- ============================================================================
-- 1. TICKETS TABLE
-- ============================================================================

ALTER TABLE tickets 
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC',
  ALTER COLUMN due_date TYPE TIMESTAMPTZ USING due_date AT TIME ZONE 'UTC',
  ALTER COLUMN resolved_at TYPE TIMESTAMPTZ USING resolved_at AT TIME ZONE 'UTC',
  ALTER COLUMN closed_at TYPE TIMESTAMPTZ USING closed_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 2. USERS TABLE
-- ============================================================================

ALTER TABLE users
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC',
  ALTER COLUMN last_login_at TYPE TIMESTAMPTZ USING last_login_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 3. COMMENTS TABLE
-- ============================================================================

ALTER TABLE comments
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC',
  ALTER COLUMN edited_at TYPE TIMESTAMPTZ USING edited_at AT TIME ZONE 'UTC',
  ALTER COLUMN deleted_at TYPE TIMESTAMPTZ USING deleted_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 4. CATEGORIES TABLE
-- ============================================================================

ALTER TABLE categories
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 5. KNOWLEDGE_ARTICLES TABLE
-- ============================================================================

ALTER TABLE knowledge_articles
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC',
  ALTER COLUMN published_at TYPE TIMESTAMPTZ USING published_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 6. ATTACHMENTS TABLE
-- ============================================================================

ALTER TABLE attachments
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 7. NOTIFICATIONS TABLE
-- ============================================================================

ALTER TABLE notifications
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN read_at TYPE TIMESTAMPTZ USING read_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 8. TICKET_HISTORY TABLE
-- ============================================================================

ALTER TABLE ticket_history
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 9. SLA_RULES TABLE
-- ============================================================================

ALTER TABLE sla_rules
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 10. ESCALATION_RULES TABLE
-- ============================================================================

ALTER TABLE escalation_rules
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 11. ESCALATION_HISTORY TABLE
-- ============================================================================

ALTER TABLE escalation_history
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 12. BUSINESS_HOURS TABLE
-- ============================================================================

ALTER TABLE business_hours
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 13. HOLIDAYS TABLE
-- ============================================================================

-- Note: holidays.date is DATE type, not TIMESTAMP, so no change needed
ALTER TABLE holidays
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

-- ============================================================================
-- 14. REFRESH_TOKENS TABLE (if exists)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'refresh_tokens') THEN
    ALTER TABLE refresh_tokens
      ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
      ALTER COLUMN expires_at TYPE TIMESTAMPTZ USING expires_at AT TIME ZONE 'UTC';
  END IF;
END $$;

-- ============================================================================
-- 15. PASSWORD_RESETS TABLE (if exists)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'password_resets') THEN
    ALTER TABLE password_resets
      ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
      ALTER COLUMN expires_at TYPE TIMESTAMPTZ USING expires_at AT TIME ZONE 'UTC',
      ALTER COLUMN used_at TYPE TIMESTAMPTZ USING used_at AT TIME ZONE 'UTC';
  END IF;
END $$;

-- ============================================================================
-- 16. AUDIT_LOGS TABLE (if exists)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    ALTER TABLE audit_logs
      ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that all timestamp columns are now TIMESTAMPTZ
DO $$
DECLARE
  wrong_type_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO wrong_type_count
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND data_type = 'timestamp without time zone';
  
  IF wrong_type_count > 0 THEN
    RAISE EXCEPTION 'Migration incomplete: % columns still using TIMESTAMP WITHOUT TIME ZONE', wrong_type_count;
  END IF;
  
  RAISE NOTICE 'Migration successful: All timestamp columns converted to TIMESTAMPTZ';
END $$;

-- ============================================================================
-- RECREATE VIEWS
-- ============================================================================

-- Recreate v_active_tickets_summary view
CREATE OR REPLACE VIEW v_active_tickets_summary AS
SELECT 
  t.id,
  t.ticket_number,
  t.title,
  t.status,
  t.priority,
  t.created_at,
  t.due_date,
  u.full_name as creator_name,
  a.full_name as assignee_name,
  c.name as category_name
FROM tickets t
LEFT JOIN users u ON t.created_by = u.id
LEFT JOIN users a ON t.assigned_to = a.id
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.status NOT IN ('closed', 'resolved');

-- Recreate v_sla_compliance view
CREATE OR REPLACE VIEW v_sla_compliance AS
SELECT 
  t.id,
  t.ticket_number,
  t.priority,
  t.created_at,
  t.due_date,
  t.resolved_at,
  t.status,
  CASE 
    WHEN t.resolved_at IS NOT NULL AND t.resolved_at <= t.due_date THEN 'met'
    WHEN t.resolved_at IS NOT NULL AND t.resolved_at > t.due_date THEN 'breached'
    WHEN t.resolved_at IS NULL AND NOW() > t.due_date THEN 'breached'
    ELSE 'at_risk'
  END as sla_status
FROM tickets t;

COMMIT;

-- ============================================================================
-- POST-MIGRATION VERIFICATION QUERIES
-- ============================================================================

-- Run these queries after migration to verify:

-- 1. Check all timestamp columns
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND data_type LIKE '%timestamp%'
ORDER BY table_name, ordinal_position;

-- 2. Check sample ticket data
SELECT 
  id,
  ticket_number,
  created_at,
  due_date,
  EXTRACT(TIMEZONE FROM created_at) as tz_offset_seconds
FROM tickets
ORDER BY id DESC
LIMIT 5;

-- 3. Verify timezone is stored
SELECT 
  'tickets' as table_name,
  created_at,
  created_at AT TIME ZONE 'UTC' as utc_time,
  created_at AT TIME ZONE 'Asia/Ho_Chi_Minh' as vn_time
FROM tickets
ORDER BY id DESC
LIMIT 1;
