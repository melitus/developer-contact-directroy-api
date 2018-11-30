const { appKey } = require('../config/keys');
const app = require('../config/express');

// open mongoose connection
require('../config/mongoose');

// listen to requests
app.listen(appKey.port, () => console.info(`server started on port ${appKey.port} (${appKey.env})`));

/**
* Exports express
* @public
*/
module.exports = app;
