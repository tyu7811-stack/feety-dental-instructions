-- Add expires_at column to clinic_relations table
ALTER TABLE clinic_relations 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days');

-- Update existing rows to have an expiration date
UPDATE clinic_relations 
SET expires_at = created_at + INTERVAL '7 days' 
WHERE expires_at IS NULL;
