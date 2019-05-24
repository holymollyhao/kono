const express = require('express');
const router = express.Router();

const versions = {
  'v1': require('./v1')
}

router.use('/v1', versions['v1']);

module.exports = router;
