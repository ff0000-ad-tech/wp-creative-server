const express = require('express')

const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const open = require('open')

const network = require('./lib/network.js')
const portManager = require('./lib/port-manager.js')
const timeout = require('./lib/timeout.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server')

// determine IP
global.serveIp = network.getIp()
// will increase sequentially until available ip/port is found
global.servePort = 5200
// set once the server is running
global.origin
global.app
global.api

// set app-path
global.appPath = __dirname

// --browser, will automatically open a browser

// set creative-path with --context,
// ex: `node node_modules/wp-creative-server/index.js --context ./`
global.servePath = path.resolve('context' in argv ? argv.context : global.appPath)
log(`Requested --context ${argv.context}`)
log(` Serve path is: ${global.servePath}`)

/* -- Setup -----------------------------------------------
 *
 *
 *
 */
var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/* -- STATE ----------------------------------------------
 *
 *
 *
 */
var state = require('./lib/state.js')
state.reset()

/* -- Backend API ----------------------------------------------
 *
 *
 *
 */
var backendApi = require('./routes/backend-api.js')
backendApi.api.getAppMeta(() => { })
backendApi.api.getPlugins(() => { })
backendApi.api.getCreative(() => { })
backendApi.api.readTargets(() => { })
backendApi.api.getProfiles(() => { })
backendApi.api.refreshTargets(() => { })

/* -- ROUTES ----------------------------------------------
 *
 *
 *
 */

require('./routes/app')(app, express)
require('./routes/api')(app, express)
require('./routes/plugins')(app, express)
require('./routes/browse')(app, express)

/* -- START SERVER ----------------------------------------------
 *
 *
 */
portManager
	.getNextAvailable(app, global.serveIp, global.servePort)
	.then(port => {
		global.servePort = port
		app.listen(global.servePort, global.serveIp, () => {
			global.origin = `http://${global.serveIp}:${global.servePort}`
			global.app = `${global.origin}/app`
			global.api = `${global.origin}/api`
			log(`Origin: ${global.origin}`)
			log(`API: ${global.api}`)
			log(``)
			log(`Server running at ${global.app}`)
			// open browser, after server is ready
			if ('browser' in argv) {
				open(`${global.app}`)
			}
			// start request timeout, if requested
			if ('timeout' in argv) {
				timeout.setCsTimeout(Number(argv.timeout), cleanup)
			}
		})
	})
	.catch(err => {
		log(`Unable to start server!`)
		throw err
	})

const background = require('./lib/compiling/background.js')
function cleanup() {
	background.killAll()
	log('Goodbye~')
	process.exit()
}
process.stdin.resume() // so the program will not terminate instantly
process.on('SIGINT', cleanup)
process.on('SIGUSR1', cleanup)
process.on('SIGUSR2', cleanup)
process.on('SIGTERM', cleanup)
// process.on('SIGKILL', cleanup)
process.on('exit', code => {
	log(`Exit code: ${code}`)
})
process.on('uncaughtException', err => {
	throw err
})
