const Tour = require('../models/Tour');
const Expense = require('../models/Expense');

async function authorizeTourAccess(req, res, next) {
    try {
        const tourId = req.params.tourId || req.body.tourId;
        if (!tourId) {
            return res.status(400).json({ message: 'Tour ID required' });
        }

        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        if (tour.createdBy.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to access this tour' });
        }

        req.tour = tour;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function authorizeExpenseAccess(req, res, next) {
    try {
        const expense = await Expense.findById(req.params.expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const tour = await Tour.findById(expense.tour);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        if (tour.createdBy.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to access this expense' });
        }

        req.expense = expense;
        req.tour = tour;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { authorizeTourAccess, authorizeExpenseAccess };
