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
const cookieParser=require('cookie-parser');
const app = express(); //firing express server
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//parser middleware
app.use(express.urlencoded());

//cookie parser middleware 
app.use(cookieParser());

app.use(express.static('./assets')); //for including static files

app.use(expressLayouts); //must be before routes  before rendering

//extract style and scripts from sub pages into the layout uses express-ejs-layouts see documentation
app.set('layout extractStyles', true); //add individual style to each page-- >
app.set('layout extractScripts', true); //add individual style to each page-- >


//use express router using middleware
app.use('/', require('./routes'));




//set up view or template engine ejs
//first install-> npm install ejs

app.set('view engine', 'ejs');
app.set('views', './views');








app.listen(port, function(err) {
    if (err) {
        console.log(`Error:${err}`); //interpolation
    }
    console.log(`Server is running on port:${port}`);
});