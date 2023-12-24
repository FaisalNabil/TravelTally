const express = require('express');
const session = require('express-session');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
//const cookieSession = require('cookie-session');
//const passportSetup = require('passport-config');
const path = require('path');
const testRoutes = require('./tests/testRoutes');

const app = express();

// Middleware
app.use(cors());
require('dotenv').config({ path: __dirname + '/.env' });

const tourRoutes = require('./routes/tours');
const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');

// Connect to Database
connectDB();

// Serve static files from the React app
//app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());

app.use(session({ 
    secret: process.env.GOOGLE_CLIENT_SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: true, maxAge: 3600000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/auth', authRoutes);
app.use('/test', testRoutes);

app.get('/logout', (req, res) => {
    req.logout(); // Passport.js logout method
    req.session.destroy(); // Destroy session
    res.redirect('/'); // Redirect to homepage or login page
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.status(404).send('API route not found');
    //res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
  
const PORT = process.env.PORT;
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`)
});
