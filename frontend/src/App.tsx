import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { PageLoader } from "@/components/loaders/PageLoader";
import { ErrorBoundary } from "@/pages/ErrorBoundary";
import { RootLayout } from "@/layouts/RootLayout";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTES } from "@/lib/constants";

// Lazy load pages
const Login = lazy(() => import("@/pages/auth/Login"));
const Signup = lazy(() => import("@/pages/auth/Signup"));
const Invite = lazy(() => import("@/pages/auth/Invite"));
const Upload = lazy(() => import("@/pages/upload/Upload"));
const Processing = lazy(() => import("@/pages/processing/Processing"));
const Review = lazy(() => import("@/pages/review/Review"));
const Result = lazy(() => import("@/pages/result/Result"));
const Workspace = lazy(() => import("@/pages/workspace/Workspace"));
const Integrations = lazy(() => import("@/pages/integrations/Integrations"));
const Docs = lazy(() => import("@/pages/docs/Docs"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to={ROUTES.UPLOAD} replace />;
  return <>{children}</>;
}

const App = () => (
  <ErrorBoundary>
    <RootLayout>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
            {/* Public auth routes */}
            <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGNUP} element={<Signup />} />
              <Route path={ROUTES.INVITE} element={<Invite />} />
            </Route>

            {/* Protected app routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path={ROUTES.UPLOAD} element={<Upload />} />
              <Route path={ROUTES.PROCESSING} element={<Processing />} />
              <Route path={ROUTES.REVIEW} element={<Review />} />
              <Route path={ROUTES.RESULT} element={<Result />} />
              <Route path={ROUTES.WORKSPACE} element={<Workspace />} />
              <Route path={ROUTES.INTEGRATIONS} element={<Integrations />} />
              <Route path={ROUTES.DOCS} element={<Docs />} />
              <Route path={ROUTES.SETTINGS} element={<Settings />} />
            </Route>

            {/* Redirects */}
            <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LOGIN} replace />} />
            <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </RootLayout>
  </ErrorBoundary>
);

export default App;
