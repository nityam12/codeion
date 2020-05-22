const express = require('express'); //same instance is passed from previous require index.js

const router = express.Router();

const passport = require('passport');

const likesController = require('../controllers/likes_controller');

router.post('/toggle', passport.checkAuthentication, likesController.toggleLike);

module.exports = router;
