import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  readinessScore: number;
  completedAssessments: number;
  coursesCompleted: number;
  badges: number;
}

export function useDashboardStats(walletAddress: string | undefined) {
  const [stats, setStats] = useState<DashboardStats>({
    readinessScore: 0,
    completedAssessments: 0,
    coursesCompleted: 0,
    badges: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    fetchStats();
  }, [walletAddress]);

  const fetchStats = async () => {
    if (!walletAddress) return;

    try {
      setLoading(true);
      setError(null);

      // Note: assessments table might not exist yet, so we'll handle gracefully
      let readinessScore = 0;
      let completedAssessmentsCount = 0;

      try {
        // Try to fetch assessments data using wallet address
        const { data: assessments, error: assessmentsError } = await supabase
          .from('assessments')
          .select('readiness_score, created_at')
          .eq('user_address', walletAddress.toLowerCase())
          .order('created_at', { ascending: false });

        if (!assessmentsError && assessments && assessments.length > 0) {
          readinessScore = assessments[0].readiness_score || 0;
          completedAssessmentsCount = assessments.length;
        }
      } catch (err) {
        console.warn('Assessments table not accessible, using default values:', err);
      }

      // Fetch course completion using course_progress table (uses user_address)
      const { data: courseProgress, error: courseError } = await supabase
        .from('course_progress')
        .select('course_id, completed_at')
        .eq('user_address', walletAddress.toLowerCase());

      if (courseError) {
        console.error('Error fetching course progress:', courseError);
      }

      // Count unique completed courses (each course has multiple modules)
      const uniqueCompletedCourses = new Set(
        courseProgress
          ?.filter((p) => p.completed_at)
          ?.map((p) => p.course_id) || []
      );
      const coursesCompleted = uniqueCompletedCourses.size;

      // Each completed course earns a badge (NFT)
      setStats({
        readinessScore,
        completedAssessments: completedAssessmentsCount,
        coursesCompleted,
        badges: coursesCompleted,
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchStats };
}
