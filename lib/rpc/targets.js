const state = require('../state.js')
const targets = require('../targets.js')
const utils = require('../utils.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc:targets')
// SILENCE
debug.disable('wp-creative-server:rpc:targets')

// rebuild targets from filesystem state
function getTargets(cb, err) {
	targets.readTargets()
	refreshTargets(cb, err)
}

// refresh targets from application state
function refreshTargets(cb, err) {
	log('refreshTargets()')
	const targets = state.getTargets()
	// format result
	for (var id in targets) {
		Object.keys(targets[id].watching).forEach(ctype => {
			targets[id].watching[ctype] = utils.format(
				targets[id].watching[ctype],
				{
					watching: value => {
						return value
					},
					processing: value => {
						return value
					},
					error: value => {
						return value
					}
				},
				true
			)
		})
	}
	log(targets)
	cb(targets)
}

module.exports = {
	getTargets,
	refreshTargets
}
