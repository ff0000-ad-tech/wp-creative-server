const clipboardy = require('clipboardy')
const unixPathLiteral = require('@ff0000-ad-tech/unix-path-literal')

const plugins = require('../plugins.js')

const debug = require('@ff0000-ad-tech/debug')
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
	const semver = available[plugin]
	let cmd = ''
	// windows
	if (process.platform === 'win32') {
		cmd += `cd "${global.servePath}" && npm install `
	}
	// mac & other platforms
	else {
		cmd = `cd ${unixPathLiteral(global.servePath)} && npm install `
	}
	// if plugin is set to install a github repo:
	if (semver.match(/^git\+/)) {
		cmd += available[plugin]
	} else {
		cmd += plugin
	}
	cmd += ` --save`
	clipboardy.writeSync(cmd)
	cb()
}

module.exports = {
	getPlugins,
	copyPluginInstallCmd
}
