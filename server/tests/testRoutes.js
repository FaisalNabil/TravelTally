const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).send('Server is up and running!');
});

router.get('/echo/:message', (req, res) => {
    const message = req.params.message;
    res.status(200).send(`Echo: ${message}`);
});

router.post('/echo', (req, res) => {
    res.status(200).json({ receivedData: req.body });
});

module.exports = router;
