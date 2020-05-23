const express = require('express');
//same instance is passed from previous require index.js
const router = express.Router();

router.use('/posts', require('./posts'));
router.use('/users', require('./users'));

module.exports = router;
