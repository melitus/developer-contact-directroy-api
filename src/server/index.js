const { port, env } = require('../config/vars');
const app = require('../config/express');

// open mongoose connection
require('../config/mongoose');

// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
