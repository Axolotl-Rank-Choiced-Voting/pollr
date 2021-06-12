const express = require('express');
const pollController = require('../controllers/pollController.js');

const router = express.Router();

router.post('/', pollController.createPoll, (req, res) => {
    res.status(200).json(res.locals);
});

router.get('/:id', (req, res) => {
    res.cookie('poll', req.params.id);
    res.status(200).sendFile('./index.html');
});

module.exports = router;