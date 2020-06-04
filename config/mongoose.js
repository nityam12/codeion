//first install mongoose->npm install mongoose
const mongoose = require('mongoose');

const env = require('./environment');

const DB = env.DB.replace('<PASSWORD>', env.db_pass);

// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');

//   console.log(err.name, err.message);

//   process.exit(1);
// });

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// mongoose.connect(`mongodb://localhost/${env.db}`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MOngOB'));

db.once('open', function () {
  console.log('connected to Database::MongoDB');
});

// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');

//   console.log(err.name, err.message);

//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on('SIGTERM', () => {
//   console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');

//   server.close(() => {
//     console.log('💥 Process terminated!');
//   });
// });

module.exports = db;
