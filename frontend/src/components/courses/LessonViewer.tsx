import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import type { LessonSection } from "@/types/courses";

interface LessonViewerProps {
  sections: LessonSection[];
  onComplete?: () => void;
}

export const LessonViewer = ({ sections, onComplete }: LessonViewerProps) => {
  const renderSection = (section: LessonSection, index: number) => {
    switch (section.type) {
      case "text":
        return (
          <div key={index} className="prose prose-gray max-w-none">
            {section.title && (
              <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
            )}
            <p className="text-gray-700 leading-relaxed">{section.content}</p>
          </div>
        );

      case "callout":
        const calloutStyles = {
          info: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            icon: Info,
            iconColor: "text-blue-600",
          },
          warning: {
            bg: "bg-amber-50",
            border: "border-amber-200",
            icon: AlertTriangle,
            iconColor: "text-amber-600",
          },
          success: {
            bg: "bg-green-50",
            border: "border-green-200",
            icon: CheckCircle2,
            iconColor: "text-green-600",
          },
          tip: {
            bg: "bg-purple-50",
            border: "border-purple-200",
            icon: Lightbulb,
            iconColor: "text-purple-600",
          },
        };

        const style =
          calloutStyles[section.callout_type || "info"] || calloutStyles.info;
        const Icon = style.icon;

        return (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${style.bg} ${style.border}`}
          >
            <div className="flex items-start gap-3">
              <Icon
                className={`h-5 w-5 ${style.iconColor} flex-shrink-0 mt-0.5`}
              />
              <div className="flex-1">
                {section.title && (
                  <h4 className="font-semibold mb-1">{section.title}</h4>
                )}
                <p className="text-sm text-gray-700">{section.content}</p>
              </div>
            </div>
          </div>
        );

      case "list":
        return (
          <div key={index} className="space-y-2">
            {section.title && (
              <h4 className="font-semibold text-lg mb-3">{section.title}</h4>
            )}
            <ul className="space-y-2">
              {section.items?.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "image":
        return (
          <div key={index} className="space-y-2">
            {section.title && (
              <h4 className="font-semibold text-lg mb-2">{section.title}</h4>
            )}
            <img
              src={section.content}
              alt={section.title || "Lesson image"}
              className="rounded-lg w-full max-w-2xl mx-auto"
            />
          </div>
        );

      case "video":
        return (
          <div key={index} className="space-y-2">
            {section.title && (
              <h4 className="font-semibold text-lg mb-2">{section.title}</h4>
            )}
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <iframe
                src={section.content}
                className="w-full h-full"
                allowFullScreen
                title={section.title || "Lesson video"}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Lesson Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section, index) => renderSection(section, index))}

        {onComplete && (
          <div className="pt-4 border-t">
            <Button onClick={onComplete} className="w-full" size="lg">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Mark as Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
