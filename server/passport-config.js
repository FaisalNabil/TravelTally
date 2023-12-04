const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); // Your User model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, cb) => {
    // Check if user already exists in your DB
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      // User exists, pass the user to done
      return cb(null, existingUser);
    }

    // If new user, create in your DB
    const newUser = await new User({ 
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value
      // Add other relevant data
    }).save();

    cb(null, newUser);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
