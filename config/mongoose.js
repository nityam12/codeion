//first install mongoose->npm install mongoose
const mongoose = require('mongoose');
const env = require('./environment');
mongoose.connect(`mongodb://localhost/${env.db}`, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MOngOB'));

db.once('open', function () {
  console.log('connected to Database::MongoDB');
});

module.exports = db;
