const express = require('express'); //same instance is passed from previous require index.js

const router = express.Router();

const likesController= require('../controllers/likes_controller');



router.post('/toggle',likesController.toggleLike);











module.exports=router;


