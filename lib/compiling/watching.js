const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const utils = require('../utils.js')
const state = require('../state.js')
const profiles = require('../profiles.js')
const wp = require('./wp.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:lib:watching')

// returns a "watch" object
function newWatch() {
	return {
		watching: false,
		processing: false,
		error: false,
		updateAt: Date.now()
	}
}

function getWpCmd(profile, size, index) {
	let params = {
		deploy: {
			source: {
				size,
				index
			}
		}
	}
	if (profile == profiles.PROFILE_DEBUG) {
		params.deploy.profile = {
			name: ''
		}
		params.deploy.output = {
			debug: true,
			context: `./${utils.DEBUG_FOLDER}`
		}
	} else {
		params.deploy.output = {
			debug: false,
			context: `./${utils.TRAFFIC_FOLDER}`
		}
		// apply user profile settings
		params = _.merge(params, profiles.getProfiles()[profile].webpack)
	}
	return wp.prepareCmd(profile, params)
}

// wp-process-manager (webpack.config.js) will call via api
function startWatching(profile, targets, pid) {
	// confirm requested targets are stopped
	stopWatching(targets)

	log('startWatching()')
	for (var id in targets) {
		// use an IIFE to preserve the value of id in callbacks
		;(id => {
			log(` - ${profile}/${targets[id].size}/${targets[id].index}/${pid}`)
			// indicate watching state
			state.updateWatch(id, profile, {
				pid: pid,
				// tail: ft,
				watching: true,
				processing: true
				// updateAt: Date.now(),
				// intervalId: intervalId
			})

			// mark profile state
			profiles.markDeployInProgress(profile, targets[id])

			// call IIFE
		})(id)
	}
}

// wp-process-manager (webpack.config.js) will call via api
function stopWatching(profile, targets) {
	log('stopWatching()')
	for (var id in targets) {
		// clean up watch
		if (targets[id].watching[profile].intervalId) {
			clearInterval(targets[id].watching[profile].intervalId)
		}
		if (targets[id].watching[profile].tail) {
			targets[id].watching[profile].tail.stop()
		}

		// update state
		state.updateWatch(id, profile, {
			pid: null,
			watching: false,
			processing: false,
			error: false
		})
	}
}

// wp-process-manager (webpack.config.js) will call via api
function completeWatch(profile, targets) {
	stopWatching(profile, targets)
	log('completeWatch()')
	// update profile
	if (profile !== profiles.PROFILE_DEBUG) {
		for (var id in targets) {
			profiles.markDeployed(profile, targets[id])
		}
	}
}

function stopWatchingAll(profile) {
	log('stopWatchingAll()')
	const targets = state.getTargets()
	for (var i in targets) {
		stopWatching(profile, targets[i])
	}
}

function setProcessing(profile, targets, toggle) {
	for (var id in targets) {
		// update state
		state.updateWatch(id, profile, {
			processing: toggle
		})
	}
}

function setError(profile, targets, toggle) {
	for (var id in targets) {
		// update state
		state.updateWatch(id, profile, {
			error: toggle
		})
	}
}

module.exports = {
	newWatch,
	getWpCmd,
	startWatching,
	stopWatching,
	completeWatch,
	stopWatchingAll,
	setProcessing,
	setError
}
