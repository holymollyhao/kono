const express = require('expres');
const router = express.Router();
const room = require('./room');

router.get('/', room.roomState);

module.exports = router;
