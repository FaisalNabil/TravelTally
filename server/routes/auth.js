const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library'); // Import Google Auth Library
const router = express.Router();
const User = require('../models/User');
const LoginRecord = require('../models/LoginRecord'); // Import the model

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; 
const CLIENT_SECTRET = process.env.GOOGLE_CLIENT_SECRET; 
const client = new OAuth2Client(CLIENT_ID);

//Utils
const logUserAction = require('../utils/actionLogging');

// // Trigger Google OAuth
// router.get('/google',
//   passport.authenticate('google', { 
//     scope: ['profile', 'email'],
//     prompt: "select_account", 
//   })
// );

// // Google OAuth callback
// router.get('/google/callback', 
//   passport.authenticate('google', { 
//     failureRedirect: '/login/failed' 
//   }),
//   (req, res) => {
//     // Successful authentication
//     // Instead of redirecting, send a response that the SPA can handle
//     // You might want to create a token and send it back

//     // Example: Sending back user info
//     res.json({ 
//       success: true,
//       message: 'Authentication successful',
//       user: req.user // or any other user data you wish to send
//     });
//   }
// );

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Failed to log in",
  });
});

router.post('/google/callback', async (req, res) => {
  try {
      const { token } = req.body;
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const googleId = payload['sub'];

      let user = await User.findOne({ googleId: googleId });
      let actionType = 'Login';
      let oldValue = {};
      let newValue = {};
      if (!user) {
          user = new User({
              googleId: googleId,
              name: payload['name'],
              email: payload['email']
          });
          await user.save();

          actionType = 'User Creation';
          newValue = JSON.parse(JSON.stringify(user)); // New user details
      }

      const verifiedToken = jwt.sign({ userId: user._id }, CLIENT_SECTRET, { expiresIn: '1h' });

      // Create a new login record
      const loginRecord = new LoginRecord({
          userId: user._id,
          // Example of capturing IP address and user agent
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
      });
      await loginRecord.save();

      // Log the user action
      logUserAction(user, actionType, {
          oldValue: oldValue,
          newValue: newValue,
          additionalInfo: {
              loginRecordId: loginRecord._id
          }
      }, req);

      res.json({ success: true, message: 'Authentication successful', user: user, verifiedToken: verifiedToken });
  } catch (error) {
      console.error('Error verifying Google token', error);
      res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

module.exports = router;