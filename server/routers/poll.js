const express = require('express');
const path = require('path');
const pollController = require('../controllers/pollController.js');

const router = express.Router();

router.post('/', pollController.createPoll, (req, res) => {
    res.status(200).json(res.locals);
});

router.get('/:id', (req, res) => {
    if(req.params.id !== 'style.css') res.cookie('poll', req.params.id);
    res.status(200).sendFile(path.join(__dirname, '../../index.html'));
});

module.exports = router;