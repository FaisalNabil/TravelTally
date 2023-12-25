import React from 'react';
import Header from './Header'; 
import Footer from './Footer'; 
import { Box } from '@mui/material';

const Layout = ({ children }) => {
    return (
        <Box className="root-container">
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
};

export default Layout;
