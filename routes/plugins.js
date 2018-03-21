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
				// merge default query with requested query
				const query = Object.assign(req.query, plugins.getDefaultQuery())

				// prepare cli args
				let args = ['node', `${pluginPath}/${routes.api}`]
				Object.keys(query).forEach(arg => {
					let cliArg = `-${arg}`
					if (arg.length > 1) {
						cliArg = `--${arg}`
					}
					args.push(cliArg)
					args.push(`${query[arg]}`)
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

			// if the route is to a static asset, serve it
			app.use(`/${plugin}/app/`, express.static(`${staticRoute}`))

			// requests to the app origin will have get wp-creative-server params appended to qs
			app.get(`/${plugin}/app/*`, (req, res) => {
				// reconstruct params path
				let ps = ''
				Object.keys(req.params).forEach(param => {
					ps += `${req.params[param].replace(/\/*$/, '')}`
				})

				// build a redirect to requested asset + query params
				let appOrigin
				if (routes.app.match(/^http/)) {
					// external requests
					appOrigin = routes.app
				} else {
					// repath requests through the plugin's declared "app" route
					appOrigin = `/${plugin}/app/${routes.app.replace(/^[\.\/]*/, '')}`
				}

				// merge default query with requested query
				const query = Object.assign(req.query, plugins.getDefaultQuery())
				let qs = ''
				Object.keys(query).forEach(arg => {
					let value = query[arg]
					// serialize arg values that are objects
					if (typeof value === 'object') {
						value = JSON.stringify(value)
					}
					qs += `&${arg}=${encodeURIComponent(value)}`
				})
				qs = qs.slice(1)

				res.redirect(`${appOrigin}/${ps}?${qs}`)
			})
		}
	})
}
