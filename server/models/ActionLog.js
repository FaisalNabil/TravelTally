const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    timestamp: { type: Date, default: Date.now },
    details: {
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed
    },
    ipAddress: String,
    userAgent: String
});

module.exports = mongoose.model('ActionLog', actionLogSchema);
