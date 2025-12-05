import {
  Brain,
  Target,
  Globe2,
  Rocket,
  Shield,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Powered Diagnostics",
    description:
      "Get personalized assessments of your readiness for top fellowships and scholarships worldwide.",
  },
  {
    icon: Target,
    title: "Real Time Coaching",
    description:
      "Receive instant feedback and guidance from our AI coach tailored to your goals.",
  },
  {
    icon: Globe2,
    title: "Global Opportunity Matching",
    description:
      "Discover fellowships, scholarships, and programs that perfectly match your profile.",
  },
  {
    icon: Rocket,
    title: "Career Acceleration",
    description:
      "Fast-track your professional journey with strategic insights and action plans.",
  },
  {
    icon: Shield,
    title: "Blockchain Credentials",
    description:
      "Verify and showcase your achievements with tamper-proof blockchain certificates.",
  },
  {
    icon: Users,
    title: "Global Network",
    description:
      "Connect with a community of ambitious talents from over 80 countries.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-background py-24 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Platform Features</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Everything You Need to{" "}
            <span className="gradient-text">Succeed Globally</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Preshot combines cutting-edge AI with blockchain technology to
            prepare you for the world's most competitive opportunities.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon container */}
              <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>

              {/* Hover glow effect */}
              <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid gap-8 rounded-2xl border border-border/50 bg-card/30 p-8 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "80+", label: "Countries Represented" },
            { value: "1k+", label: "Talents Prepared" },
            { value: "500+", label: "Fellowships Matched" },
            { value: "95%", label: "Success Rate" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-4xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
