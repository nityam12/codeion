const express = require('express');

const router = express.Router();

const passport = require('passport');

const friendController = require('../controllers/friends_controller');

router.post('/make', passport.checkAuthentication, friendController.makefriend);

module.exports = router;
