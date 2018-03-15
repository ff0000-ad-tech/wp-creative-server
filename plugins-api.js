const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const open = require('open')

const plugins = require('./lib/plugins.js')

const debug = require('debug')
var log = debug('wp-creative-server:plugins-api')

// serve-path is the location to look for
global.servePath = path.resolve('context' in argv ? argv.context : global.appPath)
log(`Requested --context ${argv.context}`)
log(` Plugin scope is: ${global.servePath}`)

/* -- API -----------------------------------------------
 *
 *
 *
 */
switch (argv.cmd) {
	case 'install':
		plugins.checkToInstall()
		break
}
