import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isTokenExpired } from '@/lib/utils';
import { toast } from 'sonner';

export function TokenWatcher() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        logout();
        toast.info('Session expired. Please sign in again.');
        navigate('/login', { replace: true });
      }
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [logout, navigate]);

  return null;
}
