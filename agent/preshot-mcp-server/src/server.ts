import { Implementation } from '@modelcontextprotocol/sdk/types.js';
import { McpHonoServerDO } from '@nullshot/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Env } from './env';
import { PinataSDK } from 'pinata';


export class PreshotAgentServer extends McpHonoServerDO<Env> {
	private assessmentCache: Map<string, any> = new Map();
	private readonly MAX_CACHE_SIZE = 500;
	
	// Fellowship/Scholarship Programs Database - Global Coverage
	private readonly PROGRAMS = [
		{
			id: 'fulbright',
			name: 'Fulbright Program',
			type: 'scholarship',
			region: 'Global',
			deadline: 'Varies by country',
			eligibility: {
				ageRange: '18+',
				regions: ['155+ countries worldwide'],
				requirements: ['Bachelor degree', 'Academic/professional achievement', 'English proficiency']
			},
			selectionCriteria: {
				academic: 40,
				leadership: 25,
				culturalExchange: 20,
				projectProposal: 15
			},
			description: 'US government flagship international educational exchange program for graduate study and research.',
			url: 'https://foreign.fulbrightonline.org'
		},
		{
			id: 'rhodes',
			name: 'Rhodes Scholarships',
			type: 'scholarship',
			region: 'Global',
			deadline: 'September-October annually',
			eligibility: {
				ageRange: '18-28',
				regions: ['Global (64 countries)'],
				requirements: ['Outstanding academic achievement', 'Leadership potential', 'Commitment to service']
			},
			selectionCriteria: {
				academic: 35,
				leadership: 30,
				character: 20,
				publicService: 15
			},
			description: 'The world\'s oldest graduate scholarship for study at the University of Oxford.',
			url: 'https://www.rhodeshouse.ox.ac.uk'
		},
		{
			id: 'gates-cambridge',
			name: 'Gates Cambridge Scholarships',
			type: 'scholarship',
			region: 'Global',
			deadline: 'October-December annually',
			eligibility: {
				ageRange: '18+',
				regions: ['All countries except UK'],
				requirements: ['Outstanding academic achievement', 'Leadership capacity', 'Commitment to improving lives']
			},
			selectionCriteria: {
				academic: 40,
				leadership: 25,
				socialCommitment: 25,
				fitWithCambridge: 10
			},
			description: 'Full-cost scholarships for graduate study at the University of Cambridge.',
			url: 'https://www.gatescambridge.org'
		},
		{
			id: 'schwarzman',
			name: 'Schwarzman Scholars',
			type: 'leadership',
			region: 'Global',
			deadline: 'September annually',
			eligibility: {
				ageRange: '18-28',
				regions: ['Global'],
				requirements: ['Bachelor degree', 'Leadership experience', 'Interest in China/global affairs']
			},
			selectionCriteria: {
				leadership: 35,
				intellectual: 30,
				globalPerspective: 25,
				character: 10
			},
			description: 'One-year Master\'s degree in Global Affairs at Tsinghua University, Beijing.',
			url: 'https://www.schwarzmanscholars.org'
		},
		{
			id: 'chevening',
			name: 'Chevening Scholarships',
			type: 'scholarship',
			region: 'Global',
			deadline: 'November annually',
			eligibility: {
				ageRange: '18+',
				regions: ['Global (160+ countries)'],
				requirements: ['Bachelor degree', 'Work experience (2+ years)', 'Leadership potential']
			},
			selectionCriteria: {
				leadership: 35,
				academic: 30,
				networking: 25,
				careerPlan: 10
			},
			description: 'UK government\'s global scholarship program for future leaders.',
			url: 'https://www.chevening.org'
		},
		{
			id: 'yali',
			name: 'YALI (Young African Leaders Initiative)',
			type: 'leadership',
			region: 'Sub-Saharan Africa',
			deadline: 'Rolling',
			eligibility: {
				ageRange: '18-35',
				regions: ['Sub-Saharan Africa'],
				requirements: ['Proven leadership', 'Community impact', 'English proficiency']
			},
			selectionCriteria: {
				leadership: 40,
				impact: 30,
				clarity: 20,
				potential: 10
			},
			description: 'YALI empowers young African leaders through training, networking, and support.',
			url: 'https://yali.state.gov'
		},
		{
			id: 'tef',
			name: 'Tony Elumelu Foundation',
			type: 'entrepreneurship',
			region: 'Africa',
			deadline: 'January annually',
			eligibility: {
				ageRange: '18+',
				regions: ['All African countries'],
				requirements: ['Business idea/startup', 'African citizen', 'Business plan']
			},
			selectionCriteria: {
				innovation: 35,
				viability: 30,
				impact: 25,
				execution: 10
			},
			description: '$10,000 seed funding, training, and mentorship for African entrepreneurs.',
			url: 'https://www.tonyelumelufoundation.org'
		},
		{
			id: 'mandela-washington',
			name: 'Mandela Washington Fellowship',
			type: 'leadership',
			region: 'Sub-Saharan Africa',
			deadline: 'September-November annually',
			eligibility: {
				ageRange: '25-35',
				regions: ['Sub-Saharan Africa'],
				requirements: ['Leadership track record', 'English proficiency', 'Commitment to Africa']
			},
			selectionCriteria: {
				leadership: 40,
				commitment: 25,
				impact: 20,
				communication: 15
			},
			description: 'Flagship program of YALI, includes 6-week US-based leadership training.',
			url: 'https://yali.state.gov/mwf'
		},
		{
			id: 'mastercard',
			name: 'Mastercard Foundation Scholars Program',
			type: 'scholarship',
			region: 'Africa',
			deadline: 'Varies by university',
			eligibility: {
				ageRange: '18-35',
				regions: ['Africa'],
				requirements: ['Academic excellence', 'Financial need', 'Leadership potential']
			},
			selectionCriteria: {
				academic: 35,
				leadership: 30,
				need: 20,
				commitment: 15
			},
			description: 'Comprehensive scholarship including tuition, accommodation, and leadership development.',
			url: 'https://mastercardfdn.org/all/scholars'
		},
		{
			id: 'erasmus',
			name: 'Erasmus+ Master\'s Scholarships',
			type: 'scholarship',
			region: 'Europe',
			deadline: 'January annually',
			eligibility: {
				ageRange: '18+',
				regions: ['Global'],
				requirements: ['Bachelor degree', 'Academic excellence', 'Program-specific requirements']
			},
			selectionCriteria: {
				academic: 40,
				motivation: 30,
				languageSkills: 20,
				diversity: 10
			},
			description: 'EU-funded scholarships for joint Master\'s degrees across European universities.',
			url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en'
		}
	];

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	getImplementation(): Implementation {
		return {
			name: 'PreshotReadinessAI',
			version: '1.0.0',
		};
	}

	override async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const pathname = url.pathname;

		console.log(`[DO] ${request.method} ${pathname}`);

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
					'Access-Control-Max-Age': '86400',
				},
			});
		}

		if (pathname === '/api/health') {
			return new Response(
				JSON.stringify({
					status: 'ok',
					service: 'Preshot Readiness MCP Server',
					version: '1.0.0',
					capabilities: ['diagnostic-assessment', 'ai-coaching', 'interview-prep', 'program-matching', 'blockchain-credentials']
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				}
			);
		}

		// Diagnostic Assessment Endpoint
		if (pathname === '/api/preshot/assess' && request.method === 'POST') {
			try {
				const body: any = await request.json();
				const { background, goals, targetPrograms, essayDraft } = body;

				if (!background || !goals) {
					return new Response(JSON.stringify({ error: 'Missing required fields: background, goals' }), {
						status: 400,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					});
				}

				console.log('[API] Assessment request:', { background, goals, targetPrograms });

				const assessment = await this.performDiagnosticAssessment(background, goals, targetPrograms, essayDraft);

				return new Response(JSON.stringify(assessment), {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			} catch (error: any) {
				console.error('[API] Error in /api/preshot/assess:', error);
				return new Response(
					JSON.stringify({
						error: error.message,
						success: false,
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					}
				);
			}
		}

		// AI Coaching Endpoint
		if (pathname === '/api/preshot/coach' && request.method === 'POST') {
			try {
				const body: any = await request.json();
				const { draft, programType } = body;

				if (!draft) {
					return new Response(JSON.stringify({ error: 'Missing required field: draft' }), {
						status: 400,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					});
				}

				console.log('[API] Coaching request for program type:', programType);

				const feedback = await this.provideCoachingFeedback(draft, programType);

				return new Response(JSON.stringify(feedback), {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			} catch (error: any) {
				console.error('[API] Error in /api/preshot/coach:', error);
				return new Response(
					JSON.stringify({
						error: error.message,
						success: false,
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					}
				);
			}
		}

		// AI-Generated Lesson Endpoint
		if (pathname === '/api/preshot/lesson' && request.method === 'POST') {
			try {
				const body: any = await request.json();
				const { topic, userLevel } = body;

				if (!topic) {
					return new Response(JSON.stringify({ error: 'Missing required field: topic' }), {
						status: 400,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					});
				}

				console.log('[API] Lesson generation request:', topic);

				const lesson = await this.generateLesson(topic, userLevel || 'beginner');

				return new Response(JSON.stringify(lesson), {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			} catch (error: any) {
				console.error('[API] Error in /api/preshot/lesson:', error);
				return new Response(
					JSON.stringify({
						error: error.message,
						success: false,
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					}
				);
			}
		}

		// Interview Preparation Endpoint
		if (pathname === '/api/preshot/interview' && request.method === 'POST') {
			try {
				const body: any = await request.json();
				const { interviewType, role, experience, questions } = body;

				if (!interviewType || !role) {
					return new Response(JSON.stringify({ error: 'Missing required fields: interviewType, role' }), {
						status: 400,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					});
				}

				console.log('[API] Interview prep request:', { interviewType, role });

				const interviewPrep = await this.prepareInterview(interviewType, role, experience, questions);

				return new Response(JSON.stringify(interviewPrep), {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			} catch (error: any) {
				console.error('[API] Error in /api/preshot/interview:', error);
				return new Response(
					JSON.stringify({
						error: error.message,
						success: false,
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					}
				);
			}
		}

		// Program Library Endpoint
		if (pathname === '/api/preshot/programs' && request.method === 'GET') {
			try {
				const type = url.searchParams.get('type');
				const region = url.searchParams.get('region');

				let programs = this.PROGRAMS;

				if (type) {
					programs = programs.filter(p => p.type === type);
				}
				if (region) {
					programs = programs.filter(p => p.region.toLowerCase().includes(region.toLowerCase()));
				}

				return new Response(JSON.stringify({ programs, total: programs.length }), {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			} catch (error: any) {
				console.error('[API] Error in /api/preshot/programs:', error);
				return new Response(
					JSON.stringify({
						error: error.message,
						success: false,
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					}
				);
			}
		}

		// Blockchain Submission Endpoint (IPFS + Base)
		if (pathname === '/api/preshot/submit' && request.method === 'POST') {
			try {
				const body: any = await request.json();
				const { userAddress, assessmentData, signature } = body;

				if (!userAddress || !assessmentData || !signature) {
					return new Response(
						JSON.stringify({
							error: 'Missing required parameters: userAddress, assessmentData, signature',
							success: false,
						}),
						{
							status: 400,
							headers: {
								'Content-Type': 'application/json',
								'Access-Control-Allow-Origin': '*',
							},
						}
					);
				}

				console.log('[API] Blockchain submission request for user:', userAddress);

				// Upload to IPFS via Pinata
				const ipfsUrl = await this.uploadToIPFS(assessmentData);

				// Submit to blockchain
				const result = await this.submitToBlockchain(userAddress, ipfsUrl, assessmentData.readinessScore || 0, signature);

				return new Response(JSON.stringify(result), {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			} catch (error: any) {
				console.error('[API] Error in /api/preshot/submit:', error);
				return new Response(
					JSON.stringify({
						error: error.message,
						success: false,
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					}
				);
			}
		}

		return super.fetch(request);
	}

	configureServer(server: McpServer): void {
		this.setupPreshotTools(server);
		this.setupPreshotResources(server);
		this.setupPreshotPrompts(server);
	}

	processSSEConnection(request: Request): Response {
		const url = new URL(request.url);
		let sessionId = url.searchParams.get('sessionId');

		if (!sessionId) {
			sessionId = `preshot-${Date.now()}-${Math.random().toString(36).substring(7)}`;
			console.log(`[SSE] Auto-generated sessionId: ${sessionId}`);
		}

		url.searchParams.set('sessionId', sessionId);
		const modifiedRequest = new Request(url.toString(), request);
		return super.processSSEConnection(modifiedRequest);
	}

	// ========== DIAGNOSTIC ASSESSMENT ==========
	private async performDiagnosticAssessment(
		background: string,
		goals: string,
		targetPrograms: string[] = [],
		essayDraft?: string
	): Promise<any> {
		const cacheKey = `${background.substring(0, 50)}:${goals.substring(0, 50)}`;
		
		if (this.assessmentCache.has(cacheKey)) {
			console.log('[CACHE] Assessment found in cache');
			return this.assessmentCache.get(cacheKey)!;
		}

		try {
			const apiEnv = this.env as Env;
			const apiKey = apiEnv.PRESHOT_AI_API_KEY ?? apiEnv.PRESHOT_ANTHROPIC_API_KEY;

			if (!apiKey) {
				throw new Error('API key not configured');
			}

			const programContext = targetPrograms.length > 0
				? `Target programs: ${targetPrograms.map(p => this.PROGRAMS.find(prog => prog.id === p)?.name || p).join(', ')}`
				: 'No specific programs targeted';

			const response = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01',
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens: 2000,
					messages: [
						{
							role: 'user',
							content: `You are an expert talent readiness assessor for global professionals applying to fellowships, scholarships, and career opportunities worldwide.

							Analyze this candidate's profile and provide a comprehensive diagnostic assessment:

							**Background:** ${background}

							**Goals:** ${goals}

							${programContext}

							${essayDraft ? `**Essay Draft:** ${essayDraft}` : ''}

							Provide a detailed JSON assessment with:
							1. readinessScore (0-100): Overall preparedness
							2. strengths (array): 3-5 key strengths
							3. weaknesses (array): 3-5 areas for improvement
							4. narrativeGaps (array): Missing or unclear story elements
							5. mindsetAlignment (string): "strong" | "moderate" | "needs-work" with explanation
							6. recommendations (array): 5-7 specific actionable recommendations
							7. programFit (object): Match percentage for each target program

							Be honest, constructive, and internationally focused. Use frameworks like systems thinking, servant leadership, and social impact.

							Return ONLY valid JSON.`,
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			const data: any = await response.json();
			const aiResponse = data.content[0].text.trim();

			// Try to parse JSON from the response
			let assessment;
			try {
				const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
				assessment = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
			} catch (e) {
				// Fallback if AI doesn't return pure JSON
				assessment = {
					readinessScore: 65,
					strengths: ['Leadership experience', 'Clear goals', 'Community engagement'],
					weaknesses: ['Narrative clarity', 'Quantifiable impact metrics', 'Strategic framing'],
					narrativeGaps: ['Specific achievements', 'Long-term vision'],
					mindsetAlignment: 'moderate',
					recommendations: [
						'Quantify your impact with specific metrics',
						'Develop a clearer theory of change',
						'Frame experiences in systems thinking terms',
						'Strengthen your leadership narrative',
						'Connect local work to global trends'
					],
					programFit: {},
					rawAIResponse: aiResponse
				};
			}

			assessment.success = true;
			assessment.timestamp = new Date().toISOString();

			this.cacheAssessment(cacheKey, assessment);
			return assessment;
		} catch (error: any) {
			console.error('[Assessment] Error:', error);
			throw error;
		}
	}

	// ========== AI COACHING ==========
	private async provideCoachingFeedback(draft: string, programType?: string): Promise<any> {
		try {
			const apiEnv = this.env as Env;
			const apiKey = apiEnv.PRESHOT_AI_API_KEY ?? apiEnv.PRESHOT_ANTHROPIC_API_KEY;

			if (!apiKey) {
				throw new Error('API key not configured');
			}

			const programInfo = programType 
				? this.PROGRAMS.find(p => p.id === programType || p.type === programType)
				: null;

			const criteriaContext = programInfo
				? `Selection criteria for ${programInfo.name}: ${JSON.stringify(programInfo.selectionCriteria)}`
				: 'General fellowship/scholarship criteria';

			const response = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01',
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens: 1500,
					messages: [
						{
							role: 'user',
							content: `You are an expert application coach for global professionals applying to international opportunities.

							Analyze this essay/statement and provide specific, actionable feedback:

							**Draft:**
							${draft}

							**Program Context:**
							${criteriaContext}

							Provide feedback as JSON with:
							1. overallScore (0-100): Quality rating
							2. structureFeedback: Commentary on organization and flow
							3. clarityFeedback: Issues with clarity and conciseness
							4. impactFeedback: How well impact is communicated
							5. mindsetFeedback: Leadership philosophy and systems thinking
							6. specificIssues (array): Line-by-line issues with suggestions
							7. strengthAreas (array): What's working well
							8. revisionPriorities (array): Top 3-5 things to fix first

							Be specific, constructive, and globally applicable.

							Return ONLY valid JSON.`,
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			const data: any = await response.json();
			const aiResponse = data.content[0].text.trim();

			let feedback;
			try {
				const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
				feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
			} catch (e) {
				feedback = {
					overallScore: 70,
					structureFeedback: 'Review structure and flow',
					clarityFeedback: 'Improve clarity and conciseness',
					impactFeedback: 'Quantify your impact more',
					mindsetFeedback: 'Strengthen leadership framing',
					specificIssues: [],
					strengthAreas: ['Authentic voice', 'Clear passion'],
					revisionPriorities: ['Add metrics', 'Clarify structure', 'Strengthen conclusion'],
					rawAIResponse: aiResponse
				};
			}

			feedback.success = true;
			feedback.timestamp = new Date().toISOString();

			return feedback;
		} catch (error: any) {
			console.error('[Coaching] Error:', error);
			throw error;
		}
	}

	// ========== AI-GENERATED LESSONS ==========
	private async generateLesson(topic: string, userLevel: string): Promise<any> {
		try {
			const apiEnv = this.env as Env;
			const apiKey = apiEnv.PRESHOT_AI_API_KEY ?? apiEnv.PRESHOT_ANTHROPIC_API_KEY;

			if (!apiKey) {
				throw new Error('API key not configured');
			}

			const response = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01',
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens: 2500,
					messages: [
						{
							role: 'user',
							content: `You are an expert educator creating professional development courses for global leaders.

							Create a comprehensive, interactive lesson on: **${topic}**

							User level: ${userLevel}

							Structure the lesson as JSON with:
							1. title (string): Engaging lesson title
							2. duration (string): Estimated time (e.g., "15-20 minutes")
							3. learningObjectives (array): 3-5 specific learning goals
							4. introduction (string): Hook and context (2-3 paragraphs)
							5. sections (array): 3-4 main teaching sections, each with:
							- sectionTitle (string)
							- content (string): Rich teaching content with examples
							- globalContext (string): How this applies to international leadership
								- reflection (string): Reflection question for the user
							6. caseStudy (object):
							- title (string)
							- story (string): Real or realistic global example
							- keyLessons (array): 2-3 takeaways
							7. practicalExercise (object):
							- title (string)
							- instructions (string)
							- expectedOutcome (string)
							8. keyTakeaways (array): 5-7 main points
							9. furtherResources (array): 3-5 resources (with titles and URLs if real)
							10. assessmentQuestions (array): 3-5 multiple choice or reflection questions

							Make it interactive, engaging, globally relevant, and immediately applicable.

							Return ONLY valid JSON.`,
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			const data: any = await response.json();
			const aiResponse = data.content[0].text.trim();

			let lesson;
			try {
				const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
				lesson = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
			} catch (e) {
				lesson = {
					title: topic,
					duration: '15-20 minutes',
					learningObjectives: [`Understand ${topic}`],
					introduction: `This lesson covers ${topic} for African leaders.`,
					sections: [],
					keyTakeaways: [`${topic} is important for leadership`],
					rawAIResponse: aiResponse,
					parseError: true
				};
			}

			lesson.success = true;
			lesson.timestamp = new Date().toISOString();
			lesson.lessonId = `lesson-${Date.now()}`;

			return lesson;
		} catch (error: any) {
			console.error('[Lesson Generation] Error:', error);
			throw error;
		}
	}

	// ========== INTERVIEW PREPARATION ==========
	private async prepareInterview(
		interviewType: string,
		role: string,
		experience?: string,
		questions?: string[]
	): Promise<any> {
		try {
			const apiEnv = this.env as Env;
			const apiKey = apiEnv.PRESHOT_AI_API_KEY ?? apiEnv.PRESHOT_ANTHROPIC_API_KEY;

			if (!apiKey) {
				throw new Error('API key not configured');
			}

			const questionContext = questions?.length
				? `User provided questions: ${questions.join(', ')}`
				: 'Generate appropriate interview questions';

			const response = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01',
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens: 2500,
					messages: [
						{
							role: 'user',
							content: `You are an expert career coach specializing in interview preparation.

Help prepare for this interview:

**Interview Type:** ${interviewType}
**Role:** ${role}
**Experience Level:** ${experience || 'Not specified'}
${questionContext}

Note: Interview type might be standard (behavioral, technical, case, panel) or custom/specialized (e.g., chef, sales, teaching, executive, etc.).
Adapt your guidance accordingly.

Provide comprehensive interview prep as JSON with:
1. mockQuestions (array): 5-7 relevant interview questions for this role/type
2. sampleAnswers (array): For each question:
   - question (string)
   - starFramework (object):
     - situation (string): Example situation
     - task (string): The task/challenge
     - action (string): Actions taken
     - result (string): Outcomes achieved
   - tips (array): 2-3 specific tips for answering
3. commonPitfalls (array): 3-5 mistakes to avoid
4. keyTalkingPoints (array): 5-7 things to emphasize based on the role
5. technicalTopics (array if technical): Topics to review (for technical interviews)
6. closingQuestions (array): 3-5 smart questions to ask the interviewer
7. generalTips (array): 5-7 interview best practices

For behavioral interviews: Use STAR method extensively
For technical interviews: Include coding patterns, system design concepts
For case interviews: Include framework approaches
For panel interviews: Include strategies for engaging multiple interviewers

Return ONLY valid JSON.`,
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			const data: any = await response.json();
			const aiResponse = data.content[0].text.trim();

			let interviewPrep;
			try {
				const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
				interviewPrep = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
			} catch (e) {
				interviewPrep = {
					mockQuestions: [`Tell me about yourself and your experience with ${role}`],
					sampleAnswers: [],
					commonPitfalls: ['Not preparing examples', 'Speaking too generally', 'Forgetting to ask questions'],
					keyTalkingPoints: ['Relevant experience', 'Problem-solving skills', 'Team collaboration'],
					closingQuestions: ['What does success look like in this role?'],
					generalTips: ['Research the company', 'Prepare STAR examples', 'Practice out loud'],
					rawAIResponse: aiResponse,
					parseError: true
				};
			}

			interviewPrep.success = true;
			interviewPrep.timestamp = new Date().toISOString();
			interviewPrep.interviewType = interviewType;
			interviewPrep.role = role;

			return interviewPrep;
		} catch (error: any) {
			console.error('[Interview Prep] Error:', error);
			throw error;
		}
	}

	// ========== IPFS INTEGRATION (Pinata) ==========
	private async uploadToIPFS(data: any): Promise<string> {
		try {
			const apiEnv = this.env as Env;
			const pinataJWT = apiEnv.PRESHOT_PINATA_JWT;

			if (!pinataJWT) {
				throw new Error('Pinata JWT not configured');
			}

			// Initialize Pinata SDK
			const pinata = new PinataSDK({
				pinataJwt: pinataJWT,
				pinataGateway: "gateway.pinata.cloud"
			});

			// Prepare data with timestamp
			const ipfsData = {
				...data,
				uploadedAt: new Date().toISOString(),
				platform: 'Preshot',
				version: '1.0'
			};

			// Upload JSON to Pinata using new SDK
			const upload = await pinata.upload.json(ipfsData, {
				metadata: {
					name: `preshot-assessment-${Date.now()}.json`,
				}
			});

			const ipfsUrl = `ipfs://${upload.IpfsHash}`;

			console.log('[IPFS] Uploaded successfully:', ipfsUrl);

			return ipfsUrl;
		} catch (error: any) {
			console.error('[IPFS] Upload error:', error);
			throw error;
		}
	}

	// ========== BLOCKCHAIN INTEGRATION (Base Sepolia) ==========
	private async submitToBlockchain(
		userAddress: string,
		ipfsUrl: string,
		readinessScore: number,
		userSignature: string
	): Promise<{ success: boolean; message: string; txHash?: string; ipfsUrl?: string }> {
		try {
			console.log('[Blockchain] AI submitting to Base Sepolia...');
			console.log('  User Address:', userAddress);
			console.log('  IPFS URL:', ipfsUrl);
			console.log('  Readiness Score:', readinessScore);

			const { ethers } = await import('ethers');
			const kv = (this.env as any).PRESHOT_KV;

			if (!kv) {
				console.error('[Blockchain] KV not configured');
				return { success: false, message: 'KV storage not configured.' };
			}

			// Get AI wallet from Cloudflare KV
			const privateKey = await kv.get('PRESHOT_AI_WALLET_KEY');
			if (!privateKey) {
				console.error('[Blockchain] AI wallet key not found in KV');
				return {
					success: false,
					message: 'AI wallet not configured. Please set PRESHOT_AI_WALLET_KEY in Cloudflare KV.',
				};
			}

			// Base Sepolia RPC
			const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
			const aiWallet = new ethers.Wallet(privateKey, provider);

			console.log('[Blockchain] AI Wallet Address:', aiWallet.address);

			// Check AI wallet balance
			const balance = await provider.getBalance(aiWallet.address);
			const balanceInEth = ethers.formatEther(balance);
			console.log('[Blockchain] AI Wallet Balance:', balanceInEth, 'ETH');

			// If balance too low, return error for frontend fallback
			if (balance < ethers.parseEther('0.0001')) {
				console.warn('[Blockchain] AI wallet gas too low');
				return {
					success: false,
					message: `AI wallet out of gas (${balanceInEth} ETH). Please submit manually.`,
				};
			}

			// Contract addresses  (Base Sepolia)
			const contractAddress = '0xEF18625F583F2362390A8edD637f707f62358669'; // PreshotCredentials
			const badgesContractAddress = '0x97d0CcEfE0Fe3A9dD392743c29A39ea18ADD0156'; // PreshotBadges
			
			const contractABI = [
				'function submitWithSignature(address user, string memory ipfsUrl, uint256 readinessScore, uint256 region, bytes memory signature) external',
				'function submitData(string memory ipfsUrl, uint256 readinessScore) external',
				'function getUserData(address user) external view returns (string[] memory)',
				'function getReadinessScore(address user) external view returns (uint256)'
			];

			const contract = new ethers.Contract(contractAddress, contractABI, aiWallet);

			console.log('[Blockchain] Submitting transaction...');
			console.log('  Signature (from user):', userSignature);

			// Detect region (simplified - default to Global for now)
			// In production, you'd use geolocation or user profile
			const region = 0; // 0 = Global, 1 = Africa, 2 = Asia

			// AI wallet submits transaction (pays gas), using user's signature
			const tx = await contract.submitWithSignature(userAddress, ipfsUrl, readinessScore, region, userSignature, {
				gasLimit: 500000,
			});

			console.log('[Blockchain] Transaction hash:', tx.hash);

			// Wait for confirmation
			const receipt = await tx.wait();
			console.log('[Blockchain] Transaction confirmed in block:', receipt.blockNumber);

			return {
				success: true,
				message: `✅ Credentials recorded on Base blockchain! AI paid the gas fees.\nTx: ${tx.hash}`,
				txHash: tx.hash,
				ipfsUrl: ipfsUrl
			};
		} catch (error: any) {
			console.error('[Blockchain] Submission error:', error);

			// Enhanced error logging
			if (error.reason) {
				console.error('[Blockchain] Revert reason:', error.reason);
			}
			if (error.data) {
				console.error('[Blockchain] Error data:', error.data);
			}

			// Check for gas errors
			const errorMessage = error.reason || error.message || 'Unknown error';
			const isGasError =
				errorMessage.toLowerCase().includes('insufficient funds') ||
				errorMessage.toLowerCase().includes('gas') ||
				error.code === 'INSUFFICIENT_FUNDS';

			if (isGasError) {
				return {
					success: false,
					message: 'AI wallet out of gas. Please submit manually.',
				};
			}

			return {
				success: false,
				message: `❌ ${errorMessage}`,
			};
		}
	}

	private cacheAssessment(key: string, data: any): void {
		if (this.assessmentCache.size >= this.MAX_CACHE_SIZE) {
			const firstKey = this.assessmentCache.keys().next().value;
			if (firstKey !== undefined) {
				this.assessmentCache.delete(firstKey);
			}
		}
		this.assessmentCache.set(key, data);
	}

	// ========== MCP TOOLS ==========
	private setupPreshotTools(server: McpServer) {
		// Diagnostic Assessment Tool
		server.tool(
			'perform_diagnostic_assessment',
			'Analyze user readiness for fellowships/scholarships.',
			{
				background: z.string().describe('User background and experience'),
				goals: z.string().describe('Career and application goals'),
				targetPrograms: z.array(z.string()).optional().describe('Target program IDs'),
				essayDraft: z.string().optional().describe('Optional essay draft for analysis'),
			},
			async ({ background, goals, targetPrograms, essayDraft }) => {
				const assessment = await this.performDiagnosticAssessment(background, goals, targetPrograms, essayDraft);
				return { content: [{ type: 'text', text: JSON.stringify(assessment, null, 2) }] };
			}
		);

		// AI Coaching Tool
		server.tool(
			'provide_application_feedback',
			'Get AI feedback on application essays and statements.',
			{
				draft: z.string().describe('Essay or statement draft'),
				programType: z.string().optional().describe('Program type or ID for context'),
			},
			async ({ draft, programType }) => {
				const feedback = await this.provideCoachingFeedback(draft, programType);
				return { content: [{ type: 'text', text: JSON.stringify(feedback, null, 2) }] };
			}
		);

		// AI Lesson Generation Tool
		server.tool(
			'deliver_mindset_lesson',
			'Generate an interactive mindset development lesson.',
			{
				topic: z.string().describe('Lesson topic (e.g., "Leadership Framing", "Systems Thinking")'),
				userLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe('User proficiency level'),
			},
			async ({ topic, userLevel = 'beginner' }) => {
				const lesson = await this.generateLesson(topic, userLevel);
				return { content: [{ type: 'text', text: JSON.stringify(lesson, null, 2) }] };
			}
		);

		// Interview Preparation Tool
		server.tool(
			'prepare_interview',
			'Get AI-powered interview preparation and coaching.',
			{
				interviewType: z.string().describe('Type of interview: behavioral, technical, case, panel, or custom (e.g., chef, sales, teaching)'),
				role: z.string().describe('Job role/position'),
				experience: z.string().optional().describe('Years of experience or level'),
				questions: z.array(z.string()).optional().describe('Specific questions to prepare for'),
			},
			async ({ interviewType, role, experience, questions }) => {
				const interviewPrep = await this.prepareInterview(interviewType, role, experience, questions);
				return { content: [{ type: 'text', text: JSON.stringify(interviewPrep, null, 2) }] };
			}
		);

		// Program Matching Tool
		server.tool(
			'match_programs',
			'Find matching fellowship/scholarship programs.',
			{
				type: z.string().optional().describe('Program type filter'),
				region: z.string().optional().describe('Region filter'),
			},
			async ({ type, region }) => {
				let programs = this.PROGRAMS;

				if (type) {
					programs = programs.filter(p => p.type === type);
				}
				if (region) {
					programs = programs.filter(p => p.region.toLowerCase().includes(region.toLowerCase()));
				}

				return { content: [{ type: 'text', text: JSON.stringify({ programs, total: programs.length }, null, 2) }] };
			}
		);

		// Blockchain Submission Tool
		server.tool(
			'submit_to_blockchain',
			'Submit assessment credentials to blockchain via IPFS.',
			{
				userAddress: z.string().describe('User wallet address'),
				assessmentData: z.any().describe('Assessment data object'),
				signature: z.string().describe('User signature'),
			},
			async ({ userAddress, assessmentData, signature }) => {
				const ipfsUrl = await this.uploadToIPFS(assessmentData);
				const result = await this.submitToBlockchain(userAddress, ipfsUrl, assessmentData.readinessScore || 0, signature);
				return { content: [{ type: 'text', text: result.message }] };
			}
		);
	}

	// ========== MCP RESOURCES ==========
	private setupPreshotResources(server: McpServer) {
		server.resource('user_readiness_state', 'resource://preshot/readiness/{userId}', async (uri: URL) => {
			const userId = uri.pathname.split('/').pop() || 'unknown';
			const state = {
				userId,
				lastAssessment: null,
				currentScore: 0,
				completedLessons: 0,
				message: 'No assessments on record'
			};
			return { contents: [{ text: JSON.stringify(state, null, 2), uri: uri.href }] };
		});

		server.resource('program_criteria', 'resource://preshot/program/{programId}', async (uri: URL) => {
			const programId = uri.pathname.split('/').pop() || '';
			const program = this.PROGRAMS.find(p => p.id === programId);
			
			if (!program) {
				return { contents: [{ text: 'Program not found', uri: uri.href }] };
			}

			return { contents: [{ text: JSON.stringify(program, null, 2), uri: uri.href }] };
		});
	}

	// ========== MCP PROMPTS ==========
	private setupPreshotPrompts(server: McpServer) {
		server.prompt('preshot_coaching_prompt', 'Expert coaching personality for Preshot AI.', () => ({
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
						text: 'You are Preshot AI - an expert coach for African leaders pursuing global opportunities. Be constructive, specific, and culturally aware. Focus on systems thinking, servant leadership, and transformative impact.',
					},
				},
			],
		}));

		server.prompt('assessment_analysis_prompt', 'Rubric for diagnostic assessments.', () => ({
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
						text: `Assess candidates using these dimensions:
1. Leadership (40%): Track record, philosophy, potential
2. Impact (30%): Measurable outcomes, scale, sustainability
3. Clarity (20%): Communication, narrative, vision
4. Mindset (10%): Systems thinking, global citizenship, commitment

Be honest and specific. Identify gaps and provide actionable recommendations.`,
					},
				},
			],
		}));
	}
}

export const ExampleMcpServer = PreshotAgentServer;
