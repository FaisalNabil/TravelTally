import './App.css';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TourUpdate from './components/TourUpdate';
import ProtectedRoute from './components/ProtectedRoute';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import FAQ from './components/FAQ';
import About from './components/About';
import LogoutWatcher from './components/LogoutWatcher';

function App() {
    
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <LogoutWatcher />
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
