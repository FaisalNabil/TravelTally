import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    console.log("ProtectedRoute - User:", user, "isLoading:", isLoading);

    if (isLoading) {
        // Optionally, render a loading indicator or return null
        return <div>Loading...</div>; // or return null;
    }
    if (!user) {
        // User not logged in, redirect to login
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;