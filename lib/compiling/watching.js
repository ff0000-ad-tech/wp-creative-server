const fs = require('fs')
const path = require('path')
const tail = require('file-tail')

const state = require('../state.js')
const profiles = require('../profiles.js')
const wp = require('./wp.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:watching')

const TYPE_DEBUG = 'debug'

// returns a "watch" object
function newWatch() {
	return {
		watching: false,
		processing: false,
		error: false,
		updateAt: Date.now()
	}
}

function getWpCmd(ctype, size, index) {
	const outFile = getWpOutFile(ctype, size, index)
	const params = {
		deploy: {
			source: {
				size,
				index
			}
		}
	}
	if (ctype == TYPE_DEBUG) {
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
	return wp.prepareCmd(outFile, ctype, params)
}

// generate out-file for tailing webpack output
function getWpOutFile(ctype, size, index) {
	return `.${ctype}_${size}_${index}`
}

// wp-process-manager (webpack.config.js) will call via api
function startWatching(ctype, targets, pid) {
	// confirm requested targets are stopped
	stopWatching(targets)

	log('startWatching()')
	for (var id in targets) {
		log(` - ${ctype}/${targets[id].size}/${targets[id].index}/${pid}`)
		// read stream of webpack out file
		ft = tail.startTailing({
			fd: getWpOutFile(ctype, targets[id].size, targets[id].index),
			mode: 'stream'
		})
		ft.on('stream', stream => {
			stream.on('data', chunk => {
				const data = chunk.toString()
				let error = targets[id].watching[ctype].error
				if (data.match(/ERROR/)) {
					error = Date.now()
				}
				// log(data)
				// update state
				state.updateWatch(id, ctype, {
					error: error && error > Date.now() - 1000 ? error : false,
					updateAt: Date.now()
				})
			})
		})
		ft.on('error', err => {
			log(err)
		})

		// timer to indicate processing state
		const intervalId = setInterval(() => {
			if (targets[id].watching[ctype].updateAt > Date.now() - 200) {
				state.updateWatch(id, ctype, {
					processing: true
				})
			} else {
				state.updateWatch(id, ctype, {
					processing: false
				})
			}
		}, 50)

		// indicate watching state
		state.updateWatch(id, ctype, {
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
function stopWatching(ctype, targets) {
	log('stopWatching()')
	for (var id in targets) {
		// clean up watch
		if (targets[id].watching[ctype].intervalId) {
			clearInterval(targets[id].watching[ctype].intervalId)
		}
		if (targets[id].watching[ctype].tail) {
			targets[id].watching[ctype].tail.stop()
		}

		// update state
		state.updateWatch(id, ctype, {
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
function completeWatch(ctype, targets) {
	stopWatching(ctype, targets)
	log('completeWatch()')
	// update profile
	if (ctype !== TYPE_DEBUG) {
		for (var id in targets) {
			profiles.markDeployed(ctype, targets[id])
		}
	}
}

function stopWatchingAll(ctype) {
	log('stopWatchingAll()')
	const targets = state.getTargets()
	for (var i in targets) {
		stopWatching(ctype, targets[i])
	}
}

module.exports = {
	TYPE_DEBUG,
	newWatch,
	getWpCmd,
	startWatching,
	stopWatching,
	completeWatch,
	stopWatchingAll
}
