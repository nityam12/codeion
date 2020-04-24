//first install mongoose->npm install mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codeial_development');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error connecting to MOngOB"));



db.once('open', function() {
    console.log('connected to Database::MongoDB');
});




module.exports = db;