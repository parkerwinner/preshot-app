-- ========================================
-- FIX: Rename existing courses table to preshotcourses
-- ========================================

-- Option 1: If you want to keep existing data, RENAME the table
ALTER TABLE IF EXISTS courses RENAME TO preshotcourses;

-- Option 2: If starting fresh, DROP old table and create new one
-- Uncomment if you prefer a clean start:
-- DROP TABLE IF EXISTS courses CASCADE;

-- Add missing columns to preshotcourses (if renamed from courses)
ALTER TABLE preshotcourses 
  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'BookOpen',
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'blue',
  ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Ensure ID column is TEXT type (not SERIAL)
-- If your existing table has integer IDs, you'll need to migrate

-- Create course_modules table (if doesn't exist)
CREATE TABLE IF NOT EXISTS course_modules (
  id SERIAL PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT DEFAULT 'text',
  content JSONB,
  duration_minutes INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint (if table was just created)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'course_modules_course_id_fkey'
  ) THEN
    ALTER TABLE course_modules 
      ADD CONSTRAINT course_modules_course_id_fkey 
      FOREIGN KEY (course_id) REFERENCES preshotcourses(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create progress tracking tables
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
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
  module_id INTEGER NOT NULL,
  course_id TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_id)
);

-- Enable RLS on all tables
ALTER TABLE preshotcourses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;

-- Create policies (public read for demo)
DROP POLICY IF EXISTS "Public can read courses" ON preshotcourses;
CREATE POLICY "Public can read courses" ON preshotcourses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read modules" ON course_modules;
CREATE POLICY "Public can read modules" ON course_modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read course progress" ON user_course_progress;
CREATE POLICY "Public can read course progress" ON user_course_progress FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert course progress" ON user_course_progress;
CREATE POLICY "Public can insert course progress" ON user_course_progress FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update course progress" ON user_course_progress;
CREATE POLICY "Public can update course progress" ON user_course_progress FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can read module progress" ON user_module_progress;
CREATE POLICY "Public can read module progress" ON user_module_progress FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert module progress" ON user_module_progress;
CREATE POLICY "Public can insert module progress" ON user_module_progress FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update module progress" ON user_module_progress;
CREATE POLICY "Public can update module progress" ON user_module_progress FOR UPDATE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON course_modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user ON user_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_module ON user_module_progress(module_id);

-- ========================================
-- INSERT DEMO COURSE
-- ========================================

-- First, ensure the course doesn't exist (in case of re-run)
DELETE FROM preshotcourses WHERE id = 'global-leadership-foundations';

-- Insert demo course
INSERT INTO preshotcourses (
  id,
  title,
  description,
  category,
  duration_minutes,
  difficulty,
  icon,
  color,
  order_index,
  is_locked,
  is_demo,
  created_at,
  updated_at
) VALUES (
  'global-leadership-foundations',
  'Global Leadership Foundations',
  'Master the fundamentals of global leadership, systems thinking, and transformative impact. Earn your Leadership Foundations NFT badge upon completion. 🎓',
  'leadership',
  20,
  'beginner',
  'Users',
  'blue',
  1,
  false,
  true,
  NOW(),
  NOW()
);

-- Insert course modules
INSERT INTO course_modules (course_id, title, description, content_type, duration_minutes, order_index, content) 
VALUES 
  (
    'global-leadership-foundations', 
    'Introduction to Global Leadership',
    'Learn the core principles of servant leadership and global impact.',
    'video', 
    7, 
    1,
    '{"videoUrl": "https://example.com/intro-video", "transcript": "Welcome to Global Leadership Foundations..."}'::jsonb
  ),
  (
    'global-leadership-foundations', 
    'Systems Thinking Framework',
    'Understand complex systems and interconnections.',
    'interactive', 
    8, 
    2,
    '{"interactiveType": "mindmap", "content": "Systems thinking helps you see interconnections..."}'::jsonb
  ),
  (
    'global-leadership-foundations', 
    'Impact Measurement & Storytelling',
    'Learn to quantify and communicate your social impact.',
    'text', 
    5, 
    3,
    '{"markdown": "# Impact Measurement\n\nLearn to quantify your social impact with metrics and compelling narratives..."}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Verify the data
SELECT 'Courses created:' as info, COUNT(*) as count FROM preshotcourses;
SELECT 'Modules created:' as info, COUNT(*) as count FROM course_modules;
