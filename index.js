const express = require('express');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');

const debug = require('debug');
var log = debug('wp-creative-server');

// set app-path
global.appPath = __dirname;

// set creative-path with --context, 
// ex: `node node_modules/wp-creative-server/index.js --context ./`
global.servePath = path.resolve(
	'context' in argv ? argv.context : global.appPath
);
log(`Requested --context ${argv.context}`);
log(` Serve path is: ${global.servePath}`);


/* -- Setup -----------------------------------------------
 *
 *
 *
 */
// express set up
var app = express();

// set view engine
app.set('view engine', 'ejs');




/* -- ROUTES ----------------------------------------------
 *
 *
 *
 */
require('./routes/control')(app, express);
require('./routes/browse')(app, express);
require('./routes/api')(app, express);





/* -- SHARED STATIC ----------------------------------------------
 *
 *
 *
 */
app.use('/shared', express.static(
	`${global.appPath}/views/static`
));




/* -- START SERVER ----------------------------------------------
 *
 *
 */
app.listen(3000);