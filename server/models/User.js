const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String, // If using Google OAuth
  name: String,
  email: String,
  // Add other relevant user information here
});

module.exports = mongoose.model('User', userSchema);