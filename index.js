//first install expressusing terminal npm install express then fire up expressby requiring it
//use nodemon index.js to run server ative 
/*
"start": "nodemon index.js",
add this statement in package.json in script part to get rid of repeative command
imp:use npm start to run nodemon server
nodemon index.js


sudo apt git install-linux
use git init
npm install->imp all lib are installed from package .json

*/



const express = require('express'); //requiring 
const app = express(); //firing express server
const port = 8000;



//use express router using middleware
app.use('/', require('./routes'));








app.listen(port, function(err) {
    if (err) {
        console.log(`Error:${err}`); //interpolation
    }
    console.log(`Server is running on port:${port}`);
});