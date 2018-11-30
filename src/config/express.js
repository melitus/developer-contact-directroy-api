const express = require('express');
const passport = require('passport');

const routes = require('../routes/index');
const middlewaresConfig = require('../middlewares/middleConfig')
const addSecurityMiddleware = require('../middlewares/security');
const toobusy = require('../middlewares/toobusy');
const strategies = require('./passport');


// Express instance/
const app = express();

// body-parser defaults to a body size limit of 300kb
app.use(express.json({ limit: '300kb' })); 

// Trust the now proxy
app.set('trust proxy', true);

// Return the request if the server is too busy
app.use(toobusy);

// Security middleware.
addSecurityMiddleware(app, { enableNonce: false, enableCSP: false });

// set up passport
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
passport.use('facebook', strategies.facebook);
passport.use('google', strategies.google);

// Middlewares
middlewaresConfig(app);

// mount api routes
app.use('/', routes);


module.exports = app;
