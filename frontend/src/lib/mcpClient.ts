// MCP Server Client for Preshot AI Tools
// Connects to the deployed MCP server on Cloudflare Workers

const MCP_SERVER_URL = import.meta.env.VITE_MCP_SERVER_URL || 'http://localhost:8787';

export interface AssessmentRequest {
  background: string;
  goals: string;
  targetPrograms?: string[];
  essayDraft?: string;
}

export interface FeedbackRequest {
  draft: string;
  programType?: string;
}

export interface LessonRequest {
  topic: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface InterviewRequest {
  interviewType: string;
  role: string;
  experience?: string;
  questions?: string[];
}

export interface ProgramMatchRequest {
  type?: string;
  region?: string;
}

export interface BlockchainSubmitRequest {
  userAddress: string;
  assessmentData: any;
  signature: string;
}

class MCPClient {
  private baseURL: string;

  constructor(baseURL: string = MCP_SERVER_URL) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(endpoint: string, method: 'GET' | 'POST' = 'POST', body?: any): Promise<T> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body && method === 'POST') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.success && data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Perform diagnostic assessment for fellowship/scholarship readiness
   */
  async performAssessment(request: AssessmentRequest) {
    return this.makeRequest('/api/preshot/assess', 'POST', request);
  }

  /**
   * Get AI feedback on application essays
   */
  async provideFeedback(request: FeedbackRequest) {
    return this.makeRequest('/api/preshot/coach', 'POST', request);
  }

  /**
   * Generate an interactive mindset development lesson
   */
  async generateLesson(request: LessonRequest) {
    return this.makeRequest('/api/preshot/lesson', 'POST', {
      topic: request.topic,
      userLevel: request.userLevel || 'beginner',
    });
  }

  /**
   * Get interview preparation and coaching
   */
  async prepareInterview(request: InterviewRequest) {
    return this.makeRequest('/api/preshot/interview', 'POST', request);
  }

  /**
   * Find matching fellowship/scholarship programs
   */
  async matchPrograms(request: ProgramMatchRequest = {}) {
    const params = new URLSearchParams();
    if (request.type) params.append('type', request.type);
    if (request.region) params.append('region', request.region);
    
    const queryString = params.toString();
    const endpoint = `/api/preshot/programs${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint, 'GET');
  }

  /**
   * Submit assessment to blockchain via IPFS
   */
  async submitToBlockchain(request: BlockchainSubmitRequest) {
    return this.makeRequest('/api/preshot/submit', 'POST', request);
  }

  /**
   * Health check for the MCP server
   */
  async healthCheck() {
    return this.makeRequest('/api/health', 'GET');
  }
}

export const mcpClient = new MCPClient();
export default mcpClient;
