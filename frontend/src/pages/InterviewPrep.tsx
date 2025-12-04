import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useInterview } from '@/hooks/useMCP';
import { Loader2, Briefcase, Target, MessageSquare, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const InterviewPrep = () => {
  const { prepareInterview, loading, data } = useInterview();
  const [formData, setFormData] = useState({
    interviewType: 'behavioral',
    role: '',
    experience: '',
    customQuestions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) {
      toast.error('Please enter the role you\'re interviewing for');
      return;
    }

    const questionsArray = formData.customQuestions
      ? formData.customQuestions.split('\n').filter((q) => q.trim())
      : undefined;

    try {
      await prepareInterview({
        interviewType: formData.interviewType,
        role: formData.role,
        experience: formData.experience || undefined,
        questions: questionsArray,
      });
      toast.success('Interview prep generated successfully!');
    } catch (error) {
      toast.error('Failed to generate interview prep');
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 mt-32">
        {/* Header */}
        <div className="text-black">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            Interview Preparation
          </h1>
          <p className="text-muted-foreground mt-2">
            Get AI-powered interview coaching with mock questions, STAR method
            examples, and personalized tips
          </p>
        </div>

        {/* Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Configure Your Prep Session</CardTitle>
            <CardDescription>
              Tell us about your interview to get tailored preparation materials
              {/* i'm a professional smart contract developer, with skilled knowledge in solidity rust and other language. a work best with teams and delivers projects on time */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="interviewType">Interview Type</Label>
                  <Select
                    value={formData.interviewType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, interviewType: value })
                    }
                  >
                    <SelectTrigger id="interviewType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="case">Case Interview</SelectItem>
                      <SelectItem value="panel">Panel Interview</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="fellowship">Fellowship/Scholarship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role/Position *</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Software Engineer, Product Manager"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level (Optional)</Label>
                <Input
                  id="experience"
                  placeholder="e.g., 3 years, Entry-level, Senior"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customQuestions">
                  Specific Questions (Optional)
                </Label>
                <Textarea
                  id="customQuestions"
                  placeholder="Enter any specific questions you want to prepare for (one per line)"
                  rows={4}
                  value={formData.customQuestions}
                  onChange={(e) =>
                    setFormData({ ...formData, customQuestions: e.target.value })
                  }
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Prep Materials...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    Generate Interview Prep
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {data && (
          <div className="space-y-6">
            {/* Mock Questions */}
            {data.mockQuestions && data.mockQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Mock Questions ({data.mockQuestions.length})
                  </CardTitle>
                  <CardDescription>
                    Practice these common interview questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.mockQuestions.map((question: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-secondary/50 border border-border"
                      >
                        {typeof question === 'string' ? (
                          <p className="font-medium">
                            {idx + 1}. {question}
                          </p>
                        ) : (
                          <div className="space-y-2">
                            <p className="font-medium">
                              {idx + 1}. {question.question}
                            </p>
                            {question.category && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {question.category}
                              </span>
                            )}
                            {question.difficulty && (
                              <span className="text-xs ml-2 text-muted-foreground">
                                Difficulty: {question.difficulty}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sample Answers with STAR */}
            {data.sampleAnswers && data.sampleAnswers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sample Answers (STAR Method)</CardTitle>
                  <CardDescription>
                    Framework for structuring your responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {data.sampleAnswers.map((answer: any, idx: number) => (
                      <div key={idx} className="space-y-4">
                        <p className="font-semibold text-lg">
                          {answer.question}
                        </p>
                        {answer.starFramework && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                              <h4 className="font-semibold text-sm text-blue-600 mb-2">
                                Situation
                              </h4>
                              <p className="text-sm">
                                {answer.starFramework.situation}
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                              <h4 className="font-semibold text-sm text-purple-600 mb-2">
                                Task
                              </h4>
                              <p className="text-sm">
                                {answer.starFramework.task}
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                              <h4 className="font-semibold text-sm text-green-600 mb-2">
                                Action
                              </h4>
                              <p className="text-sm">
                                {answer.starFramework.action}
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                              <h4 className="font-semibold text-sm text-orange-600 mb-2">
                                Result
                              </h4>
                              <p className="text-sm">
                                {answer.starFramework.result}
                              </p>
                            </div>
                          </div>
                        )}
                        {answer.tips && answer.tips.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Tips:</h4>
                            <ul className="space-y-1">
                              {answer.tips.map((tip: string, tipIdx: number) => (
                                <li
                                  key={tipIdx}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Talking Points */}
            {data.keyTalkingPoints && data.keyTalkingPoints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Talking Points</CardTitle>
                  <CardDescription>
                    Important themes to emphasize in your answers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {data.keyTalkingPoints.map((point: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50"
                      >
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Common Pitfalls */}
            {data.commonPitfalls && data.commonPitfalls.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Common Pitfalls to Avoid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.commonPitfalls.map((pitfall: any, idx: number) => (
                      <li
                        key={idx}
                        className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                      >
                        {typeof pitfall === 'string' ? (
                          <p className="text-sm text-muted-foreground">
                            ❌ {pitfall}
                          </p>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-destructive">
                              ❌ {pitfall.pitfall}
                            </p>
                            {pitfall.why && (
                              <p className="text-xs text-muted-foreground">
                                <strong>Why to avoid:</strong> {pitfall.why}
                              </p>
                            )}
                            {pitfall.instead && (
                              <p className="text-xs text-green-600">
                                <strong>Do instead:</strong> {pitfall.instead}
                              </p>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Questions to Ask */}
            {data.closingQuestions && data.closingQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Questions to Ask the Interviewer</CardTitle>
                  <CardDescription>
                    Show your interest and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.closingQuestions.map((question: any, idx: number) => (
                      <li
                        key={idx}
                        className="p-3 rounded-lg bg-primary/5 border border-primary/20"
                      >
                        {typeof question === 'string' ? (
                          <p className="text-sm">{question}</p>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              {question.question}
                            </p>
                            {question.why && (
                              <p className="text-xs text-muted-foreground">
                                <strong>Why ask:</strong> {question.why}
                              </p>
                            )}
                            {question.whenToUse && (
                              <p className="text-xs text-primary/70">
                                <strong>When to ask:</strong> {question.whenToUse}
                              </p>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
