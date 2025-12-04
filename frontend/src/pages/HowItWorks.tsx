import Footer from "@/components/Footer";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  ClipboardCheck,
  Target,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 mt-20 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">How Preshot Works</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-400">
            Your journey to global opportunities in 5 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 mb-16">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  1
                </div>
                <Card className="border-2 border-blue-200 shadow-xl">
                  <CardContent className="p-8 flex justify-center">
                    <div className="p-6 rounded-full bg-blue-100">
                      <UserPlus className="h-16 w-16 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-3">Create Your Account</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Sign up for free and complete your profile. Tell us about your
                background, interests, and aspirations. This helps us
                personalize your experience and match you with the right
                opportunities.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  2
                </div>
                <Card className="border-2 border-purple-200 shadow-xl">
                  <CardContent className="p-8 flex justify-center">
                    <div className="p-6 rounded-full bg-purple-100">
                      <ClipboardCheck className="h-16 w-16 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="md:w-2/3 md:text-right">
              <h3 className="text-2xl font-bold mb-3">
                Take the Diagnostic Assessment
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Complete our comprehensive AI-powered assessment that evaluates
                your readiness across key competencies: leadership, systems
                thinking, communication, and global citizenship. Get instant
                feedback and a personalized readiness score.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  3
                </div>
                <Card className="border-2 border-green-200 shadow-xl">
                  <CardContent className="p-8 flex justify-center">
                    <div className="p-6 rounded-full bg-green-100">
                      <Target className="h-16 w-16 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-3">
                Discover Matched Programs
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Browse our curated library of 100+ fellowships, scholarships,
                and accelerators. Our AI matches you with programs that align
                with your profile, showing compatibility scores and key
                deadlines.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  4
                </div>
                <Card className="border-2 border-orange-200 shadow-xl">
                  <CardContent className="p-8 flex justify-center">
                    <div className="p-6 rounded-full bg-orange-100">
                      <BookOpen className="h-16 w-16 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="md:w-2/3 md:text-right">
              <h3 className="text-2xl font-bold mb-3">Learn & Improve</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Access our mindset micro-courses on leadership, systems
                thinking, and global citizenship. Work with our AI Application
                Coach to refine your essays and personal statements. Track your
                progress in real-time.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  5
                </div>
                <Card className="border-2 border-pink-200 shadow-xl">
                  <CardContent className="p-8 flex justify-center">
                    <div className="p-6 rounded-full bg-pink-100">
                      <Users className="h-16 w-16 text-pink-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-3">Connect with Mentors</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Get matched with experienced fellows and scholars who've
                successfully navigated the programs you're interested in.
                Receive personalized guidance, application reviews, and insider
                tips to maximize your chances of success.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            What Makes Preshot Different
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 rounded-lg bg-blue-100 w-fit mb-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Our proprietary AI analyzes your profile and provides
                  data-driven recommendations tailored to your unique strengths
                  and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 rounded-lg bg-purple-100 w-fit mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Expert Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Learn from those who've succeeded. Our mentors are alumni of
                  top programs like Rhodes, Chevening, Fulbright, and YALI.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 rounded-lg bg-green-100 w-fit mb-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Proven Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  85% of our users who complete the full preparation program
                  receive at least one fellowship or scholarship offer.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-12">
              <h2 className="text-3xl text-black font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Join hundreds of African youth preparing for global
                opportunities
              </p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
