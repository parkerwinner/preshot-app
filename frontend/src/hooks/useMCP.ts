// React hooks for MCP tool integration
import { useState, useCallback } from 'react';
import mcpClient, {
  AssessmentRequest,
  FeedbackRequest,
  LessonRequest,
  InterviewRequest,
  ProgramMatchRequest,
  BlockchainSubmitRequest,
} from '../lib/mcpClient';

// Enhanced result validation
function validateAssessmentResult(result: any): void {
  if (!result) {
    throw new Error('Empty assessment result received');
  }
  
  if (!result.success) {
    throw new Error('Assessment failed on server');
  }
  
  if (typeof result.readinessScore !== 'number' || 
      result.readinessScore < 0 || 
      result.readinessScore > 100) {
    throw new Error('Invalid readiness score received');
  }
  
  if (!result.componentScores || 
      typeof result.componentScores !== 'object') {
    throw new Error('Invalid component scores structure');
  }
  
  // Validate component scores
  const requiredComponents = [
    'leadershipImpact',
    'narrativeCommunication',
    'strategicFit',
    'systemsThinking'
  ];
  
  for (const component of requiredComponents) {
    if (typeof result.componentScores[component] !== 'number' ||
        result.componentScores[component] < 0 ||
        result.componentScores[component] > 100) {
      throw new Error(`Invalid ${component} score`);
    }
  }
  
  if (!Array.isArray(result.strengths) || result.strengths.length === 0) {
    throw new Error('No strengths provided in assessment');
  }
  
  if (!Array.isArray(result.weaknesses) || result.weaknesses.length === 0) {
    throw new Error('No weaknesses provided in assessment');
  }
  
  if (!Array.isArray(result.recommendations) || result.recommendations.length === 0) {
    throw new Error('No recommendations provided in assessment');
  }
}

function validateFeedbackResult(result: any): void {
  if (!result) {
    throw new Error('Empty feedback result received');
  }
  
  if (!result.success) {
    throw new Error('Feedback generation failed on server');
  }
  
  if (typeof result.overallScore !== 'number' || 
      result.overallScore < 0 || 
      result.overallScore > 100) {
    throw new Error('Invalid overall score received');
  }
  
  if (!result.structureFeedback || !result.clarityFeedback || 
      !result.impactFeedback || !result.mindsetFeedback) {
    throw new Error('Incomplete feedback received');
  }
  
  if (!Array.isArray(result.revisionPriorities) || result.revisionPriorities.length === 0) {
    throw new Error('No revision priorities provided');
  }
}

function validateInterviewResult(result: any): void {
  if (!result) {
    throw new Error('Empty interview prep result received');
  }
  
  if (!result.success) {
    throw new Error('Interview preparation failed on server');
  }
  
  if (!Array.isArray(result.mockQuestions) || result.mockQuestions.length === 0) {
    throw new Error('No interview questions provided');
  }
  
  if (!Array.isArray(result.sampleAnswers)) {
    throw new Error('No sample answers provided');
  }
}

function validateLessonResult(result: any): void {
  if (!result) {
    throw new Error('Empty lesson result received');
  }
  
  if (!result.success) {
    throw new Error('Lesson generation failed on server');
  }
  
  if (!result.title || !result.duration) {
    throw new Error('Incomplete lesson metadata');
  }
  
  if (!Array.isArray(result.learningObjectives) || result.learningObjectives.length === 0) {
    throw new Error('No learning objectives provided');
  }
  
  if (!Array.isArray(result.sections) || result.sections.length === 0) {
    throw new Error('No lesson sections provided');
  }
}

export function useAssessment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const performAssessment = useCallback(async (request: AssessmentRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate request before sending
      if (!request.background || request.background.trim().length < 20) {
        throw new Error('Background must be at least 20 characters for accurate assessment');
      }
      
      if (!request.goals || request.goals.trim().length < 20) {
        throw new Error('Goals must be at least 20 characters for accurate assessment');
      }
      
      console.log('[useAssessment] Performing assessment with:', {
        backgroundLength: request.background.length,
        goalsLength: request.goals.length,
        targetPrograms: request.targetPrograms?.length || 0,
        hasEssay: !!request.essayDraft
      });
      
      const result = await mcpClient.performAssessment(request);
      
      console.log('[useAssessment] Raw result:', result);
      
      // Validate result structure
      validateAssessmentResult(result);
      
      console.log('[useAssessment] Validation passed. Score:', result.readinessScore);
      
      setData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      console.error('[useAssessment] Error:', error.message);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { performAssessment, loading, error, data };
}

export function useFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const provideFeedback = useCallback(async (request: FeedbackRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate request
      if (!request.draft || request.draft.trim().length < 50) {
        throw new Error('Draft must be at least 50 characters for meaningful feedback');
      }
      
      console.log('[useFeedback] Requesting feedback for draft length:', request.draft.length);
      
      const result = await mcpClient.provideFeedback(request);
      
      console.log('[useFeedback] Raw result:', result);
      
      // Validate result structure
      validateFeedbackResult(result);
      
      console.log('[useFeedback] Validation passed. Score:', result.overallScore);
      
      setData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      console.error('[useFeedback] Error:', error.message);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { provideFeedback, loading, error, data };
}

export function useLesson() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const generateLesson = useCallback(async (request: LessonRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate request
      if (!request.topic || request.topic.trim().length < 3) {
        throw new Error('Topic must be at least 3 characters');
      }
      
      console.log('[useLesson] Generating lesson for topic:', request.topic);
      
      const result = await mcpClient.generateLesson(request);
      
      console.log('[useLesson] Raw result:', result);
      
      // Validate result structure
      validateLessonResult(result);
      
      console.log('[useLesson] Validation passed. Lesson:', result.title);
      
      setData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      console.error('[useLesson] Error:', error.message);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateLesson, loading, error, data };
}

export function useInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const prepareInterview = useCallback(async (request: InterviewRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate request
      if (!request.interviewType || request.interviewType.trim().length < 3) {
        throw new Error('Interview type is required');
      }
      
      if (!request.role || request.role.trim().length < 3) {
        throw new Error('Role is required');
      }
      
      console.log('[useInterview] Preparing interview:', {
        type: request.interviewType,
        role: request.role,
        hasQuestions: !!request.questions?.length
      });
      
      const result = await mcpClient.prepareInterview(request);
      
      console.log('[useInterview] Raw result:', result);
      
      // Validate result structure
      validateInterviewResult(result);
      
      console.log('[useInterview] Validation passed. Questions:', result.mockQuestions.length);
      
      setData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      console.error('[useInterview] Error:', error.message);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { prepareInterview, loading, error, data };
}

export function usePrograms() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const matchPrograms = useCallback(async (request: ProgramMatchRequest = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[usePrograms] Discovering programs with filters:', request);
      
      const result = await mcpClient.matchPrograms(request);
      
      console.log('[usePrograms] Raw result:', result);
      
      // Validate result structure
      if (!result) {
        throw new Error('Empty programs result received');
      }
      
      if (!Array.isArray(result.programs)) {
        throw new Error('Invalid programs structure');
      }
      
      console.log('[usePrograms] Validation passed. Programs found:', result.programs.length);
      
      setData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      console.error('[usePrograms] Error:', error.message);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { matchPrograms, loading, error, data };
}

export function useBlockchainSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const submitToBlockchain = useCallback(async (request: BlockchainSubmitRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate request
      if (!request.userAddress || !request.userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error('Valid Ethereum address is required');
      }
      
      if (!request.assessmentData) {
        throw new Error('Assessment data is required');
      }
      
      if (!request.signature) {
        throw new Error('Signature is required');
      }
      
      console.log('[useBlockchain] Submitting to blockchain:', {
        address: request.userAddress,
        score: request.assessmentData.readinessScore
      });
      
      const result = await mcpClient.submitToBlockchain(request);
      
      console.log('[useBlockchain] Raw result:', result);
      
      // Validate result structure
      if (!result) {
        throw new Error('Empty blockchain result received');
      }
      
      // If result contains ipfsUrl but success=false, it means manual submission is needed
      // Return the result so the modal can handle manual submission
      if (!result.success && (result as any).ipfsUrl) {
        console.log('[useBlockchain] Manual submission required (ipfsUrl present), returning result');
        setData(result);
        return result;
      }
      
      // If manualSubmit flag is explicitly set, return result
      if ((result as any).manualSubmit) {
        console.log('[useBlockchain] Manual submission flagged, returning result');
        setData(result);
        return result;
      }
      
      // Only throw error if it's a real failure (not manual submission)
      if (!result.success) {
        throw new Error(result.message || 'Blockchain submission failed');
      }
      
      console.log('[useBlockchain] Validation passed. TX:', result.txHash);
      
      setData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      console.error('[useBlockchain] Error:', error.message);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitToBlockchain, loading, error, data };
}