# Preshot — CAMP Readiness Engine

![Preshot Banner](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=300&fit=crop)

**Preshot** is Africa's first AI-powered platform designed to help users prepare for fellowships, scholarships, talent programs, interview and accelerators. Built as part of the CAMP Network, Preshot provides comprehensive diagnostic assessments, program matching, AI-powered coaching, and mindset development resources.

## 🌟 Overview

Preshot addresses the challenge of African leaders and students navigating the complex landscape of global opportunities. The platform combines artificial intelligence, curated program intelligence, and community mentorship to provide personalized guidance and preparation support.

### Key Features

- **🎯 Diagnostic Assessment Engine**: Evaluate readiness levels, identify strengths and weaknesses
- **🎓 Program Intelligence Library**: Curated database of fellowships, scholarships, and accelerators
- **🤖 AI Application Coach**: Real-time feedback on essays, statements, and application materials
- **📚 Mindset Micro-Courses**: Interactive lessons on leadership, systems thinking, and global citizenship
- **👥 Mentor Network**: Connect with experienced fellows and program alumni
- **📊 Analytics & Progress Tracking**: Monitor readiness metrics and improvement over time

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Supabase account (for backend features)
- OpenAI or HuggingFace API key (for AI coaching features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd preshot-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080`

## 🏗️ Project Structure

```
preshot-app/
├── src/
│   ├── components/
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ui/                    # shadcn UI components
│   ├── contexts/
│   │   └── AuthContext.tsx        # Authentication context
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   └── utils.ts              # Utility functions
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Assessment.tsx
│   │   ├── AssessmentResults.tsx
│   │   ├── Programs.tsx
│   │   ├── Coach.tsx
│   │   ├── Courses.tsx
│   │   ├── Mentors.tsx
│   │   ├── Analytics.tsx
│   │   └── Index.tsx
│   ├── services/
│   │   └── api.ts                # API integration layer
│   ├── App.tsx                   # Main app component
│   ├── index.css                 # Global styles
│   └── main.tsx                  # Entry point
├── public/
├── .env                          # Environment variables (create this)
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Configuration

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Set up authentication**
   - Enable Email/Password authentication
   - Configure redirect URLs in Authentication > URL Configuration
   - Add your app URL (both localhost and production)

3. **Create database tables** (optional, for storing user data)
   ```sql
   -- Example: User profiles table
   create table profiles (
     id uuid references auth.users primary key,
     full_name text,
     goals text,
     background text,
     readiness_score integer,
     created_at timestamp with time zone default now()
   );
   ```

4. **Update environment variables**
   - Copy your Supabase URL and anon key to `.env`

### Backend API Integration

The app includes placeholder API functions in `src/services/api.ts` for:
- Diagnostic assessment processing (`/api/diagnose`)
- AI coaching feedback (`/api/coach`)
- Program matching (`/api/programs`)
- CAMP Network integration (`/api/camp/*`)

**To implement the backend:**

1. Set up a Node.js/Express server or use serverless functions
2. Connect to OpenAI or HuggingFace for AI features
3. Implement the API endpoints matching the service layer
4. Update the API base URL in the service functions

### CAMP Network SSO Integration

For CAMP Network SSO integration:
1. Contact CAMP Network for API credentials
2. Implement OAuth flow or API-based authentication
3. Update authentication logic in `AuthContext.tsx`
4. Add user sync functionality in `services/api.ts`

## 📱 Features & User Flow

### 1. Authentication
- Email/password signup and login
- Password reset functionality
- Session management with Supabase Auth
- Ready for CAMP Network SSO integration

### 2. Diagnostic Assessment
- Multi-step form collecting:
  - Career and education goals
  - Background and experience
  - Target programs
  - Optional essay draft
- AI-powered analysis
- Personalized readiness score

### 3. Program Library
- Curated database of opportunities
- Advanced filtering (type, region, deadline)
- Program matching based on user profile
- Detailed eligibility requirements

### 4. AI Coach (Placeholder)
- Essay structure analysis
- Clarity and mindset feedback
- Highlighted issues with suggestions
- Iterative improvement tracking

### 5. Mindset Courses (Placeholder)
- Leadership fundamentals
- Systems thinking
- Global citizenship
- Interactive assessments

### 6. Mentor Network (Placeholder)
- Mentor profiles and matching
- Direct messaging
- Session scheduling
- Progress reviews

### 7. Analytics Dashboard (Placeholder)
- Readiness score trends
- Skill gap analysis
- Course completion metrics
- Application status tracking

## 🎨 Design System

The app uses a custom design system built with Tailwind CSS:

### Color Palette
- **Primary**: Blue (#3B82F6) - Main brand color
- **Accent**: Green (#10B981) - Success states
- **Warning**: Amber (#F59E0B) - Warnings and alerts
- **Muted**: Gray tones for secondary content

### Components
- Built with shadcn/ui component library
- Fully customizable and accessible
- Dark mode support included
- Responsive design for all screen sizes

## 🚢 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard

### Deploy to Netlify

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to Netlify

3. **Set environment variables** in Netlify dashboard

### Production Checklist
- [ ] Configure Supabase production URL and keys
- [ ] Set up backend API endpoints
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Configure custom domain
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Enable analytics (optional)
- [ ] Test authentication flow end-to-end
- [ ] Verify all API integrations

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use Row Level Security (RLS) in Supabase for data access control
- Implement rate limiting on backend APIs
- Validate all user inputs on both client and server
- Use HTTPS in production
- Regularly update dependencies for security patches

## 📊 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State Management**: React Context API + React Query
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL (backend)
- **AI Integration**: OpenAI/HuggingFace (backend)
- **Build Tool**: Vite

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

### Current Status
- ✅ Authentication system (login/signup)
- ✅ Dashboard with readiness overview
- ✅ Diagnostic assessment flow
- ✅ Assessment results page
- ✅ Program library with filtering
- ⏳ AI Coach (placeholder)
- ⏳ Mindset Courses (placeholder)
- ⏳ Mentor Network (placeholder)
- ⏳ Analytics Dashboard (placeholder)

### Next Steps
1. Implement backend API for diagnostic assessment processing
2. Integrate OpenAI for AI coaching feedback
3. Build out mindset course content and interactive components
4. Develop mentor matching and messaging system
5. Create analytics dashboard with charts and insights
6. Implement CAMP Network API integration
7. Add email notifications for deadlines and updates

### Known Issues
- Backend API endpoints are placeholders and need implementation
- AI coaching features require external API integration
- Some pages are placeholder implementations (marked "Coming Soon")

## 📞 Support

For questions or support:
- **Email**: support@preshot.app
- **CAMP Network**: [camp-network.org](https://camp-network.org)

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🙏 Acknowledgments

- Built for the CAMP Network community
- Powered by modern web technologies
- Inspired by the need to democratize access to global opportunities for African leaders

---

**Built with ❤️ for Africa's next generation of leaders**
