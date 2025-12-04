import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { ChevronDown, Sparkles, Shield, Globe, Zap } from "lucide-react";

// Lazy load the 3D scene for better initial load performance
const HeroScene = lazy(() => import("@/components/3d/HeroScene"));

// Loading skeleton for 3D scene
function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="h-32 w-32 rounded-full border-2 border-primary/30 animate-pulse" />
        <div className="absolute inset-4 rounded-full border-2 border-accent/30 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="absolute inset-8 rounded-full border-2 border-primary/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}

// Feature pill component
function FeaturePill({ icon: Icon, text }: { icon: typeof Sparkles; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm border border-border/50">
      <Icon className="h-4 w-4 text-accent" />
      <span>{text}</span>
    </div>
  );
}

export default function HeroSection() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Gradient background overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)/0.08),transparent_40%)]" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* 3D Scene Container */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<SceneLoader />}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation spacer */}
        <div className="h-20" />

      {/* Main content */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-24">
          {/* Feature pills */}
          <div 
            className="mb-6 flex flex-wrap items-center justify-center gap-3 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <FeaturePill icon={Sparkles} text="AI-powered diagnostics" />
            <FeaturePill icon={Zap} text="Real-time coaching" />
            <FeaturePill icon={Globe} text="Fellowship matching" />
            <FeaturePill icon={Shield} text="Blockchain-verified" />
          </div>

          {/* Main heading */}
          <h1 
            className="mb-6 max-w-4xl text-center text-4xl font-bold leading-tight tracking-tight text-foreground opacity-0 animate-fade-in sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: '0.4s' }}
          >
            Become Global Ready for the{" "}
            <span className="gradient-text">World's Top Opportunities</span>
          </h1>

          {/* Subheading */}
          <p 
            className="mb-10 max-w-2xl text-center text-lg text-muted-foreground opacity-0 animate-fade-in sm:text-xl"
            style={{ animationDelay: '0.6s' }}
          >
            AI-powered diagnostics • Real-time coaching • Fellowship & scholarship matching • Blockchain-verified credentials
          </p>

          {/* CTA Buttons */}
          <div 
            className="mb-12 flex flex-col items-center gap-4 opacity-0 animate-fade-in sm:flex-row sm:gap-6"
            style={{ animationDelay: '0.8s' }}
          >
            <ConnectWallet />
            <Button
              variant="hero-outline"
              size="xl"
              onClick={scrollToFeatures}
              className="gap-2"
            >
              Explore Features
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Trust line */}
          <div 
            className="flex flex-col items-center gap-2 opacity-0 animate-fade-in sm:flex-row sm:gap-4"
            style={{ animationDelay: '1s' }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-secondary"
                    style={{
                      background: `linear-gradient(135deg, hsl(${200 + i * 15} 70% 50%), hsl(${220 + i * 15} 60% 40%))`,
                    }}
                  />
                ))}
              </div>
              <span>Trusted by talents from 80+ countries</span>
            </div>
            <span className="hidden text-muted-foreground/50 sm:inline">•</span>
            <span className="text-sm text-muted-foreground">
              Powered by Nullshot AI + Blockchain on Base
            </span>
          </div>

          {/* Scroll indicator */}
          <div 
            className="mt-8 opacity-0 animate-fade-in"
            style={{ animationDelay: '1.2s' }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground/60">Scroll to explore</span>
              <div className="flex h-8 w-5 items-start justify-center rounded-full border border-muted-foreground/30 p-1">
                <div className="h-2 w-1 animate-float rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
