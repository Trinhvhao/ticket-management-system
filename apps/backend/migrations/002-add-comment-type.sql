-- Migration: Add type column to comments table
-- This migration adds the type ENUM column and other fields needed for the Comment entity

-- Step 1: Create ENUM type if not exists
DO $$ BEGIN
    CREATE TYPE comment_type AS ENUM ('public', 'internal', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add type column
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS type comment_type NOT NULL DEFAULT 'public';

-- Step 3: Migrate existing data based on is_internal
UPDATE comments 
SET type = CASE 
    WHEN is_internal = true THEN 'internal'::comment_type
    ELSE 'public'::comment_type
END
WHERE type = 'public'; -- Only update if not already set

-- Step 4: Add other new columns
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP;

ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS metadata JSONB;

ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Step 5: Create index on type column
CREATE INDEX IF NOT EXISTS idx_comments_type ON comments(type);

-- Optional: You can keep is_internal for backward compatibility or remove it
-- ALTER TABLE comments DROP COLUMN IF EXISTS is_internal;

COMMENT ON COLUMN comments.type IS 'Comment type: public (visible to all), internal (IT staff only), system (automated)';
COMMENT ON COLUMN comments.is_edited IS 'Whether the comment has been edited';
COMMENT ON COLUMN comments.edited_at IS 'Timestamp when comment was last edited';
COMMENT ON COLUMN comments.deleted_at IS 'Soft delete timestamp';
