const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const IndividualExpenseRecord = require('../models/IndividualExpenseRecord');

// Middleware
const authenticate = require('../middleware/authenticate');

//Utils
const calculateBalances = require('../utils/calculateBalances');
const logUserAction = require('../utils/actionLogging');


// Create a new tour
router.post('/create', authenticate, async (req, res) => {
    try {
        const { name, members, startDate } = req.body;

        if (!name || !members || !startDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        const newTour = new Tour({
            name,
            createdBy: req.user.userId, // Assuming req.user is set by passport after authentication
            members,
            startDate,
            expenses: []
        });

        await newTour.save();

        // Log the action
        logUserAction(req.user, 'Create Tour', { newValue: newTour }, req);

        res.status(201).json(newTour);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Update a tour
router.put('/:tourId', authenticate, async (req, res) => {
    try {
        const { name, members, startDate, endDate } = req.body;
        const tourId = req.params.tourId;
        const oldTour = await Tour.findById(req.params.id);
    
        // Find the tour and update it
        const updatedTour = await Tour.findByIdAndUpdate(
            tourId,
            {
                $set: {
                    name: name,
                    members: members,
                    startDate: startDate,
                    endDate: endDate
                }
            },
            { new: true } // Return the updated document
        ).populate('members', 'name');

        if (!updatedTour) {
            return res.status(404).send('Tour not found');
        }

        // Log the action
        logUserAction(req.user, 'Update Tour', { oldValue: oldTour, newValue: updatedTour }, req);

        res.json(updatedTour);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/:tourId/end', authenticate, async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.tourId)
                                .populate({
                                    path: 'expenses',
                                    populate: { path: 'paidBy involvedMembers' }
                                });

        if (!tour) {
            return res.status(404).send('Tour not found');
        }

        if (tour.createdBy.toString() !== req.user.userId.toString()) {
            return res.status(403).send('User not authorized to end this tour');
        }

        const oldTourState = JSON.parse(JSON.stringify(tour)); // Deep clone the tour object

        tour.endDate = new Date(); // Set the end date to now

        // Calculate balances
        const { settlements, individualExpenses } = calculateBalances(tour);

        // Create settlement documents
        const settlementsData = await Promise.all(settlements.map(async (data) => {
            const settlement = new Settlement({
                tour: tour._id,
                fromMember: {
                    memberId: data.from.memberId,
                    name: data.from.name
                },
                toMember: {
                    memberId: data.to.memberId,
                    name: data.to.name
                },
                amount: data.amount
            });
            return settlement.save();
        }));

        // Create individual expense records
        await Promise.all(Object.keys(individualExpenses).map(memberId => {
            const expense = individualExpenses[memberId];
            return new IndividualExpenseRecord({
                tour: tour._id,
                member: {
                    memberId: memberId,
                    name: expense.name
                },
                paid: expense.paid,
                shouldHavePaid: expense.shouldHavePaid
            }).save();
        }));

        await tour.save();

        const newSettlementsData = JSON.parse(JSON.stringify(settlementsData));
        const newIndividualExpenses = JSON.parse(JSON.stringify(individualExpenses));
        const newTourState = JSON.parse(JSON.stringify(tour));

        logUserAction(req.user, 'End Tour', {
            oldValue: oldTourState,
            newValue: { tour: newTourState, settlements: newSettlementsData, individualExpenses: newIndividualExpenses }
        }, req);

        res.json({ tour, settlementsData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});


router.post('/:tourId/undoEnd', authenticate, async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.tourId);

        if (!tour) {
            return res.status(404).send('Tour not found');
        }

        // Check if the user is authorized, e.g., is the tour creator
        if (tour.createdBy.toString() !== req.user.userId.toString()) {
            return res.status(403).send('User not authorized');
        }

        // Clear settlements, individualExpenseRecord and reset endDate
        await Settlement.deleteMany({ tour: tour._id });
        await IndividualExpenseRecord.deleteMany({ tour: tour._id });
        tour.endDate = null;
        await tour.save();

        // Log the action
        logUserAction(req.user, 'Reactivate Tour', {
            oldValue: { endDate: tour.endDate }, // Old detail (end date)
            newValue: null // Since the tour is reactivated, there's no new value
        }, req);

        res.status(200).send('Tour reactivated');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get the history of all tours
router.get('/history', authenticate, async (req, res) => {
    try {
        const tours = await Tour.find({ createdBy: req.user.userId }).sort({ startDate: -1 });

        // Log the action
        logUserAction(req.user, 'Access Tour History', {}, req);

        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get details of a specific tour
router.get('/:tourId', authenticate, async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.tourId)
                               .populate('members', 'name')
                               .populate('expenses');

        if (!tour) {
            return res.status(404).send('Tour not found');
        }

        // Log the action
        logUserAction(req.user, 'Access Tour Details', { tourId: req.params.tourId }, req);

        res.json(tour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:tourId/settlements', authenticate, async (req, res) => {
    try {
        const settlements = await Settlement.find({ tour: req.params.tourId });

        // Log the action
        logUserAction(req.user, 'Access Tour Settlements', { tourId: req.params.tourId }, req);
        
        res.json(settlements);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/:tourId/individualExpenses', authenticate, async (req, res) => {
    try {
        const individualExpenses = await IndividualExpenseRecord.find({ tour: req.params.tourId });

        // Log the action
        logUserAction(req.user, 'Access Individual Expenses', { tourId: req.params.tourId }, req);
    
        res.json(individualExpenses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
