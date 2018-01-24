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

// set app-path
global.appPath = __dirname

// --browser, will automatically open a browser

// set creative-path with --context,
// ex: `node node_modules/wp-creative-server/index.js --context ./`
global.servePath = path.resolve('context' in argv ? argv.context : global.appPath)
log(`Requested --context ${argv.context}`)
log(` Serve address is: ${serveIp}`)
log(` Serve path is: ${global.servePath}`)

/* -- Setup -----------------------------------------------
 *
 *
 *
 */
// express set up
var app = express()

/* -- STATE ----------------------------------------------
 *
 *
 *
 */
var state = require('./lib/state.js')

/* -- RPC API ----------------------------------------------
 *
 *
 *
 */
var rpcApi = require('./routes/rpc-api.js')
var sock = rpcApi.connect({
	state: state
})

/* -- ROUTES ----------------------------------------------
 *
 *
 *
 */
require('./routes/app')(app, express)
require('./routes/browse')(app, express)
require('./routes/api')(app, express)

/* -- START SERVER ----------------------------------------------
 *
 *
 */

// start server and install duplex RPC
sock.install(
	app.listen(global.servePort, global.serveIp, () => {
		log(`Server running at http://${global.serveIp}:${global.servePort}/app`)
		// open browser, after server is ready
		if ('browser' in argv) {
			open(`http://${global.serveIp}:${global.servePort}/app`)
		}
	}),
	'/dnode'
)
