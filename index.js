const express = require('express')
const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const open = require('open')

const network = require('./lib/network.js')

const debug = require('debug')
var log = debug('wp-creative-server')

// determine IP
global.serveIp = network.getIp()
global.servePort = '5200'
global.origin = `http://${global.serveIp}:${global.servePort}`
global.app = `${global.origin}/app`
global.api = `${global.origin}/api`

// set app-path
global.appPath = __dirname

// --browser, will automatically open a browser

// set creative-path with --context,
// ex: `node node_modules/wp-creative-server/index.js --context ./`
global.servePath = path.resolve('context' in argv ? argv.context : global.appPath)
log(`Requested --context ${argv.context}`)
log(` Origin is: ${global.origin}`)
log(` Serve path is: ${global.servePath}`)

/* -- Setup -----------------------------------------------
 *
 *
 *
 */
// CHECK TO BACKUP PACKAGE-LOCKS
log('Checking to backup NPM package-locks')
try {
	const packageLocks = require('./lib/package-locks.js')
	packageLocks.checkToBackupPkgs()
} catch (err) {}

// express set up
var app = express()

/* -- STATE ----------------------------------------------
 *
 *
 *
 */
var state = require('./lib/state.js')
state.reset()

/* -- RPC API ----------------------------------------------
 *
 *
 *
 */
var rpcApi = require('./routes/rpc-api.js')
var sock = rpcApi.connect()

/* -- ROUTES ----------------------------------------------
 *
 *
 *
 */
require('./routes/app')(app, express)
require('./routes/browse')(app, express)
require('./routes/api')(app, express)
require('./routes/plugins')(app, express)

/* -- START SERVER ----------------------------------------------
 *
 *
 */

// start server and install duplex RPC
sock.install(
	app.listen(global.servePort, global.serveIp, () => {
		log(`Server running at ${global.app}`)
		// open browser, after server is ready
		if ('browser' in argv) {
			open(`${global.app}`)
		}
	}),
	'/dnode'
)
