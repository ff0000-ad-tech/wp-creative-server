const fs = require('fs')
const path = require('path')
const tail = require('file-tail')

const state = require('../state.js')
const wpDebug = require('./wp-debug.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:watching')

function newWatch(wp, options) {
	wp = wp ? wp : wpDebug
	return {
		cmd: wp.prepareCmd(options), // formally: webpack: webpack.prepareWatch(options)
		watching: false,
		processing: false,
		error: 0,
		updateAt: Date.now()
	}
}

function getWpKey(key) {
	return key ? key : 'debug' // or 'traffic', see: ./lib/targets:newTarget()
}

function startWatching(key, targets) {
	key = getWpKey(key)

	// confirm requested targets are stopped
	stopWatching(targets)

	log('startWatching()')
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
			tail: ft,
			watching: true,
			processing: true,
			updateAt: Date.now(),
			intervalId: intervalId
		})
	}
}

function stopWatching(key, targets) {
	key = getWpKey(key)

	log('stopWatching()')
	for (var id in targets) {
		// clean up watch
		clearInterval(targets[id][key].intervalId)
		if (targets[id][key].tail) {
			targets[id][key].tail.stop()
		}

		// update state
		state.updateWatch(id, key, {
			error: null,
			watching: false,
			intervalId: null,
			updateAt: Date.now()
		})
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
	stopWatchingAll
}
