// Dynamic form configurations for different assessment types

export type AssessmentType = 'fellowship' | 'interview' | 'scholarship' | 'accelerator' | 'general';

export interface FormField {
  id: string;
  label: string;
  placeholder: string;
  rows?: number;
  required: boolean;
  type: 'textarea' | 'text' | 'select';
  options?: { value: string; label: string }[];
}

export interface FormStep {
  title: string;
  description: string;
  fields: FormField[];
}

export const assessmentFormConfigs: Record<AssessmentType, FormStep[]> = {
  fellowship: [
    {
      title: 'Your Goals',
      description: 'What opportunities are you pursuing?',
      fields: [
        {
          id: 'goals',
          label: 'Career & Education Goals',
          placeholder: "e.g., I want to pursue a master's degree in public policy to eventually work in international development...",
          rows: 8,
          required: true,
          type: 'textarea',
        },
      ],
    },
    {
      title: 'Background & Experience',
      description: 'Tell us about your journey so far',
      fields: [
        {
          id: 'background',
          label: 'Educational & Professional Background',
          placeholder: 'Include your education, work experience, key achievements, skills, and any relevant leadership roles...',
          rows: 10,
          required: true,
          type: 'textarea',
        },
      ],
    },
    {
      title: 'Target Programs & Essay (Optional)',
      description: 'Specific programs and materials for review',
      fields: [
        {
          id: 'targetPrograms',
          label: 'Target Programs (Optional)',
          placeholder: 'e.g., YALI, Chevening, Rhodes Scholarship, Tony Elumelu Foundation (comma-separated)',
          rows: 3,
          required: false,
          type: 'textarea',
        },
        {
          id: 'essayDraft',
          label: 'Personal Statement or Essay (Optional)',
          placeholder: 'Paste your essay draft here for detailed AI feedback...',
          rows: 8,
          required: false,
          type: 'textarea',
        },
      ],
    },
  ],

  interview: [
    {
      title: 'Interview Details',
      description: 'Tell us about the interview you\'re preparing for',
      fields: [
        {
          id: 'interviewType',
          label: 'Interview Type',
          placeholder: 'e.g., Behavioral, Technical, Panel, Case Study, Virtual...',
          rows: 2,
          required: true,
          type: 'textarea',
        },
        {
          id: 'role',
          label: 'Role/Position',
          placeholder: 'e.g., Software Engineer, Product Manager, Business Analyst...',
          rows: 2,
          required: true,
          type: 'textarea',
        },
      ],
    },
    {
      title: 'Your Experience',
      description: 'Help us understand your background',
      fields: [
        {
          id: 'background',
          label: 'Professional Background & Relevant Experience',
          placeholder: 'Describe your work experience, key skills, and relevant projects...',
          rows: 8,
          required: true,
          type: 'textarea',
        },
        {
          id: 'companyIndustry',
          label: 'Company/Industry (Optional)',
          placeholder: 'e.g., Tech startup, Financial services, Healthcare...',
          rows: 2,
          required: false,
          type: 'textarea',
        },
      ],
    },
    {
      title: 'Specific Preparation',
      description: 'Areas you want to focus on',
      fields: [
        {
          id: 'specificQuestions',
          label: 'Specific Questions or Areas (Optional)',
          placeholder: 'e.g., Tell me about yourself, Why do you want to work here, Describe a challenging project...',
          rows: 6,
          required: false,
          type: 'textarea',
        },
      ],
    },
  ],

  scholarship: [
    {
      title: 'Academic Goals',
      description: 'What are you hoping to study?',
      fields: [
        {
          id: 'goals',
          label: 'Academic & Research Goals',
          placeholder: 'Describe what you want to study, your research interests, and career aspirations...',
          rows: 8,
          required: true,
          type: 'textarea',
        },
      ],
    },
    {
      title: 'Academic Background',
      description: 'Your educational journey',
      fields: [
        {
          id: 'background',
          label: 'Educational Background & Achievements',
          placeholder: 'Include your degrees, GPA, relevant coursework, research experience, publications, awards...',
          rows: 10,
          required: true,
          type: 'textarea',
        },
      ],
    },
    {
      title: 'Application Materials',
      description: 'Programs and supporting documents',
      fields: [
        {
          id: 'targetPrograms',
          label: 'Target Scholarships (Optional)',
          placeholder: 'e.g., Fulbright, Gates Cambridge, Mastercard Foundation Scholars...',
          rows: 3,
          required: false,
          type: 'textarea',
        },
        {
          id: 'essayDraft',
          label: 'Statement of Purpose (Optional)',
          placeholder: 'Paste your statement of purpose or research proposal for feedback...',
          rows: 8,
          required: false,
          type: 'textarea',
        },
      ],
    },
  ],

  accelerator: [
    {
      title: 'Your Startup',
      description: 'Tell us about your business idea',
      fields: [
        {
          id: 'businessIdea',
          label: 'Business Idea/Startup Name',
          placeholder: 'Brief description of your startup and what problem it solves...',
          rows: 4,
          required: true,
          type: 'textarea',
        },
        {
          id: 'problemStatement',
          label: 'Problem Statement',
          placeholder: 'What specific problem are you addressing? Who experiences this problem?',
          rows: 5,
          required: true,
          type: 'textarea',
        },
      ],
    },
    {
      title: 'Market & Traction',
      description: 'Your target market and progress',
      fields: [
        {
          id: 'targetMarket',
          label: 'Target Market & Customer Segments',
          placeholder: 'Who are your customers? Market size and opportunity...',
          rows: 6,
          required: true,
          type: 'textarea',
        },
        {
          id: 'background',
          label: 'Traction & Team Background',
          placeholder: 'Current metrics, revenue, users, team experience, key achievements...',
          rows: 8,
          required: true,
          type: 'textarea',
        },
      ],
    },
    {
      title: 'Goals & Materials',
      description: 'What you hope to achieve',
      fields: [
        {
          id: 'goals',
          label: 'Goals for Accelerator Program',
          placeholder: 'What do you want to achieve? What support do you need?',
          rows: 6,
          required: true,
          type: 'textarea',
        },
        {
          id: 'pitchDeck',
          label: 'Pitch Deck Summary (Optional)',
          placeholder: 'Key points from your pitch deck or business plan...',
          rows: 6,
          required: false,
          type: 'textarea',
        },
      ],
    },
  ],

  general: [
    {
      title: 'Career Goals',
      description: 'Where do you want to go?',
      fields: [
        {
          id: 'goals',
          label: 'Career Objectives',
          placeholder: 'What are your short-term and long-term career goals?',
          rows: 6,
          required: true,
          type: 'textarea',
        },
        {
          id: 'targetIndustries',
          label: 'Target Industries/Roles',
          placeholder: 'e.g., Technology, Healthcare, Finance, Education...',
          rows: 3,
          required: false,
          type: 'textarea',
        },
      ],
    },
    {
      title: 'Your Profile',
      description: 'Help us understand your background',
      fields: [
        {
          id: 'background',
          label: 'Current Skills & Experience',
          placeholder: 'Describe your education, work experience, skills, and key accomplishments...',
          rows: 8,
          required: true,
          type: 'textarea',
        },
      ],
    },
    {
      title: 'Development Areas',
      description: 'What do you want to improve?',
      fields: [
        {
          id: 'learningObjectives',
          label: 'Learning & Development Objectives',
          placeholder: 'What skills or areas do you want to develop?',
          rows: 6,
          required: false,
          type: 'textarea',
        },
      ],
    },
  ],
};
