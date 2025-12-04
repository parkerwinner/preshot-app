-- ================================================
-- FINAL STEP: Create User Progress Tables
-- ================================================
-- Run this in Supabase SQL Editor to complete setup

CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL REFERENCES preshotcourses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_id INTEGER NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES preshotcourses(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;

-- Policies (open for demo - tighten for production)
CREATE POLICY "Public can read course progress" ON user_course_progress FOR SELECT USING (true);
CREATE POLICY "Public can insert course progress" ON user_course_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update course progress" ON user_course_progress FOR UPDATE USING (true);

CREATE POLICY "Public can read module progress" ON user_module_progress FOR SELECT USING (true);
CREATE POLICY "Public can insert module progress" ON user_module_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update module progress" ON user_module_progress FOR UPDATE USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user ON user_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_module ON user_module_progress(module_id);
