const fs = require('fs')
const path = require('path')
const tail = require('file-tail')

const state = require('../state.js')
const profiles = require('../profiles.js')
const wpDebug = require('./wp-debug.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:watching')

function newWatch(wp, options) {
	wp = wp ? wp : wpDebug
	return {
		cmd: wp.prepareCmd(options),
		watching: false,
		processing: false,
		error: 0,
		updateAt: Date.now()
	}
}

function getWpKey(key) {
	return key ? key : 'debug' // or 'traffic', see: ./lib/targets:newTarget()
}

function startWatching(key, targets, pid) {
	key = getWpKey(key)

	// confirm requested targets are stopped
	stopWatching(targets)

	log('startWatching()', pid)
	for (var id in targets) {
		// read stream of webpack out file
		ft = tail.startTailing({
			fd: targets[id][key].cmd.out,
			mode: 'stream'
		})
		ft.on('stream', stream => {
			stream.on('data', chunk => {
				const data = chunk.toString()
				let error = targets[id][key].error
				if (data.match(/ERROR/)) {
					error = Date.now()
				}
				// log(data)
				// update state
				state.updateWatch(id, key, {
					error: error > Date.now() - 1000 ? error : 0,
					updateAt: Date.now()
				})
			})
		})

		// timer to indicate processing state
		const intervalId = setInterval(() => {
			if (targets[id][key].updateAt > Date.now() - 200) {
				state.updateWatch(id, key, {
					processing: true
				})
			} else {
				state.updateWatch(id, key, {
					processing: false
				})
			}
		}, 50)

		// indicate watching state
		state.updateWatch(id, key, {
			pid: pid,
			tail: ft,
			watching: true,
			processing: true,
			updateAt: Date.now(),
			intervalId: intervalId
		})
	}
}

function stopWatching(key, targets, pid) {
	key = getWpKey(key)

	log('stopWatching()', pid)
	for (var id in targets) {
		// clean up watch
		if (targets[id][key].intervalId) {
			clearInterval(targets[id][key].intervalId)
		}
		if (targets[id][key].tail) {
			targets[id][key].tail.stop()
		}

		// update state
		state.updateWatch(id, key, {
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

function completeWatch(key, targets, currentProfile) {
	key = getWpKey(key)
	stopWatching(key, targets)
	log('completeWatch()')

	// update profile
	for (var id in targets) {
		profiles.markDeployed(currentProfile, targets[id])
	}
}

function stopWatchingAll(key) {
	log('stopWatchingAll()')
	const targets = state.getTargets()
	for (var i in targets) {
		stopWatching(key, targets[i])
	}
}

module.exports = {
	newWatch,
	startWatching,
	stopWatching,
	completeWatch,
	stopWatchingAll
}
