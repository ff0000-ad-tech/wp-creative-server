const fs = require('fs')
const path = require('path')

const utils = require('./utils.js')
const state = require('./state.js')
const watching = require('./compiling/watching.js')
const profiles = require('./profiles.js')

const debug = require('@ff0000-ad-tech/debug')
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
			// add a watch for debug compilations
			[profiles.PROFILE_DEBUG]: watching.newWatch()
		}
	}
	// add a watch for each profile compilation
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
	const buildPath = `${global.servePath}/${utils.BUILD_FOLDER}`
	fs.readdirSync(buildPath).forEach(buildItem => {
		// locate build-size folders
		if (buildItem.match(/[0-9]+x[0-9]+/)) {
			// iterate build-size folder, looking for index files
			const size = buildItem
			fs.readdirSync(`${buildPath}/${size}`).forEach(sizeItem => {
				// locate index files
				if (sizeItem.match(/index/) && fs.statSync(`${buildPath}/${size}/${sizeItem}`).isFile()) {
					const index = sizeItem
					state.addTargets(newTarget(size, index))
				}
			})
		}
	})
	// apply previous target models
	state.applyPrevious()
}

module.exports = {
	generateId,
	readTargets
}
