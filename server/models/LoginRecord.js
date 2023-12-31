const mongoose = require('mongoose');

const loginRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
  loginTime: { type: Date, default: Date.now }, // Automatically set the login time to the current time
  ipAddress: String, // IP address of the user at the time of login
  userAgent: String, // Information about the user's device, browser, etc.
  // You can add more fields if needed
});

module.exports = mongoose.model('LoginRecord', loginRecordSchema);
