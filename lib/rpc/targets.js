const state = require('../state.js')
const targets = require('../targets.js')
const utils = require('../utils.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc:targets')
// SILENCE
// debug.disable('wp-creative-server:rpc:targets')

// rebuild targets from filesystem state
function readTargets(cb, err) {
	targets.readTargets()
	refreshTargets(cb, err)
}

// refresh targets from application state
function refreshTargets(cb, err) {
	log('refreshTargets()')
	const targets = state.getTargets()
	log(targets)
	const out = {}
	// pair down the result
	for (var id in targets) {
		out[id] = {
			size: targets[id].size,
			index: targets[id].index,
			watching: {}
		}
		Object.keys(targets[id].watching).forEach(profile => {
			out[id].watching[profile] = {
				watching: targets[id].watching[profile].watching,
				processing: targets[id].watching[profile].processing,
				error: targets[id].watching[profile].error
			}
		})
	}
	log(out)
	cb(targets)
}

module.exports = {
	readTargets,
	refreshTargets
}
