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
var state
var previousState

/**
 * @method reset
 * @desc reverts the state model to its default state
 *
 */
function reset() {
	previousState = state ? _.cloneDeep(state) : _.cloneDeep(stateDefinition)
	state = _.cloneDeep(stateDefinition)
}

/**
 * @method applyPrevious
 * @desc shepherds previous target data (watch processes, etc) to new state model
 */
function applyPrevious() {
	let targets = {}
	Object.keys(state.targets).forEach(id => {
		targets[id] = id in previousState.targets ? previousState.targets[id] : state.targets[id]
	})
	state.targets = targets
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
/**
 * @method getTargets
 * @desc returns targets of matching ids
 * @param {string,array,undefined} ids if undefined, all targets are returned
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

/**
 * @method addTargets
 * @param {string} targets
 */
function addTargets(targets) {
	var newTargets = {}
	for (var id in targets) {
		if (!getTargets(id)) {
			newTargets[id] = targets[id]
		}
	}
	state.targets = _.extend(state.targets, newTargets)
}

/**
 * @method updateWatch
 * @desc updates watching params on specified targets
 * @param {string} id
 * @param {string} type either 'debug' or 'traffic'
 * @param {*} params
 */
function updateWatch(id, type, params) {
	const prevTarget = getTargets(id)
	state.targets[id][type] = _.assign(prevTarget[id][type], params)
}

module.exports = {
	getCreativeName,
	reset,
	applyPrevious,
	getTargets,
	addTargets,
	updateWatch
}
