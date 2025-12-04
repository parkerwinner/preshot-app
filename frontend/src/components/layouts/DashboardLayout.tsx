import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useActiveAccount, useDisconnect } from 'thirdweb/react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Target,
  GraduationCap,
  Brain,
  BookOpen,
  Users,
  TrendingUp,
  Menu,
  User,
  LogOut,
} from "lucide-react";
import LogoImg from "@/images/padei_logo.png";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Target, label: "Assessment", path: "/assessment" },
  { icon: GraduationCap, label: "Programs", path: "/programs" },
  { icon: Brain, label: "Coach", path: "/coach" },
  // { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: Users, label: "Mentors", path: "/mentors" },
  { icon: TrendingUp, label: "Analytics", path: "/analytics" },
];

function DashboardLayout({ children }: DashboardLayoutProps) {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    disconnect();
    // Small delay to ensure disconnect completes before navigation
    await new Promise(resolve => setTimeout(resolve, 100));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#F0E0E7_0%,_#525EE2_100%)] overflow-hidden">
      {/* Header */}
      <header className="w-full bg-[#E2BFBF] backdrop-blur overflow-hidden py-3 border-2 fixed top-0 left-0 right-0 z-50 rounded-br-2xl rounded-bl-2xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img
                src={LogoImg}
                alt="Preshot"
                className="w-9 h-9 rounded-full shadow-sm"
              />
              <span className="text-xl font-extrabold text-slate-900">
                Preshot
              </span>
            </Link>

            <nav className="hidden md:flex items-center md:gap-1 lg:gap-4 py-4 overflow-hidden">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "md:px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-all",
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/50 hover:bg-white"
                >
                  <User className="h-5 w-5 text-slate-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Wallet Connected
                    </p>
                    <p className="text-xs leading-none text-muted-foreground font-mono">
                      {account?.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'Not connected'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md bg-white/60 shadow-sm"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-slate-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sliding panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 max-w-full transform transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full bg-white shadow-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={LogoImg}
                alt="Preshot"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-bold">Preshot</span>
            </div>
            <button
              className="p-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-6 flex-1 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg bg-gradient-to-r from-[#EFF6FF] to-white text-slate-800 font-medium hover:from-[#DFF6FF] hover:to-white shadow-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-4 rounded-lg bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA]"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile when open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="container py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8 bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 text-white mt-28 relative bottom-0">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-2">
              <img
                src={LogoImg}
                alt="Preshot"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-lg">
                <strong>Preshot</strong> <br />
                Nullshot MCP
              </span>
            </div>
            <div className="text-center text-sm">
              <p>Your Journey to Global Impact Starts Here</p>
              <p className="text-purple-200 mt-1">
                Empowering Talented future leaders through AI powered guidance
              </p>
            </div>
          </div>
          <hr className="border-[1px] border-white w-full" />
          <div className="flex justify-center items-center my-5">
            <div className="text-sm text-purple-200">
              © 2025 Preshot. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardLayout;
