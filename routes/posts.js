const express = require('express');

const router = express.Router();

const passport = require('passport');

const postsController = require('../controllers/posts_controller');

router.post(
  '/create',
  passport.checkAuthentication,
  postsController.uploadUserPhoto,
  postsController.resizeUserPhoto,
  postsController.create
);

router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);
//:id params string params

module.exports = router;
