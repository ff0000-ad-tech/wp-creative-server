var _ = require('lodash')

const debug = require('debug')
var log = debug('wp-creative-server:lib:state')

var state = {
	targets: {}
}

/* returns targets matching ids
 * @ids {string,array,undefined} if undefined, all targets are returned
 */
function getTargets(ids) {
	ids = typeof ids == 'string' ? [ids] : ids
	if (!ids) {
		return state.targets
	}
	var targets = {}
	var hasTargets = false
	ids.forEach(id => {
		if (id in state.targets) {
			hasTargets = true
			targets[id] = state.targets[id]
		}
	})
	return hasTargets ? targets : null
}

// formats values of obj with matching callbacks in schema
function format(obj, schema) {
	var out = Object.keys(obj).reduce((out, i) => {
		if (!schema || i in schema) {
			out[i] = schema[i](obj[i])
		}
		return out
	}, {})
	return out
}

function addTargets(targets) {
	var newTargets = {}
	for (var id in targets) {
		if (!getTargets(id)) {
			newTargets[id] = targets[id]
		}
	}
	state.targets = _.extend(state.targets, newTargets)
}

function updateTarget(id, params) {
	const prevTarget = getTargets(id)
	state.targets[id] = _.assign(prevTarget[id], params)
}

module.exports = {
	getTargets,
	updateTarget,
	format,
	addTargets
}
