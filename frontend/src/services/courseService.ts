import { supabase } from "@/lib/supabase";
import type {
  Course,
  CourseModule,
  QuizQuestion,
  UserCourseProgress,
  UserModuleProgress,
  QuizAttempt,
  CourseWithProgress,
  ModuleWithProgress,
} from "@/types/courses";

// Mock courses data for fallback
const mockCourses: CourseWithProgress[] = [];

// Fetch all courses with user progress
export const fetchCoursesWithProgress = async (): Promise<
  CourseWithProgress[]
> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data: courses, error: coursesError } = await supabase
      .from("preshotcourses")
      .select("*")
      .order("order_index");

    if (coursesError) {
      console.warn('Supabase courses fetch failed, using mock data:', coursesError.message);
      return mockCourses;
    }

    if (!session?.user) {
      return courses || mockCourses;
    }

    // Fetch user progress for all courses
    const { data: progress } = await supabase
      .from("user_course_progress")
      .select("*")
      .eq("user_id", session.user.id);

    // Combine courses with progress
    return (courses || []).map((course) => ({
      ...course,
      progress: progress?.find((p) => p.course_id === course.id),
    }));
  } catch (error) {
    console.warn('Course service error, using mock data:', error);
    return mockCourses;
  }
};

// Fetch single course with modules
export const fetchCourseWithModules = async (
  courseId: string
): Promise<{ course: Course; modules: ModuleWithProgress[] }> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: course, error: courseError } = await supabase
    .from("preshotcourses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (courseError) throw courseError;

  const { data: modules, error: modulesError } = await supabase
    .from("course_modules")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index");

  if (modulesError) throw modulesError;

  if (!session?.user) {
    return { course, modules: modules || [] };
  }

  // Fetch user progress for modules
  const { data: moduleProgress } = await supabase
    .from("user_module_progress")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("course_id", courseId);

  const modulesWithProgress = (modules || []).map((module) => ({
    ...module,
    progress: moduleProgress?.find((p) => p.module_id === module.id),
  }));

  return { course, modules: modulesWithProgress };
};

// Fetch module with quiz questions
export const fetchModuleWithQuiz = async (
  moduleId: string
): Promise<{ module: CourseModule; questions: QuizQuestion[] }> => {
  const { data: module, error: moduleError } = await supabase
    .from("course_modules")
    .select("*")
    .eq("id", moduleId)
    .single();

  if (moduleError) throw moduleError;

  const { data: questions, error: questionsError } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("module_id", moduleId)
    .order("order_index");

  if (questionsError) throw questionsError;

  return { module, questions: questions || [] };
};

// Mark module as completed
export const completeModule = async (
  moduleId: string,
  courseId: string,
  timeSpentMinutes: number = 0
): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Not authenticated");

  const { error } = await supabase.from("user_module_progress").upsert({
    user_id: session.user.id,
    module_id: moduleId,
    course_id: courseId,
    is_completed: true,
    completed_at: new Date().toISOString(),
    time_spent_minutes: timeSpentMinutes,
  });

  if (error) throw error;
};

// Submit quiz attempt
export const submitQuizAttempt = async (
  moduleId: string,
  answers: Record<string, string>,
  score: number,
  totalPoints: number,
  passed: boolean
): Promise<QuizAttempt> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Not authenticated");

  // Get attempt number
  const { data: previousAttempts } = await supabase
    .from("user_quiz_attempts")
    .select("attempt_number")
    .eq("user_id", session.user.id)
    .eq("module_id", moduleId)
    .order("attempt_number", { ascending: false })
    .limit(1);

  const attemptNumber = previousAttempts?.[0]?.attempt_number
    ? previousAttempts[0].attempt_number + 1
    : 1;

  const { data, error } = await supabase
    .from("user_quiz_attempts")
    .insert({
      user_id: session.user.id,
      module_id: moduleId,
      score,
      total_points: totalPoints,
      answers,
      passed,
      attempt_number: attemptNumber,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get user's quiz attempts for a module
export const fetchQuizAttempts = async (
  moduleId: string
): Promise<QuizAttempt[]> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return [];

  const { data, error } = await supabase
    .from("user_quiz_attempts")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("module_id", moduleId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get user's course certificates
export const fetchUserCertificates = async (): Promise<any[]> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return [];

  const { data, error } = await supabase
    .from("course_certificates")
    .select(
      `
      *,
      preshotcourses (
        title,
        description,
        category
      )
    `
    )
    .eq("user_id", session.user.id)
    .order("issued_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Generate certificate (called when course is completed)
export const generateCertificate = async (
  courseId: string,
  finalScore?: number
): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Not authenticated");

  // Generate unique certificate number
  const certificateNumber = `PAIDEIA-${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)
    .toUpperCase()}`;

  const { error } = await supabase.from("course_certificates").insert({
    user_id: session.user.id,
    course_id: courseId,
    certificate_number: certificateNumber,
    final_score: finalScore,
  });

  if (error) throw error;
};
