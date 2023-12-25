import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => (
    <Box component="footer" sx={{ bgcolor: 'background.paper', padding: 3, marginTop: 4 }}>
        <Typography variant="body2" color="text.secondary" align="center">
            <Link href="#" sx={{ margin: 1 }}>FAQ</Link>
            <Link href="#" sx={{ margin: 1 }}>Contact</Link>
            <Link href="#" sx={{ margin: 1 }}>Privacy Policy</Link>
            <Link href="#" sx={{ margin: 1 }}>Terms of Service</Link>
            <Link href="#" sx={{ margin: 1 }}>About</Link>
            <br />
            © TravelTally {new Date().getFullYear()}
        </Typography>
    </Box>
);

export default Footer;
