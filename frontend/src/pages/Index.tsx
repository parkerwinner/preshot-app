import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navigation from "@/components/navigation";
import {
  GraduationCap,
  Target,
  Brain,
  BookOpen,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Sparkles,
  Award,
  Globe,
  TriangleAlert,
  CircleCheckBig,
  CircleStop,
  UsersRound,
  Book,
  LucideChartNoAxesColumnIncreasing,
  ArrowRightSquare,
  CircleDotDashed,
  BookOpenIcon,
  Search,
  ChartColumn,
  ArrowLeft,
} from "lucide-react";
import Footer from "@/components/Footer";
import { useState } from "react";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { useActiveAccount } from "thirdweb/react";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";

const Index = () => {
  const account = useActiveAccount();
  const isConnected = !!account;
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const features = [
    {
      icon: Target,
      title: "Diagnostic Assessment",
      description:
        "AI-powered evaluation of your readiness for global opportunities",
    },
    {
      icon: GraduationCap,
      title: "Program Intelligence",
      description:
        "Curated database of fellowships, scholarships, and accelerators",
    },
    {
      icon: Brain,
      title: "AI Application Coach",
      description:
        "Real-time feedback on essays, statements, and application materials",
    },
    {
      icon: Briefcase,
      title: "Interview Preparation",
      description:
        "AI-powered coaching for behavioral, technical, and panel interviews",
    },
    {
      icon: BookOpen,
      title: "Mindset Micro-Courses",
      description: "Interactive lessons on leadership and global citizenship",
    },
    {
      icon: Users,
      title: "Mentor Network",
      description: "Connect with experienced fellows and program alumni",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Track your readiness journey with detailed insights",
    },
  ];

  const testimonials = [
    {
      name: "Amaka Okafor",
      role: "Social Entrepreneur",
      message:
        "Preshot helped me articulate my impact story in a way that resonated with the YALI selection committee. Now I'm part of their 2026 cohort!",
    },
    {
      name: "Emmanuel Kwame",
      role: "Policy Analyst",
      message:
        "The diagnostic assessment pinpointed where I needed to improve. After the recommended modules, I secured Chevening funding.",
    },
    {
      name: "Sarah Chen",
      role: "Tech Entrepreneur",
      message:
        "The interview prep module was invaluable. I felt confident and secured my dream role at a global tech company.",
    },
    {
      name: "David Mensah",
      role: "Research Scholar",
      message:
        "The program matching feature connected me with opportunities I didn't even know existed. Now I'm pursuing my PhD at Oxford.",
    },
  ];

  const stats = [
    { value: "1,000+", label: "Global professionals supported" },
    { value: "500+", label: "Successful applications" },
    { value: "90%", label: "Success rate for prepared applicants" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Modern & Professional */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <HeroSection />
        <FeaturesSection />
      </section>

      {/* The challenge the solution Section */}
      <div className="container px-4 py-20 mx-auto max-w-7xl">
        <div className="text-center space-y-4 my-20">
          <h2 className="text-3xl md:text-4xl font-bold">
            The Challenge and Our Solution
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 justify-center items-center">
          <Card
            className="border-2 hover:border-primary/50 transition-colors bg-transparent z-20 md:w-[526.75px] rounded-[18.38px] shadow-lg h-[60%]"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 60px 40px -7px",
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-5 py-5">
                <TriangleAlert className="text-[#EF4444]" />
                The Problem
              </CardTitle>
              <CardDescription className="py-5 text-base">
                Global Talents struggle with opportunity readiness, articulating
                impact, understanding criteria, and mindset alignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-10">
                <div className="w-[30.625px] h-[67.375px]">
                  <div className="w-10 h-10 py-3 rounded-[15310.97px] bg-[#FEE2E2]">
                    <div className="w-3 h-3 rounded-[15310.97px] bg-[#EF4444] text-[#EF4444] text-center flex justify-center items-center mx-auto">
                      .
                    </div>
                  </div>
                </div>
                <div>
                  Communication gaps between applicant skills and program
                  requirements
                </div>
              </div>

              <div className="flex items-center justify-start py-5 gap-10">
                <div className="w-[30.625px] h-[67.375px]">
                  <div className="w-10 h-10 py-3 rounded-[15310.97px] bg-[#FEE2E2]">
                    <div className="w-3 h-3 rounded-[15310.97px] bg-[#EF4444] text-[#EF4444] text-center flex justify-center items-center mx-auto">
                      .
                    </div>
                  </div>
                </div>
                <div>
                  Limited understanding of selection criteria and expectations
                </div>
              </div>

              <div className="flex items-center justify-start py-5 gap-10">
                <div className="w-[30.625px] h-[67.375px]">
                  <div className="w-10 h-10 py-3 rounded-[15310.97px] bg-[#FEE2E2]">
                    <div className="w-3 h-3 rounded-[15310.97px] bg-[#EF4444] text-[#EF4444] text-center flex justify-center items-center mx-auto">
                      .
                    </div>
                  </div>
                </div>
                <div>
                  Mentorship bottleneck and lack of personalized guidance
                </div>
              </div>

              <div className="flex items-center justify-start py-5 gap-10">
                <div className="w-[30.625px] h-[67.375px]">
                  <div className="w-10 h-10 py-3 rounded-[15310.97px] bg-[#FEE2E2]">
                    <div className="w-3 h-3 rounded-[15310.97px] bg-[#EF4444] text-[#EF4444] text-center flex justify-center items-center mx-auto">
                      .
                    </div>
                  </div>
                </div>
                <div>Mindset and leadership framework misalignment</div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-2 hover:border-primary/50 transition-colors bg-transparent md:w-[526.75px] rounded-[18.38px] shadow-lg h-[60%] z-20"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 60px 40px -7px",
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-5 py-5">
                <CircleCheckBig className="text-[#28A745]" />
                The Solution
              </CardTitle>
              <CardDescription className="py-5 text-base">
                Preshot diagnoses weaknesses, align skills with real criteria,
                teaches leadership framework, and tracks growth
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 items-center justify-center gap-4">
              <div className="flex flex-col items-start justify-start gap-4 py-10">
                <div className="rounded-[15310.97px] text-[#007BFF]">
                  <CircleStop />
                </div>
                <div>
                  <strong>Diagnostic Assessment</strong>
                  <p>Complete evaluation of readiness and skills</p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-start gap-4 py-10">
                <div className="rounded-[15310.97px] text-[#007BFF]">
                  <UsersRound />
                </div>
                <div>
                  <strong>Alignment</strong>
                  <p>Match skill to program criteria and expectations</p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-start gap-4 py-10">
                <div className="rounded-[15310.97px] text-[#007BFF]">
                  <Book />
                </div>
                <div>
                  <strong>Learning</strong>
                  <p>Leadership frameworks and mindset development</p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-start gap py-10">
                <div className="rounded-[15310.97px] text-[#007BFF]">
                  <LucideChartNoAxesColumnIncreasing />
                </div>
                <div>
                  <strong>Tracking</strong>
                  <p>Measure growth and improvement over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* how it works */}
      <div className="my-10">
        <div>
          <div className="text-3xl font-bold text-center">How It Works</div>
          <div className="text-center font-semibold py-10">
            Your journey from assessment to global opportunities in six simple
            steps
          </div>
        </div>

        <div className="my-20 grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-4 md:px-10">
          <div className="flex flex-col items-center gap-6">
            <div className="rounded-full text-blue-600 bg-white border-2 border-white w-12 py-2 flex item-center justify-center">
              <ArrowRightSquare />
            </div>
            <div
              className="flex flex-col items-center justify-center rounded-3xl w-72 h-52 px-10 py-5"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
              }}
            >
              <span className="rounded-full bg-blue-700 text-white py-1 px-3 my-3">
                1
              </span>
              <div className="text-center">
                <strong>Sign In via wallet</strong>
                <p>Sign in seamlessly through wallet connect</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="rounded-full text-blue-600 bg-white border-2 border-white w-12 py-2 flex item-center justify-center text-sm">
              <CircleDotDashed />
            </div>
            <div
              className="flex flex-col items-center justify-center rounded-3xl w-72 h-52 px-10 py-5"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
              }}
            >
              <span className="rounded-full bg-blue-700 text-white py-1 px-3 my-3">
                2
              </span>
              <div className="text-center">
                <strong>Run Diagnostic</strong>
                <p>
                  Complete our comprehensive assessment of your skill and
                  experience
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="rounded-full text-blue-600 bg-white border-2 border-white w-12 py-2 flex item-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-card-sim-icon lucide-card-sim"
              >
                <path d="M12 14v4" />
                <path d="M14.172 2a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 20 7.828V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                <path d="M8 14h8" />
                <rect x="8" y="10" width="8" height="8" rx="1" />
              </svg>
            </div>
            <div
              className=" flex flex-col items-center justify-center rounded-3xl w-72 h-52 px-10 py-5"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
              }}
            >
              <span className="rounded-full bg-blue-700 text-white py-1 px-3 my-3">
                3
              </span>
              <div className="text-center">
                <strong>Get Results and Recommendations</strong>
                <p>Receive permanent insights and improvement suggestions</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="rounded-full text-blue-600 bg-white border-2 border-white w-12 py-2 flex item-center justify-center">
              <BookOpenIcon />
            </div>
            <div
              className=" flex flex-col items-center justify-center rounded-3xl w-72 h-52 px-10 py-5"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
              }}
            >
              <span className="rounded-full bg-blue-700 text-white py-1 px-3 my-3">
                4
              </span>
              <div className="text-center">
                <strong>Learn Modules</strong>
                <p>
                  Access tailored micro courses to build required competences
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="rounded-full text-blue-600 bg-white border-2 border-white w-12 py-2 flex item-center justify-center">
              <Search />
            </div>
            <div
              className=" flex flex-col items-center justify-center rounded-3xl w-72 h-52 px-10 py-5"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
              }}
            >
              <span className="rounded-full bg-blue-700 text-white py-1 px-3 my-3">
                5
              </span>
              <div className="text-center">
                <strong>Match Programs</strong>
                <p>
                  Discover opportunities that aligns with your profile and goals
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="rounded-full text-blue-600 bg-white border-2 border-white w-12 py-2 flex item-center justify-center">
              <ChartColumn />
            </div>
            <div
              className="flex flex-col items-center justify-center rounded-3xl w-72 h-52 px-10 py-5"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
              }}
            >
              <span className="rounded-full bg-blue-700 text-white py-1 px-3 my-3">
                6
              </span>
              <div className="text-center">
                <strong>Track and Monitor Review</strong>
                <p>Monitor progress and get expect feedback on your journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container px-4 py-20 mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Success Stories</h2>
          <p className="text-lg max-w-2xl mx-auto">
            See how Preshot has helped Talented Innovators achieve their goals
          </p>
        </div>

        {/* testimonies */}
        <div className="relative overflow-hidden z-20">
          <div className="text-left font-bold text-xl py-5">Testimonials</div>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${testimonialIndex * 100}%)`,
              }}
            >
              {testimonials.map((testimonial, idx) => (
                <Card
                  key={idx}
                  className="flex-shrink-0 w-full md:w-1/3 border-2 hover:border-primary/50 transition-colors shadow-lg shadow-[#232040] rounded-3xl my-5 mx-2 md:mx-5 z-10 rounded-tl-none"
                >
                  <CardContent className="p-6 h-72">
                    <p className="text-muted-foreground mb-4">
                      "{testimonial.message}"
                    </p>
                    <div>
                      <p className="font-semibold text-blue-600">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            <button
              onClick={() =>
                setTestimonialIndex(
                  testimonialIndex === 0
                    ? testimonials.length - 1
                    : testimonialIndex - 1
                )
              }
              className="p-2 rounded-full border-2 border-black text-sm cursor-pointer transition-colors bg-[#232040] text-white hover:bg-[#3a3055]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setTestimonialIndex(
                  testimonialIndex >= testimonials.length - 1
                    ? 0
                    : testimonialIndex + 1
                )
              }
              className="p-2 rounded-full border-2 border-black text-sm cursor-pointer transition-colors bg-[#232040] text-white hover:bg-[#3a3055]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* impact */}
        <div
          className="shadow-md shadow-[#232040] py-10 px-5 rounded-3xl my-20 rounded-tl-none rounded-tr-none bg-[#525EE2] z-20 relative"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
          }}
        >
          <div className="text-center font-bold text-xl py-5">Our Impact</div>
          <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-5 py-5">
            <div>
              <div className="text-white font-semibold text-xl text-center">
                70%
              </div>
              <div className="text-center ">Boost in application readiness</div>
            </div>
            <div>
              <div className="text-white font-semibold text-xl text-center">
                1000 +
              </div>
              <div className="text-center ">Global Talents supported</div>
            </div>
            <div>
              <div className="text-white font-semibold text-xl text-center">
                95%
              </div>
              <div className="text-center ">
                Success rated for prepared applicants
              </div>
            </div>
          </div>
        </div>

        {/* our partners */}
        <div className="z-20 relative bg-transparent">
          <div className="font-bold text-2xl text-center">Project Tools</div>
          <div className="flex items-center justify-center mx-auto my-12 gap-10 z-20 relative">
            <div className="rounded-3xl px-5 py-5 font-semibold shadow-lg shadow-[#232040] border-2 border-blue-500 bg-blue-500 text-white">
              Nullshot MCP
            </div>
            <div className="rounded-3xl px-5 py-5 font-semibold shadow-lg shadow-[#232040] border-2 border-blue-500 bg-transparent text-white hover:bg-blue-500 hover:text-white">
              ThirdWeb
            </div>
          </div>
        </div>
      </div>

      {/* global opportunities */}
      <div className="bg-[linear-gradient(90deg,_#007BFF_0%,_#3728A7_100%)] z-20 relative">
        <div className="text-white py-28 px-5 text-center block">
          <div className="font-bold text-2xl md:text-4xl lg:text-5xl text-nowrap mb-5">
            Ready to Unlock <br className="md:hidden" /> Global Opportunities
          </div>
          <p className="py-5">
            Join thousands of Talents who are accelerating their careers and
            making global impact with Preshot.
          </p>
          <div className="flex items-center justify-center gap-4 md:gap-7 mt-5">
            <Link
              to={isConnected ? "/assessment" : "/"}
              onClick={(e) => {
                if (!isConnected) {
                  e.preventDefault();
                  // User will need to connect wallet first
                }
              }}
              className="py-4 w-52 px-6 rounded-2xl border-b-2 border-r-2 border-black relative overflow-hidden font-semibold text-white text-center hover:shadow-lg hover:shadow-[#3728A7] hover:italic hover:font-extrabold bg-[#007BF] transition-all"
            >
              <span className="relative z-10 text-nowrap text-sm md:text-base flex justify-center items-center">
                {isConnected ? "Start Diagnostic" : "Connect Wallet"}
              </span>
            </Link>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 w-72 px-6 rounded-2xl border-b-2 border-r-2 border-white relative overflow-hidden font-semibold text-white text-center hover:shadow-lg hover:shadow-[#3728A7] hover:italic hover:font-extrabold bg-[#007BF] transition-all"
            >
              <span className="relative z-10 text-nowrap text-sm md:text-base flex justify-center items-center">
                Join Preshot Network{" "}
                <ArrowRight className="hidden md:flex ml-2 h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
