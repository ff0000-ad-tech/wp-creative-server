var dnode = require('dnode');
var shoe = require('shoe');

const targets = require('./targets.js');

const debug = require('debug');
var log = debug('wp-creative-server:rpc-api');

const api = {
	getState: getState
}

// connect dnode
function connect(options) {
	state = options.state;

	log('Connecting Public API:');
	log(api);
	// on request
	var sock = shoe(function (stream) {
		var d = dnode(api);
		d.pipe(stream).pipe(d);
	});
	return sock;
}

var state;


/* -- REMOTE CONTROL METHODS ----------------------------------------------
 *
 *
 *
 */
function getState(name, cb) {
	log('getState()');

	// refresh targets and update state
	targets.readTargets()
	.then((targets) => {
		log(state.getTargets());
		cb(state.getTargets());
	})
	.catch((err) => {
		cb(err);
	})

}



module.exports = {
	connect
};