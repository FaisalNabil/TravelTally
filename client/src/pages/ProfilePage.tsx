import { Link, useNavigate } from 'react-router-dom';
import { LogOut, HelpCircle, Shield, FileText, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';

const links = [
  { to: '/faq', icon: HelpCircle, label: 'FAQ' },
  { to: '/privacy-policy', icon: Shield, label: 'Privacy Policy' },
  { to: '/terms-of-service', icon: FileText, label: 'Terms of Service' },
  { to: '/about', icon: Info, label: 'About' },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <Card className="mb-6">
        <CardContent className="p-4 flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">{getInitials(user?.name ?? 'U')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <nav className="space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-muted transition-colors min-h-[44px]"
          >
            <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
            {label}
          </Link>
        ))}
        <a
          href="mailto:tousif.md.amin.faisal@gmail.com"
          className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-muted transition-colors min-h-[44px]"
        >
          <span className="h-5 w-5" />
          Contact support
        </a>
      </nav>

      <Separator className="my-6" />

      <Button variant="outline" className="w-full" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Log out
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-6">Travel Tally v2.0.0</p>
    </div>
  );
}
