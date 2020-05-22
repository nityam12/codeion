const express = require('express');
//same instance is passed from previous require index.js
const router = express.Router();

const passport = require('passport');

const postsApi = require('../../../controllers/api/v1/posts_api');

router.get('/', postsApi.index);
router.delete('/:id', passport.authenticate('jwt', { session: false }), postsApi.destroy);
//to prevent session cookie from generating session cookie session:false
//passport.authentication gives authentication not authorization

module.exports = router;
