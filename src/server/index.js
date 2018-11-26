const { appvar } = require('../config/vars');
const app = require('../config/express');

// open mongoose connection
require('../config/mongoose');

// listen to requests
app.listen(appvar.port, () => console.info(`server started on port ${appvar.port} (${appvar.env})`));

/**
* Exports express
* @public
*/
module.exports = app;
