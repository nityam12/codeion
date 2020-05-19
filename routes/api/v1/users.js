const express = require('express'); //same instance is passed from previous require index.js
const router = express.Router(); 

const userApi=require('../../../controllers/api/v1/users_api');



router.post('/create-session',userApi.createSession);




module.exports=router;