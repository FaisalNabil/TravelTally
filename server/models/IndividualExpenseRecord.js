const mongoose = require('mongoose');

const individualExpenseRecordSchema = new mongoose.Schema({
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    member: {
        memberId: mongoose.Schema.Types.ObjectId,
        name: String
    },
    paid: Number,
    shouldHavePaid: Number
});

module.exports = mongoose.model('IndividualExpenseRecord', individualExpenseRecordSchema);
