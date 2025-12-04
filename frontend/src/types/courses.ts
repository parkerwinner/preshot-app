// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_minutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: string;
  color: string;
  order_index: number;
  is_locked: boolean;
  is_demo?: boolean;  // Hackathon demo course flag
  prerequisite_course_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  content: ModuleContent;
  order_index: number;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface ModuleContent {
  type: "lesson" | "quiz" | "exercise";
  sections?: LessonSection[];
  quiz_id?: string;
}

export interface LessonSection {
  type: "text" | "image" | "video" | "callout" | "list";
  content: string;
  title?: string;
  items?: string[]; // For lists
  callout_type?: "info" | "warning" | "success" | "tip";
}

export interface QuizQuestion {
  id: string;
  module_id: string;
  question: string;
  question_type: "multiple_choice" | "true_false" | "short_answer";
  options?: string[];
  correct_answer: string;
  explanation?: string;
  points: number;
  order_index: number;
  created_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  status: "not_started" | "in_progress" | "completed";
  progress_percentage: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  course_id: string;
  is_completed: boolean;
  completed_at?: string;
  time_spent_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  total_points: number;
  answers: Record<string, string>;
  passed: boolean;
  attempt_number: number;
  created_at: string;
}

export interface CourseCertificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  final_score?: number;
}

// Extended types with relations
export interface CourseWithProgress extends Course {
  progress?: UserCourseProgress;
  modules_count?: number;
  completed_modules?: number;
}

export interface ModuleWithProgress extends CourseModule {
  progress?: UserModuleProgress;
  quiz_questions?: QuizQuestion[];
}
