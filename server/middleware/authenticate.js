const jwt = require('jsonwebtoken');

const CLIENT_SECTRET = process.env.GOOGLE_CLIENT_SECRET; 

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1].replace(/"/g, ''); // Bearer Token

    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, CLIENT_SECTRET);
        req.user = decoded; // Add user info to request object
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send('Invalid token');
    }
  }
  
  module.exports = authenticate;