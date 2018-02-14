const path = require('path')
var _ = require('lodash')

const debug = require('debug')
var log = debug('wp-creative-server:lib:state')

/* -- STATE UTILITIES ------------------------------------------
 *
 * 
 * 
 * 
 *
 */
const stateDefinition = {
	targets: {}
}
var State
var previousState

function getDefinition() {
	return _.cloneDeep(stateDefinition)
}

/**
 * @method reset
 * @desc reverts the state model to its default state
 *
 */
function reset() {
	previousState = State ? _.cloneDeep(State) : _.cloneDeep(stateDefinition)
	State = _.cloneDeep(stateDefinition)
}

/**
 * @method applyPrevious
 * @desc shepherds previous target watch data to new state model
 */
function applyPrevious() {
	Object.keys(State.targets).forEach(id => {
		if (id in previousState.targets) {
			Object.keys(State.targets[id].watching).forEach(profile => {
				if (profile in previousState.targets[id].watching) {
					State.targets[id].watching[profile] = previousState.targets[id].watching[profile]
				}
			})
		}
	})
}

/* -- CREATIVE ------------------------------------------
 *
 * 
 * 
 * 
 *
 */
function getCreativeName() {
	return path.basename(global.servePath)
}

/* -- TARGET ------------------------------------------
 *
 * 
 * 
 * 
 *
 */
// returns targets of matching ids
function getTargets(ids) {
	ids = typeof ids == 'string' ? [ids] : ids
	if (!ids) {
		return State.targets
	}
	var targets = {}
	var hasTargets = false
	ids.forEach(id => {
		if (id in State.targets) {
			hasTargets = true
			targets[id] = State.targets[id]
		}
	})
	return hasTargets ? targets : null
}
function addTargets(targets) {
	var newTargets = {}
	for (var id in targets) {
		if (!getTargets(id)) {
			newTargets[id] = targets[id]
		}
	}
	State.targets = _.extend(State.targets, newTargets)
}

// updates watching params on specified targets
function updateWatch(id, profile, params) {
	State.targets[id].watching[profile] = Object.assign({}, State.targets[id].watching[profile], params)
}

module.exports = {
	getCreativeName,
	reset,
	applyPrevious,
	getTargets,
	addTargets,
	updateWatch
}
