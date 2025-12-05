import { Implementation } from '@modelcontextprotocol/sdk/types.js';
import { McpHonoServerDO } from '@nullshot/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Env } from './env';
import { PinataSDK } from 'pinata';

// ========== TYPES & INTERFACES ==========
interface ProgramData {
	id: string;
	name: string;
	type: string;
	region: string;
	deadline: string;
	eligibility: {
		ageRange: string;
		regions: string[];
		requirements: string[];
	};
	selectionCriteria: Record<string, number>;
	description: string;
	url: string;
	fundingAmount?: string;
	duration?: string;
	source: 'web' | 'cache';
	lastUpdated: string;
}

interface AssessmentResult {
	readinessScore: number;
	componentScores: {
		leadershipImpact: number;
		narrativeCommunication: number;
		strategicFit: number;
		systemsThinking: number;
	};
	strengths: string[];
	weaknesses: string[];
	narrativeGaps: string[];
	mindsetAlignment: 'strong' | 'moderate' | 'needs-work';
	mindsetExplanation: string;
	recommendations: string[];
	programFit: Record<string, number>;
	keyInsights: string;
	webContext?: string;
	success: boolean;
	timestamp: string;
}

interface CoachingFeedback {
	overallScore: number;
	structureFeedback: string;
	clarityFeedback: string;
	impactFeedback: string;
	mindsetFeedback: string;
	specificIssues: Array<{
		line: number;
		issue: string;
		suggestion: string;
	}>;
	strengthAreas: string[];
	revisionPriorities: string[];
	industryBenchmark?: string;
	success: boolean;
	timestamp: string;
}

export class PreshotAgentServer extends McpHonoServerDO<Env> {
	private assessmentCache: Map<string, any> = new Map();
	private programCache: Map<string, { data: ProgramData[]; timestamp: number }> = new Map();
	private readonly MAX_CACHE_SIZE = 500;
	private readonly PROGRAM_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours
	private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
	private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	getImplementation(): Implementation {
		return {
			name: 'PreshotReadinessAI',
			version: '2.0.0',
		};
	}

	// ========== RATE LIMITING ==========
	private checkRateLimit(key: string, limit: number = 20): boolean {
		const now = Date.now();
		const record = this.requestCounts.get(key);

		if (!record || now > record.resetTime) {
			this.requestCounts.set(key, { count: 1, resetTime: now + this.RATE_LIMIT_WINDOW });
			return true;
		}

		if (record.count >= limit) {
			return false;
		}

		record.count++;
		return true;
	}

	override async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const pathname = url.pathname;

		console.log(`[DO] ${request.method} ${pathname}`);

		// CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization',
					'Access-Control-Max-Age': '86400',
				},
			});
		}

		// Rate limiting (simple IP-based)
		const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
		if (!this.checkRateLimit(clientIp)) {
			return new Response(
				JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Retry-After': '60',
					},
				}
			);
		}

		// Health check
		if (pathname === '/api/health') {
			return new Response(
				JSON.stringify({
					status: 'ok',
					service: 'Preshot Readiness MCP Server',
					version: '2.0.0',
					capabilities: [
						'diagnostic-assessment',
						'ai-coaching',
						'interview-prep',
						'real-time-program-discovery',
						'blockchain-credentials',
						'web-enhanced-intelligence'
					],
					uptime: process.uptime?.() || 'N/A'
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				}
			);
		}

		// ========== DIAGNOSTIC ASSESSMENT ENDPOINT ==========
		if (pathname === '/api/preshot/assess' && request.method === 'POST') {
			try {
				const body: any = await request.json();
				const { background, goals, targetPrograms, essayDraft } = body;

				if (!background || !goals) {
					return new Response(
						JSON.stringify({ 
							error: 'Missing required fields: background, goals',
							success: false 
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

				console.log('[API] Assessment request:', { 
					backgroundLength: background.length, 
					goalsLength: goals.length, 
					targetPrograms 
				});

				const assessment = await this.performDiagnosticAssessment(
					background,
					goals,
					targetPrograms,
					essayDraft
				);

				return new Response(JSON.stringify(assessment), {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Cache-Control': 'no-cache, no-store, must-revalidate',
					},
				});
			} catch (error: any) {
				console.error('[API] Error in /api/preshot/assess:', error);
				return new Response(
					JSON.stringify({
						error: error.message || 'Assessment failed',
						success: false,
						details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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

		// ========== AI COACHING ENDPOINT ==========
		if (pathname === '/api/preshot/coach' && request.method === 'POST') {
			try {
				const body: any = await request.json();
				const { draft, programType, industry } = body;

				if (!draft) {
					return new Response(
						JSON.stringify({ 
							error: 'Missing required field: draft',
							success: false 
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

				console.log('[API] Coaching request:', { 
					draftLength: draft.length, 
					programType,
					industry 
				});

				const feedback = await this.provideCoachingFeedback(draft, programType, industry);

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
						error: error.message || 'Coaching feedback failed',
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

		// ========== AI-GENERATED LESSON ENDPOINT ==========
		if (pathname === '/api/preshot/lesson' && request.method === 'POST') {
			try {
				const body: any = await request.json();
				const { topic, userLevel, learningStyle } = body;

				if (!topic) {
					return new Response(
						JSON.stringify({ 
							error: 'Missing required field: topic',
							success: false 
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

				console.log('[API] Lesson generation:', { topic, userLevel, learningStyle });

				const lesson = await this.generateLesson(topic, userLevel || 'intermediate', learningStyle);

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
						error: error.message || 'Lesson generation failed',
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

		// ========== INTERVIEW PREPARATION ENDPOINT ==========
		if (pathname === '/api/preshot/interview' && request.method === 'POST') {
			try {
				const body: any = await request.json();
				const { interviewType, role, experience, questions } = body;

				if (!interviewType || !role) {
					return new Response(
						JSON.stringify({ 
							error: 'Missing required fields: interviewType, role',
							success: false 
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

				console.log('[API] Interview prep request:', { interviewType, role, experience });

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
						error: error.message || 'Interview preparation failed',
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

		// ========== PROGRAM LIBRARY ENDPOINT ==========
		if (pathname === '/api/preshot/programs' && request.method === 'GET') {
			return this.handleProgramsEndpoint(request);
		}

		// ========== BLOCKCHAIN SUBMISSION ENDPOINT ==========
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

				console.log('[API] Blockchain submission for user:', userAddress);

				const ipfsUrl = await this.uploadToIPFS(assessmentData);
				const result = await this.submitToBlockchain(
					userAddress,
					ipfsUrl,
					assessmentData.readinessScore || 100, // Default to 100 for course completion
					assessmentData.region || 0, // Include region in submission
					signature
				);

				// If AI wallet out of gas, provide manual submission details
				if (!result.success && result.message.includes('out of gas')) {
					return new Response(JSON.stringify({
						...result,
						manualSubmit: true,
						ipfsUrl,
						contractAddress: '0xEF18625F583F2362390A8edd637f707f62358669',
						readinessScore: assessmentData.readinessScore || 100,
						region: assessmentData.region || 0,
						instruction: 'Use your wallet to call submitData() directly on the contract',
					}), {
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					});
				}

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
						error: error.message || 'Blockchain submission failed',
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

	// ========== ENHANCED WEB SEARCH WITH TAVILY ==========
	private async searchWeb(
		query: string, 
		maxResults: number = 10,
		searchDepth: 'basic' | 'advanced' = 'advanced'
	): Promise<{ results: string; sources: Array<{ title: string; url: string }> }> {
		try {
			const apiEnv = this.env as Env;
			const apiKey = apiEnv.TAVILY_API_KEY;

			if (!apiKey) {
				console.warn('[Tavily] API key not configured');
				return { results: '', sources: [] };
			}

			console.log(`[Tavily] Searching: "${query}" (depth: ${searchDepth})`);

			const response = await fetch('https://api.tavily.com/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					api_key: apiKey,
					query: query,
					search_depth: searchDepth,
					max_results: maxResults,
					include_answer: true,
					include_domains: [
						'fulbrightonline.org',
						'rhodeshouse.ox.ac.uk',
						'chevening.org',
						'gatescambridge.org',
						'schwarzmanscholars.org',
						'yali.state.gov',
						'tonyelumelufoundation.org',
						'mastercardfdn.org',
						'erasmus-plus.ec.europa.eu'
					],
					exclude_domains: ['reddit.com', 'quora.com'],
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('[Tavily] API error:', response.status, errorText);
				return { results: '', sources: [] };
			}

			const data: any = await response.json();

			if (!data.results || data.results.length === 0) {
				console.warn('[Tavily] No results found');
				return { results: '', sources: [] };
			}

			const sources = data.results.map((r: any) => ({
				title: r.title,
				url: r.url
			}));

			const formattedResults = data.results
				.slice(0, maxResults)
				.map((r: any, idx: number) => 
					`[${idx + 1}] ${r.title}\n${r.content.substring(0, 400)}...\nSource: ${r.url}`
				)
				.join('\n\n');

			console.log(`[Tavily] Retrieved ${data.results.length} results`);

			return { 
				results: formattedResults,
				sources 
			};
		} catch (error: any) {
			console.error('[Tavily] Search error:', error.message);
			return { results: '', sources: [] };
		}
	}

	// ========== INTELLIGENT PROGRAM DISCOVERY ==========
	private async discoverPrograms(
		type?: string,
		region?: string,
		deadline?: string
	): Promise<ProgramData[]> {
		const cacheKey = `${type || 'all'}-${region || 'all'}-${deadline || 'any'}`;
		const cached = this.programCache.get(cacheKey);

		// Return cached if fresh
		if (cached && Date.now() - cached.timestamp < this.PROGRAM_CACHE_TTL) {
			console.log('[Programs] Returning cached results');
			return cached.data;
		}

		console.log('[Programs] Fetching fresh data from web');

		try {
			// Build intelligent search query
			const searchTerms = [
				type || 'fellowship scholarship grant',
				region || 'global international',
				'2025 2026',
				'application deadline eligibility requirements'
			];

			const searchQuery = searchTerms.join(' ');
			const { results, sources } = await this.searchWeb(searchQuery, 15, 'advanced');

			if (!results) {
				console.warn('[Programs] No web results, returning empty array');
				return [];
			}

			// Parse programs from web results using AI
			const programs = await this.parsePrograms(results, sources, type, region);

			// Cache results
			this.programCache.set(cacheKey, {
				data: programs,
				timestamp: Date.now()
			});

			console.log(`[Programs] Discovered ${programs.length} programs`);
			return programs;
		} catch (error: any) {
			console.error('[Programs] Discovery error:', error);
			return [];
		}
	}


	// ========== AI-POWERED PROGRAM PARSING ==========
	private async parsePrograms(
		webResults: string,
		sources: Array<{ title: string; url: string }>,
		type?: string,
		region?: string
	): Promise<ProgramData[]> {
		try {
			const apiEnv = this.env as Env;
			const apiKey = apiEnv.PRESHOT_AI_API_KEY ?? apiEnv.PRESHOT_ANTHROPIC_API_KEY;

			if (!apiKey) {
				throw new Error('AI API key not configured');
			}

			console.log('[Programs] Parsing with AI...');

			const response = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01',
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens: 4000,
					messages: [
						{
							role: 'user',
							content: `You are an expert at extracting structured fellowship/scholarship data from web search results.

							**Web Search Results:**
							${webResults}

							**Available Sources:**
							${sources.map(s => `- ${s.title}: ${s.url}`).join('\n')}

							**TASK:** Extract and structure fellowship/scholarship programs from the results above.

							For each program found, create a JSON object with this EXACT structure:

							{
							"id": "<lowercase-hyphenated-unique-id>",
							"name": "<full program name>",
							"type": "<scholarship|fellowship|grant|leadership|entrepreneurship>",
							"region": "<Global|Africa|Asia|Europe|Americas|Middle East|or specific region>",
							"deadline": "<deadline info or 'Rolling' or 'Varies' or specific date>",
							"eligibility": {
								"ageRange": "<age range like '18-35' or '18+'>",
								"regions": ["<eligible countries/regions>"],
								"requirements": ["<key requirement 1>", "<key requirement 2>", "..."]
							},
							"selectionCriteria": {
								"academic": <percentage if mentioned>,
								"leadership": <percentage if mentioned>,
								"impact": <percentage if mentioned>,
								"other": <percentage if mentioned>
							},
							"description": "<concise 1-2 sentence description of program>",
							"url": "<official program URL from sources above>",
							"fundingAmount": "<funding amount if mentioned, e.g., 'Full tuition + stipend' or '$50,000'>",
							"duration": "<program duration if mentioned, e.g., '1 year' or '2 years'>",
							"source": "web",
							"lastUpdated": "${new Date().toISOString()}"
							}

							**FILTERS:**
							${type ? `- Only include programs of type "${type}"` : '- Include all program types'}
							${region ? `- Only include programs for region "${region}"` : '- Include all regions'}

							**INSTRUCTIONS:**
							1. Extract as many valid programs as possible (aim for 5-15 programs)
							2. Use ONLY information from the search results provided
							3. If funding/duration not mentioned, omit those fields
							4. Ensure URLs are from the sources list above
							5. Make IDs unique and descriptive (e.g., "fulbright-us-2025", "chevening-uk")
							6. Be accurate - don't invent information not in the results

							Return ONLY a valid JSON array: [program1, program2, ...]
							If no programs found, return: []`,
						},
					],
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('[Programs] AI API error:', response.status, errorText);
				throw new Error(`AI API error: ${response.status}`);
			}

			const data: any = await response.json();
			const aiResponse = data.content[0].text.trim();

			let programs: ProgramData[] = [];
			try {
				// Try to extract JSON array from response
				const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
				if (jsonMatch) {
					programs = JSON.parse(jsonMatch[0]);
				} else {
					programs = JSON.parse(aiResponse);
				}

				// Validate and clean programs
				programs = programs.filter((p: any) => 
					p && p.id && p.name && p.type && p.region && p.description
				);

				console.log(`[Programs] Successfully parsed ${programs.length} programs`);
			} catch (e) {
				console.error('[Programs] Failed to parse AI response:', e);
				console.error('[Programs] Raw AI response:', aiResponse.substring(0, 500));
				programs = [];
			}

			return programs;
		} catch (error: any) {
			console.error('[Programs] Parsing error:', error);
			return [];
		}
	}

	// ========== ENHANCED DIAGNOSTIC ASSESSMENT ==========
	private async performDiagnosticAssessment(
		background: string,
		goals: string,
		targetPrograms: string[] = [],
		essayDraft?: string
	): Promise<AssessmentResult> {
		try {
			const apiEnv = this.env as Env;
			const apiKey = apiEnv.PRESHOT_AI_API_KEY ?? apiEnv.PRESHOT_ANTHROPIC_API_KEY;

			if (!apiKey) {
				throw new Error('AI API key not configured');
			}

			console.log('[Assessment] Starting enhanced assessment');

			// Step 1: Web search for program requirements and best practices
			let webContext = '';
			let programDetails: ProgramData[] = [];

			if (targetPrograms.length > 0) {
				// Search for specific programs
				const programQuery = `${targetPrograms.join(' ')} fellowship scholarship 2025 2026 requirements selection criteria application tips`;
				const { results } = await this.searchWeb(programQuery, 5, 'advanced');
				webContext = results;

				// Get structured program data
				programDetails = await this.discoverPrograms(undefined, undefined, undefined);
			} else {
				// General best practices search
				const { results } = await this.searchWeb(
					'fellowship scholarship application best practices 2025 selection criteria what reviewers look for winning strategies',
					5,
					'advanced'
				);
				webContext = results;
			}

			// Build enhanced context
			const programContext = targetPrograms.length > 0
				? `Target programs: ${targetPrograms.join(', ')}\n\n${programDetails.slice(0, 3).map(p => `**${p.name}**\n${p.description}\nEligibility: ${JSON.stringify(p.eligibility)}`).join('\n\n')}`
				: 'General fellowship/scholarship assessment';

			// Step 2: AI assessment with web-enhanced intelligence
			const response = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01',
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens: 3500,
					messages: [
						{
							role: 'user',
							content: `You are a world-class talent assessor for prestigious global fellowships and scholarships. You have reviewed thousands of applications for Rhodes, Fulbright, Gates Cambridge, Chevening, and other top programs.

							**CRITICAL: BE RIGOROUS AND EVIDENCE-BASED. DO NOT INFLATE SCORES.**

							${webContext ? `**Latest Program Intelligence & Best Practices (from web search):**\n${webContext}\n\n` : ''}

							**Candidate Profile:**

							**Background:**
							${background}

							**Goals:**
							${goals}

							**Program Context:**
							${programContext}

							${essayDraft ? `**Essay Draft:**\n${essayDraft}\n\n` : ''}

							---

							**ASSESSMENT FRAMEWORK** (Evidence-based scoring):

							**1. Leadership & Impact (35%)**
							- 90-100: Transformative, documented impact with clear metrics (e.g., "increased enrollment 40%", "served 10,000+ people", "raised $500K")
							- 75-89: Strong leadership with measurable outcomes and specific examples
							- 60-74: Demonstrated leadership but limited quantification
							- 45-59: Leadership potential but minimal concrete evidence
							- <45: Vague claims, no measurable impact

							**2. Narrative & Communication (30%)**
							- 90-100: Compelling story, vivid examples, clear arc, excellent writing quality
							- 75-89: Good narrative with specific examples and clear structure
							- 60-74: Adequate but generic or unclear in places
							- 45-59: Vague, lacks specifics, unclear goals
							- <45: Confusing, no coherent narrative

							**3. Strategic Fit & Preparedness (20%)**
							- 90-100: Perfect alignment with program criteria, deep research evident, ready to apply
							- 75-89: Strong fit with most criteria, good understanding
							- 60-74: Decent fit but some gaps in alignment
							- 45-59: Partial alignment, needs more research and preparation
							- <45: Poor fit or unrealistic expectations

							**4. Systems Thinking & Global Perspective (15%)**
							- 90-100: Sophisticated understanding of systems, global context, interconnections
							- 75-89: Good awareness of broader implications and stakeholders
							- 60-74: Some systems thinking evident
							- 45-59: Limited perspective beyond immediate context
							- <45: Narrow, individualistic focus

							**SCORING DISCIPLINE:**
							- Most candidates score 55-75 (this is NORMAL and GOOD)
							- Only top 10% of candidates deserve 85+
							- If background lacks specifics → score LOW (50-65 range)
							- If no metrics mentioned → deduct 10-15 points
							- If goals are vague → deduct 10+ points
							- If essay is weak → deduct 15+ points
							- Be HONEST about weaknesses

							**DELIVERABLE:**
							Return ONLY valid JSON (no markdown, no preamble, no explanation):

							{
							"readinessScore": <0-100, weighted average of component scores>,
							"componentScores": {
								"leadershipImpact": <0-100>,
								"narrativeCommunication": <0-100>,
								"strategicFit": <0-100>,
								"systemsThinking": <0-100>
							},
							"strengths": [
								"<specific strength with evidence from profile>",
								"<another specific strength>",
								"<3-5 total strengths>"
							],
							"weaknesses": [
								"<specific, actionable weakness>",
								"<another weakness with context>",
								"<3-5 total weaknesses>"
							],
							"narrativeGaps": [
								"<missing element that weakens application>",
								"<another gap>",
								"<2-4 key gaps>"
							],
							"mindsetAlignment": "<strong|moderate|needs-work>",
							"mindsetExplanation": "<2-3 sentences assessing leadership philosophy, global perspective, and alignment with fellowship values>",
							"recommendations": [
								"<SPECIFIC, ACTIONABLE recommendation #1 with example>",
								"<SPECIFIC, ACTIONABLE recommendation #2>",
								"<5-7 total recommendations, prioritized by impact>",
								"..."
							],
							"programFit": {
								"<program-name>": <0-100 percentage fit>,
								"<another-program>": <0-100 percentage fit>
							},
							"keyInsights": "<2-3 sentences summarizing overall assessment, trajectory, and immediate next steps>"
							}

							Be HONEST. Be SPECIFIC. Be CONSTRUCTIVE. Provide actionable feedback.
							Return ONLY valid JSON.`,
						},
					],
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('[Assessment] AI API error:', response.status, errorText);
				throw new Error(`AI API error: ${response.status}`);
			}

			const data: any = await response.json();
			const aiResponse = data.content[0].text.trim();

			let assessment: AssessmentResult;
			try {
				// Extract JSON from response
				const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
				assessment = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);

				// Validate required fields
				if (!assessment.readinessScore || !assessment.componentScores) {
					throw new Error('Invalid assessment structure');
				}
			} catch (e) {
				console.error('[Assessment] JSON parse error, using fallback');
				console.error('[Assessment] Raw response:', aiResponse.substring(0, 500));
				
				assessment = {
					readinessScore: 60,
					componentScores: {
						leadershipImpact: 55,
						narrativeCommunication: 60,
						strategicFit: 65,
						systemsThinking: 60
					},
					strengths: [
						'Shows initiative and drive',
						'Clear interest in growth',
						'Authentic voice'
					],
					weaknesses: [
						'Limited quantifiable achievements mentioned',
						'Narrative needs more specificity and concrete examples',
						'Systems perspective could be stronger'
					],
					narrativeGaps: [
						'Specific metrics and numbers to demonstrate impact',
						'Long-term vision and theory of change',
						'Connection to global challenges'
					],
					mindsetAlignment: 'needs-work',
					mindsetExplanation: 'Leadership philosophy needs development. Consider articulating your theory of change and how your work connects to broader systems.',
					recommendations: [
						'Quantify every major achievement with specific numbers (e.g., people served, funds raised, % improvement)',
						'Develop a clear theory of change connecting your local work to global challenges',
						'Strengthen your narrative with vivid, specific examples using storytelling techniques',
						'Research target programs deeply and tailor your story to their specific criteria',
						'Frame experiences using systems thinking language (stakeholders, root causes, leverage points)',
						'Build a compelling arc: past impact → present positioning → future vision'
					],
					programFit: {},
					keyInsights: 'Profile shows potential but needs more evidence, specificity, and strategic positioning. Focus on quantifying impact and clarifying your narrative.',
					success: true,
					timestamp: new Date().toISOString()
				};
			}

			assessment.success = true;
			assessment.timestamp = new Date().toISOString();
			assessment.webContext = webContext ? 'Enhanced with real-time program intelligence' : undefined;

			console.log('[Assessment] Complete. Score:', assessment.readinessScore);
			return assessment;
		} catch (error: any) {
			console.error('[Assessment] Error:', error);
			throw new Error(`Assessment failed: ${error.message}`);
		}
	}

	// ========== ENHANCED AI COACHING ==========
	private async provideCoachingFeedback(
		draft: string,
		programType?: string,
		industry?: string
	): Promise<CoachingFeedback> {
		try {
			const apiEnv = this.env as Env;
			const apiKey = apiEnv.PRESHOT_AI_API_KEY ?? apiEnv.PRESHOT_ANTHROPIC_API_KEY;

			if (!apiKey) {
				throw new Error('AI API key not configured');
			}

			console.log('[Coaching] Analyzing draft (length:', draft.length, 'chars)');

			// Search for industry-specific best practices
			let industryContext = '';
			if (industry || programType) {
				const searchQuery = `${industry || programType} fellowship scholarship essay statement best practices winning examples 2025`;
				const { results } = await this.searchWeb(searchQuery, 3, 'basic');
				industryContext = results;
			}

			// Get program-specific criteria
			let programContext = '';
			if (programType) {
				const programs = await this.discoverPrograms(programType, undefined, undefined);
				const targetProgram = programs[0];
				if (targetProgram) {
					programContext = `**Target Program:** ${targetProgram.name}\n**Selection Criteria:** ${JSON.stringify(targetProgram.selectionCriteria)}\n**Description:** ${targetProgram.description}`;
				}
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
					max_tokens: 3000,
					messages: [
						{
							role: 'user',
							content: `You are an expert application coach who has helped hundreds of candidates win prestigious fellowships and scholarships. You provide specific, actionable, constructive feedback.

							${industryContext ? `**Industry Best Practices (from web research):**\n${industryContext}\n\n` : ''}
							${programContext ? `**Program Context:**\n${programContext}\n\n` : ''}

							**Essay/Statement Draft to Analyze:**
							${draft}

							---

							**YOUR TASK:**
							Analyze this draft with surgical precision. Provide specific, actionable feedback that will transform this essay into a winning application.

							**EVALUATION CRITERIA:**
							1. **Structure** (20%): Logical flow, organization, transitions between ideas
							2. **Clarity** (25%): Conciseness, precision, accessibility, avoiding jargon
							3. **Impact** (30%): Strength of examples, use of metrics, storytelling quality
							4. **Mindset** (25%): Leadership philosophy, systems thinking, authenticity, voice

							**DELIVERABLE:**
							Return ONLY valid JSON (no markdown, no preamble):

							{
							"overallScore": <0-100>,
							"structureFeedback": "<2-3 sentences on organization, flow, transitions, and overall arc>",
							"clarityFeedback": "<2-3 sentences on wordiness, jargon, unclear phrasing, and readability>",
							"impactFeedback": "<2-3 sentences on how well impact is demonstrated with examples, metrics, and storytelling>",
							"mindsetFeedback": "<2-3 sentences assessing leadership voice, global perspective, and authenticity>",
							"specificIssues": [
								{
								"line": <approximate paragraph or section number (1, 2, 3, etc.)>,
								"issue": "<specific problem identified>",
								"suggestion": "<concrete suggestion to fix it>"
								}
							],
							"strengthAreas": [
								"<specific strength - be detailed about what's working>",
								"<another strength>",
								"<3-5 total strengths>"
							],
							"revisionPriorities": [
								"<#1 most important thing to fix, with specific action>",
								"<#2 priority>",
								"<#3 priority>",
								"<top 3-5 priorities ranked by impact>"
							],
							"industryBenchmark": "<1-2 sentences on how this compares to successful essays in this field, based on best practices>"
							}

							**INSTRUCTIONS:**
							- Be SPECIFIC with line/paragraph references
							- Be CONSTRUCTIVE and encouraging while being honest
							- Be ACTIONABLE - every criticism should have a clear fix
							- Identify both what's working AND what needs work
							- Consider the program criteria if provided

							Return ONLY valid JSON.`,
						},
					],
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('[Coaching] AI API error:', response.status, errorText);
				throw new Error(`AI API error: ${response.status}`);
			}

			const data: any = await response.json();
			const aiResponse = data.content[0].text.trim();

			let feedback: CoachingFeedback;
			try {
				const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
				feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);

				// Validate structure
				if (!feedback.overallScore || !feedback.revisionPriorities) {
					throw new Error('Invalid feedback structure');
				}
			} catch (e) {
				console.error('[Coaching] JSON parse error, using fallback');
				console.error('[Coaching] Raw response:', aiResponse.substring(0, 500));
				
				feedback = {
					overallScore: 70,
					structureFeedback: 'Consider reorganizing for better logical flow. Add stronger transitions between paragraphs.',
					clarityFeedback: 'Some sections could be more concise. Simplify complex sentences and reduce jargon.',
					impactFeedback: 'Add more specific metrics and concrete outcomes. Use vivid examples with clear before/after results.',
					mindsetFeedback: 'Strengthen your leadership voice and connect your work to broader systems and global challenges.',
					specificIssues: [],
					strengthAreas: [
						'Authentic voice and genuine passion come through',
						'Clear commitment to the field',
						'Good foundation to build upon'
					],
					revisionPriorities: [
						'Add quantifiable achievements with specific numbers and metrics',
						'Tighten the introduction - make it more compelling and hook the reader',
						'Strengthen conclusion with forward-looking vision and clear connection to program goals',
						'Include vivid, specific examples using storytelling techniques',
						'Clarify your theory of change and systems perspective'
					],
					success: true,
					timestamp: new Date().toISOString()
				};
			}

			feedback.success = true;
			feedback.timestamp = new Date().toISOString();

			console.log('[Coaching] Complete. Score:', feedback.overallScore);
			return feedback;
		} catch (error: any) {
			console.error('[Coaching] Error:', error);
			throw new Error(`Coaching failed: ${error.message}`);
		}
	}

	// ========== ENHANCED LESSON GENERATION ==========
	private async generateLesson(
		topic: string,
		userLevel: string,
		learningStyle?: string
	): Promise<any> {
		try {
			const apiEnv = this.env as Env;
			const apiKey = apiEnv.PRESHOT_AI_API_KEY ?? apiEnv.PRESHOT_ANTHROPIC_API_KEY;

			if (!apiKey) {
				throw new Error('AI API key not configured');
			}

			console.log('[Lesson] Generating:', topic, 'Level:', userLevel);

			// Search for latest research and best practices on topic
			const { results } = await this.searchWeb(
				`${topic} leadership development best practices 2025 research`,
				4,
				'basic'
			);

			const response = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01',
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens: 4000,
					messages: [
						{
							role: 'user',
							content: `You are an expert educator creating world-class professional development content for global leaders.

							${results ? `**Latest Research & Best Practices:**\n${results}\n\n` : ''}

							**CREATE A LESSON ON:** ${topic}
							**User Level:** ${userLevel}
							**Learning Style:** ${learningStyle || 'mixed (visual, practical, reflective)'}

							**LESSON STRUCTURE (Return as JSON):**

							{
							"title": "<engaging, specific title>",
							"duration": "<realistic time estimate>",
							"learningObjectives": [
								"<3-5 specific, measurable learning goals>",
								"..."
							],
							"introduction": "<2-3 compelling paragraphs that hook learner and establish relevance>",
							"sections": [
								{
								"sectionTitle": "<clear section title>",
								"content": "<rich teaching content with examples, frameworks, and actionable insights>",
								"globalContext": "<how this applies to international/African leadership context>",
								"reflection": "<thought-provoking question for self-assessment>"
								}
							],
							"caseStudy": {
								"title": "<case study title>",
								"story": "<realistic, globally relevant scenario with challenges and outcomes>",
								"keyLessons": ["<takeaway 1>", "<takeaway 2>", "<takeaway 3>"]
							},
							"practicalExercise": {
								"title": "<exercise title>",
								"instructions": "<clear, step-by-step instructions>",
								"expectedOutcome": "<what learner should produce/achieve>",
								"timeNeeded": "<estimated time>"
							},
							"keyTakeaways": [
								"<7-10 memorable, actionable takeaways>",
								"..."
							],
							"furtherResources": [
								{
								"title": "<resource name>",
								"type": "<article|book|video|course>",
								"url": "<URL if available>",
								"description": "<why this resource is valuable>"
								}
							],
							"assessmentQuestions": [
								{
								"question": "<reflection or multiple choice question>",
								"type": "<reflection|multiple-choice>",
								"options": ["<option A>", "<option B>", "..."],
								"correctAnswer": "<correct option if applicable>",
								"explanation": "<why this matters>"
								}
							]
							}

							**REQUIREMENTS:**
							- Make it engaging, interactive, and immediately applicable
							- Include real-world examples from diverse global contexts
							- Adapt complexity to ${userLevel} level
							- Focus on practical skills, not just theory
							- Include metrics, frameworks, and actionable tools

							Return ONLY valid JSON (no markdown, no preamble).`,
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error(`AI API error: ${response.status}`);
			}

			const data: any = await response.json();
			const aiResponse = data.content[0].text.trim();

			let lesson: any;
			try {
				const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
				lesson = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
			} catch (e) {
				console.error('[Lesson] JSON parse error, using fallback');
				lesson = {
					title: topic,
					duration: '20-30 minutes',
					learningObjectives: [`Understand ${topic}`, `Apply ${topic} in practice`],
					introduction: `This lesson covers ${topic} for global leaders.`,
					sections: [],
					keyTakeaways: [`${topic} is essential for effective leadership`],
					parseError: true
				};
			}

			lesson.success = true;
			lesson.timestamp = new Date().toISOString();
			lesson.lessonId = `lesson-${Date.now()}`;

			console.log('[Lesson] Generated successfully');
			return lesson;
		} catch (error: any) {
			console.error('[Lesson] Error:', error);
			throw new Error(`Lesson generation failed: ${error.message}`);
		}
	}

	// ========== ENHANCED INTERVIEW PREPARATION ==========
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
				throw new Error('AI API key not configured');
			}

			console.log('[Interview] Preparing for:', interviewType, role);

			// Search for latest interview trends and tips
			const { results } = await this.searchWeb(
				`${role} ${interviewType} interview questions 2025 tips best practices`,
				4,
				'basic'
			);

			const questionContext = questions?.length
				? `User wants to prepare for these specific questions: ${questions.join(', ')}`
				: 'Generate comprehensive interview questions for this role';

			const response = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01',
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens: 4000,
					messages: [
						{
							role: 'user',
							content: `You are an expert career coach specializing in interview preparation. You've helped thousands of candidates succeed in competitive interviews.

							${results ? `**Latest Interview Trends & Insights:**\n${results}\n\n` : ''}

							**INTERVIEW DETAILS:**
							- Type: ${interviewType}
							- Role: ${role}
							- Experience Level: ${experience || 'Not specified'}
							- ${questionContext}

							**YOUR TASK:**
							Create comprehensive interview prep tailored to this specific role and interview type.

							**DELIVERABLE (Return as JSON):**

							{
							"mockQuestions": [
								{
								"category": "<behavioral|technical|situational|role-specific>",
								"question": "<specific interview question>",
								"difficulty": "<easy|medium|hard>",
								"commonInIndustry": <true|false>
								}
							],
							"sampleAnswers": [
								{
								"question": "<question text>",
								"starFramework": {
									"situation": "<specific scenario>",
									"task": "<challenge/goal>",
									"action": "<steps taken>",
									"result": "<quantifiable outcome>"
								},
								"tips": [
									"<specific tip for answering this question>",
									"..."
								],
								"commonMistakes": ["<mistake to avoid>", "..."]
								}
							],
							"roleSpecificPrep": {
								"keyCompetencies": ["<competency 1>", "..."],
								"technicalTopics": ["<topic 1>", "..."],
								"industryKnowledge": ["<what to know>", "..."]
							},
							"commonPitfalls": [
								{
								"pitfall": "<mistake>",
								"why": "<why it's bad>",
								"instead": "<what to do instead>"
								}
							],
							"keyTalkingPoints": [
								"<critical strength/experience to emphasize>",
								"..."
							],
							"closingQuestions": [
								{
								"question": "<smart question to ask interviewer>",
								"why": "<why this question is good>",
								"whenToUse": "<appropriate interview stage>"
								}
							],
							"preparationChecklist": [
								"<action item to complete before interview>",
								"..."
							],
							"dayOfTips": [
								"<last-minute tip for interview day>",
								"..."
							]
							}

							**INTERVIEW TYPE ADAPTATIONS:**
							- Behavioral: Heavy STAR method, leadership examples
							- Technical: Coding patterns, system design, problem-solving
							- Case: Framework thinking, structured approaches
							- Panel: Engaging multiple people, reading room dynamics
							- Custom (chef, sales, etc.): Role-specific scenarios and skills

							Return ONLY valid JSON (no markdown, no preamble).`,
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error(`AI API error: ${response.status}`);
			}

			const data: any = await response.json();
			const aiResponse = data.content[0].text.trim();

			let interviewPrep: any;
			try {
				const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
				interviewPrep = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
			} catch (e) {
				console.error('[Interview] JSON parse error, using fallback');
				interviewPrep = {
					mockQuestions: [
						{ category: 'behavioral', question: `Tell me about your experience with ${role}`, difficulty: 'medium' }
					],
					sampleAnswers: [],
					commonPitfalls: [
						{ pitfall: 'Not preparing examples', why: 'Shows lack of preparation', instead: 'Prepare 5-7 STAR stories' }
					],
					keyTalkingPoints: ['Relevant experience', 'Problem-solving', 'Team collaboration'],
					closingQuestions: [
						{ question: 'What does success look like in this role?', why: 'Shows strategic thinking' }
					],
					parseError: true
				};
			}

			interviewPrep.success = true;
			interviewPrep.timestamp = new Date().toISOString();
			interviewPrep.interviewType = interviewType;
			interviewPrep.role = role;

			console.log('[Interview] Prep complete');
			return interviewPrep;
		} catch (error: any) {
			console.error('[Interview] Error:', error);
			throw new Error(`Interview prep failed: ${error.message}`);
		}
	}

	// ========== PROGRAM LIBRARY ENDPOINT ==========
	async handleProgramsEndpoint(request: Request): Promise<Response> {
		try {
			const url = new URL(request.url);
			const type = url.searchParams.get('type');
			const region = url.searchParams.get('region');
			const deadline = url.searchParams.get('deadline');

			console.log('[Programs API] Query:', { type, region, deadline });

			const programs = await this.discoverPrograms(type || undefined, region || undefined, deadline || undefined);

			return new Response(
				JSON.stringify({
					programs,
					total: programs.length,
					source: 'real-time-web-search',
					lastUpdated: new Date().toISOString()
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Cache-Control': 'public, max-age=21600', // 6 hours
					},
				}
			);
		} catch (error: any) {
			console.error('[Programs API] Error:', error);
			return new Response(
				JSON.stringify({
					error: error.message || 'Program discovery failed',
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

	// ========== IPFS INTEGRATION (Pinata) ==========
	private async uploadToIPFS(data: any): Promise<string> {
		try {
			const apiEnv = this.env as Env;
			const pinataJWT = apiEnv.PRESHOT_PINATA_JWT;

			if (!pinataJWT) {
				throw new Error('Pinata JWT not configured');
			}

			const pinata = new PinataSDK({
				pinataJwt: pinataJWT,
				pinataGateway: 'gateway.pinata.cloud',
			});

			const ipfsData = {
				...data,
				uploadedAt: new Date().toISOString(),
				platform: 'Preshot',
				version: '2.0',
			};

			const upload = await pinata.upload.json(ipfsData, {
				metadata: {
					name: `preshot-assessment-${Date.now()}.json`,
				},
			});

			const ipfsUrl = `ipfs://${upload.cid}`;  // Use 'cid' instead of 'IpfsHash'
			console.log('[IPFS] Uploaded:', ipfsUrl);

			return ipfsUrl;
		} catch (error: any) {
			console.error('[IPFS] Upload error:', error);
			throw new Error(`IPFS upload failed: ${error.message}`);
		}
	}

	// ========== BLOCKCHAIN INTEGRATION (Base Sepolia) ==========
	private async submitToBlockchain(
		userAddress: string,
		ipfsUrl: string,
		readinessScore: number,
		region: number,
		userSignature: string
	): Promise<{ success: boolean; message: string; txHash?: string; ipfsUrl?: string }> {
		try {
			console.log('[Blockchain] Submitting to Base Sepolia');
			console.log('  User:', userAddress);
			console.log('  IPFS:', ipfsUrl);
			console.log('  Score:', readinessScore);
			console.log('  Region:', region);

			const { ethers } = await import('ethers');
			const kv = (this.env as any).PRESHOT_KV;

			if (!kv) {
				return { success: false, message: 'KV storage not configured' };
			}

			const privateKey = await kv.get('PRESHOT_AI_WALLET_KEY');
			if (!privateKey) {
				return {
					success: false,
					message: 'AI wallet not configured. Please set PRESHOT_AI_WALLET_KEY in KV.',
				};
			}

			const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
		const aiWallet = new ethers.Wallet(privateKey, provider);

		console.log('[Blockchain] ✅ AI Wallet Address:', aiWallet.address);
		console.log('[Blockchain] 🔍 Expected Address: 0x061595bdf25dec1f668844db7d0874fa724c46b6');

		const balance = await provider.getBalance(aiWallet.address);
		const balanceInEth = ethers.formatEther(balance);
		console.log('[Blockchain] 💰 Balance:', balanceInEth, 'ETH');

		// Removed 0.0001 ETH validation - user confirmed wallet has sufficient gas
		// The wallet has 0.07 ETH which is plenty for transactions

		const contractAddress = '0xEF18625F583F2362390A8edD637f707f62358669';
		const contractABI = [
			'function submitWithSignature(address user, string memory ipfsUrl, uint256 readinessScore, uint256 region, bytes memory signature) external',
		];

		const contract = new ethers.Contract(contractAddress, contractABI, aiWallet);

		console.log('[Blockchain] 📝 Submitting transaction...');

			const tx = await contract.submitWithSignature(
				userAddress,
				ipfsUrl,
				readinessScore,
				region, // Use the region parameter from the request
				userSignature,
				{
					gasLimit: 500000,
				}
			);

			console.log('[Blockchain] TX Hash:', tx.hash);

			const receipt = await tx.wait();
			console.log('[Blockchain] Confirmed in block:', receipt.blockNumber);

			return {
				success: true,
				message: `✅ Credentials recorded on Base blockchain!\nTransaction: ${tx.hash}\nBlock: ${receipt.blockNumber}`,
				txHash: tx.hash,
				ipfsUrl: ipfsUrl,
			};
		} catch (error: any) {
			console.error('[Blockchain] Error:', error);

			const errorMessage = error.reason || error.message || 'Unknown error';
			const isGasError =
				errorMessage.toLowerCase().includes('insufficient funds') ||
				errorMessage.toLowerCase().includes('gas') ||
				error.code === 'INSUFFICIENT_FUNDS';

			if (isGasError) {
				return {
					success: false,
					message: 'AI wallet out of gas. Please submit manually or contact support.',
					ipfsUrl: ipfsUrl, // Include IPFS URL for manual submission
				};
			}

			return {
				success: false,
				message: `❌ Blockchain submission failed: ${errorMessage}`,
			};
		}
	}

	// ========== MCP CONFIGURATION ==========
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
			console.log(`[SSE] Generated session: ${sessionId}`);
		}

		url.searchParams.set('sessionId', sessionId);
		const modifiedRequest = new Request(url.toString(), request);
		return super.processSSEConnection(modifiedRequest);
	}

	// ========== MCP TOOLS SETUP ==========
	private setupPreshotTools(server: McpServer) {
		server.tool(
			'perform_diagnostic_assessment',
			'Analyze user readiness for fellowships/scholarships with web-enhanced intelligence.',
			{
				background: z.string().describe('User background and experience'),
				goals: z.string().describe('Career and application goals'),
				targetPrograms: z.array(z.string()).optional().describe('Target program IDs or names'),
				essayDraft: z.string().optional().describe('Optional essay draft for analysis'),
			},
			async ({ background, goals, targetPrograms, essayDraft }) => {
				const assessment = await this.performDiagnosticAssessment(background, goals, targetPrograms, essayDraft);
				return { content: [{ type: 'text', text: JSON.stringify(assessment, null, 2) }] };
			}
		);

		server.tool(
			'provide_application_feedback',
			'Get AI feedback on application essays with industry benchmarking.',
			{
				draft: z.string().describe('Essay or statement draft'),
				programType: z.string().optional().describe('Program type or ID'),
				industry: z.string().optional().describe('Target industry or field'),
			},
			async ({ draft, programType, industry }) => {
				const feedback = await this.provideCoachingFeedback(draft, programType, industry);
				return { content: [{ type: 'text', text: JSON.stringify(feedback, null, 2) }] };
			}
		);

		server.tool(
			'deliver_mindset_lesson',
			'Generate interactive, research-backed leadership lesson.',
			{
				topic: z.string().describe('Lesson topic'),
				userLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
				learningStyle: z.string().optional().describe('Preferred learning style'),
			},
			async ({ topic, userLevel = 'intermediate', learningStyle }) => {
				const lesson = await this.generateLesson(topic, userLevel, learningStyle);
				return { content: [{ type: 'text', text: JSON.stringify(lesson, null, 2) }] };
			}
		);

		server.tool(
			'prepare_interview',
			'Get comprehensive, role-specific interview preparation.',
			{
				interviewType: z.string().describe('Interview type'),
				role: z.string().describe('Job role/position'),
				experience: z.string().optional().describe('Years of experience'),
				questions: z.array(z.string()).optional().describe('Specific questions to prepare'),
			},
			async ({ interviewType, role, experience, questions }) => {
				const prep = await this.prepareInterview(interviewType, role, experience, questions);
				return { content: [{ type: 'text', text: JSON.stringify(prep, null, 2) }] };
			}
		);

		server.tool(
			'discover_programs',
			'Discover fellowship/scholarship programs via real-time web search.',
			{
				type: z.string().optional().describe('Program type filter'),
				region: z.string().optional().describe('Region filter'),
				deadline: z.string().optional().describe('Deadline filter'),
			},
			async ({ type, region, deadline }) => {
				const programs = await this.discoverPrograms(type, region, deadline);
				return { content: [{ type: 'text', text: JSON.stringify({ programs, total: programs.length }, null, 2) }] };
			}
		);

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

	private setupPreshotResources(server: McpServer) {
		server.resource('user_readiness_state', 'resource://preshot/readiness/{userId}', async (uri: URL) => {
			const userId = uri.pathname.split('/').pop() || 'unknown';
			const state = {
				userId,
				lastAssessment: null,
				currentScore: 0,
				message: 'No assessments on record',
			};
			return { contents: [{ text: JSON.stringify(state, null, 2), uri: uri.href }] };
		});

		server.resource('live_programs', 'resource://preshot/programs/live', async (uri: URL) => {
			const programs = await this.discoverPrograms();
			return { contents: [{ text: JSON.stringify({ programs, source: 'web', total: programs.length }, null, 2), uri: uri.href }] };
		});
	}

	private setupPreshotPrompts(server: McpServer) {
		server.prompt('preshot_coaching_prompt', 'Expert coaching personality.', () => ({
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
						text: 'You are Preshot AI - an expert coach for global leaders. Be constructive, specific, evidence-based, and culturally aware.',
					},
				},
			],
		}));
	}
}

export const ExampleMcpServer = PreshotAgentServer;