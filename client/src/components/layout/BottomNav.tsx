import { Link, useLocation } from 'react-router-dom';
import { Map, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/tours', icon: Map, label: 'Tours' },
  { to: '/add', icon: Plus, label: 'Add' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-bottom"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pt-2">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to === '/tours' && location.pathname.startsWith('/tours/'));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-xs font-medium transition-colors min-w-[64px] min-h-[44px] justify-center',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
