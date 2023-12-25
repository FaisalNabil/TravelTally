import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h6">
                        Travel Tally
                    </Typography>
                </Box>
                {user ? (
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                ) : (
                    <Button color="inherit" href="/login">
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
