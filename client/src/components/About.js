import React from 'react';
import { Container, Typography, Box, Avatar } from '@mui/material';

const About = () => {
    return (
        <Container>
            <Box display="flex" flexDirection="column" alignItems="center" marginTop={4} marginBottom={4}>
                {/* Placeholder for Portrait Photo */}
                <Avatar 
                    alt="Tousif Md. Amin Faisal" 
                    src="tousif.jpg" // Replace with the path to your photo
                    sx={{ width: 128, height: 128, mb: 2 }}
                    style={{ border: '3px solid #fff' }}
                />

                <Typography variant="h4" gutterBottom>
                    Tousif Md. Amin Faisal
                </Typography>

                <Typography variant="body1" paragraph align="center">
                    A passionate software engineer with a deep love for coding, Tousif Md. Amin Faisal has dedicated his career to mastering the art and science of software development. With a keen eye for detail and a relentless drive for perfection, Tousif has developed a reputation for creating elegant, efficient, and user-friendly software solutions.
                </Typography>

                <Typography variant="body1" paragraph align="center">
                    His journey in software engineering is marked by a continuous quest for learning and improvement. This has led him to explore various aspects of software development, from backend systems to interactive front-end designs, always pushing the boundaries of technology and creativity.
                </Typography>

                <Typography variant="body1" paragraph align="center">
                    Beyond his technical skills, Tousif's collaborative spirit and ability to understand and solve complex problems make him a valuable asset to any project. His approach to software development is not just about writing code but about crafting experiences that enrich and empower users.
                </Typography>

                <Typography variant="body1" paragraph align="center" style={{ fontWeight: 'bold' }}>
                    If you're seeking a dedicated and innovative software engineer for your next project, whether on a contract basis or for a more permanent role, Tousif Md. Amin Faisal is open to exploring new opportunities and challenges.
                </Typography>

                <Typography variant="body1" align="center">
                    Feel free to reach out if you wish to collaborate or require his expertise.
                </Typography>
            </Box>
        </Container>
    );
};

export default About;
