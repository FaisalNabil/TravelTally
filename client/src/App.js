import './App.css';
import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TourUpdate from './components/TourUpdate';
import ProtectedRoute from './components/ProtectedRoute';
import { isTokenExpired } from './utils';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import FAQ from './components/FAQ';
import About from './components/About';

function App() {
    const navigate = useNavigate();

    // Callback for handling logout
    const handleLogout = useCallback(() => {
        navigate('/login', { replace: true });
    }, [navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token && isTokenExpired(token)) {
                handleLogout();
                window.location.href = '/login';
            }
        }, 60000); // Check every minute
    
        return () => clearInterval(interval);
    }, [handleLogout]);
    
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } />
                            <Route path="/tour-update/:tourId" element={
                                    <ProtectedRoute>
                                        <TourUpdate />
                                    </ProtectedRoute>
                                } />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-of-service" element={<TermsOfService />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/about" element={<About />} />
                            {/* Redirect to login by default */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </Layout>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
