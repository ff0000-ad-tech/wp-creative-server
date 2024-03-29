const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const cmdEscape = require('@ff0000-ad-tech/cmd-escape')

const plugins = require('../lib/plugins.js')

const debug = require('@ff0000-ad-tech/debug')
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

			// serve api POST requests
			app.post(`/${plugin}/api/`, (req, res) => {
				executePluginApi(pluginPath, routes, req.body)
					.then(result => {
						res.status(200).send(result)
					})
					.catch(err => {
						res.status(500).send(err.message)
					})
			})

			// serve api GET requests
			app.get(`/${plugin}/api/`, (req, res) => {
				executePluginApi(pluginPath, routes, req.query)
					.then(result => {
						res.status(200).send(result)
					})
					.catch(err => {
						res.status(500).send(err.message)
					})
			})
		}

		// plugin may specify "app", path to servable directory
		if ('app' in routes) {
			log(`${plugin} app available on route: /${plugin}/app`)

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

function executePluginApi(pluginPath, routes, params) {
	return new Promise((resolve, reject) => {
		// merge default query with requested query
		const query = Object.assign(params, plugins.getDefaultQuery())

		// prepare cli args
		let args = []
		Object.keys(query).forEach(arg => {
			// key
			let cliArg = `-${arg}`
			if (arg.length > 1) {
				cliArg = `--${arg}`
			}
			args.push(cliArg)

			// value
			let cliValue = query[arg]
			if (typeof cliValue === 'object') {
				cliValue = JSON.stringify(cliValue)
			} else {
				cliValue = cliValue.toString()
			}
			args.push(cliValue)
		})

		// using double-quotes to be compatible with winblows
		const cmd = `node "${pluginPath}/${routes.api}" ${cmdEscape(args)}`

		// execute api command
		log(`API -> ${cmd}`)
		exec(cmd, (err, stdout, stderr) => {
			if (err) {
				reject(new Error(stderr))
			} else {
				resolve({
					stdout,
					stderr
				})
			}
		})
	})
}
