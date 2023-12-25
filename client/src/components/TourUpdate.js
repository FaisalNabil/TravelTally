import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, TextField, Box, Typography, List, ListItem, ListItemText, Modal, Snackbar, Alert as MuiAlert, IconButton } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BackButton from './BackButton';
import Chip from '@mui/material/Chip';


const TourUpdate = () => {
    
    const { tourId } = useParams();
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [members, setMembers] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editTourDetails, setEditTourDetails] = useState({
        name: '',
        startDate: new Date(),
        members: []
      });
    const [openModal, setOpenModal] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [expanded, setExpanded] = useState('panel1');
    const [expenseDetails, setExpenseDetails] = useState({ paidBy: '', amount: '', description: '', date: new Date().toISOString().slice(0, 10), involvedMembers: [] });
    const [editMemberNames, setEditMemberNames] = useState([]);
    const [memberNameInput, setMemberNameInput] = useState('');

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
        individualExpensesCard: {
            backgroundColor: '#f5f5f5', // Example background color
            padding: 2,
            margin: 2,
        },
        accordion: {
            width: '100%', // Ensure full width
        },
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


    // Handle opening the edit modal
    const handleOpenEditModal = () => {
        if (tour) {
            setEditTourDetails({
                name: tour.name,
                startDate: new Date(tour.startDate), // Parse the date
                //members: tour.members.map(member => member.name) // Extract member names
            });
        }
        setEditMemberNames(tour.members.map(member => member.name));
        setOpenEditModal(true);
    };

    // Handle saving tour details
    const handleUpdateTour = async () => {
        try {
            // Construct the updated tour data
            const updatedTourData = {
                name: editTourDetails.name,
                startDate: editTourDetails.startDate.toISOString(), // Format date to ISO string
                members: editMemberNames.map(name => ({ name }))  // Convert names back to member objects
            };
        
            // Send the updated tour data to the server
            const response = await fetch(`${serverUrl}/api/tours/${tourId}`, {
                method: 'PUT', // Or PATCH, depending on your API design
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if needed
                },
                body: JSON.stringify(updatedTourData)
            });
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            // Handle the response, e.g., updating local state or redirecting the user
            const updatedTour = await response.json();
            setTour(updatedTour); // Update the local state with the new tour data
            setOpenEditModal(false); // Close the edit modal
        
            showAlert('Tour updated successfully', 'success'); // Show success message
        } catch (error) {
            console.error('Error updating tour:', error);
            showAlert('Error updating tour'); // Show error message
        }
    };
    // Add/Edit/Delete Expense Functions
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

    const handleAddEditMember = () => {
        if (memberNameInput) {
            setEditMemberNames([...editMemberNames, memberNameInput]);
            setMemberNameInput(''); // Clear the input field
        }
    };
    
    const handleRemoveEditMember = (index) => {
        const updatedMembers = editMemberNames.filter((_, idx) => idx !== index);
        setEditMemberNames(updatedMembers);
    };

    // Snackbar Functions
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

    // Accordion Functions
    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
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

    const SettlementsDisplay = ({ tourId }) => {
        const [settlements, setSettlements] = useState([]);
        const [individualExpenses, setIndividualExpenses] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
    
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const settlementsResponse = await fetch(`${serverUrl}/api/tours/${tourId}/settlements`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    const settlementsData = await settlementsResponse.json();
                    setSettlements(settlementsData);
    
                    const expensesResponse = await fetch(`${serverUrl}/api/tours/${tourId}/individualExpenses`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    const expensesData = await expensesResponse.json();
                    setIndividualExpenses(expensesData);
    
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error:', error);
                    setIsLoading(false);
                }
            };
            fetchData();
        }, [tourId]);
    
        if (isLoading) return <p>Loading settlements...</p>;
        if (settlements.length === 0 && individualExpenses.length === 0) return <p>No settlements or individual expenses to display.</p>;
    
        return (
            <div>
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
                <Box sx={styles.individualExpensesCard}>
                    <Typography variant="h6">Individual Expense Summary</Typography>
                    <List>
                        {individualExpenses.map((expense, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`${expense.member.name}'s Contribution`}
                                    secondary={`Paid: $${expense.paid} | Expected: $${expense.shouldHavePaid}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </div>
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

    // Render Functions
    const renderExpenses = () => {
        return expenses.map((expense, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItemText
                    primary={expense.description}
                    secondary={`Amount: $${expense.amount} - Date: ${new Date(expense.date).toLocaleDateString()}`}
                />
                <Box>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(false, expense)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteExpense(expense._id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </ListItem>
        ));
    };    

    const TourDetails = () => {
        return (
            <Box sx={{ mt: 1, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h5" component="h2" color="textSecondary">
                        {tour ? tour.name : 'Loading...'}
                    </Typography>
                    <IconButton onClick={handleOpenEditModal} aria-label="edit tour" size="small">
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Typography variant="body2" color="textSecondary">
                    <strong>Members:</strong> {tour?.members.map(member => member.name).join(', ')}
                    <br />
                    <strong>Start Date:</strong> {tour && new Date(tour.startDate).toLocaleDateString()}
                    {tour?.endDate && (
                        <>
                            <br />
                            <strong>End Date:</strong> {new Date(tour.endDate).toLocaleDateString()}
                        </>
                    )}
                </Typography>
            </Box>
        );
    };

    return (
        <Container>
            <BackButton />
            <TourDetails />
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={styles.headingBox}>
                    <Box sx={styles.buttonGroup}>
                        <Button onClick={handleOpenModal} variant="contained" color="primary">Add New Expense</Button>
                    </Box>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')} style={styles.accordion}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Expenses</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {renderExpenses()}
                            </List>
                        </AccordionDetails>
                    </Accordion>
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
                            <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')} style={styles.accordion}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Settlements</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <SettlementsDisplay tourId={tour._id} />
                                </AccordionDetails>
                            </Accordion>
                            <ReactivateTourButton tourId={tour._id} onReactivate={refetchTourDetails} />
                        </>
                    ) : (
                        <Button onClick={handleEndTour} variant="contained" color="error" style={{ marginTop: '20px' }}>
                            End Tour
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Edit Modal */}
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90vw', sm: '400px' },
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto'
                    }}>
                    <IconButton aria-label="close" onClick={() => setOpenEditModal(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">Edit Tour</Typography>
                    <TextField
                        label="Tour Name"
                        value={editTourDetails.name}
                        onChange={(e) => setEditTourDetails({...editTourDetails, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Start Date"
                        value={editTourDetails.startDate}
                        onChange={(date) => setEditTourDetails({...editTourDetails, startDate: date})}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    </LocalizationProvider>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <TextField
                            label="Member Name"
                            value={memberNameInput}
                            onChange={(e) => setMemberNameInput(e.target.value)}
                            fullWidth
                        />
                        <Button onClick={handleAddEditMember } variant="contained" sx={{ ml: 2 }}>
                            Add
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        {editMemberNames.map((name, index) => (
                            <Chip
                            key={index}
                            label={name}
                            onDelete={() => handleRemoveEditMember(index)}
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: '4px' }}
                            />
                        ))}
                    </Box>
                    <Button onClick={handleUpdateTour} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                    Update Tour
                    </Button>
                </Box>
                </Modal>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert elevation={6} variant="filled" severity={!snackbarSeverity ? 'error' : snackbarSeverity} onClose={handleCloseSnackbar}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>

        </Container>
    );
};

export default TourUpdate;
