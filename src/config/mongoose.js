const mongoose = require('mongoose');
const { mongo } = require('./vars');
// make bluebird default Promise
mongoose.Promise = require('bluebird'); 

let gracefulShutdown;

// Connecting to Database
 mongoose.connect( mongo.uri, { useNewUrlParser: true } );

// Checking if connection to db was successful
mongoose.connection.on('connected', () => {
    console.log('Mongoose successfully connected to database URL: '+ mongo.uri);
});

mongoose.connection.on('error', (err) => {
    console.error("Mongoose connection error occurred. Error: " + err);
});

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose connection lost...");
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

// module.exports = mongoose;




