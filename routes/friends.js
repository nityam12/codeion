const express = require('express');
const router = express.Router();



const friendController = require('../controllers/friends_controller');

router.post('/make',friendController.makefriend);




module.exports=router;