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
	var out = {}
	for (var id in targets) {
		out[id] = utils.format(
			targets[id],
			{
				size: value => {
					return value
				},
				index: value => {
					return value
				},
				debug: value => {
					return {
						watching: value.watching,
						processing: value.processing,
						error: value.error,
						cmd: {
							shell: value.cmd.shell,
							out: value.cmd.out
						}
					}
				},
				traffic: value => {
					return {
						watching: value.watching,
						processing: value.processing,
						error: value.error,
						cmd: {
							shell: value.cmd.shell,
							out: value.cmd.out
						}
					}
				},
				currentProfile: value => {
					return value
				}
			},
			true
		)
	}
	log(out)
	cb(out)
}

module.exports = {
	getTargets,
	refreshTargets
}
