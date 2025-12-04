import { useActiveAccount } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Target,
  BookOpen,
  Users,
  Brain,
  Sparkles,
  BarChart3,
  Trophy,
  Briefcase,
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { isAdmin } from '@/config/admins';

export default function Dashboard() {
  const account = useActiveAccount();
  const navigate = useNavigate();
  const userAddress = account?.address;
  const userName = userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'there';

  // Admin users should see admin dashboard instead
  const userIsAdmin = isAdmin(userAddress);
  if (userIsAdmin) {
    navigate('/mentors-admin');
    return null;
  }

  // TODO: Fetch real data from blockchain & MCP
  // For now showing placeholder while transitions happen
  const stats = {
    readinessScore: 0,
    completedAssessments: 0,
    coursesCompleted: 0,
    badges: 0,
  };

  const quickActions = [
    {
      title: 'Run Diagnostic',
      description: 'Assess your readiness and get personalized insights',
      icon: Target,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      badge: 'Start Here',
      badgeColor: 'bg-green-500/10 text-green-600 border-green-500/20',
      route: '/assessment',
    },
    {
      title: 'Interview Prep',
      description: 'AI-powered coaching for your next interview',
      icon: Briefcase,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
      badge: 'AI Powered',
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      route: '/interview-prep',
    },
    {
      title: 'Match Programs',
      description: 'Discover opportunities that fit your profile',
      icon: Trophy,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      badge: 'Recommended',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      route: '/programs',
    },
    {
      title: 'Mindset Courses',
      description: 'Build leadership skills with AI-generated lessons',
      icon: Brain,
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-600',
      badge: 'Interactive',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      route: '/courses',
    },
    {
      title: 'Application Coach',
      description: 'Get real-time feedback on your essays',
      icon: Sparkles,
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-600',
      badge: 'AI Coach',
      badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      route: '/coach',
    },
    {
      title: 'Progress Analytics',
      description: 'Track your journey and achievements',
      icon: BarChart3,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      badge: 'Insights',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      route: '/analytics',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 mt-32">
        {/* Welcome Section */}
        <div className="text-black">
          <h1 className="text-3xl font-bold">Welcome Back, {userName}! 👋</h1>
          <p className="text-muted-foreground mt-2">
           Ready to take your career to the next level? Start with an assessment.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Readiness Score
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.readinessScore > 0 ? stats.readinessScore : '--'}/100
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.readinessScore === 0
                  ? 'Complete an assessment'
                  : 'Keep improving'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completedAssessments}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.coursesCompleted}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.badges}</div>
              <p className="text-xs text-muted-foreground">NFT Achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl text-black font-semibold mb-7">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, idx) => (
              <Card
                key={idx}
                className="cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/5 border-border/50 hover:border-primary/50"
                onClick={() => navigate(action.route)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${action.iconBg}`}>
                      <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                    </div>
                    <Badge className={action.badgeColor}>{action.badge}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {action.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        {stats.completedAssessments === 0 && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Get Started with Preshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Complete Your First Assessment</p>
                    <p className="text-sm text-muted-foreground">
                      Discover your readiness level and get personalized
                      recommendations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/60 text-primary-foreground text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Explore Matched Programs</p>
                    <p className="text-sm text-muted-foreground">
                      Find fellowships and scholarships that fit your profile
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/40 text-primary-foreground text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Start Learning</p>
                    <p className="text-sm text-muted-foreground">
                      Take AI-generated courses to fill skill gaps
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full" asChild>
                <Link to="/assessment">
                  <Target className="mr-2 h-4 w-4" />
                  Start Your First Assessment
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Mentorship CTA */}
        <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">
                  Connect with Mentors
                </h2>
                <p className="text-muted-foreground mb-4">
                  Get guidance from experienced professionals who have walked the
                  path you're on. Our mentors are ready to help you succeed.
                </p>
                <Button variant="default" asChild>
                  <Link to="/mentors">
                    <Users className="mr-2 h-4 w-4" />
                    Find a Mentor
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-20 w-20 text-primary/20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
