const dnode = require('dnode')
const shoe = require('shoe')
const moment = require('moment')

const targets = require('../lib/targets.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc-api')
//
debug.disable('wp-creative-server:rpc-api')

const api = {
	getCreative: getCreative,
	getTargets: getTargets
}

// connect dnode
function connect(options) {
	state = options.state

	log('Connecting Public API:')
	log(api)
	// on request
	var sock = shoe(function(stream) {
		var d = dnode(api)
		d.pipe(stream).pipe(d)
	})
	return sock
}

var state

/* -- REMOTE CONTROL METHODS ----------------------------------------------
 *
 *
 *
 */
// get current creative
function getCreative(cb) {
	log('getCreative()')
	var out = {
		name: targets.getCreativeName()
	}
	cb(out)
}

// get compile/deploy targets
function getTargets(cb) {
	log('getTargets()')

	// refresh targets and update state
	targets
		.readTargets()
		.then(targets => {
			var out = {}
			for (var id in targets) {
				out[id] = state.format(targets[id], {
					size: value => {
						return value
					},
					index: value => {
						return value
					},
					watching: value => {
						return value ? true : false
					},
					processing: value => {
						return value
					},
					error: value => {
						return value
					},
					updateAt: value => {
						return moment(value).from(Date.now())
					},
					deployAt: value => {
						return moment(value).from(Date.now())
					},
					webpack: value => {
						return {
							shell: value.shell,
							out: value.out
						}
					}
				})
			}

			log(out)
			cb(out)
		})
		.catch(err => {
			cb(err)
		})
}

module.exports = {
	connect,
	getCreative,
	getTargets
}
