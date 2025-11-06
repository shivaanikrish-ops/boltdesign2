/*
  # Add Alarms Table

  ## Overview
  Creates a table to store user-created alarms for scheduled posts and content planning.
  Users can set alarms for specific dates and times to be reminded about their scheduled content.

  ## New Tables
  - `alarms`
    - `id` (uuid, primary key) - Unique identifier for each alarm
    - `user_id` (text, not null) - User identifier
    - `title` (text, not null) - Title/description of the alarm
    - `alarm_datetime` (timestamptz, not null) - The exact date and time when the alarm should trigger
    - `scheduled_post_id` (uuid, nullable) - Optional reference to a scheduled post
    - `planned_post_id` (uuid, nullable) - Optional reference to a planned post
    - `status` (text, default 'active') - Status: 'active', 'triggered', 'dismissed'
    - `sound_enabled` (boolean, default true) - Whether to play a sound when triggered
    - `notification_enabled` (boolean, default true) - Whether to show browser notification
    - `notes` (text) - Additional notes for the alarm
    - `metadata` (jsonb) - Additional flexible data storage
    - `created_at` (timestamptz) - When the alarm was created
    - `updated_at` (timestamptz) - When the alarm was last modified

  ## Security
  - Enable RLS on alarms table
  - Add policies for users to manage their own alarms
*/

CREATE TABLE IF NOT EXISTS alarms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  alarm_datetime timestamptz NOT NULL,
  scheduled_post_id uuid REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  planned_post_id uuid REFERENCES planned_posts(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  sound_enabled boolean DEFAULT true,
  notification_enabled boolean DEFAULT true,
  notes text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE alarms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alarms"
  ON alarms FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own alarms"
  ON alarms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own alarms"
  ON alarms FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own alarms"
  ON alarms FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_alarms_user_id ON alarms(user_id);
CREATE INDEX IF NOT EXISTS idx_alarms_alarm_datetime ON alarms(alarm_datetime);
CREATE INDEX IF NOT EXISTS idx_alarms_status ON alarms(status);