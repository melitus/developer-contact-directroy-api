const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
  allowEmptyValues: true,

});

module.exports = {
  appvar: {
    name: process.env.APP_NAME,
    port: process.env.APP_PORT || 8000,
    env: process.env.NODE_ENV,
  },
  mongo: {
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : process.env.MONGO_URI,
  },
  application_logging: {
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  }
};