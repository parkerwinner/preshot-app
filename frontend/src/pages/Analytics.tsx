import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  Brain,
  Users,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  TrendingUp,
  BookOpen,
  Loader2,
  BarChart3,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  fetchUserAnalytics,
  fetchReadinessTrend,
  fetchSkillAnalysis,
  fetchRecentAchievements,
  calculateAverageStudyTime,
  type UserAnalytics,
  type ReadinessTrend,
  type SkillScore,
  type Achievement,
} from "@/services/analyticsService";
import { toast } from "sonner";

export default function Analytics() {
  const account = useActiveAccount();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserAnalytics>({
    overallScore: 0,
    improvement: 0,
    programsMatched: 0,
    completionRate: 0,
    assessmentsTaken: 0,
    coursesCompleted: 0,
    coursesInProgress: 0,
    totalStudyTime: 0,
    currentStreak: 0,
  });
  const [trendData, setTrendData] = useState<ReadinessTrend[]>([]);
  const [skillsData, setSkillsData] = useState<SkillScore[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (account) {
      // loadUserAnalytics(); // Commented out - needs Web3 backend
      setLoading(false); // For now just set loading false
    }
  }, [account]);

  const loadUserAnalytics = async () => {
    if (!account?.address) return;

    setLoading(true);
    try {
      // Load all analytics data in parallel
      const [stats, trend, skills, recentAchievements] = await Promise.all([
        fetchUserAnalytics(account.address),
        fetchReadinessTrend(account.address),
        fetchSkillAnalysis(account.address),
        fetchRecentAchievements(account.address),
      ]);

      setUserStats(stats);
      setTrendData(trend);
      setSkillsData(skills);
      setAchievements(recentAchievements);
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Use real trend data or show empty state
  const progressData =
    trendData.length > 0 ? trendData : [{ month: "No data", score: 0 }];

  // Transform skills data for radar chart
  const radarData = skillsData.map((skill) => ({
    subject: skill.skill,
    A: skill.score,
    fullMark: 100,
  }));

  const chartConfig = {
    score: {
      label: "Readiness Score",
      color: "hsl(var(--primary))",
    },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 top-40 relative pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-black">
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your preparation journey with detailed insights and
              analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-lg bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Progress Summary Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {userStats.overallScore}
                </div>
                <p className="text-blue-100">Overall Score</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ArrowUp className="h-6 w-6 text-green-300" />
                  <span className="text-3xl font-bold">
                    +{userStats.improvement}%
                  </span>
                </div>
                <p className="text-blue-100">Improvement</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {userStats.programsMatched}
                </div>
                <p className="text-blue-100">Programs Matched</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {userStats.completionRate}%
                </div>
                <p className="text-blue-100">Completion Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {userStats.assessmentsTaken}
                </div>
                <p className="text-blue-100">Assessments Taken</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Results */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Academic Excellence
                  </p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
              </div>
              <Progress value={92} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Leadership Skills
                  </p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
              </div>
              <Progress value={78} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Community Impact
                  </p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
              <Progress value={85} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Readiness Score Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Readiness Score Over Time</CardTitle>
            <CardDescription>Your progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No assessment data yet</p>
                  <p className="text-sm">
                    Complete an assessment to see your progress
                  </p>
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Recommended Programs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recommended Programs
            </CardTitle>
            <CardDescription>
              Based on your profile and interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      Mandela Washington Fellowship
                    </p>
                    <p className="text-sm text-muted-foreground">
                      U.S. Department of State
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  88% Match
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      Young African Leaders Initiative
                    </p>
                    <p className="text-sm text-muted-foreground">
                      U.S. Department of State
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  92% Match
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Award className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      Tony Elumelu Foundation Programme
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tony Elumelu Foundation
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  85% Match
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Development</CardTitle>
            <CardDescription>
              Track your progress across key competencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Systems Thinking</span>
                  <span className="text-sm text-muted-foreground">85/100</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Communication Skills</span>
                  <span className="text-sm text-muted-foreground">78/100</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Cultural Awareness</span>
                  <span className="text-sm text-muted-foreground">92/100</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Problem Solving</span>
                  <span className="text-sm text-muted-foreground">80/100</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Project Management</span>
                  <span className="text-sm text-muted-foreground">70/100</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Management & Application Cycles */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Study Time</span>
                  <span className="font-semibold">
                    {Math.round(userStats.totalStudyTime / 60)} hrs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Courses Completed</span>
                  <span className="font-semibold">
                    {userStats.coursesCompleted}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Streak</span>
                  <span className="font-semibold">
                    {userStats.currentStreak} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Courses In Progress</span>
                  <Badge>{userStats.coursesInProgress}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Assessments Taken</span>
                  <Badge variant="secondary">
                    {userStats.assessmentsTaken}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completion Rate</span>
                  <Badge className="bg-green-500">
                    {userStats.completionRate}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No achievements yet. Keep learning to earn achievements!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {achievements.map((achievement) => {
                  const bgColors = {
                    green: "bg-green-50 border-green-200",
                    blue: "bg-blue-50 border-blue-200",
                    purple: "bg-purple-50 border-purple-200",
                    orange: "bg-orange-50 border-orange-200",
                  };
                  const iconColors = {
                    green: "bg-green-100 text-green-600",
                    blue: "bg-blue-100 text-blue-600",
                    purple: "bg-purple-100 text-purple-600",
                    orange: "bg-orange-100 text-orange-600",
                  };

                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        bgColors[
                          achievement.icon_color as keyof typeof bgColors
                        ] || bgColors.green
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          iconColors[
                            achievement.icon_color as keyof typeof iconColors
                          ] || iconColors.green
                        }`}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Competency Analysis - Radar Chart & Bar Chart */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Competency Radar</CardTitle>
              <CardDescription>
                Visual representation of your key skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Comparison</CardTitle>
              <CardDescription>
                Your performance across different areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="skill"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="score"
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>
              Focus on these areas to boost your readiness score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 border border-orange-200">
                <div className="p-2 rounded-full bg-orange-100">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Essay Writing Skills</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Complete the "Effective Essay Writing" module
                  </p>
                  <Progress value={40} className="h-2" />
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="p-2 rounded-full bg-yellow-100">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Interview Preparation</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Practice with mock interviews
                  </p>
                  <Progress value={25} className="h-2" />
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Networking Skills</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Connect with mentors and peers
                  </p>
                  <Progress value={15} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
