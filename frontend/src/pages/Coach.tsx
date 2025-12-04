import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Brain,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { useFeedback } from '@/hooks/useMCP';
import { toast } from 'sonner';

export default function Coach() {
  const [essayText, setEssayText] = useState('');
  const { provideFeedback, loading, data } = useFeedback();

  const handleAnalyze = async () => {
    const wordCount = essayText.split(' ').filter((w) => w).length;
    
    if (wordCount < 100) {
      toast.error('Please enter at least 100 words');
      return;
    }

    try {
      await provideFeedback({
        draft: essayText,
      });
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze essay. Please try again.');
    }
  };

  const wordCount = essayText.split(' ').filter((w) => w).length;

  return (
    <DashboardLayout>
      <div className="space-y-8 mt-32">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <div className="text-black">
            <h1 className="text-3xl font-bold">AI Application Coach</h1>
            <p className="text-muted-foreground mt-1">
              Get instant, AI-powered feedback on your essays and statements
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Essay Input */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Your Essay</CardTitle>
              <CardDescription>
                Paste your essay or personal statement for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your essay here... (minimum 100 words)"
                className="min-h-[400px] resize-none"
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {wordCount} words {wordCount < 100 && `(${100 - wordCount} more needed)`}
                </span>
                <Button
                  onClick={handleAnalyze}
                  disabled={loading || wordCount < 100}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Analyze Essay
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Feedback */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Feedback
              </CardTitle>
              <CardDescription>
                Detailed analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">
                    Analyzing your essay with AI...
                  </p>
                </div>
              ) : !data ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <Brain className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Paste your essay to receive AI-powered feedback
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Score */}
                  {data.overallScore && (
                    <div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-5xl font-bold text-primary mb-2">
                        {data.overallScore}/100
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Overall Score
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {data.strengths && data.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {data.strengths.map((strength: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {data.improvements && data.improvements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {data.improvements.map((improvement: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
                          >
                            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {data.suggestions && data.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-600" />
                        Suggestions
                      </h4>
                      <div className="space-y-2">
                        {data.suggestions.map((suggestion: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm"
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pro Tips */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Lightbulb className="h-5 w-5 text-primary" />
              Pro Tips for Better Essays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-black">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  <strong>Be specific:</strong> Use concrete examples and
                  metrics to demonstrate impact
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  <strong>Show growth:</strong> Highlight how experiences shaped
                  your perspective and goals
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  <strong>Connect to values:</strong> Align your narrative with
                  the fellowship's mission and values
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  <strong>Be authentic:</strong> Let your unique voice and
                  passion shine through
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
