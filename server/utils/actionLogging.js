const ActionLog = require('../models/ActionLog'); 

async function logUserAction(user, action, details, req) {
    console.log(user);
    const actionLog = new ActionLog({
        user: user.userId,
        action: action,
        details: details,
        ipAddress: req.ip, // or another method to get the IP
        userAgent: req.headers['user-agent'] // Gets the user agent from the request headers
    });
    await actionLog.save();
}

module.exports = logUserAction;
