const fs = require('fs')
const path = require('path')
const state = require('./state.js')
const profiles = require('./profiles.js')

const watching = require('./compiling/watching.js')
const wpDebug = require('./compiling/wp-debug.js')
const wpTraffic = require('./compiling/wp-traffic.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:targets')

// target models
function newTarget(size, index, currentProfile) {
	// webpack options
	const options = { size, index, currentProfile }
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
function generateId(size, index) {
	return `${size}/${index}`
}

// read the file-system
function readTargets() {
	state.reset()
	// get current profile - loads build/package.json
	const currentProfile = profiles.getCurrentProfile()

	// iterate build folder, looking for build-size folders
	const buildPath = `${global.servePath}/build`
	fs.readdirSync(buildPath).forEach(buildItem => {
		// locate build-size folders
		if (buildItem.match(/[0-9]+x[0-9]+/)) {
			// iterate build-size folder, looking for index files
			const size = buildItem
			fs.readdirSync(`${buildPath}/${size}`).forEach(sizeItem => {
				// locate index files
				if (sizeItem.match(/index/)) {
					const index = sizeItem
					state.addTargets(newTarget(size, index, currentProfile))
				}
			})
		}
	})
	// apply previous target models
	state.applyPrevious()
	// log(state.getTargets())
}

module.exports = {
	generateId,
	readTargets
}
