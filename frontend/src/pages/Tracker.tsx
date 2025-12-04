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
} from "recharts";

export default function Analytics() {
  // Progress data for chart
  const progressData = [
    { month: "Jan", score: 45 },
    { month: "Feb", score: 52 },
    { month: "Mar", score: 58 },
    { month: "Apr", score: 65 },
    { month: "May", score: 70 },
    { month: "Jun", score: 78 },
  ];

  const chartConfig = {
    score: {
      label: "Readiness Score",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 top-40 relative pb-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Your Progress Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Track your preparation journey with detailed insights and analytics
          </p>
        </div>

        {/* Progress Summary Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">80</div>
                <p className="text-blue-100">Overall Score</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ArrowUp className="h-6 w-6 text-green-300" />
                  <span className="text-3xl font-bold">+12%</span>
                </div>
                <p className="text-blue-100">Improvement</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">8</div>
                <p className="text-blue-100">Programs Matched</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">15%</div>
                <p className="text-blue-100">Completion Rate</p>
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
            <CardDescription>
              Your progress over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                <div className="flex flex-col md:flex-row items-center gap-4">
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
                  <span className="text-sm">Average Study Time</span>
                  <span className="font-semibold">2.5 hrs/day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Modules Completed</span>
                  <span className="font-semibold">12/20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Streak</span>
                  <span className="font-semibold">7 days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Application Cycles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Applications</span>
                  <Badge>3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Upcoming Deadlines</span>
                  <Badge variant="destructive">5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Submitted</span>
                  <Badge className="bg-green-500">2</Badge>
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
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    Completed "Leadership Foundations" Module
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Scored 95% • Nov 1, 2024
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="p-2 rounded-full bg-blue-100">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">7-Day Learning Streak</p>
                  <p className="text-sm text-muted-foreground">
                    Keep it up! • Oct 30, 2024
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="p-2 rounded-full bg-purple-100">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    Readiness Score Improved by 12%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    From 68 to 80 • Oct 28, 2024
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
