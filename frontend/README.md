# Preshot - Your Gateway to Global Opportunities

![Preshot](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=300&fit=crop)

**Preshot** is an AI-powered platform designed to help professionals worldwide prepare for fellowships, scholarships, job interviews, and career opportunities. The platform combines blockchain-verified credentials, AI coaching, and comprehensive preparation tools to transform your potential into success.

## 🌟 Overview

Preshot addresses the challenge of professionals navigating the complex landscape of global opportunities. The platform combines artificial intelligence, program intelligence, and blockchain-verified achievements to provide personalized guidance and preparation support.

### Key Features

- **🎯 Diagnostic Assessment**: AI-powered readiness evaluation with blockchain-verified scores
- **🎓 Program Intelligence**: Curated database of fellowships, scholarships, and opportunities
- **🤖 AI Application Coach**: Real-time feedback on essays and application materials  
- **💼 Interview Preparation**: AI-powered coaching for behavioral, technical, and panel interviews
- **📚 Mindset Micro-Courses**: Interactive lessons on leadership and global citizenship
- **👥 Mentor Network**: Connect with experienced fellows and program alumni
- **📊 Progress Analytics**: Track your readiness journey with on-chain verification
- **🏆 NFT Achievement Badges**: Earn soul-bound NFTs for milestones and achievements

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Thirdweb client ID ([Get one for free](https://thirdweb.com/dashboard))

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd preshot-app/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```env
   VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
   VITE_MCP_SERVER_URL=https://your-mcp-server.workers.dev
   VITE_BASE_NETWORK=base-sepolia
   VITE_BADGES_CONTRACT=0x97d0CcEfE0Fe3A9dD392743c29A39ea18ADD0156
   VITE_CREDENTIALS_CONTRACT=0xEF18625F583F2362390A8edD637f707f62358669
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
preshot-app/frontend/
├── src/
│   ├── components/
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx
│   │   ├── wallet/
│   │   │   └── ConnectWallet.tsx
│   │   ├── navigation.tsx
│   │   └── ui/                    # shadcn UI components
│   ├── config/
│   │   └── admins.ts             # Admin wallet addresses
│   ├── hooks/
│   │   └── useMCP.ts             # MCP tool hooks
│   ├── lib/
│   │   ├── mcpClient.ts          # MCP server client
│   │   └── utils.ts              # Utility functions
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Assessment.tsx
│   │   ├── AssessmentResults.tsx
│   │   ├── Programs.tsx
│   │   ├── Coach.tsx
│   │   ├── Courses.tsx
│   │   ├── InterviewPrep.tsx     # NEW: Interview preparation
│   │   ├── Mentors.tsx
│   │   ├── MentorsAdmin.tsx      # NEW: Admin dashboard
│   │   ├── Analytics.tsx
│   │   └── Index.tsx
│   ├── providers/
│   │   └── ThirdwebProvider.tsx  # Thirdweb/Web3 provider
│   ├── App.tsx                   # Main app with routing
│   ├── index.css                 # Global styles
│   └── main.tsx                  # Entry point
├── .env.example                  # Environment template
├── index.html
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

## 🔧 Configuration

### Thirdweb Setup

1. **Create a Thirdweb account** at [thirdweb.com](https://thirdweb.com)
2. **Get your Client ID** from the dashboard
3. **Add to `.env.local`**

### MCP Server Deployment

The MCP (Model Context Protocol) server powers AI features. See `/agent/preshot-mcp-server` for deployment instructions.

### Blockchain Contracts

Deployed on Base Sepolia:
- **PreshotBadges**: Soul-bound NFT achievement badges
- **PreshotCredentials**: On-chain credential verification

### Admin Configuration

Add admin wallet addresses in `src/config/admins.ts`:

```typescript
export const ADMIN_ADDRESSES = [
  '0xe099fa204938657fd6f81671d1f7d14ec669b24d',
  // Add more admin addresses here
];
```

## 📱 Features & User Flow

### 1. Wallet Authentication
- Connect with any Web3 wallet via Thirdweb
- Automatic routing to dashboard or admin panel
- Secure session management

### 2. Diagnostic Assessment
- AI-powered readiness evaluation
- Choose assessment type: scholarship, fellowship, interview, or general
- Blockchain-verified results
- Personalized recommendations

### 3. Program Matching
- AI-powered program recommendations via MCP
- Filter by type, region, deadline
- Real program data (no mocks)

### 4. AI Coach
- Essay and application feedback
- Real-time suggestions via MCP server
- Iterative improvement tracking

### 5. Interview Preparation
- Select interview type (behavioral, technical, case, etc.)
- Get mock questions with STAR method examples
- AI-generated coaching and tips

### 6. Mindset Courses
- AI-generated interactive lessons
- Leadership, citizenship, and professional development
- Progress tracking

### 7. Mentor Network
- User view: Browse and request mentorship
- Admin view: Monitor users and provide feedback

### 8. NFT Badges
- Earn soul-bound NFTs for achievements
- Region-specific badges (Global, Africa, Asia)
- View on blockchain explorers

## 🎨 Design System

### Color Palette (Dark Theme)
- **Background**: Deep Slate (`#0c0e14`)
- **Foreground**: Light (`#fafafa`)
- **Primary**: Professional Blue (`#4f7cff`)
- **Card**: Elevated Slate (`#141821`)
- **Border**: Subtle (`#232940`)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: Space Grotesk
- **Code**: SF Mono

### Components
- Built with shadcn/ui
- Fully customizable and accessible
- Dark theme by default
- Responsive design for all screens

## 🚢 Deployment

### Deploy to Vercel

```bash
npm run build
vercel
```

Set environment variables in Vercel dashboard.

### Deploy to Netlify

```bash
npm run build
```

Deploy the `dist` folder. Set environment variables in Netlify dashboard.

### Production Checklist
- [ ] Configure Thirdweb client ID
- [ ] Deploy MCP server to Cloudflare Workers
- [ ] Set MCP_SERVER_URL
- [ ] Verify contract addresses
- [ ] Test wallet connection
- [ ] Test all MCP integrations
- [ ] Configure custom domain
- [ ] Enable analytics (optional)

## 🔐 Security Notes

- Never commit `.env.local` files
- Wallet private keys managed by users
- Admin addresses verified on-chain
- All API calls authenticated
- Rate limiting on MCP server
- HTTPS in production

## 📊 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Wallet**: Thirdweb SDK
- **Blockchain**: Base (Sepolia testnet)
- **Smart Contracts**: Solidity + Foundry
- **AI**: MCP Server (Cloudflare Workers) + Claude AI
- **IPFS**: Pinata for credential storage
- **Routing**: React Router v6
- **State**: React Query + Context API

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Development Status

### ✅ Completed
- Thirdweb wallet integration
- Admin routing system
- Modern dark theme UI
- MCP client infrastructure
- React hooks for AI tools
- Landing page redesign
- InterviewPrep page
- MentorsAdmin page
- Protected route system
- Blockchain integration setup

### ⏳ In Progress
- Mock data removal from pages
- Full MCP integration in all features
- Enhanced analytics dashboard
- Mentor matching system

### 📅 Planned
- Email notifications
- Mobile app (React Native)
- More badge types
- Advanced analytics
- Community features

## 📞 Support

For questions or support:
- **Website**: [preshot.app](https://preshot.app)
- **Documentation**: See `/docs`
- **Issues**: GitHub Issues

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**Built for professionals worldwide seeking global opportunities** 🌍
