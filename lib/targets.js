const fs = require('fs')
const path = require('path')

const state = require('./state.js')
const watching = require('./compiling/watching.js')
const profiles = require('./profiles.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:targets')

// target models
function newTarget(size, index) {
	// webpack options
	const options = { size, index }
	// target model
	const id = generateId(size, index)
	var target = {}
	target[id] = {
		size: size,
		index: index,
		watching: {
			[watching.TYPE_DEBUG]: watching.newWatch()
		}
	}
	Object.keys(profiles.getProfiles()).forEach(profile => {
		target[id].watching[profile] = watching.newWatch()
	})
	return target
}
function generateId(size, index) {
	return `${size}/${index}`
}

// read the file-system
function readTargets() {
	state.reset()
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
					state.addTargets(newTarget(size, index))
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
