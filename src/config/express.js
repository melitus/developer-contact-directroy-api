const express = require('express');

const routes = require('../routes/developer.route');
const middlewaresConfig = require('../middlewares/middlewares')
const addSecurityMiddleware = require('../middlewares/security');
const toobusy = require('../middlewares/toobusy');


// Express instance
const app = express();

// body-parser defaults to a body size limit of 100kb
app.use(express.json({ limit: '300kb' })); 

// Trust the now proxy
app.set('trust proxy', true);

// Return the request if the server is too busy
app.use(toobusy);

// Security middleware.
addSecurityMiddleware(app);

// Middlewares

middlewaresConfig(app);

// mount api routes
app.use('/', routes);


module.exports = app;
