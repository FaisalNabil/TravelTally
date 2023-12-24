import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Snackbar, Alert as MuiAlert, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const serverUrl = process.env.REACT_APP_API_URL;

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: 'url(background-image.png)', // Replace with your background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
}));


function Login() {
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    
    const handleCredentialResponse = useCallback(async (response) => {
        try {
            const res = await fetch(`${serverUrl}/auth/google/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: response.credential }),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            
            // Store user data in local storage or context
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.verifiedToken);
            // Redirect to dashboard
            //window.location.href = '/dashboard';
            console.log("Navigating to dashboard");
            navigate('/dashboard');

        } catch (error) {
            console.error('Login failed:', error);
            showAlert('Login failed: ' + error.message);
        }
    }, [navigate]);

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.google?.accounts.id.initialize({
            client_id: clientId,
            context: 'signin',
            callback: handleCredentialResponse
        });

        window.google?.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large" }
        );

    }, [handleCredentialResponse]);

    const showAlert = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <StyledContainer component="main">
            <StyledPaper elevation={3}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Welcome to Travel Tally
                </Typography>
                <img src="logo.png" alt="Brand Logo" style={{ width: '100px', marginBottom: '20px' }} />
                <div id="signInDiv" style={{ marginBottom: '20px' }}></div>
                <Typography variant="body1">
                    Sign in with Google to continue
                </Typography>
            </StyledPaper>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleCloseSnackbar}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </StyledContainer>
    );
}

export default Login;