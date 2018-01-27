const state = require('../state.js')
const targets = require('../targets.js')
const utils = require('../utils.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc:targets')
// SILENCE
debug.disable('wp-creative-server:rpc:targets')

// rebuild targets from filesystem state
function readTargets(cb, err) {
	targets.readTargets()
	refreshTargets(cb, err)
}

// refresh targets from application state
function refreshTargets(cb, err) {
	log('refreshTargets()')
	const targets = state.getTargets()
	// pair down the result
	for (var id in targets) {
		Object.keys(targets[id].watching).forEach(ctype => {
			targets[id].watching[ctype] = {
				watching: targets[id].watching[ctype].watching,
				processing: targets[id].watching[ctype].watching,
				error: targets[id].watching[ctype].watching
			}
		})
	}
	log(targets)
	cb(targets)
}

module.exports = {
	readTargets,
	refreshTargets
}
