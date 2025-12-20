-- Add is_popular flag to games table
ALTER TABLE games ADD COLUMN IF NOT EXISTS is_popular boolean DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_games_is_popular ON games(is_popular);
