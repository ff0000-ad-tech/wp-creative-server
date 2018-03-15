const fs = require('fs')
const exec = require('child_process').exec
const isSemver = require('is-semver')

const debug = require('debug')
var log = debug('wp-creative-server:plugins')

const pluginKey = `wp-creative-server`

/* -- INSTALL ----
 * 
 * 
 */
function checkToInstall() {
	const available = getAvailable()
	if (available) {
		if (pluginKey in available) {
			for (var plugin in available[pluginKey]) {
				determineInstallMethod(plugin, available[pluginKey][plugin])
			}
		}
	}
}
function determineInstallMethod(plugin, dep) {
	if (isSemver(dep)) {
		install(plugin)
	} else {
		install(dep)
	}
}

function install(plugin) {
	log('Installing:')
	log(` - ${plugin}`)
	exec(`cd "${global.servePath}" && npm install ${plugin} --save`, (err, stdout, stderr) => {
		if (err) {
			log(err)
		}
		log(stdout)
		log(stderr)
	})
}

/* -- STATUS ----
 *
 *
 */
function getAvailable() {
	const pluginsPath = `${global.servePath}/plugins.json`
	try {
		return JSON.parse(fs.readFileSync(pluginsPath))
	} catch (err) {}
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

module.exports = {
	checkToInstall,
	getAvailable,
	getInstalled
}
