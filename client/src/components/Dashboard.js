import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Box, TextField, Typography, List, Snackbar, Alert as MuiAlert, IconButton } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import CloseIcon from '@mui/icons-material/Close';

const Dashboard = () => {
    const [openModal, setOpenModal] = useState(false);
    const [tours, setTours] = useState([]);
    const [newTourName, setNewTourName] = useState('');
    const [newTourMembers, setNewTourMembers] = useState([]);
    const [newTourStartDate, setNewTourStartDate] = useState(new Date());
    const navigate = useNavigate();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const serverUrl = process.env.REACT_APP_API_URL;
    const styles = {
        buttonGroup: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 2,
        },
        modalBox: {
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: 400, 
            bgcolor: 'background.paper', 
            boxShadow: 24, 
            p: 4
        },
        tourListItem: {
            marginBottom: 1, // Spacing between items
            padding: 2, // Inner spacing
            border: '1px solid #ddd', // Optional border
            borderRadius: '4px', // Rounded corners
        },
    };

    // Fetch tours when the component mounts
    useEffect(() => {
        const fetchTours = () => {
            fetch(`${serverUrl}/api/tours/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        // Token is invalid or expired
                        window.location.href = '/login';
                        return;
                    }
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTours(data);
            })
            .catch(error => {
                console.error('Error fetching tours:', error);
                showAlert('Error fetching tours');
            });
        };        
    
        fetchTours();
    }, []);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // Function to add a new tour
    const handleAddTour = async () => {
        // Logic to submit the new tour to the backend
        const tourData = {
            name: newTourName,
            members: newTourMembers.map(member => ({ name: member })),
            startDate: newTourStartDate,
            // ... any other tour details
        };
    
        // Example POST request to your backend
        try {
            fetch(`${serverUrl}/api/tours/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(tourData),
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        // Token is invalid or expired
                        window.location.href = '/login';
                        return;
                    }
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(newTour => {
                // Handle successful tour creation
                // Fetch the updated list of tours, etc.
                handleCloseModal();
                navigate(`/tour-update/${newTour._id}`);
            })
            .catch(error => {
                console.error('Error fetching tours:', error);
                showAlert('Error fetching tours');
            });
            
        } catch (error) {
            console.error('Error creating tour:', error);
            showAlert('Error creating tour');
        }
    };
    
    // Function to navigate to TourUpdate page
    const goToTourUpdate = (tourId) => {
        navigate(`/tour-update/${tourId}`);
    };

    // Function to render tour details
    const renderTours = () => {
        return tours.map((tour, index) => (
            <Box key={index} sx={styles.tourListItem} onClick={() => goToTourUpdate(tour._id)}>
                <Typography variant="subtitle1">{tour.name}</Typography>
                <Typography variant="body2">
                    {tour.isRunning ? 'Running' : 'Ended'} - Start Date: {new Date(tour.startDate).toLocaleDateString()}
                </Typography>
                {/* Add more details or actions here */}
            </Box>
        ));
    };
    
    const showAlert = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    return (
        <Layout>
            <Container>
                <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box>
                        <Box sx={styles.buttonGroup}>
                            <Button onClick={handleOpenModal} variant="contained" color="primary">Add New Tour</Button>
                        </Box>
                    
                        <Modal open={openModal} onClose={handleCloseModal}>
                            <Box 
                                sx={{ 
                                    position: 'absolute', 
                                    top: '50%', 
                                    left: '50%', 
                                    transform: 'translate(-50%, -50%)',
                                    width: { xs: '90vw', sm: '400px' }, // Responsive width
                                    maxHeight: '80vh', // Maximum height
                                    bgcolor: 'background.paper', 
                                    boxShadow: 24, 
                                    p: 4,
                                    overflowY: 'auto' // Enable vertical scrolling 
                            }}>
                                <IconButton aria-label="close" onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
                                    <CloseIcon />
                                </IconButton>
                                <Typography variant="h6">Create New Tour</Typography>
                                <TextField
                                    label="Tour Name"
                                    value={newTourName}
                                    onChange={(e) => setNewTourName(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                                
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Start Date"
                                        value={newTourStartDate}
                                        onChange={(date) => setNewTourStartDate(date)}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                </LocalizationProvider>
                                <TextField
                                    label="Number of Members"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    onChange={(e) => setNewTourMembers(Array(parseInt(e.target.value)).fill(''))}
                                />
                                {newTourMembers.map((_, index) => (
                                    <TextField
                                        key={index}
                                        label={`Member ${index + 1} Name`}
                                        onChange={(e) => {
                                            const updatedMembers = [...newTourMembers];
                                            updatedMembers[index] = e.target.value;
                                            setNewTourMembers(updatedMembers);
                                        }}
                                        fullWidth
                                        margin="normal"
                                    />
                                ))}
                                <Button onClick={handleAddTour} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                                    Add Tour
                                </Button>
                            </Box>

                        </Modal>

                        <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                            {renderTours()}
                        </List>
                    </Box> 
                </Box>

                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleCloseSnackbar}>
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </Container>
        </Layout>
    );
};

export default Dashboard;