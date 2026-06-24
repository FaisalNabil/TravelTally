import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import type { AuthResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (el: HTMLElement, config: object) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef<HTMLDivElement>(null);
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/tours';

  const handleCredential = useCallback(
    async (credential: string) => {
      try {
        const data = await apiRequest<AuthResponse>('/auth/google/callback', {
          method: 'POST',
          body: JSON.stringify({ token: credential }),
          skipAuth: true,
        });
        localStorage.setItem('token', data.verifiedToken);
        setUser(data.user);
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      } catch {
        toast.error('Login failed. Please try again.');
      }
    },
    [setUser, navigate, from]
  );

  useEffect(() => {
    if (!clientId) {
      toast.error('Google login is not configured.');
      return;
    }

    const init = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => handleCredential(response.credential),
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 280,
        text: 'signin_with',
      });
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          init();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [handleCredential]);

  return (
    <div className="min-h-dvh flex flex-col">
      <div
        className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-primary/5 to-background"
      >
        <img src="/logo.svg" alt="Travel Tally" className="h-20 w-20 mb-6" />
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Travel Tally</CardTitle>
            <CardDescription>Sign in to manage your group travel expenses</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div ref={buttonRef} />
            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our{' '}
              <Link to="/privacy-policy" className="underline">Privacy Policy</Link>
              {' '}and{' '}
              <Link to="/terms-of-service" className="underline">Terms of Service</Link>.
            </p>
          </CardContent>
        </Card>
        <Button variant="ghost" className="mt-6" asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
