import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = useCallback(() => {
        // Clear the token or perform other logout actions
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    }, [navigate]);

    return logout;
};