import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Receipt, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const steps = [
  { icon: MapPin, title: 'Create a tour', desc: 'Name your trip and add travel companions.' },
  { icon: Receipt, title: 'Log expenses', desc: 'Record who paid and who shared each cost.' },
  { icon: Users, title: 'Settle up', desc: 'End the tour and see exactly who owes whom.' },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  if (!isLoading && user) return <Navigate to="/tours" replace />;

  return (
    <div className="min-h-dvh">
      <header className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="h-8 w-8" />
          <span className="font-bold text-lg text-primary">Travel Tally</span>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">Sign in</Link>
        </Button>
      </header>

      <section className="px-4 py-12 max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Split travel costs fairly
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
          No spreadsheets. No awkward math. Just log, split, and settle with friends.
        </p>
        <Button size="lg" className="mt-8 w-full max-w-xs" asChild>
          <Link to="/login">Get started free</Link>
        </Button>
      </section>

      <section className="px-4 py-8 max-w-lg mx-auto">
        <div className="grid gap-4">
          {['Log in seconds', 'Split fairly', 'Settle with clarity'].map((text) => (
            <Card key={text}>
              <CardContent className="p-4 text-center font-medium">{text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 py-8 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-center mb-6">How it works</h2>
        <div className="space-y-4">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden />
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-4 py-8 border-t mt-8 max-w-lg mx-auto text-center text-sm text-muted-foreground space-y-2">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
          <Link to="/privacy-policy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms-of-service" className="hover:text-foreground">Terms</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
          <a href="mailto:tousif.md.amin.faisal@gmail.com" className="hover:text-foreground">Contact</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Travel Tally</p>
      </footer>
    </div>
  );
}
