const bodyParser = required('body-parser');
const morgan = required('morgan');
const passport = require('passport');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');

const { logs } = require('./vars');
const strategies = require('./passport');

module.exports = app => {
  app.use(bodyParser.json()); // parse body params and attach them to req.body
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan(logs));  // request logging. dev: console | production: file
  app.use(compress());  // Send all responses as gzip
  app.use(methodOverride()); // lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
  app.use(cors());   // enable CORS - Cross Origin Resource Sharing
  app.use(passport.initialize());
  passport.use('jwt', strategies.jwt);
  passport.use('facebook', strategies.facebook);
  passport.use('google', strategies.google);
};

