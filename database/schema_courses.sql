-- ========================================
-- PRESHOT COURSES & MODULES SCHEMA
-- ========================================

-- Drop existing courses table if migrating
-- DROP TABLE IF EXISTS courses CASCADE;

-- Create courses table with all required fields
CREATE TABLE IF NOT EXISTS preshotcourses (
  id TEXT PRIMARY KEY,  -- Use text ID like 'global-leadership-foundations'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,  -- 'leadership', 'systems-thinking', etc.
  icon TEXT DEFAULT 'BookOpen',  -- Lucide icon name
  color TEXT DEFAULT 'blue',  -- Tailwind color name
  duration_minutes INTEGER DEFAULT 30,
  order_index INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  is_demo BOOLEAN DEFAULT false,  -- Flag for demo courses with bypass
  content JSONB,  -- Detailed lesson content
  requirements TEXT[],  -- Prerequisites
  learning_objectives TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create course_modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id SERIAL PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES preshotcourses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT DEFAULT 'text',  -- 'text', 'video', 'interactive', 'quiz'
  content JSONB,  -- Module content (markdown, video URL, quiz questions, etc.)
  duration_minutes INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create course_progress table for tracking user completion
CREATE TABLE IF NOT EXISTS course_progress (
  id SERIAL PRIMARY KEY,
  user_address TEXT NOT NULL,  -- Wallet address
  course_id TEXT NOT NULL REFERENCES preshotcourses(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES course_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  score INTEGER,  -- For quizzes
  bypass_used BOOLEAN DEFAULT false,  -- Track if bypass was used (hackathon only)
  UNIQUE(user_address, course_id, module_id)
);

-- Enable Row Level Security
ALTER TABLE preshotcourses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Public read access for courses and modules
CREATE POLICY "Public can read courses" ON preshotcourses FOR SELECT USING (true);
CREATE POLICY "Public can read modules" ON course_modules FOR SELECT USING (true);

-- Users can only read/write their own progress
CREATE POLICY "Users can view own progress" ON course_progress 
  FOR SELECT USING (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own progress" ON course_progress 
  FOR INSERT WITH CHECK (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own progress" ON course_progress 
  FOR UPDATE USING (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON course_modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_address);
CREATE INDEX IF NOT EXISTS idx_course_progress_course ON course_progress(course_id);

-- ========================================
-- INSERT DEMO COURSE: Global Leadership Foundations
-- ========================================

INSERT INTO preshotcourses (
  id,
  title,
  description,
  category,
  icon,
  color,
  duration_minutes,
  order_index,
  is_locked,
  is_demo,
  learning_objectives,
  requirements
) VALUES (
  'global-leadership-foundations',
  'Global Leadership Foundations',
  'Master the fundamentals of global leadership, systems thinking, and transformative impact. Earn your Leadership Foundations NFT badge upon completion. 🎓',
  'leadership',
  'Users',
  'blue',
  20,
  1,
  false,  -- Unlocked for everyone
  true,   -- This is a demo course with bypass enabled
  ARRAY[
    'Understand core principles of servant leadership',
    'Apply systems thinking to complex challenges',
    'Measure and communicate social impact effectively',
    'Develop a personal theory of change'
  ],
  ARRAY['Open to all learners', 'No prerequisites required']
) ON CONFLICT (id) DO NOTHING;

-- Insert course modules
INSERT INTO course_modules (course_id, title, content_type, duration_minutes, order_index, content) 
VALUES 
  (
    'global-leadership-foundations', 
    'Introduction to Global Leadership', 
    'video', 
    7, 
    1,
    '{"videoUrl": "https://example.com/intro-video", "transcript": "Welcome to Global Leadership..."}'::jsonb
  ),
  (
    'global-leadership-foundations', 
    'Systems Thinking Framework', 
    'interactive', 
    8, 
    2,
    '{"interactiveType": "mindmap", "content": "Systems thinking helps you see interconnections..."}'::jsonb
  ),
  (
    'global-leadership-foundations', 
    'Impact Measurement & Storytelling', 
    'text', 
    5, 
    3,
    '{"markdown": "# Impact Measurement\n\nLearn to quantify your social impact..."}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- Function to get course completion percentage for a user
CREATE OR REPLACE FUNCTION get_course_completion(
  p_user_address TEXT,
  p_course_id TEXT
) RETURNS INTEGER AS $$
DECLARE
  total_modules INTEGER;
  completed_modules INTEGER;
BEGIN
  -- Get total required modules
  SELECT COUNT(*) INTO total_modules
  FROM course_modules
  WHERE course_id = p_course_id AND is_required = true;
  
  -- Get completed modules
  SELECT COUNT(*) INTO completed_modules
  FROM course_progress
  WHERE user_address = p_user_address 
    AND course_id = p_course_id;
  
  -- Return percentage
  IF total_modules = 0 THEN
    RETURN 0;
  ELSE
    RETURN (completed_modules * 100 / total_modules)::INTEGER;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to mark course as complete and trigger NFT minting
CREATE OR REPLACE FUNCTION complete_course_with_bypass(
  p_user_address TEXT,
  p_course_id TEXT,
  p_bypass BOOLEAN DEFAULT false
) RETURNS JSONB AS $$
DECLARE
  v_course_title TEXT;
  v_result JSONB;
BEGIN
  -- Get course info
  SELECT title INTO v_course_title
  FROM preshotcourses
  WHERE id = p_course_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Course not found'
    );
  END IF;
  
  -- If bypass used, mark all modules as complete
  IF p_bypass THEN
    INSERT INTO course_progress (user_address, course_id, module_id, bypass_used)
    SELECT p_user_address, p_course_id, id, true
    FROM course_modules
    WHERE course_id = p_course_id
    ON CONFLICT (user_address, course_id, module_id) 
    DO UPDATE SET bypass_used = true, completed_at = CURRENT_TIMESTAMP;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Course completed',
    'course_title', v_course_title,
    'bypass_used', p_bypass,
    'completion_percentage', get_course_completion(p_user_address, p_course_id)
  );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- NOTES
-- ========================================
-- **HACKATHON BYPASS**: The is_demo flag and bypass functionality are temporary.
-- After hackathon, set is_demo = false and remove bypass UI from frontend.
-- Users will then need to complete all modules to earn their NFT badge.
