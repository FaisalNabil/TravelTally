const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: mongoose.Schema.Types.ObjectId, // Unique identifier for each member
  name: String // Name of the member
});

const tourSchema = new mongoose.Schema({
  name: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [memberSchema],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  startDate: Date,
  endDate: Date,
  // Add other tour-specific fields as needed
});

module.exports = mongoose.model('Tour', tourSchema);