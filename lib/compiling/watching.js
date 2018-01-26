const fs = require('fs')
const path = require('path')
const tail = require('file-tail')

const state = require('../state.js')
const profiles = require('../profiles.js')
const wp = require('./wp.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:watching')

const TYPE_DEBUG = 'debug'
const TYPE_TRAFFIC = 'traffic'

// returns a "watch" object
function newWatch(type) {
	return {
		watching: false,
		processing: false,
		error: 0,
		updateAt: Date.now()
	}
}

function getWpCmd(profileName, size, index, type) {
	const outFile = getWpOutFile(size, index)
	const params = {
		deploy: {
			source: {
				size,
				index
			}
		}
	}
	if (type == TYPE_DEBUG) {
		params.deploy.output = {
			watch: true,
			babel: true,
			logs: true
		}
	} else {
		params.deploy.output = {
			watch: false,
			babel: true,
			logs: true
		}
	}
	return wp.prepareCmd(outFile, profileName, type, params)
}

// generate out-file for tailing webpack output
function getWpOutFile(size, index) {
	return `.${size}_${index}`
}

// wp-process-manager (webpack.config.js) will call via api
function startWatching(type, targets, pid) {
	// confirm requested targets are stopped
	stopWatching(targets)

	log('startWatching()', pid)
	for (var id in targets) {
		// read stream of webpack out file
		ft = tail.startTailing({
			fd: getWpOutFile(targets[id].size, targets[id].index),
			mode: 'stream'
		})
		ft.on('stream', stream => {
			stream.on('data', chunk => {
				const data = chunk.toString()
				let error = targets[id][type].error
				if (data.match(/ERROR/)) {
					error = Date.now()
				}
				// log(data)
				// update state
				state.updateWatch(id, type, {
					error: error > Date.now() - 1000 ? error : 0,
					updateAt: Date.now()
				})
			})
		})

		// timer to indicate processing state
		const intervalId = setInterval(() => {
			if (targets[id][type].updateAt > Date.now() - 200) {
				state.updateWatch(id, type, {
					processing: true
				})
			} else {
				state.updateWatch(id, type, {
					processing: false
				})
			}
		}, 50)

		// indicate watching state
		state.updateWatch(id, type, {
			pid: pid,
			tail: ft,
			watching: true,
			processing: true,
			updateAt: Date.now(),
			intervalId: intervalId
		})
	}
}

// wp-process-manager (webpack.config.js) will call via api
function stopWatching(type, targets, pid) {
	log('stopWatching()', pid)
	for (var id in targets) {
		// clean up watch
		if (targets[id][type].intervalId) {
			clearInterval(targets[id][type].intervalId)
		}
		if (targets[id][type].tail) {
			targets[id][type].tail.stop()
		}

		// update state
		state.updateWatch(id, type, {
			pid: null,
			tail: null,
			error: null,
			watching: false,
			processing: false,
			updateAt: Date.now(),
			intervalId: null
		})
	}
}

// wp-process-manager (webpack.config.js) will call via api
function completeWatch(type, targets, currentProfile) {
	stopWatching(type, targets)
	log('completeWatch()')

	// update profile
	for (var id in targets) {
		profiles.markDeployed(currentProfile, targets[id])
	}
}

function stopWatchingAll(type) {
	log('stopWatchingAll()')
	const targets = state.getTargets()
	for (var i in targets) {
		stopWatching(type, targets[i])
	}
}

module.exports = {
	TYPE_DEBUG,
	TYPE_TRAFFIC,
	newWatch,
	getWpCmd,
	startWatching,
	stopWatching,
	completeWatch,
	stopWatchingAll
}
