const express = require('express');

const routes = require('../routes/v1');
const middlewaresConfig = require('../middlewares/middlewares')
const addSecurityMiddleware = require('../middlewares/security');
const toobusy = require('../middlewares/toobusy');


// Express instance
const app = express();

// Trust the now proxy
app.set('trust proxy', true);

// Return the request if the server is too busy
app.use(toobusy);

// Security middleware.
addSecurityMiddleware(app);

/**
* Middlewares
*/
middlewaresConfig(app);

// mount api v1 routes
app.use('/v1', routes);


module.exports = app;