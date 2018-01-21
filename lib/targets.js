const fs = require('fs')
const path = require('path')
const state = require('./state.js')

const watching = require('./compiling/watching.js')
const wpDebug = require('./compiling/wp-debug.js')
const wpTraffic = require('./compiling/wp-traffic.js')

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
		debug: watching.newWatch(wpDebug, options),
		traffic: watching.newWatch(wpTraffic, options)
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

module.exports = {
	getCreativeName,
	generateId,
	readTargets
}
