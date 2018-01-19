const fs = require('fs')
const path = require('path')

const state = require('./state.js')
const webpack = require('./webpack.js')
const tail = require('file-tail')

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
		webpack: webpack.prepareWatch(options),
		processing: false,
		error: 0,
		updateAt: Date.now()
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

function startWatching(targets) {
	// confirm requested targets are stopped
	stopWatching(targets)

	log('startWatching()')
	for (var id in targets) {
		// read stream of webpack out file
		ft = tail.startTailing({
			fd: targets[id].webpack.out,
			mode: 'stream'
		})
		ft.on('stream', stream => {
			stream.on('data', chunk => {
				const data = chunk.toString()
				let error = targets[id].error
				if (data.match(/ERROR/)) {
					error = Date.now()
				}
				// log(data)
				// update state
				state.updateTarget(id, {
					error: error > Date.now() - 1000 ? error : 0,
					updateAt: Date.now()
				})
			})
		})

		// timer to indicate processing state
		const intervalId = setInterval(() => {
			if (targets[id].updateAt > Date.now() - 200) {
				state.updateTarget(id, {
					processing: true
				})
			} else {
				state.updateTarget(id, {
					processing: false
				})
			}
		}, 50)

		// indicate watching state
		state.updateTarget(id, {
			tail: ft,
			watching: true,
			processing: true,
			updateAt: Date.now(),
			intervalId: intervalId
		})
	}
}

function stopWatching(targets) {
	log('stopWatching()')
	for (var id in targets) {
		// clean up watch
		clearInterval(targets[id].intervalId)
		if (targets[id].tail) {
			targets[id].tail.stop()
		}

		// update state
		state.updateTarget(id, {
			error: null,
			watching: false,
			intervalId: null,
			updateAt: Date.now()
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
