import './App.css';
import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TourUpdate from './components/TourUpdate';
import ProtectedRoute from './components/ProtectedRoute';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Footer from './components/Footer';

import { isTokenExpired } from './utils';

function App() {
    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token && isTokenExpired(token)) {
                window.location.href = '/login';
            }
        }, 60000); // Check every minute
    
        return () => clearInterval(interval);
    }, []);
    
  return (
    <>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TravelTally
                </Typography>
                {/* Add navigation links or buttons here */}
            </Toolbar>
        </AppBar>

        <Container>
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <Router>
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
                            {/* Redirect to login by default */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </Container>

        <Footer />
    </>
  );
}

export default App;
