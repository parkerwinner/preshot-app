import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Brain,
  Users,
  Globe,
  Target,
  Lightbulb,
  Clock,
  CheckCircle2,
  Lock,
  Play,
  Loader2,
} from "lucide-react";
import { fetchCoursesWithProgress } from "@/services/courseService";
import type { CourseWithProgress } from "@/types/courses";
import { toast } from "sonner";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchCoursesWithProgress();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Users,
      Brain,
      Globe,
      Target,
      Lightbulb,
      BookOpen,
    };
    return icons[iconName] || BookOpen;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> =
      {
        blue: {
          bg: "bg-blue-100",
          text: "text-blue-600",
          border: "border-blue-200",
        },
        green: {
          bg: "bg-green-100",
          text: "text-green-600",
          border: "border-green-200",
        },
        purple: {
          bg: "bg-purple-100",
          text: "text-purple-600",
          border: "border-purple-200",
        },
        orange: {
          bg: "bg-orange-100",
          text: "text-orange-600",
          border: "border-orange-200",
        },
        yellow: {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          border: "border-yellow-200",
        },
        pink: {
          bg: "bg-pink-100",
          text: "text-pink-600",
          border: "border-pink-200",
        },
      };
    return colors[color] || colors.blue;
  };

  const getStatusBadge = (status: string) => {
    if (status === "Completed") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }
    if (status === "In Progress") {
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
      );
    }
    if (status === "Locked") {
      return (
        <Badge variant="secondary">
          <Lock className="h-3 w-3 mr-1" />
          Locked
        </Badge>
      );
    }
    return <Badge variant="outline">Not Started</Badge>;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalCourses = courses.length;
  const completedCourses = courses.filter(
    (c) => c.progress?.status === "completed"
  ).length;
  const inProgressCourses = courses.filter(
    (c) => c.progress?.status === "in_progress"
  ).length;
  const overallProgress =
    totalCourses > 0
      ? Math.round(
          courses.reduce(
            (sum, c) => sum + (c.progress?.progress_percentage || 0),
            0
          ) / totalCourses
        )
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8 top-40 relative pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <BookOpen className="h-10 w-10 text-blue-600" />
            </div>
            <div className="text-black">
              <h1 className="text-3xl font-bold">Mindset Micro-Courses</h1>
              <p className="text-muted-foreground mt-1">
                Interactive lessons on leadership and global citizenship
              </p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {totalCourses}
                </div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {completedCourses}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {inProgressCourses}
                </div>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {overallProgress}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Overall Progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <Card className="border-2">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Courses Available
              </h3>
              <p className="text-muted-foreground">
                Courses will appear here once they are added to the system.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const Icon = getIconComponent(course.icon);
              const colors = getColorClasses(course.color);
              const progress = course.progress?.progress_percentage || 0;
              const status = course.progress?.status || "not_started";
              const isLocked = course.is_locked;

              return (
                <Card
                  key={course.id}
                  className={`border-2 ${
                    colors.border
                  } hover:shadow-lg transition-all cursor-pointer ${
                    isLocked ? "opacity-60" : ""
                  }`}
                  onClick={() => !isLocked && navigate(`/courses/${course.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${colors.bg}`}>
                          <Icon className={`h-6 w-6 ${colors.text}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {course.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {course.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.modules_count || 0} modules</span>
                      </div>
                      {getStatusBadge(
                        status === "completed"
                          ? "Completed"
                          : status === "in_progress"
                          ? "In Progress"
                          : isLocked
                          ? "Locked"
                          : "Not Started"
                      )}
                    </div>

                    {!isLocked && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-semibold">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    <Button
                      className="w-full"
                      disabled={isLocked}
                      variant={isLocked ? "secondary" : "default"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLocked) navigate(`/courses/${course.id}`);
                      }}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Complete previous courses to unlock
                        </>
                      ) : progress === 0 ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Course
                        </>
                      ) : progress === 100 ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Review Course
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Learning Path Info */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Your Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Complete courses in sequence to unlock advanced modules. Each
              course builds on the previous one, creating a comprehensive
              preparation journey.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>
                Earn certificates upon completion to showcase your skills
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
