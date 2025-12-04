import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PreshotThirdwebProvider } from '@/providers/ThirdwebProvider';
import { ThemeProvider } from 'next-themes';
import { useActiveAccount } from 'thirdweb/react';
import { isAdmin } from '@/config/admins';

// Pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import AssessmentResults from './pages/AssessmentResults';
import Programs from './pages/Programs';
import Coach from './pages/Coach';
import Courses from './pages/Courses';
import Mentors from './pages/Mentors';
import MentorsAdmin from './pages/MentorsAdmin';
import Analytics from './pages/Analytics';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Tracker from './pages/Tracker';
import Profile from './pages/Profile';
import InterviewPrep from './pages/InterviewPrep';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Admin Route Wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const account = useActiveAccount();
  
  if (!account) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin(account.address)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Protected Route Wrapper (requires wallet connection)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const account = useActiveAccount();
  
  if (!account) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PreshotThirdwebProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />

              {/* Protected routes - require wallet connection */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment"
                element={
                  <ProtectedRoute>
                    <Assessment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment/results"
                element={
                  <ProtectedRoute>
                    <AssessmentResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/programs"
                element={
                  <ProtectedRoute>
                    <Programs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coach"
                element={
                  <ProtectedRoute>
                    <Coach />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview-prep"
                element={
                  <ProtectedRoute>
                    <InterviewPrep />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentors"
                element={
                  <ProtectedRoute>
                    <Mentors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tracker"
                element={
                  <ProtectedRoute>
                    <Tracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin only route */}
              <Route
                path="/mentors-admin"
                element={
                  <AdminRoute>
                    <MentorsAdmin />
                  </AdminRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </PreshotThirdwebProvider>
  </QueryClientProvider>
);

export default App;
