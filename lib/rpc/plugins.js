const clipboardy = require('clipboardy')

const state = require('../state.js')
const utils = require('../utils.js')
const plugins = require('../plugins.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc:plugins')
// SILENCE
debug.disable('wp-creative-server:rpc:plugins')

// get plugins
function getPlugins(cb, err) {
	log('getPlugins()')
	// get available plugins
	const available = plugins.getAvailable()
	if (!available) {
		return cb()
	}

	// get installed plugins
	const installed = plugins.getInstalled(available)

	var out = {
		available,
		installed
	}
	cb(out)
}

function copyPluginInstallCmd(plugin, cb, err) {
	const available = plugins.getAvailable()
	clipboardy.writeSync(available[plugin])
	cb()
}

module.exports = {
	getPlugins,
	copyPluginInstallCmd
}
