import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  Play,
  Zap,
} from "lucide-react";
import { LessonViewer } from "@/components/courses/LessonViewer";
import { QuizComponent } from "@/components/courses/QuizComponent";
import {
  fetchCourseWithModules,
  fetchModuleWithQuiz,
  completeModule,
} from "@/services/courseService";
import type { Course, ModuleWithProgress, QuizQuestion } from "@/types/courses";
import { toast } from "sonner";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithProgress[]>([]);
  const [selectedModule, setSelectedModule] =
    useState<ModuleWithProgress | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingModule, setCompletingModule] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await fetchCourseWithModules(courseId!);
      setCourse(data.course);
      setModules(data.modules);
    } catch (error) {
      console.error("Error loading course:", error);
      toast.error("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = async (module: ModuleWithProgress) => {
    // Check if previous modules are completed
    const moduleIndex = modules.findIndex((m) => m.id === module.id);
    if (moduleIndex > 0) {
      const previousModule = modules[moduleIndex - 1];
      if (!previousModule.progress?.is_completed) {
        toast.error("Please complete the previous module first");
        return;
      }
    }

    setSelectedModule(module);

    // Load quiz questions if this is a quiz module
    if (module.content.type === "quiz") {
      try {
        const { questions } = await fetchModuleWithQuiz(module.id);
        setQuizQuestions(questions);
      } catch (error) {
        console.error("Error loading quiz:", error);
        toast.error("Failed to load quiz");
      }
    }
  };

  const handleCompleteLesson = async () => {
    if (!selectedModule || !course) return;

    try {
      setCompletingModule(true);
      await completeModule(
        selectedModule.id,
        course.id,
        selectedModule.duration_minutes || 0
      );
      toast.success("Module completed!");

      // Reload course data to update progress
      await loadCourse();
      setSelectedModule(null);
    } catch (error) {
      console.error("Error completing module:", error);
      toast.error("Failed to mark module as complete");
    } finally {
      setCompletingModule(false);
    }
  };

  const handleQuizComplete = async (passed: boolean, score: number) => {
    if (!passed) return;

    // Mark module as complete after passing quiz
    await handleCompleteLesson();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading course...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Course not found</p>
          <Button onClick={() => navigate("/courses")} className="mt-4">
            Back to Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const completedModules = modules.filter(
    (m) => m.progress?.is_completed
  ).length;
  const progressPercentage = (completedModules / modules.length) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6 top-40 relative pb-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/courses")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-1">{course.description}</p>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm font-semibold">
                  {completedModules} / {modules.length} modules completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{modules.length} modules</span>
                </div>
                <Badge
                  variant={
                    course.difficulty === "beginner" ? "secondary" : "default"
                  }
                >
                  {course.difficulty}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HACKATHON BYPASS - Demo Only */}
        {course.is_demo && progressPercentage < 100 && (
          <Card className="border-2 border-yellow-400 bg-yellow-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-900 mb-2">
                    🎓 Hackathon Demo Mode
                  </h3>
                  <p className="text-sm text-yellow-800 mb-4">
                    For demonstration purposes, you can skip directly to NFT
                    minting.{" "}
                    <strong className="font-semibold">
                      This bypass will be removed after the hackathon
                    </strong>
                    . Production users will need to complete all modules.
                  </p>
                  <Button
                    onClick={async () => {
                      try {
                        toast.loading("Bypassing to certificate...");
                        // Mark course as 100% complete (demo only)
                        // This would call your backend to mint NFT
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                        toast.success(
                          "Demo NFT minting initiated! Check your wallet soon."
                        );
                        navigate("/certificates");
                      } catch (error) {
                        toast.error("Bypass failed");
                      }
                    }}
                    variant="outline"
                    className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Skip to NFT Minting (Demo Only)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Module List */}
          <div className="md:col-span-1 space-y-3">
            <h2 className="text-xl font-semibold mb-4">Modules</h2>
            {modules.map((module, index) => {
              const isLocked =
                index > 0 && !modules[index - 1].progress?.is_completed;
              const isCompleted = module.progress?.is_completed;
              const isActive = selectedModule?.id === module.id;

              return (
                <Card
                  key={module.id}
                  className={`cursor-pointer transition-all ${
                    isActive
                      ? "border-2 border-blue-500 shadow-md"
                      : "border hover:shadow-md"
                  } ${isLocked ? "opacity-50" : ""}`}
                  onClick={() => !isLocked && handleModuleClick(module)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isCompleted
                            ? "bg-green-100"
                            : isLocked
                            ? "bg-gray-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : isLocked ? (
                          <Lock className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Play className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">
                          {index + 1}. {module.title}
                        </h3>
                        {module.description && (
                          <p className="text-xs text-muted-foreground">
                            {module.description}
                          </p>
                        )}
                        {module.duration_minutes && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{module.duration_minutes} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="md:col-span-2">
            {!selectedModule ? (
              <Card className="border-2">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Select a Module to Begin
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a module from the list to start learning
                  </p>
                </CardContent>
              </Card>
            ) : selectedModule.content.type === "lesson" ? (
              <LessonViewer
                sections={selectedModule.content.sections || []}
                onComplete={
                  selectedModule.progress?.is_completed
                    ? undefined
                    : handleCompleteLesson
                }
              />
            ) : selectedModule.content.type === "quiz" ? (
              <QuizComponent
                moduleId={selectedModule.id}
                questions={quizQuestions}
                onComplete={handleQuizComplete}
              />
            ) : (
              <Card className="border-2">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Unknown module type</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
