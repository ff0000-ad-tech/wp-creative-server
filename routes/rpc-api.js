const dnode = require('dnode');
const shoe = require('shoe');
const moment = require('moment');


const targets = require('../lib/targets.js');

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
		var out = [];
		for (var i in targets) {
			out.push(state.format(targets[i], {
				size: value => { return value; },
				index: value => { return value; },
				watching: value => { return value ? true : false; },
				processing: value => { return value; },
				error: value => { return value; },
				updateAt: value => { return moment(value).from(Date.now()); }, 
				deployAt: value => { return moment(value).from(Date.now()); }
			}));
		}

		log(out);
		cb(out);
	})
	.catch((err) => {
		cb(err);
	})

}



module.exports = {
	connect
};