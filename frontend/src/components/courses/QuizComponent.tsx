import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { QuizQuestion } from "@/types/courses";
import { submitQuizAttempt } from "@/services/courseService";
import { toast } from "sonner";

interface QuizComponentProps {
  moduleId: string;
  questions: QuizQuestion[];
  onComplete: (passed: boolean, score: number) => void;
}

export const QuizComponent = ({
  moduleId,
  questions,
  onComplete,
}: QuizComponentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let score = 0;
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        score += question.points;
      }
    });

    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= 70; // 70% passing grade

    try {
      await submitQuizAttempt(moduleId, answers, score, totalPoints, passed);
      setSubmitted(true);
      setShowResults(true);

      if (passed) {
        toast.success(`Quiz passed! Score: ${percentage.toFixed(0)}%`);
      } else {
        toast.error(
          `Quiz failed. Score: ${percentage.toFixed(0)}%. Try again!`
        );
      }

      onComplete(passed, score);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz");
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = !!answers[question.id];
  const allAnswered = questions.every((q) => answers[q.id]);

  if (showResults) {
    const score = questions.reduce((sum, q) => {
      return sum + (answers[q.id] === q.correct_answer ? q.points : 0);
    }, 0);
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= 70;

    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {passed ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Quiz Passed!
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-600" />
                Quiz Failed
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {percentage.toFixed(0)}%
            </div>
            <p className="text-muted-foreground">
              {score} out of {totalPoints} points
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q, index) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct_answer;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold mb-1">
                        Question {index + 1}: {q.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer: <strong>{userAnswer}</strong>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-600">
                          Correct answer: <strong>{q.correct_answer}</strong>
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-sm text-gray-700 mt-2 italic">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!passed && (
            <Button
              onClick={() => {
                setShowResults(false);
                setSubmitted(false);
                setAnswers({});
                setCurrentQuestion(0);
              }}
              className="w-full"
            >
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Quiz</CardTitle>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

          {question.question_type === "multiple_choice" && question.options && (
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {question.question_type === "true_false" && (
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="True" id="true" />
                  <Label htmlFor="true" className="flex-1 cursor-pointer">
                    True
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="False" id="false" />
                  <Label htmlFor="false" className="flex-1 cursor-pointer">
                    False
                  </Label>
                </div>
              </div>
            </RadioGroup>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentQuestion
                    ? "bg-blue-600"
                    : answers[questions[index].id]
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitted}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitted ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!isAnswered}>
              Next
            </Button>
          )}
        </div>

        {!allAnswered && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>Please answer all questions before submitting</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
