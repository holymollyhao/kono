const express = require('express');
const router = express.Router();
const room = require('./room');

router.get('/state', room.roomState);

module.exports = router;
