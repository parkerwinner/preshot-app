import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Brain,
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function AssessmentResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assessment } = location.state || {};

  useEffect(() => {
    if (!assessment) {
      toast.error('No assessment data found. Please complete an assessment first.');
      navigate('/assessment');
    }
  }, [assessment, navigate]);

  if (!assessment) {
    return null;
  }

  // Get data from the AI assessment
  const readinessScore = assessment.readinessScore || 0;
  const componentScores = assessment.componentScores || {};
  const strengths = assessment.strengths || [];
  const weaknesses = assessment.weaknesses || [];
  const narrativeGaps = assessment.narrativeGaps || [];
  const recommendations = assessment.recommendations || [];
  const programFit = assessment.programFit || {};
  const keyInsights = assessment.keyInsights || '';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 mt-32">
        {/* Header */}
        <div className="text-center space-y-4 text-black">
          <Trophy className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Your AI Readiness Assessment Results</h1>
          <p className="text-muted-foreground">
            Based on your responses, here's your personalized readiness report
          </p>
        </div>

        {/* Overall Score */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Overall Readiness Score
            </CardTitle>
            <CardDescription>Your preparation level for target opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="text-6xl font-bold text-primary">{Math.round(readinessScore)}</div>
              <div className="text-muted-foreground mb-2">/100</div>
            </div>
            <Progress value={readinessScore} className="h-3" />
            {keyInsights && (
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-4">
                {keyInsights}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Component Scores */}
        {Object.keys(componentScores).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>Detailed component analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(componentScores).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-semibold text-primary">{value}/100</span>
                  </div>
                  <Progress value={value as number} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Strengths */}
          {strengths.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <CardTitle>Your Strengths</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Areas for Improvement */}
          {weaknesses.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <CardTitle>Areas for Improvement</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Narrative Gaps */}
        {narrativeGaps.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-yellow-900">Narrative Gaps</CardTitle>
              </div>
              <CardDescription>Story elements to strengthen your application</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {narrativeGaps.map((gap, idx) => (
                  <li key={idx} className="text-sm text-yellow-900 flex items-start gap-2">
                    <span className="text-yellow-600 font-bold mt-0.5">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Personalized Recommendations</CardTitle>
              </div>
              <CardDescription>AI-generated action items to improve your readiness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">{idx + 1}</span>
                    </div>
                    <span className="flex-1 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Program Matches */}
        {Object.keys(programFit).length > 0 && (
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Program Fit Analysis</CardTitle>
              </div>
              <CardDescription>AI-assessed compatibility with major programs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(programFit)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([program, match], idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{program}</p>
                      <p className="text-sm text-muted-foreground">
                        {match}% compatibility with your profile
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        (match as number) >= 70 
                          ? "bg-green-50 text-green-700 border-green-200"
                          : (match as number) >= 50
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {match}%
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/programs')}>
            Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/courses')}>
            Start Learning
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/assessment')}>
            Retake Assessment
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
