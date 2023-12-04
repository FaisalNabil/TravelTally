import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, TextField, Box, Typography, List, ListItem, Modal, Snackbar, Alert as MuiAlert, IconButton, ListItemText } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';


const TourUpdate = () => {
    const { tourId } = useParams(); // To get the tour ID from the URL
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [members, setMembers] = useState([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('');

    const serverUrl = process.env.REACT_APP_API_URL;
    const styles = {
        headingBox: {
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 2, // Added bottom margin
        },
        buttonGroup: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 2, // Added margin
        },
        listItem: {
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: 1, // Added margin for each list item
        },
        settlementCard: {
            backgroundColor: '#f5f5f5', // Example background color
            padding: 2,
            margin: 2,
        },
    };

    // States for expense details
    const [expenseDetails, setExpenseDetails] = useState({
        paidBy: '',
        amount: '',
        description: '',
        date: new Date().toISOString().slice(0, 10), // Default to today's date
        involvedMembers: [],
    });

    const handleBackClick = () => {
        navigate('/dashboard');
    };

    const resetExpenseDetails = () => {
        setExpenseDetails({
            _id: null, // Reset ID as well
            paidBy: '',
            amount: '',
            description: '',
            date: new Date().toISOString().slice(0, 10),
            involvedMembers: [],
        });
    };

    useEffect(() => {
        const fetchTourDetails = async () => {
            try {
                const response = await fetch(`${serverUrl}/api/tours/${tourId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                        // Include authorization headers if needed
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const data = await response.json();
                console.log(data);
                setTour(data);
                setExpenses(data.expenses);
                setMembers(data.members); // Assuming the API returns a list of members
            } catch (error) {
                console.error('Error fetching tour details:', error);
                showAlert('Error fetching tour details');
            }
        };
    
        fetchTourDetails();
    }, [tourId, serverUrl]);

    const handleOpenModal = (isNew = true, expense = null) => {
        if (isNew) {
            resetExpenseDetails();
        } else {
            setExpenseDetails({
                _id: expense._id,
                paidBy: expense.paidBy.memberId, // Assuming paidBy has memberId
                amount: expense.amount,
                description: expense.description,
                date: new Date(expense.date).toISOString().slice(0, 10),
                involvedMembers: expense.involvedMembers.map(member => member.memberId), // Assuming involvedMembers have memberId
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        resetExpenseDetails(); // Reset form when closing modal
        setOpenModal(false);
    };

    // Function to add or update an expense
    const handleSaveExpense = async () => {
        try {
            
            if (!expenseDetails.amount || !expenseDetails.description) {
                showAlert('Please fill in all fields');
                return;
            }

            // Find the member who is paidBy
            const paidByMember = members.find(member => member._id === expenseDetails.paidBy);

            const expenseData = {
                ...expenseDetails,
                tourId: tourId,
                paidBy: {
                    memberId: paidByMember?._id,
                    name: paidByMember?.name
                },
                involvedMembers: expenseDetails.involvedMembers.map(memberId => {
                    const member = members.find(m => m._id === memberId);
                    return { memberId, name: member ? member.name : '' };
                }),
            };
            
            const url = expenseDetails._id ? `${serverUrl}/api/expenses/${expenseDetails._id}` : `${serverUrl}/api/expenses/add`;
            const method = expenseDetails._id ? 'PUT' : 'POST';
    
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                    // Include authorization headers if needed
                },
                body: JSON.stringify(expenseData),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setExpenseDetails({
                paidBy: '',
                amount: '',
                description: '',
                date: new Date().toISOString().slice(0, 10),
                involvedMembers: [],
            });

            const updatedExpense = await response.json();
    
            // Update the expenses list
            if (method === 'POST') {
                setExpenses([...expenses, updatedExpense]);
            } else {
                setExpenses(expenses.map(exp => exp._id === updatedExpense._id ? updatedExpense : exp));
            }
    
            showAlert('Expense saved successfully', 'success');
            handleCloseModal();
        } catch (error) {
            console.error('Error saving expense:', error);
            showAlert('Error saving expense');
        }
        handleCloseModal();
    };
    
    // Function to delete an expense
    const handleDeleteExpense = async (expenseId) => {
        try {
            const response = await fetch(`${serverUrl}/api/expenses/${expenseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                    // Include authorization headers if needed
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Handle successful expense deletion
            showAlert('Expense deleted successfully', 'success');

            // Fetch updated expenses list, etc.
            setExpenses(expenses.filter(exp => exp._id !== expenseId));
        } catch (error) {
            console.error('Error deleting expense:', error);
            showAlert('Error deleting expense');
        }
    };

    // Function to end the tour
    const handleEndTour = async () => {
        try {
            const response = await fetch(`${serverUrl}/api/tours/${tourId}/end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                    // Include authorization headers if needed
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Handle successful tour ending
            navigate('/dashboard'); // Redirect to dashboard or another appropriate page
        } catch (error) {
            console.error('Error ending tour:', error);
            showAlert('Error ending tour');
        }
    };

    const ReactivateTourButton = ({ tourId, onReactivate }) => {
        const reactivateTour = () => {
            fetch(`${serverUrl}/api/tours/${tourId}/undoEnd`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            .then(response => {
                if (response.ok) {
                    onReactivate(); // Callback to refetch tour details
                } else {
                    throw new Error('Failed to reactivate tour');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        };
    
        return (
            <Button onClick={reactivateTour} variant="contained" color="error" style={{ marginTop: '20px' }}>Reactivate Tour</Button>
        );
    };    

    // Function to render expenses
    const renderExpenses = () => {
        return expenses.map((expense, index) => (
            <ListItem key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItemText
                    primary={expense.description}
                    secondary={`Amount: $${expense.amount} - Date: ${new Date(expense.date).toLocaleDateString()}`}
                    style={{ flex: 1, marginRight: '10px' }} // Adjust margin as needed
                />
                <div>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(false, expense)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteExpense(expense._id)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </ListItem>
        ));
    };
    
    const showAlert = (message, type = 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(type); // Add a new state for severity
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setExpenseDetails({
            paidBy: '',
            amount: '',
            description: '',
            date: new Date().toISOString().slice(0, 10),
            involvedMembers: [],
        });

        setOpenSnackbar(false);
    };

    const SettlementsDisplay = ({ tourId }) => {
        const [settlements, setSettlements] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
    
        useEffect(() => {
            fetch(`${serverUrl}/api/tours/${tourId}/settlements`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            .then(response => response.json())
            .then(data => {
                setSettlements(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching settlements:', error);
                setIsLoading(false);
            });
        }, [tourId]);
    
        if (isLoading) return <p>Loading settlements...</p>;
        if (settlements.length === 0) return <p>No settlements to display.</p>;
    
        return (
            <Box sx={styles.settlementCard}>
                <Typography variant="h6">Settlements</Typography>
                        <List>
                            {settlements.map((settlement, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`${settlement.fromMember.name} owes ${settlement.toMember.name}`}
                                        secondary={`Amount: $${settlement.amount}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
            </Box>
        );
    };
    
    const refetchTourDetails  = async () => {
        try {
            const response = await fetch(`${serverUrl}/api/tours/${tourId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                    // Include authorization headers if needed
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setTour(data);
            setExpenses(data.expenses);
            setMembers(data.members); // Assuming the API returns a list of members
        } catch (error) {
            console.error('Error fetching tour details:', error);
            showAlert('Error fetching tour details');
        }
    };

    return (
        <Container>
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={styles.headingBox}>
                    <Typography variant="h4">{tour ? tour.name : 'Loading...'}</Typography>
                    <Box sx={styles.buttonGroup}>
                        <Button onClick={handleBackClick} variant="outlined">Back to Dashboard</Button>
                        <Button onClick={handleOpenModal} variant="contained" color="primary">Add New Expense</Button>
                    </Box>
                    <List>
                        {renderExpenses()}
                    </List>
                    <Modal open={openModal} onClose={handleCloseModal}>
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                            <IconButton aria-label="close" onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6">{expenseDetails._id ? 'Edit Expense' : 'Add Expense'}</Typography>
                            <TextField label="Amount" value={expenseDetails.amount} onChange={(e) => setExpenseDetails({ ...expenseDetails, amount: e.target.value })} fullWidth margin="normal" />
                            <TextField label="Description" value={expenseDetails.description} onChange={(e) => setExpenseDetails({ ...expenseDetails, description: e.target.value })} fullWidth margin="normal" />
                            <TextField type="date" label="Date" value={expenseDetails.date} onChange={(e) => setExpenseDetails({ ...expenseDetails, date: e.target.value })} fullWidth margin="normal" />
                            
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Paid By</InputLabel>
                                <Select
                                    value={expenseDetails.paidBy}
                                    label="Paid By"
                                    onChange={(e) => setExpenseDetails({ ...expenseDetails, paidBy: e.target.value })}
                                >
                                    {members.map((member, index) => (
                                        <MenuItem key={index} value={member._id}>{member.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormGroup>
                                {members.map((member, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox
                                                checked={expenseDetails.involvedMembers.includes(member._id)}
                                                onChange={(e) => {
                                                    let newInvolvedMembers = [...expenseDetails.involvedMembers];
                                                    if (e.target.checked) {
                                                        newInvolvedMembers.push(member._id);
                                                    } else {
                                                        newInvolvedMembers = newInvolvedMembers.filter(id => id !== member._id);
                                                    }
                                                    setExpenseDetails({ ...expenseDetails, involvedMembers: newInvolvedMembers });
                                                }}
                                            />
                                        }
                                        label={member.name}
                                    />
                                ))}
                            </FormGroup>

                            <Button onClick={handleSaveExpense} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                                Save
                            </Button>
                        </Box>
                    </Modal>
                    {tour && tour.endDate ? (
                        <>
                            <SettlementsDisplay tourId={tour._id} />
                            <ReactivateTourButton tourId={tour._id} onReactivate={refetchTourDetails} />
                        </>
                    ) : (
                        <Button onClick={handleEndTour} variant="contained" color="error" style={{ marginTop: '20px' }}>
                            End Tour
                        </Button>
                    )}
                </Box>
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert elevation={6} variant="filled" severity={!snackbarSeverity ? 'error' : snackbarSeverity} onClose={handleCloseSnackbar}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>

        </Container>
    );
};

export default TourUpdate;
