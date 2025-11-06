/*
  # Add Singapore Timezone Conversion Functions

  ## Overview
  This migration adds database functions to return scheduled and planned posts.

  ## New Functions

  ### `get_scheduled_posts_sg(p_user_id text)`
  Returns scheduled posts
  - Returns results in YYYY-MM-DD format
  - Orders by scheduled_date and scheduled_time ascending

  ### `get_planned_posts_sg(p_user_id text)`
  Returns planned posts
  - Returns results in YYYY-MM-DD format
  - Orders by suggested_date ascending
*/

-- Function to get scheduled posts
CREATE OR REPLACE FUNCTION get_scheduled_posts_sg(p_user_id text)
RETURNS TABLE (
  id uuid,
  user_id text,
  brand_profile_id uuid,
  generated_content_id uuid,
  title text,
  caption text,
  hashtags text[],
  platforms text[],
  image_url text,
  scheduled_date text,
  scheduled_time time,
  timezone text,
  status text,
  notes text,
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sp.id,
    sp.user_id,
    sp.brand_profile_id,
    sp.generated_content_id,
    sp.title,
    sp.caption,
    sp.hashtags,
    sp.platforms,
    sp.image_url,
    sp.scheduled_date::text as scheduled_date,
    sp.scheduled_time,
    sp.timezone,
    sp.status,
    sp.notes,
    sp.metadata,
    sp.created_at,
    sp.updated_at
  FROM scheduled_posts sp
  WHERE sp.user_id = p_user_id
  ORDER BY sp.scheduled_date ASC, sp.scheduled_time ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get planned posts
CREATE OR REPLACE FUNCTION get_planned_posts_sg(p_user_id text)
RETURNS TABLE (
  id uuid,
  content_plan_id uuid,
  user_id text,
  title text,
  suggested_date text,
  suggested_time time,
  rationale text,
  content_generated boolean,
  caption text,
  hashtags text[],
  platforms text[],
  image_url text,
  status text,
  order_in_plan integer,
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pp.id,
    pp.content_plan_id,
    pp.user_id,
    pp.title,
    pp.suggested_date::text as suggested_date,
    pp.suggested_time,
    pp.rationale,
    pp.content_generated,
    pp.caption,
    pp.hashtags,
    pp.platforms,
    pp.image_url,
    pp.status,
    pp.order_in_plan,
    pp.metadata,
    pp.created_at,
    pp.updated_at
  FROM planned_posts pp
  WHERE pp.user_id = p_user_id
  ORDER BY pp.suggested_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;