const express = require('express');
const router = express.Router();

const room = require('./room');

router.use('/room', room);

module.exports = router;
