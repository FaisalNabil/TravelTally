const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
  fromMember: {
    memberId: mongoose.Schema.Types.ObjectId,
    name: String
  },
  toMember: {
    memberId: mongoose.Schema.Types.ObjectId,
    name: String
  },
  amount: Number,
  // You can add additional fields as needed
});

module.exports = mongoose.model('Settlement', settlementSchema);