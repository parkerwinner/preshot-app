import Footer from "@/components/Footer";
import Navigation from "@/components/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Globe, Award, Heart, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 mt-20 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About Preshot</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-400">
            Africa's first AI-powered platform for fellowship, scholarship, and
            accelerator preparation
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 leading-relaxed">
                To democratize access to global opportunities by providing
                African youth with world-class preparation tools, mentorship,
                and AI-powered guidance for prestigious fellowships,
                scholarships, and accelerator programs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 leading-relaxed">
                A future where every talented African youth has equal access to
                transformative global opportunities, empowering them to become
                leaders who drive positive change across the continent and
                beyond.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 rounded-lg bg-green-100 w-fit mb-3">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>AI-Powered Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Our diagnostic tool evaluates your readiness across key
                  competencies and provides personalized recommendations for
                  improvement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 rounded-lg bg-orange-100 w-fit mb-3">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Expert Mentorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Connect with successful fellows and scholars who provide
                  guidance, review your applications, and share insider tips for
                  success.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 rounded-lg bg-pink-100 w-fit mb-3">
                  <Award className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Program Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Discover opportunities tailored to your profile, interests,
                  and goals from our curated library of 100+ programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Story */}
        <Card className="mb-16 border-2">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-indigo-100">
                <Heart className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Preshot was born from a simple observation: talented African youth
              often miss out on life-changing opportunities not due to lack of
              merit, but due to lack of access to proper preparation resources
              and guidance.
            </p>
            <p>
              Our founders, themselves beneficiaries of prestigious fellowships,
              experienced firsthand the transformative power of these programs.
              They also witnessed countless brilliant peers struggle with the
              application process, lacking the mentorship and structured
              preparation that could make the difference.
            </p>
            <p>
              Today, Preshot combines cutting-edge AI technology with human
              expertise to level the playing field. We're building a community
              where every African youth can access world-class preparation
              tools, connect with mentors who've walked the path, and unlock
              their full potential.
            </p>
          </CardContent>
        </Card>

        {/* Impact Stats */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-10">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-700">Active Users</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                100+
              </div>
              <p className="text-gray-700">Programs Listed</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <p className="text-gray-700">Expert Mentors</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">85%</div>
              <p className="text-gray-700">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
