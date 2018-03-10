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
	const pluginsPath = `${global.servePath}/plugins.json`
	try {
		const pluginsJson = require(pluginsPath)
		if (pluginKey in pluginsJson) {
			for (var plugin in pluginsJson[pluginKey]) {
				determineInstallMethod(plugin, pluginsJson[pluginKey][plugin])
			}
		}
	} catch (err) {
		log(`No plugins.json found at:`)
		log(` ${pluginsPath}`)
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
	exec(`cd "${global.servePath}" && npm install ${plugin}`, (err, stdout, stderr) => {
		if (err) {
			log(err)
		}
		log(stdout)
		log(stderr)
	})
}

module.exports = {
	checkToInstall
}
