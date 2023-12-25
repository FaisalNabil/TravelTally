import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Navigates to the previous page
    };

    return (
        <Tooltip title="Go Back">
            <IconButton onClick={goBack}>
                <ArrowBackIcon />
            </IconButton>
        </Tooltip>
    );
};

export default BackButton;
