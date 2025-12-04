# Tables:

Create profiles table (extends user auth with app-specific data):

textCREATE TABLE campprofiles (
id UUID REFERENCES auth.users(id) PRIMARY KEY,
full_name TEXT,
email TEXT UNIQUE,
background JSONB, -- Store user background as JSON (e.g., skills, experience)
goals JSONB, -- User goals (e.g., targeted programs)
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

Create programs table (for program intelligence library):

textCREATE TABLE programs (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
description TEXT,
selection_criteria JSONB, -- Criteria as JSON (e.g., leadership, impact)
evaluation_rubrics JSONB, -- Rubrics for scoring
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (public read, admin write)
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read programs" ON programs FOR SELECT USING (true);

Create assessments table (for diagnostic results):

textCREATE TABLE assessments (
id SERIAL PRIMARY KEY,
user_id UUID REFERENCES profiles(id) NOT NULL,
program_id INTEGER REFERENCES programs(id),
input_data JSONB, -- User inputs (e.g., essay draft, details)
readiness_score INTEGER, -- Score out of 100
feedback JSONB, -- Strengths, weaknesses, alignment gaps
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own assessments" ON assessments FOR ALL USING (auth.uid() = user_id);

Create courses table (for mindset micro-courses):

textCREATE TABLE courses (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
content JSONB, -- Lesson content (text, quizzes, etc.)
category TEXT, -- e.g., 'Leadership', 'Systems Thinking'
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (public read)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read courses" ON courses FOR SELECT USING (true);

Create user_progress table (track course completion and overall progress):

textCREATE TABLE user_progress (
id SERIAL PRIMARY KEY,
user_id UUID REFERENCES profiles(id) NOT NULL,
course_id INTEGER REFERENCES courses(id),
status TEXT DEFAULT 'in_progress', -- e.g., 'in_progress', 'completed'
completion_date TIMESTAMP WITH TIME ZONE,
overall_readiness_improvement JSONB -- Track metrics over time
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

Create mentor_comments table (for mentor feedback):

textCREATE TABLE mentor_comments (
id SERIAL PRIMARY KEY,
user_id UUID REFERENCES profiles(id) NOT NULL,
assessment_id INTEGER REFERENCES assessments(id),
mentor_id UUID REFERENCES profiles(id), -- Assuming mentors are also users
comment TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE mentor_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors and users can access" ON mentor_comments FOR ALL USING (auth.uid() = user_id OR auth.uid() = mentor_id);
After running these, go to the "Authentication" section in the sidebar and ensure email auth is enabled (it's default). You can add providers like Google if needed. In your app code (from Lovable), use Supabase auth methods for signup/login.
For analytics, Supabase's built-in analytics or a view can be added later:
textCREATE VIEW readiness_analytics AS
SELECT user_id, AVG(readiness_score) as avg_score FROM assessments GROUP BY user_id;
