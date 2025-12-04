// API service layer for backend integrations
import { supabase } from "@/lib/supabase";

export interface DiagnosticAssessment {
  userId: string;
  goals: string;
  background: string;
  essayDraft?: string;
  targetPrograms: string[];
}

export interface AssessmentResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  mindsetAlignment: number;
  recommendations: string[];
}

export interface Program {
  id: string;
  name: string;
  type: string;
  deadline: string;
  eligibility: string[];
  selectionCriteria: string[];
  matchScore?: number;
}

export interface CoachFeedback {
  structureScore: number;
  clarityScore: number;
  mindsetScore: number;
  suggestions: string[];
  highlightedIssues: Array<{
    text: string;
    issue: string;
    suggestion: string;
  }>;
}

// Diagnostic Assessment API
export const submitDiagnostic = async (
  assessment: DiagnosticAssessment
): Promise<AssessmentResult> => {
  // TODO: Connect to backend /api/diagnose endpoint
  const response = await fetch("/api/diagnose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assessment),
  });

  if (!response.ok) {
    throw new Error("Failed to submit diagnostic assessment");
  }

  return response.json();
};

// AI Coach API
export const getCoachFeedback = async (
  essayText: string,
  context?: string
): Promise<CoachFeedback> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await supabase.functions.invoke("ai-coach", {
    body: {
      essayText,
      context,
      userId: session?.user?.id,
    },
  });

  if (response.error) {
    console.error("AI Coach error:", response.error);
    throw new Error(response.error.message || "Failed to get coach feedback");
  }

  return response.data as CoachFeedback;
};

// Program Library API
export const fetchPrograms = async (filters?: {
  type?: string;
  region?: string;
  deadline?: string;
}): Promise<Program[]> => {
  // TODO: Connect to backend /api/programs endpoint
  const params = new URLSearchParams(filters as any);
  const response = await fetch(`/api/programs?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch programs");
  }

  return response.json();
};

export const matchPrograms = async (userProfile: any): Promise<Program[]> => {
  // TODO: Connect to backend /api/programs/match endpoint
  const response = await fetch("/api/programs/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userProfile),
  });

  if (!response.ok) {
    throw new Error("Failed to match programs");
  }

  return response.json();
};

// CAMP Network API Integration
export const syncUserWithCAMP = async (
  userId: string,
  userData: any
): Promise<void> => {
  // TODO: Connect to CAMP Network API for user sync
  const response = await fetch("/api/camp/sync-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, userData }),
  });

  if (!response.ok) {
    throw new Error("Failed to sync user with CAMP Network");
  }
};

export const reportActivityToCAMP = async (
  userId: string,
  activity: any
): Promise<void> => {
  // TODO: Connect to CAMP Network API for activity reporting
  const response = await fetch("/api/camp/report-activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, activity }),
  });

  if (!response.ok) {
    throw new Error("Failed to report activity to CAMP Network");
  }
};
