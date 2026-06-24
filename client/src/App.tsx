import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { TokenWatcher } from '@/components/TokenWatcher';
import { setUnauthorizedHandler } from '@/lib/api';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ToursPage = lazy(() => import('@/pages/ToursPage'));
const TourDetailPage = lazy(() => import('@/pages/TourDetailPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AddExpensePage = lazy(() => import('@/pages/AddExpensePage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function AuthHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    });
  }, [navigate]);
  return null;
}

function PageLoader() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AuthHandler />
            <TokenWatcher />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/about" element={<AboutPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route element={<AppShell />}>
                    <Route path="/tours" element={<ToursPage />} />
                    <Route path="/tours/:tourId" element={<TourDetailPage />} />
                    <Route path="/add" element={<AddExpensePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Route>

                <Route path="/dashboard" element={<Navigate to="/tours" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Toaster position="top-center" richColors closeButton />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
