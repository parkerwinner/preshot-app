import { supabase } from "@/lib/supabase";

// Analytics data aggregation service

export interface UserAnalytics {
  overallScore: number;
  improvement: number;
  programsMatched: number;
  completionRate: number;
  assessmentsTaken: number;
  coursesCompleted: number;
  coursesInProgress: number;
  totalStudyTime: number;
  currentStreak: number;
}

export interface ReadinessTrend {
  date: string;
  score: number;
  month?: string;
}

export interface SkillScore {
  skill: string;
  score: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "course" | "assessment" | "streak" | "improvement";
  icon_color: string;
}

// Fetch comprehensive user analytics
export const fetchUserAnalytics = async (
  userId: string
): Promise<UserAnalytics> => {
  // Fetch assessments
  const { data: assessments } = await supabase
    .from("assessments")
    .select("readiness_score, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  // Fetch course progress
  const { data: courseProgress } = await supabase
    .from("user_course_progress")
    .select("status, progress_percentage")
    .eq("user_id", userId);

  // Fetch module progress for time tracking
  const { data: moduleProgress } = await supabase
    .from("user_module_progress")
    .select("time_spent_minutes, created_at, is_completed")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  // Calculate metrics
  const latestScore =
    assessments && assessments.length > 0
      ? assessments[assessments.length - 1].readiness_score || 0
      : 0;

  const firstScore =
    assessments && assessments.length > 0
      ? assessments[0].readiness_score || 0
      : 0;

  const improvement = latestScore - firstScore;

  const completedCourses =
    courseProgress?.filter((c) => c.status === "completed").length || 0;
  const inProgressCourses =
    courseProgress?.filter((c) => c.status === "in_progress").length || 0;
  const totalCourses = courseProgress?.length || 0;
  const completionRate =
    totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  const totalStudyTime =
    moduleProgress?.reduce((sum, m) => sum + (m.time_spent_minutes || 0), 0) ||
    0;

  // Calculate streak (consecutive days with activity)
  const streak = calculateStreak(moduleProgress || []);

  return {
    overallScore: latestScore,
    improvement,
    programsMatched: 0, // TODO: Implement program matching
    completionRate,
    assessmentsTaken: assessments?.length || 0,
    coursesCompleted: completedCourses,
    coursesInProgress: inProgressCourses,
    totalStudyTime,
    currentStreak: streak,
  };
};

// Fetch readiness score trend over time
export const fetchReadinessTrend = async (
  userId: string
): Promise<ReadinessTrend[]> => {
  const { data: assessments } = await supabase
    .from("assessments")
    .select("readiness_score, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (!assessments || assessments.length === 0) {
    return [];
  }

  // Group by month and get average score
  const monthlyData = assessments.reduce(
    (acc: Record<string, { total: number; count: number }>, assessment) => {
      const date = new Date(assessment.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, count: 0 };
      }

      acc[monthKey].total += assessment.readiness_score || 0;
      acc[monthKey].count += 1;

      return acc;
    },
    {}
  );

  return Object.entries(monthlyData).map(([key, value]) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      date: key,
      month: date.toLocaleDateString("en-US", { month: "short" }),
      score: Math.round(value.total / value.count),
    };
  });
};

// Fetch skill analysis from latest assessment
export const fetchSkillAnalysis = async (
  userId: string
): Promise<SkillScore[]> => {
  const { data: assessment } = await supabase
    .from("assessments")
    .select("skills_analysis")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!assessment?.skills_analysis) {
    // Return default skills if no assessment
    return [
      { skill: "Leadership", score: 0 },
      { skill: "Communication", score: 0 },
      { skill: "Critical Thinking", score: 0 },
      { skill: "Global Awareness", score: 0 },
      { skill: "Innovation", score: 0 },
    ];
  }

  // Transform skills_analysis JSONB to array format
  const skills = assessment.skills_analysis;
  return Object.entries(skills).map(([skill, score]) => ({
    skill,
    score: typeof score === "number" ? score : 0,
  }));
};

// Fetch recent achievements
export const fetchRecentAchievements = async (
  userId: string
): Promise<Achievement[]> => {
  const achievements: Achievement[] = [];

  // Get recent course completions
  const { data: completedCourses } = await supabase
    .from("user_course_progress")
    .select(
      `
      completed_at,
      courses (
        title
      )
    `
    )
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(3);

  if (completedCourses) {
    completedCourses.forEach((course: any) => {
      if (course.courses) {
        achievements.push({
          id: `course-${course.completed_at}`,
          title: `Completed "${course.courses.title}"`,
          description: new Date(course.completed_at).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          ),
          date: course.completed_at,
          type: "course",
          icon_color: "green",
        });
      }
    });
  }

  // Get assessment improvements
  const { data: assessments } = await supabase
    .from("assessments")
    .select("readiness_score, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(2);

  if (assessments && assessments.length >= 2) {
    const improvement =
      assessments[0].readiness_score - assessments[1].readiness_score;
    if (improvement > 5) {
      achievements.push({
        id: `improvement-${assessments[0].created_at}`,
        title: `Readiness Score Improved by ${improvement} points`,
        description: new Date(assessments[0].created_at).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        ),
        date: assessments[0].created_at,
        type: "improvement",
        icon_color: "purple",
      });
    }
  }

  // Calculate current streak
  const { data: moduleProgress } = await supabase
    .from("user_module_progress")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const streak = calculateStreak(moduleProgress || []);
  if (streak >= 3) {
    achievements.push({
      id: `streak-${Date.now()}`,
      title: `${streak}-Day Learning Streak`,
      description: "Keep it up!",
      date: new Date().toISOString(),
      type: "streak",
      icon_color: "blue",
    });
  }

  // Sort by date and return top 5
  return achievements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};

// Calculate learning streak (consecutive days with activity)
function calculateStreak(
  moduleProgress: Array<{ created_at: string; is_completed?: boolean }>
): number {
  if (!moduleProgress || moduleProgress.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique activity dates
  const activityDates = moduleProgress
    .map((m) => {
      const date = new Date(m.created_at);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => b - a);

  if (activityDates.length === 0) return 0;

  // Check if there's activity today or yesterday
  const latestActivity = activityDates[0];
  const daysSinceLatest = Math.floor(
    (today.getTime() - latestActivity) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLatest > 1) return 0; // Streak broken

  let streak = 0;
  let expectedDate = today.getTime();

  for (const activityDate of activityDates) {
    const daysDiff = Math.floor(
      (expectedDate - activityDate) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      streak++;
      expectedDate -= 1000 * 60 * 60 * 24; // Move to previous day
    } else if (daysDiff === 1) {
      streak++;
      expectedDate = activityDate - 1000 * 60 * 60 * 24;
    } else {
      break; // Streak broken
    }
  }

  return streak;
}

// Calculate average study time per day
export const calculateAverageStudyTime = (
  moduleProgress: Array<{ time_spent_minutes: number; created_at: string }>
): number => {
  if (!moduleProgress || moduleProgress.length === 0) return 0;

  const totalMinutes = moduleProgress.reduce(
    (sum, m) => sum + (m.time_spent_minutes || 0),
    0
  );

  // Get date range
  const dates = moduleProgress.map((m) => new Date(m.created_at).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const daysDiff = Math.max(
    1,
    Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24))
  );

  return Math.round((totalMinutes / daysDiff / 60) * 10) / 10; // Hours per day
};
