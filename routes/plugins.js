const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const shellescape = require('shell-escape')

const plugins = require('../lib/plugins.js')

const debug = require('debug')
var log = debug('wp-creative-server:route:plugins')

module.exports = (app, express) => {
	/* -- DYNAMIC PLUGIN ROUTES -----------------------------------
	 *
	 *
	 *
	 */
	const installed = plugins.getInstalled()
	if (!installed) {
		return
	}
	// plugin routes are declared in the plugin's package.json
	Object.keys(installed).forEach(plugin => {
		const pluginPath = `${global.servePath}/node_modules/${plugin}`

		// plugin must specify "wp-creative-server": { "routes": { ... }}
		if (!('wp-creative-server' in installed[plugin]) || !('routes' in installed[plugin]['wp-creative-server'])) {
			return
		}
		const routes = installed[plugin]['wp-creative-server'].routes

		// plugin may specify "api"
		if ('api' in routes) {
			log(`${plugin} api available on route: /${plugin}/api`)

			// serve api requests
			app.get(`/${plugin}/api/`, (req, res) => {
				// prepare cli args
				let args = ['node', `${pluginPath}/${routes.api}`, '--api', global.api]
				Object.keys(req.query).forEach(arg => {
					let cliArg = `-${arg}`
					if (arg.length > 1) {
						cliArg = `--${arg}`
					}
					args.push(cliArg)
					args.push(`${req.query[arg]}`)
				})
				// execute api command
				const cmd = shellescape(args)
				log(`API -> ${cmd}`)
				exec(cmd, (err, stdout, stderr) => {
					if (err) {
						res.status(500).send({
							stdout,
							stderr,
							error: err.message
						})
					} else {
						res.status(200).send({
							stdout,
							stderr
						})
					}
				})
			})
		}

		// plugin may specify "app", path to servable directory
		if ('app' in routes) {
			log(`${plugin} app available on route: /${plugin}`)

			const staticRoute = `${pluginPath}/${path.dirname(routes.app)}`
			if (!fs.existsSync(staticRoute)) {
				return
			}
			// serve static plugin assets
			app.use(`/${plugin}`, express.static(`${staticRoute}`))

			// proxy misc routes back to the plugin (so the plugin use any sub-routes)
			app.get(`/${plugin}/*`, (req, res) => {
				res.sendFile(`${staticRoute}/`)
			})
		}
	})
}
