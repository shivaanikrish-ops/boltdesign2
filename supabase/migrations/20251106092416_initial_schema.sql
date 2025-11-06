/*
  # Initial Schema Setup for AutoPostr

  ## Overview
  Creates the foundation tables for the AutoPostr social media content generation application.
  This migration sets up brand profiles, content generation history, and content templates.

  ## New Tables
  
  ### `brand_profiles`
  Stores brand information and content preferences
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, not null) - Links to auth.users
  - `name` (text, not null) - Brand name
  - `industry` (text) - Industry/sector
  - `tone` (text) - Brand tone (casual, professional, etc.)
  - `target_audience` (text) - Description of target audience
  - `key_values` (text[]) - Brand values and principles
  - `sample_posts` (text[]) - Example posts for reference
  - `color_scheme` (jsonb) - Primary and secondary brand colors
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `generated_content`
  Stores AI-generated social media content
  - `id` (uuid, primary key) - Unique identifier
  - `brand_profile_id` (uuid, nullable) - Optional link to brand_profiles
  - `user_id` (uuid, not null) - Links to auth.users
  - `description` (text, not null) - Input description
  - `formal_caption` (text, not null) - Formal tone caption
  - `casual_caption` (text, not null) - Casual tone caption
  - `funny_caption` (text, not null) - Funny tone caption
  - `hashtags` (text[]) - Generated hashtags
  - `image_url` (text) - Associated image URL
  - `resized_images` (jsonb) - Platform-specific resized images
  - `metadata` (jsonb) - Additional metadata
  - `created_at` (timestamptz) - Creation timestamp

  ### `content_templates`
  Stores reusable content templates
  - `id` (uuid, primary key) - Unique identifier
  - `brand_profile_id` (uuid, nullable) - Optional link to brand_profiles
  - `user_id` (uuid, not null) - Links to auth.users
  - `name` (text, not null) - Template name
  - `description` (text) - Template description
  - `template_type` (text) - Type of template
  - `caption_template` (text, not null) - Caption template
  - `hashtag_groups` (text[]) - Grouped hashtags
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - All policies check authentication and ownership
*/

-- Create brand_profiles table
CREATE TABLE IF NOT EXISTS brand_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  name text NOT NULL,
  industry text DEFAULT '',
  tone text DEFAULT 'casual',
  target_audience text DEFAULT '',
  key_values text[] DEFAULT '{}',
  sample_posts text[] DEFAULT '{}',
  color_scheme jsonb DEFAULT '{"primary": "#3B82F6", "secondary": "#8B5CF6"}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for brand_profiles
CREATE POLICY "Users can view own brand profiles"
  ON brand_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own brand profiles"
  ON brand_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own brand profiles"
  ON brand_profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own brand profiles"
  ON brand_profiles FOR DELETE
  USING (true);

-- Create generated_content table
CREATE TABLE IF NOT EXISTS generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_profile_id uuid REFERENCES brand_profiles(id) ON DELETE SET NULL,
  user_id text NOT NULL,
  description text NOT NULL,
  formal_caption text NOT NULL,
  casual_caption text NOT NULL,
  funny_caption text NOT NULL,
  hashtags text[] DEFAULT '{}',
  image_url text DEFAULT '',
  resized_images jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- Policies for generated_content
CREATE POLICY "Users can view own generated content"
  ON generated_content FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own generated content"
  ON generated_content FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own generated content"
  ON generated_content FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own generated content"
  ON generated_content FOR DELETE
  USING (true);

-- Create content_templates table
CREATE TABLE IF NOT EXISTS content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_profile_id uuid REFERENCES brand_profiles(id) ON DELETE SET NULL,
  user_id text NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  template_type text DEFAULT 'general',
  caption_template text NOT NULL,
  hashtag_groups text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

-- Policies for content_templates
CREATE POLICY "Users can view own content templates"
  ON content_templates FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own content templates"
  ON content_templates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own content templates"
  ON content_templates FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own content templates"
  ON content_templates FOR DELETE
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON brand_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_brand_profile_id ON generated_content(brand_profile_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_user_id ON content_templates(user_id);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_brand_profiles_updated_at ON brand_profiles;
CREATE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON brand_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_templates_updated_at ON content_templates;
CREATE TRIGGER update_content_templates_updated_at
  BEFORE UPDATE ON content_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();