//import React, { useState } from 'react';
//import { GoogleLogin } from '@leecheuk/react-google-login';
import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Snackbar, Alert as MuiAlert } from '@mui/material';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const serverUrl = process.env.REACT_APP_API_URL;

function Login() {
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
            console.log('Login successful, backend response:', data);
            
            // Store user data in local storage or context
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.verifiedToken);
            // Redirect to dashboard
            window.location.href = '/dashboard';


        } catch (error) {
            console.error('Login failed:', error);
            showAlert('Login failed: ' + error.message);
        }
    }, []);

    useEffect(() => {
        window.google?.accounts.id.initialize({
            client_id: clientId,
            context: 'signin',
            callback: handleCredentialResponse
        });
        console.log(clientId);

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
        <Container component="main" maxWidth="xs">
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign in with Google
                </Typography>
                <div id="signInDiv" style={{ marginTop: '20px' }}></div>
            </div>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleCloseSnackbar}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
}

export default Login;