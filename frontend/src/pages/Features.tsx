import Footer from "@/components/Footer";
import Navigation from "@/components/navigation";
import {
  Brain,
  Users,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  MessageSquare,
  FileText,
  Globe,
  Sparkles,
  CheckCircle2,
  Clock,
  BarChart3,
  Lightbulb,
  Shield,
  Zap,
} from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Diagnostic Assessment",
      description:
        "Take our comprehensive diagnostic test that evaluates your readiness across multiple dimensions including leadership, systems thinking, and global citizenship.",
      benefits: [
        "Personalized readiness score",
        "Detailed competency analysis",
        "Actionable improvement recommendations",
        "Track progress over time",
      ],
      color: "purple",
    },
    {
      icon: BookOpen,
      title: "Mindset Micro-Courses",
      description:
        "Access our curated library of interactive courses designed specifically for fellowship and scholarship preparation.",
      benefits: [
        "6+ comprehensive courses",
        "Self-paced learning modules",
        "Earn completion certificates",
        "Progressive skill building",
      ],
      color: "blue",
    },
    {
      icon: Users,
      title: "Expert Mentorship Network",
      description:
        "Connect with experienced professionals who have successfully navigated the fellowship application process.",
      benefits: [
        "50+ verified mentors",
        "One-on-one guidance sessions",
        "Application review support",
        "Insider tips and strategies",
      ],
      color: "green",
    },
    {
      icon: Target,
      title: "Smart Program Matching",
      description:
        "Our intelligent algorithm matches you with fellowships and scholarships that align with your profile, goals, and strengths.",
      benefits: [
        "100+ curated programs",
        "Personalized match scores",
        "Deadline tracking",
        "Eligibility filtering",
      ],
      color: "orange",
    },
    {
      icon: FileText,
      title: "AI Application Coach",
      description:
        "Get instant, intelligent feedback on your essays and personal statements with our advanced AI writing coach.",
      benefits: [
        "Structure and clarity analysis",
        "Mindset alignment check",
        "Impact enhancement suggestions",
        "Unlimited revisions",
      ],
      color: "pink",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Dashboard",
      description:
        "Visualize your progress with comprehensive analytics that show your growth journey and areas for improvement.",
      benefits: [
        "Real-time progress tracking",
        "Competency radar charts",
        "Skills comparison graphs",
        "Achievement milestones",
      ],
      color: "indigo",
    },
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: "Deadline Management",
      description:
        "Never miss an opportunity with our intelligent deadline tracking system",
    },
    {
      icon: MessageSquare,
      title: "Community Forum",
      description:
        "Connect with peers, share experiences, and learn from others",
    },
    {
      icon: Globe,
      title: "Global Program Database",
      description: "Access opportunities from around the world in one place",
    },
    {
      icon: Sparkles,
      title: "Personalized Recommendations",
      description: "Get tailored suggestions based on your unique profile",
    },
    {
      icon: Award,
      title: "Success Stories",
      description: "Learn from those who've successfully secured fellowships",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> =
      {
        purple: {
          bg: "bg-purple-100",
          text: "text-purple-600",
          border: "border-purple-200",
        },
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
        orange: {
          bg: "bg-orange-100",
          text: "text-orange-600",
          border: "border-orange-200",
        },
        pink: {
          bg: "bg-pink-100",
          text: "text-pink-600",
          border: "border-pink-200",
        },
        indigo: {
          bg: "bg-indigo-100",
          text: "text-indigo-600",
          border: "border-indigo-200",
        },
      };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 mt-16 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Everything You Need to Succeed
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Preshot combines cutting-edge AI technology with expert human
            guidance to give you the competitive edge in fellowship and
            scholarship applications.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const colors = getColorClasses(feature.color);

            return (
              <div
                key={index}
                className={`bg-transparent rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 ${colors.border}`}
              >
                <div className={`p-4 rounded-lg ${colors.bg} w-fit mb-4`}>
                  <Icon className={`h-8 w-8 ${colors.text}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-400">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            And Much More...
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-lg p-6 shadow-md hover:shadow-lg shadow-white"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gray-100">
                      <Icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Preshot Section */}
        <div className="bg-white rounded-2xl p-12 shadow-xl mb-20">
          <h2 className="text-4xl text-black font-bold text-center mb-12">
            Why Choose Preshot?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 rounded-full bg-purple-100 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Precision</h3>
              <p className="text-gray-700">
                Our advanced algorithms provide personalized insights that would
                take human consultants hours to generate.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 rounded-full bg-blue-100 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Human Touch</h3>
              <p className="text-gray-700">
                Connect with mentors who have been through the process and know
                what it takes to succeed.
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 rounded-full bg-green-100 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Proven Results</h3>
              <p className="text-gray-700">
                85% of our active users report improved application quality and
                increased confidence.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of ambitious Africans preparing for life-changing
            opportunities.
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
            Get Started Free
          </button>
          <p className="mt-4 text-sm opacity-75">
            No credit card required • Full access to all features
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Features;
