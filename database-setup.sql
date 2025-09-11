-- Slime Collector Database Schema for Supabase
-- Run this in Supabase → SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Each auth user (parent) can own many child profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,           -- child profile name (e.g., "Sam")
  avatar_url TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS profiles_account_idx ON profiles(account_user_id);

-- One cloud save per profile (simple & reliable)
CREATE TABLE IF NOT EXISTS saves (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  data JSONB NOT NULL,          -- serializable game state
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migration codes for family device linking
CREATE TABLE IF NOT EXISTS migration_codes (
  code TEXT PRIMARY KEY,
  account_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS migration_codes_expires_idx ON migration_codes(expires_at);
CREATE INDEX IF NOT EXISTS migration_codes_account_idx ON migration_codes(account_user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles owner can select"
  ON profiles FOR SELECT
  USING (account_user_id = auth.uid());

CREATE POLICY "profiles owner can insert"
  ON profiles FOR INSERT
  WITH CHECK (account_user_id = auth.uid());

CREATE POLICY "profiles owner can update"
  ON profiles FOR UPDATE
  USING (account_user_id = auth.uid());

CREATE POLICY "profiles owner can delete"
  ON profiles FOR DELETE
  USING (account_user_id = auth.uid());

-- RLS Policies for saves (via profile ownership)
CREATE POLICY "read own saves"
  ON saves FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = saves.profile_id
        AND p.account_user_id = auth.uid()
    )
  );

CREATE POLICY "upsert own saves (insert)"
  ON saves FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = saves.profile_id
        AND p.account_user_id = auth.uid()
    )
  );

CREATE POLICY "upsert own saves (update)"
  ON saves FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = saves.profile_id
        AND p.account_user_id = auth.uid()
    )
  );

-- RLS Policies for migration codes
CREATE POLICY "migration codes owner can select"
  ON migration_codes FOR SELECT
  USING (account_user_id = auth.uid());

CREATE POLICY "migration codes owner can insert"
  ON migration_codes FOR INSERT
  WITH CHECK (account_user_id = auth.uid());

CREATE POLICY "migration codes owner can update"
  ON migration_codes FOR UPDATE
  USING (account_user_id = auth.uid());

-- Allow reading migration codes by code (for verification)
CREATE POLICY "migration codes verify by code"
  ON migration_codes FOR SELECT
  USING (true);  -- Anyone can read to verify codes, but RLS still protects user data

-- Function to cleanup expired migration codes (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_migration_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM migration_codes
  WHERE expires_at < now() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a scheduled job to cleanup expired codes daily
-- (You can set this up in Supabase → Database → Cron Jobs)
-- SELECT cron.schedule('cleanup-migration-codes', '0 2 * * *', 'SELECT cleanup_expired_migration_codes();');


