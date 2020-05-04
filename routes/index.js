//see documentation-express routing
//see routingsection
//router in express
//express.router-creating sub-division
const express = require('express'); //same instance is passed from previous require index.js
const router = express.Router(); //dividing paths this is a module which separates app route and controller
//create route handler

const homeController = require('../controllers/home_controller')


console.log("routes up!");


router.get('/', homeController.home); //like app.get previously where home is action
router.use('/users', require('./users'));

//path for post routes
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
//for any furthur routes,access from here
//router.use('/routename',require('./routerfile));


router.use('/api',require('./api'));

module.exports = router; //we need to export it to outer world so it can be used
//diff btn exports & module.exports