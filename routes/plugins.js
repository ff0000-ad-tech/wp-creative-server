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
	Object.keys(installed).forEach(plugin => {
		// plugin package must specify "main", path to servable directory
		if (!('main' in installed[plugin])) {
			return
		}
		const pluginPath = `${global.servePath}/node_modules/${plugin}`
		const staticRoute = `${pluginPath}/${path.dirname(installed[plugin].main)}`
		if (!fs.existsSync(staticRoute)) {
			return
		}

		// serve static plugin assets
		app.use(`/${plugin}`, express.static(`${staticRoute}`))

		// enable plugin backend
		if ('api' in installed[plugin]) {
			log(`${plugin} api available on route: /${plugin}/api`)
			app.get(`/${plugin}/api/`, (req, res) => {
				// prepare cli args
				let args = ['node', `${pluginPath}/${installed[plugin].api}`]
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
				log(`${plugin} API -> ${cmd}`)
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

		// proxy misc routes back to the plugin
		app.get(`/${plugin}/*`, (req, res) => {
			res.sendFile(`${staticRoute}/`)
		})
	})
}
