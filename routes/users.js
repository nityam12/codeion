const express = require('express');

const router = express.Router();

const passport = require('passport');

const usersController = require('../controllers/users_controller');

const ChatController = require('../controllers/chat_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
// eslint-disable-next-line prettier/prettier
router.post('/profile/chat/:name/:email/:id1/:id2/:chatroom', passport.checkAuthentication, ChatController.startchat);

router.post(
  '/update/:id',
  passport.checkAuthentication,
  usersController.uploadUserPhoto,
  usersController.resizeUserPhoto,
  usersController.update
);
router.post('/update/password/:id', passport.checkAuthentication, usersController.updatepassword);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.get('/group-chat', passport.checkAuthentication, ChatController.groupchat);
router.get('/groupchat/room', passport.checkAuthentication, ChatController.groupchatroom);

router.get('/forgot', usersController.forgotpage);
router.post('/forgotPassword', usersController.forgotPassword);
// router.post('/forgotPassword',usersController.forgotPassword);
router.get('/resetPassword/:token', usersController.resetPassword);
router.post('/resetPasswordupdate/:token', usersController.resetPassword2);

router.get('/verify/:token', usersController.verifyAccount);

router.post('/create', usersController.create);

//for posts
router.post('/posts');

//use passport as a middleware to authenticate
router.post(
  '/create-session',
  passport.authenticate(
    'local', //strategy
    { failureRedirect: '/users/sign-in' }
  ),
  usersController.createSession
); //on success to this action

router.get('/sign-out', usersController.destroySession);

router.use('/profile/friends', require('./friends'));

//google

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/sign-in' }),
  usersController.createSession
);

module.exports = router;
