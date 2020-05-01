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

//used for seession cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

const MongoStore=require('connect-mongo')(session);

const sassMiddleware=require('node-sass-middleware');

//for showing flash
const flash=require('connect-flash');
const customMware=require('./config/middleware');




//must be before express server is fired
app.use(sassMiddleware({
    src:'./assets/SCSS',
    dest:'./assets/css',
    debug:true,//display errors in terminal
    outputStyle:'extended',
    prefix:'/css'

}));

//parser middleware
app.use(express.urlencoded());

//cookie parser middleware 
app.use(cookieParser());

app.use(express.static('./assets')); //for including static files

app.use(expressLayouts); //must be before routes  before rendering

//extract style and scripts from sub pages into the layout uses express-ejs-layouts see documentation
app.set('layout extractStyles', true); //add individual style to each page-- >
app.set('layout extractScripts', true); //add individual style to each page-- >







//set up view or template engine ejs
//first install-> npm install ejs

app.set('view engine', 'ejs');
app.set('views', './views');

//midleware used for enrypting session cookie of express cookie
//mongo store is used to store the session cookie in db
app.use(session({
    name:'codeial',//name for cookie
    //to change secret before deployment
    secret:'blahsomething', //key to encode & decode
    saveUninitialized:false, //no need to save uninitialized login info 
    resave:false, //no need to re-save data
    cookie:{ //cookie validity
        maxAge:(1000*60*100) //in ms
    },
    store:new MongoStore( //using mongo store //session is permanentyly stored on server
        { //instance of mongo store
            mongooseConnection:db,
            autoRemove:'disabled'
        },
        function(err) //callback fn to show err
        {
            console.log(err || 'connect-mongodb setup ok');
        }
   )
}));


app.use(passport.initialize()); //passport also helps in storing session cookie
app.use(passport.session());


app.use(passport.setAuthenticatedUser);//this fn is automatically called as middleware

app.use(flash());//must be placed after session cookie as it uses it 

app.use(customMware.setFlash);


//use express router using middleware must be after initialize
app.use('/', require('./routes')); //must be after passport.initialize;




app.listen(port, function(err) {
    if (err) {
        console.log(`Error:${err}`); //interpolation
    }
    console.log(`Server is running on port:${port}`);
});