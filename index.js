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


/* -- STATE ----------------------------------------------
 *
 *
 *
 */
var state = require('./lib/state.js');


/* -- RPC ----------------------------------------------
 *
 *
 *
 */
var dnode = require('dnode');
var shoe = require('shoe');

var sock = shoe(function (stream) {
	log('dnode connect');
	var d = dnode({
		getState: function (name, cb) {
			log('getState() requested');
			cb({ data:'<3- You will receive  -->' });
		}
	});
	d.pipe(stream).pipe(d);
});






/* -- ROUTES ----------------------------------------------
 *
 *
 *
 */
require('./routes/app')(app, express);
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
sock.install(app.listen(3000), '/dnode');