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

const env = require('./config/environment');

const logger = require('morgan');

const cors = require('cors');

const rfs = require('rotating-file-stream');

const cookieParser = require('cookie-parser');

const compression = require('compression');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express(); //firing express server
app.enable('trust proxy');
app.use(cors());
app.options('*', cors());
require('./config/view-helpers')(app);
require('./config/view-helpers2')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const validator = require('validator');
//used for seession cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');

//for showing flash
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app); //express app http inbuilt module
const chatServer2 = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
const chatSocketss = require('./config/group_chat_socket').chatSocketss(chatServer2);
chatServer.listen(5000);
chatServer2.listen(6000);
console.log('chat serve/r is listening on port 5000');

//global middleware
app.use(compression()); //only for text & json
//set security http headers
app.use(helmet());

//Limit requests from same ip address
const limiter = rateLimit({
  max: 350,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP,please try again in an hour!',
});

app.use('/users', limiter);

const path = require('path');

//must be before express server is fired

if (env.name == 'development') {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, 'scss'),
      dest: path.join(__dirname, env.asset_path, 'css'),
      debug: true, //display errors in terminal
      outputStyle: 'extended',
      prefix: '/css',
    })
  );
}

//parser middleware
//Body parser,reading data from body into req.body
app.use(express.urlencoded({ limit: '10kb', extended: false }));

//not used
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQl query inzection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

//cookie parser middleware
app.use(cookieParser());

app.use(express.static(path.join('.', env.asset_path))); //for including static files

//make the upload file available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// app.use(logger(env.morgan.mode, env.morgan.options));
app.use(logger(env.morgan.mode, env.morgan.options));
// app.use(logger('combined',{
// stream:env.stream
// }));

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
app.use(
  session({
    name: 'codeial', //name for cookie
    secret: env.session_cookie_keys, //key to encode & decode
    saveUninitialized: false, //no need to save uninitialized login info
    resave: false, //no need to re-save data
    cookie: {
      //cookie validity
      maxAge: 1000 * 24 * 60 * 60, //in ms
      secure: true, //necessary
      httpOnly: true, // by def
    },
    store: new MongoStore( //using mongo store //session is permanentyly stored on server
      {
        //instance of mongo store
        mongooseConnection: db,
        autoRemove: 'disabled',
      },
      function (
        err //callback fn to show err
      ) {
        console.log(err || 'connect-mongodb setup ok');
      }
    ),
  })
);

app.use(passport.initialize()); //passport also helps in storing session cookie
app.use(passport.session());

app.use(passport.setAuthenticatedUser); //this fn is automatically called as middleware

app.use(flash()); //must be placed after session cookie as it uses it

app.use(customMware.setFlash);

//use express router using middleware must be after initialize
app.use('/', require('./routes')); //must be after passport.initialize;

// let redis = require('redis');
// let url = require('url');
// let redisURL = url.parse(process.env.REDISCLOUD_URL);
// let client = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true });
// client.auth(redisURL.auth.split(':')[1]);

app.listen(port, function (err) {
  if (err) {
    console.log(`Error:${err}`); //interpolation
  }
  console.log(`Server is running on port:${port}`);
});

// require('events').EventEmitter.defaultMaxListeners = 15;
// require('events').EventEmitter.prototype._maxListeners = 100;
