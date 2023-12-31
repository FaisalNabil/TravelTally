import { useEffect } from 'react';
import { useLogout } from '../hooks/useLogout';
import { isTokenExpired } from '../utils';

const LogoutWatcher = () => {
    const logout = useLogout();

    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token && isTokenExpired(token)) {
                logout();
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [logout]);

    return null; // This component does not render anything
};

export default LogoutWatcher;
