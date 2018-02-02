const fs = require('fs')
const path = require('path')
const tail = require('file-tail')

const utils = require('../utils.js')
const state = require('../state.js')
const profiles = require('../profiles.js')
const wp = require('./wp.js')

const debug = require('debug')
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
	const outFile = getWpOutFile(profile, size, index)
	const params = {
		deploy: {
			source: {
				size,
				index
			}
		}
	}
	if (profile == profiles.PROFILE_DEBUG) {
		params.deploy.output = {
			folder: utils.DEBUG_FOLDER,
			debug: true
		}
	} else {
		params.deploy.output = {
			folder: utils.TRAFFIC_FOLDER,
			debug: false
		}
	}
	return wp.prepareCmd(outFile, profile, params)
}

// generate out-file for tailing webpack output
function getWpOutFile(profile, size, index) {
	const tailsFolder = '.webpack-tails'
	const tailsPath = `${global.servePath}/${tailsFolder}`
	if (!fs.existsSync(tailsPath)) {
		fs.mkdirSync(tailsPath)
	}
	return `${tailsFolder}/${profile}_${size}_${index}`
}

// wp-process-manager (webpack.config.js) will call via api
function startWatching(profile, targets, pid) {
	// confirm requested targets are stopped
	stopWatching(targets)

	log('startWatching()')
	for (var id in targets) {
		log(` - ${profile}/${targets[id].size}/${targets[id].index}/${pid}`)
		// read stream of webpack out file
		ft = tail.startTailing({
			fd: getWpOutFile(profile, targets[id].size, targets[id].index),
			mode: 'stream'
		})
		ft.on('stream', stream => {
			stream.on('data', chunk => {
				const data = chunk.toString()
				let error = targets[id].watching[profile].error
				if (data.match(/ERROR/)) {
					error = Date.now()
				}
				// log(data)
				// update state
				state.updateWatch(id, profile, {
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
			if (targets[id].watching[profile].updateAt > Date.now() - 200) {
				state.updateWatch(id, profile, {
					processing: true
				})
			} else {
				state.updateWatch(id, profile, {
					processing: false
				})
			}
		}, 50)

		// indicate watching state
		state.updateWatch(id, profile, {
			pid: pid,
			tail: ft,
			watching: true,
			processing: true,
			updateAt: Date.now(),
			intervalId: intervalId
		})
		profiles.markDeployInProgress(profile, targets[id])
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
			tail: null,
			watching: false,
			processing: false,
			error: false,
			updateAt: Date.now(),
			intervalId: null
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

module.exports = {
	newWatch,
	getWpCmd,
	startWatching,
	stopWatching,
	completeWatch,
	stopWatchingAll
}
