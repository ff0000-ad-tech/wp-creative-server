const fs = require('fs')
const path = require('path')
const state = require('./state.js')
const profiles = require('./profiles.js')
const moment = require('moment')

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

// read the file-system
function getTargets() {
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

// read the state
function refreshTargets() {
	const targets = state.getTargets()
	// format result
	var out = {}
	for (var id in targets) {
		out[id] = state.format(targets[id], {
			size: value => {
				return value
			},
			index: value => {
				return value
			},
			debug: value => {
				return {
					watching: value.watching,
					processing: value.processing,
					error: value.error,
					updateAt: moment(value.updateAt).from(Date.now()),
					cmd: {
						shell: value.cmd.shell,
						out: value.cmd.out
					}
				}
			},
			traffic: value => {
				return {
					watching: value.watching,
					processing: value.processing,
					error: value.error,
					updateAt: moment(value.updateAt).from(Date.now()),
					cmd: {
						shell: value.cmd.shell,
						out: value.cmd.out
					}
				}
			},
			currentProfile: value => {
				return value
			}
		})
	}
	return out
}

module.exports = {
	getCreativeName,
	generateId,
	getTargets,
	refreshTargets
}
