const fs = require('fs')
const path = require('path')

const state = require('./state.js')
const webpack = require('./webpack.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:targets')

function getCreativeName() {
	return path.basename(global.servePath)
}

function generateId(size, index) {
	return `${size}/${index}`
}

function newTarget(size, index) {
	// webpack options
	const options = { size, index }

	// target model
	var target = {}
	target[generateId(size, index)] = {
		size: size,
		index: index,
		watching: null,
		watchCommand: webpack.prepareWatch(options),
		processing: false,
		error: null,
		updateAt: Date.now(),
		deployAt: Date.now()
	}
	return target
}

// analyze the file-system
function readTargets() {
	return new Promise((resolve, reject) => {
		// iterate build folder, looking for build-size folders
		const buildPath = `${global.servePath}/build`

		fs.readdir(buildPath, (err, buildItems) => {
			if (err) {
				return reject(err)
			}
			buildItems.forEach(buildItem => {
				// locate build-size folders
				if (buildItem.match(/[0-9]+x[0-9]+/)) {
					const size = buildItem

					// iterate build-size folder, looking for index files
					fs.readdir(`${buildPath}/${size}`, (err, sizeItems) => {
						if (err) {
							return reject(err)
						}
						sizeItems.forEach(sizeItem => {
							// locate index files
							if (sizeItem.match(/index/)) {
								const index = sizeItem
								state.addTargets(newTarget(size, index))
							}
						})
						resolve(state.getTargets())
					})
				}
			})
		})
	})
}

function startWatching(params) {
	const targets = state.getTargets(targets.generateId(params.size, params.index))
	if (!targets) {
		return
	}
	// confirm requested targets are stopped
	stopWatching(targets)

	log('startWatching()')
	for (var id in targets) {
		// callback to watch stdout for processing
		const intervalId = setInterval(() => {
			if (targets[id].updateAt > Date.now() - 1000) {
				state.updateTarget(id, {
					processing: true
				})
			} else {
				state.updateTarget(id, {
					processing: false
				})
			}
		}, 100)
		const onStdout = function(data) {
			state.updateTarget(id, {
				updateAt: Date.now()
			})
		}
		// callback to handle error
		const onStderr = function(data) {
			state.updateTarget(id, {
				updateAt: Date.now()
			})
		}
		// callback to handle exit
		const onExit = function(code) {
			log(`process exit: ${code}`)
			if (code && code !== 0) {
				state.updateTarget(id, {
					updateAt: Date.now(),
					error: new Error(`Exit code ${code}`)
				})
			}
			stopWatching(targets)
		}

		// start watching process
		state.updateTarget(id, {
			watching: webpack.start(options, onStdout, onStderr, onExit),
			processing: true,
			updateAt: Date.now(),
			intervalId: intervalId
		})
		// log(state.getTargets())
	}
}

function stopWatching(targets) {
	log('stopWatching()')
	if (typeof targets == 'string') {
		targets = getTargets(targets)
	}
	for (var id in targets) {
		clearInterval(targets[id].intervalId)
		webpack.stop(targets[id].watching)
		state.updateTarget(id, {
			watching: null,
			processing: false
		})
	}
}

function stopWatchingAll() {
	log('stopWatchingAll()')
	const targets = state.getTargets()
	for (var i in targets) {
		stopWatching(targets[i])
	}
}

module.exports = {
	getCreativeName,
	generateId,
	readTargets,
	startWatching,
	stopWatching,
	stopWatchingAll
}
