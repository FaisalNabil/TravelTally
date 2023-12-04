
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => (
    <Box component="footer" sx={{ bgcolor: 'background.paper', padding: 3, marginTop: 4 }}>
        <Typography variant="body2" color="text.secondary" align="center">
            {/* Footer content here */}
            © TravelTally {new Date().getFullYear()}
        </Typography>
    </Box>
);

export default Footer;