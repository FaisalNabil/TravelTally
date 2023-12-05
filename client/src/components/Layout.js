import React from 'react';
import { Box, Container, Tooltip, IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { logout } = useAuth();
    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
                <Tooltip title="Logout">
                    <IconButton onClick={logout} color="inherit">
                        <ExitToAppIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            {children}
        </Container>
    );
};

export default Layout;
