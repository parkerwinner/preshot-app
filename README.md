# Preshot — Readiness Engine

![Preshot Banner](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=300&fit=crop)

**Preshot** is a Talent first AI powered platform designed to help users prepare for fellowships, scholarships, talent programs, interview and accelerators. Built with Nullshot MCP, Preshot provides comprehensive diagnostic assessments, program matching, AI powered coaching, and mindset development resources.

## 🌟 Overview

Preshot addresses the challenge of Talents and students navigating the complex landscape of global opportunities. The platform combines artificial intelligence, curated program intelligence, and community mentorship to provide personalized guidance and preparation support.

### Key Features

- **🎯 Diagnostic Assessment Engine**: Evaluate readiness levels, identify strengths and weaknesses
- **🎓 Program Intelligence Library**: Curated database of fellowships, scholarships, Job Interviews, and accelerators
- **🤖 AI Application Coach**: Real time feedback on essays, statements, and application materials
- **📚 Mindset Micro-Courses**: Interactive lessons on leadership, systems thinking, and global citizenship
- **👥 Mentor Network**: Connect with experienced fellows and program alumni
- **📊 Analytics & Progress Tracking**: Monitor readiness metrics and improvement over time

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for database and courses)
- Thirdweb account (for Web3 wallet authentication)
- NullShot MCP server (for AI-powered coaching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd preshot-app
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8081` (or the port shown in terminal)

## 🏗️ Project Structure

```
preshot-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   │   └── DashboardLayout.tsx
│   │   │   ├── wallet/
│   │   │   │   └── ConnectWallet.tsx    # Thirdweb wallet connection
│   │   │   ├── navigation.tsx            # Main navigation component
│   │   │   ├── Footer.tsx
│   │   │   └── ui/                       # shadcn UI components
│   │   ├── config/
│   │   │   └── admins.ts                 # Admin wallet addresses
│   │   ├── lib/
│   │   │   ├── supabase.ts              # Supabase client
│   │   │   ├── mcpClient.ts             # NullShot MCP client
│   │   │   └── utils.ts                 # Utility functions
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Assessment.tsx
│   │   │   ├── AssessmentResults.tsx
│   │   │   ├── Programs.tsx
│   │   │   ├── Coach.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── InterviewPrep.tsx        # Interview preparation
│   │   │   ├── Mentors.tsx
│   │   │   ├── MentorsAdmin.tsx         # Admin mentor management
│   │   │   ├── Analytics.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Index.tsx                # Landing page
│   │   ├── providers/
│   │   │   └── ThirdwebProvider.tsx     # Thirdweb configuration
│   │   ├── services/
│   │   │   ├── courses.ts               # Supabase course services
│   │   │   └── mentors.ts               # Mentor management
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env                              # Environment variables
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
├── agent/
│   └── preshot-mcp-server/              # NullShot MCP Server
│       ├── src/
│       │   ├── server.ts                # MCP server implementation
│       │   └── programs/                # Program library
│       └── package.json
├── database/
│   └── fix_courses_table.sql            # Supabase schema
└── README.md
```

## 🔧 Configuration

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Create preshotcourses tables** (optional, for storing user data)
   ```sql
   -- Example: User courses table
   CREATE TABLE IF NOT EXISTS preshotcourses (
  id TEXT PRIMARY KEY,  -- Use text ID like 'global-leadership-foundations'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,  -- 'leadership', 'systems-thinking', etc.
  icon TEXT DEFAULT 'BookOpen',  -- Lucide icon name
  color TEXT DEFAULT 'blue',  -- Tailwind color name
  duration_minutes INTEGER DEFAULT 30,
  order_index INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  is_demo BOOLEAN DEFAULT false,  -- Flag for demo courses with bypass
  content JSONB,  -- Detailed lesson content
  requirements TEXT[],  -- Prerequisites
  learning_objectives TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
   ```

4. **Update environment variables**
   - Copy your Supabase URL and anon key to `.env`

### Thirdweb Configuration

1. **Create a Thirdweb account** at [thirdweb.com](https://thirdweb.com)
2. **Create a new project** in the Thirdweb dashboard
3. **Get your Client ID** from the project settings
4. **Add to environment variables**:
   ```env
   VITE_THIRDWEB_CLIENT_ID=your_client_id_here
   ```

### NullShot MCP Server

The MCP (Model Context Protocol) server provides AI-powered coaching and program intelligence:

1. **Navigate to the MCP server directory**
   ```bash
   cd agent/preshot-mcp-server
   npm install
   ```

2. **Configure the server** with your program library and AI credentials

3. **Start the MCP server**
   ```bash
   npm start
   ```

The MCP server provides:
- AI-powered coaching feedback
- Program matching intelligence
- Interview preparation guidance
- Personalized learning recommendations

## 📱 Features & User Flow

### 1. Authentication
- **Web3 Wallet Connection** via Thirdweb
- Support for multiple wallet providers (MetaMask, Coinbase Wallet, WalletConnect, etc.)
- Automatic redirect to dashboard upon connection
- Admin/user role-based routing
- Secure wallet-based authentication on Base network

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
- **Web3 Authentication**: Thirdweb SDK (Base network)
- **Database**: Supabase PostgreSQL
- **AI Integration**: NullShot MCP (Model Context Protocol)
- **Build Tool**: Vite
- **Blockchain**: Base (Layer 2 on Ethereum)

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
- Some advanced AI features require MCP server configuration
- Course content needs to be populated in Supabase
- Interview prep features are in development

## 📞 Support

For questions or support:
- **Email**: hi@xavalabs.com
- **Discord**: Join Preshot Network community

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🙏 Acknowledgments

- Built with **NullShot MCP** for AI-powered intelligence
- Powered by **Thirdweb** for Web3 authentication
- Styled with **Tailwind CSS** and **shadcn/ui**
- Inspired by the need to democratize access to global opportunities for talented innovators worldwide

---

**Built with NULLSHOT MCP for global talents and innovators**
