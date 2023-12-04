const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
  paidBy: {
    memberId: mongoose.Schema.Types.ObjectId,
    name: String
  },
  amount: Number,
  description: String,
  date: Date,
  involvedMembers: [{
    memberId: mongoose.Schema.Types.ObjectId,
    name: String
  }],
  // Add other fields as necessary
});

module.exports = mongoose.model('Expense', expenseSchema);