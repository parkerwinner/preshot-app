import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAssessment } from '@/hooks/useMCP';
import { toast } from 'sonner';
import { assessmentFormConfigs, type AssessmentType } from '@/config/assessmentForms';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Assessment() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { performAssessment, loading: hookLoading } = useAssessment();
  const [loading, setLoading] = useState(false);

  const [assessmentType, setAssessmentType] = useState<AssessmentType>('fellowship');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Get dynamic form configuration based on assessment type
  const formConfig = useMemo(() => assessmentFormConfigs[assessmentType], [assessmentType]);
  const totalSteps = formConfig.length + 1; // +1 for type selection step

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation errors when user types
    setValidationErrors([]);
  };

  const handleTypeChange = (newType: string) => {
    setAssessmentType(newType as AssessmentType);
    setFormData({}); // Reset form data when changing type
    setValidationErrors([]);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Fields that don't require 20-character minimum
    const exemptFields = ['interviewType', 'role'];

    // Validate all steps up to current
    for (let i = 0; i < formConfig.length; i++) {
      const stepConfig = formConfig[i];
      const requiredFields = stepConfig.fields.filter((f) => f.required);

      for (const field of requiredFields) {
        const value = formData[field.id]?.trim();
        if (!value) {
          errors.push(`${field.label} is required`);
        } else if (value.length < 20 && !exemptFields.includes(field.id)) {
          errors.push(`${field.label} should be at least 20 characters for better assessment`);
        }
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      toast.error('Please complete all required fields with sufficient detail');
      return;
    }

    setLoading(true);
    try {
      console.log('[Assessment] Starting with type:', assessmentType);
      console.log('[Assessment] Form data:', formData);

      // Construct assessment data based on type
      let assessmentPayload: any = {};

      if (assessmentType === 'interview') {
        // For interview assessments, use the interview endpoint
        assessmentPayload = {
          interviewType: formData.interviewType || 'behavioral',
          role: formData.role || '',
          experience: formData.background || '',
          questions: formData.specificQuestions
            ? formData.specificQuestions.split('\n').filter((q) => q.trim())
            : undefined,
        };

        console.log('[Assessment] Interview payload:', assessmentPayload);

        // Call interview preparation endpoint
        const response = await fetch('/api/preshot/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assessmentPayload),
        });

        if (!response.ok) {
          throw new Error(`Interview prep failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('[Assessment] Interview result:', result);

        // Navigate to interview results
        navigate('/assessment/interview-results', {
          state: { 
            assessment: result, 
            assessmentType: 'interview',
            formData 
          },
        });

        toast.success('Interview preparation complete!');
        return;
      }

      // For fellowship/scholarship/general assessments
      assessmentPayload = {
        background: formData.background || '',
        goals: formData.goals || '',
        targetPrograms: formData.targetPrograms
          ? formData.targetPrograms.split(',').map((p) => p.trim()).filter(Boolean)
          : [],
        essayDraft: formData.essayDraft || undefined,
      };

      // Add type-specific fields
      if (assessmentType === 'accelerator') {
        Object.assign(assessmentPayload, {
          businessIdea: formData.businessIdea,
          problemStatement: formData.problemStatement,
          targetMarket: formData.targetMarket,
          pitchDeck: formData.pitchDeck,
        });
      } else if (assessmentType === 'general') {
        Object.assign(assessmentPayload, {
          targetIndustries: formData.targetIndustries,
          learningObjectives: formData.learningObjectives,
        });
      }

      console.log('[Assessment] Payload being sent:', assessmentPayload);

      // Call the MCP assessment endpoint directly
      const response = await fetch('/api/preshot/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Assessment failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[Assessment] Raw result from server:', result);

      // Validate result structure
      if (!result.success || !result.readinessScore) {
        console.error('[Assessment] Invalid result structure:', result);
        throw new Error('Invalid assessment result received');
      }

      toast.success('Assessment complete!');

      // Navigate to results with full assessment data
      navigate('/assessment/results', {
        state: {
          assessment: result,
          assessmentType,
          formData,
        },
      });
    } catch (error: any) {
      console.error('[Assessment] Error:', error);
      toast.error(error.message || 'Failed to complete assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (field: any) => {
    if (field.type === 'select' && field.options) {
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            <SelectTrigger id={field.id}>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.hint && (
            <p className="text-sm text-muted-foreground">{field.hint}</p>
          )}
        </div>
      );
    }

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id}>
          {field.label} {field.required && <span className="text-destructive">*</span>}
        </Label>
        <Textarea
          id={field.id}
          placeholder={field.placeholder}
          value={formData[field.id] || ''}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          rows={field.rows || 4}
          required={field.required}
          className="min-h-[100px]"
        />
        {field.hint && (
          <p className="text-sm text-muted-foreground">{field.hint}</p>
        )}
        {field.id === 'background' && (
          <p className="text-xs text-muted-foreground italic">
            💡 Tip: Include specific achievements, metrics, and impact for better assessment
          </p>
        )}
        {field.id === 'goals' && (
          <p className="text-xs text-muted-foreground italic">
            💡 Tip: Be specific about what you want to achieve and why
          </p>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 pb-12 mt-32">
        {/* Header */}
        <div className="text-center space-y-2 text-black">
          <div className="flex items-center justify-center gap-2 text-primary mb-4">
            <Target className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">AI Readiness Assessment</h1>
          <p className="text-muted-foreground">
            Get personalized insights powered by advanced AI analysis
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  i + 1 <= step
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted bg-background text-muted-foreground'
                }`}
              >
                {i + 1 < step ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors ${
                    i + 1 < step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Form Steps */}
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Assessment Type'}
              {step > 1 && formConfig[step - 2]?.title}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'What type of opportunity are you preparing for?'}
              {step > 1 && formConfig[step - 2]?.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Assessment Type */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assessmentType">
                    Select Assessment Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={assessmentType} onValueChange={handleTypeChange}>
                    <SelectTrigger id="assessmentType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fellowship">
                        Fellowship/Scholarship
                      </SelectItem>
                      <SelectItem value="interview">Job Interview</SelectItem>
                      <SelectItem value="scholarship">
                        Academic Scholarship
                      </SelectItem>
                      <SelectItem value="accelerator">
                        Accelerator/Incubator
                      </SelectItem>
                      <SelectItem value="general">
                        General Career Readiness
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    This helps our AI tailor the assessment to your specific needs
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm">
                    <strong>Selected:</strong>{' '}
                    {assessmentType === 'fellowship' && 'Fellowship/Scholarship Preparation'}
                    {assessmentType === 'interview' && 'Job Interview Readiness'}
                    {assessmentType === 'scholarship' && 'Academic Scholarship Applications'}
                    {assessmentType === 'accelerator' && 'Startup Accelerator/Incubator'}
                    {assessmentType === 'general' && 'General Career Development'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Our AI will analyze your responses and provide personalized recommendations
                  </p>
                </div>
              </div>
            )}

            {/* Dynamic Form Steps */}
            {step > 1 && step <= totalSteps && (
              <div className="space-y-6">
                {formConfig[step - 2]?.fields.map(renderFormField)}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1 || loading}
              >
                Previous
              </Button>

              {step < totalSteps ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={loading}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI is analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Get AI Assessment
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        {step === totalSteps && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">About Your Assessment</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI will analyze your responses using advanced natural language processing
                    to provide personalized insights, scores, and recommendations. The more detail
                    you provide, the more accurate and helpful your assessment will be.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}