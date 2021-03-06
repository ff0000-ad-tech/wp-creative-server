const fs = require('fs')
const exec = require('child_process').exec
const isSemver = require('is-semver')

const utils = require('./utils.js')
const state = require('./state.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:plugins')

const pluginKey = `wp-creative-server`

/* -- STATUS ----
 *
 *
 */
function getAvailable() {
	log('lib/plugins.js().getAvailable()')
	const pluginsPath = `${global.servePath}/plugins.json`
	try {
		return JSON.parse(fs.readFileSync(pluginsPath))
	} catch (err) { }
}

function getInstalled(available) {
	available = available || getAvailable()
	if (!available) {
		return
	}
	let installed = {}
	Object.keys(available).forEach(plugin => {
		const pluginPath = `${global.servePath}/node_modules/${plugin}/package.json`
		if (fs.existsSync(pluginPath)) {
			installed[plugin] = JSON.parse(fs.readFileSync(pluginPath))
		}
	})
	return installed
}

function getDefaultQuery() {
	return {
		origin: global.origin,
		app: global.app,
		api: global.api,
		context: global.servePath,
		folders: {
			project: state.getCreativeName(),
			build: utils.BUILD_FOLDER,
			debug: utils.DEBUG_FOLDER,
			traffic: utils.TRAFFIC_FOLDER
		}
	}
}

module.exports = {
	getAvailable,
	getInstalled,
	getDefaultQuery
}
