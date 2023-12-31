const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Tour = require('../models/Tour');

// Middleware
const authenticate = require('../middleware/authenticate');

//Utils
const logUserAction = require('../utils/actionLogging');

// Add a new expense to a tour
router.post('/add', authenticate, async (req, res) => {
    try {
        const { paidBy, amount, description, date, involvedMembers, tourId } = req.body;

        // Optionally, validate that the tour exists and the user is a member
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).send('Tour not found');
        }

        const newExpense = new Expense({
            tour: tourId,
            amount,
            description,
            date,
            involvedMembers,
            paidBy
        });

        await newExpense.save();

        // Optionally, add this expense to the tour's expenses array
        tour.expenses.push(newExpense._id);
        await tour.save();

        // Log the action
        logUserAction(req.user, 'Add Expense', {
            newValue: JSON.parse(JSON.stringify(newExpense))
        }, req);

        res.status(201).json(newExpense);
    } catch (error) {
        
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Get details of a specific expense
router.get('/:expenseId', authenticate, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.expenseId).populate('paidBy', 'name');
        if (!expense) {
            return res.status(404).send('Expense not found');
        }
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an expense
router.put('/:expenseId', authenticate, async (req, res) => {
    try {
        const { amount, description, date, involvedMembers } = req.body;
        const expense = await Expense.findById(req.params.expenseId);

        if (!expense) {
            return res.status(404).send('Expense not found');
        }

        const oldExpenseState = JSON.parse(JSON.stringify(expense)); // Deep clone

        // Update fields
        expense.amount = amount || expense.amount;
        expense.description = description || expense.description;
        expense.date = date || expense.date;
        expense.involvedMembers = involvedMembers || expense.involvedMembers;

        // Log the action
        logUserAction(req.user, 'Update Expense', {
            oldValue: oldExpenseState,
            newValue: JSON.parse(JSON.stringify(expense))
        }, req);

        await expense.save();
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an expense
router.delete('/:expenseId', authenticate, async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.expenseId);
        if (!expense) {
            return res.status(404).send('Expense not found');
        }

        const oldExpenseState = JSON.parse(JSON.stringify(expense)); // Deep clone
    
        // Optionally, remove this expense from the tour's expenses array
        await Tour.updateOne({ _id: expense.tour }, { $pull: { expenses: expense._id } });
        await Expense.findByIdAndDelete(req.params.expenseId);

        // Log the action
        logUserAction(req.user, 'Delete Expense', {
            oldValue: oldExpenseState
        }, req);
    
        res.status(200).send('Expense deleted');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
