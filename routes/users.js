const express = require('express');
const router = express.Router();

const passport=require('passport');

const usersController = require('../controllers/users_controller');




router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);


router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);

router.post('/create',usersController.create);

//for posts
router.post('/posts')

//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',//strategy
    {failureRedirect:'/users/sign-in'}
),usersController.createSession);//on success to this action

router.get('/sign-out',usersController.destroySession);

module.exports = router;